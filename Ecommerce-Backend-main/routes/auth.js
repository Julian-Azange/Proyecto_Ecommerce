const express = require('express');
const {check, validationResult, body} = require('express-validator');
const router = express.Router();
const helper = require('../config/helpers');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const AuthValidators = require('../validations/authValidators');
const AccessValidator = require('../validations/AccessValidation');
const ErrorsValidationHandler = require('../validations/ErrorsValidationHandler');

// LOGIN ROUTE
router.post('/login',
    [helper.hasAuthFields, helper.isPasswordAndUserMatch],
    (req, res) => {
    const token_secret = process.env.TOKEN_SECRET;
    const refresh_secret = process.env.REFRESH_SECRET;
    const token_algorithm = process.env.TOKEN_ALGORITHM;
    const refresh_algorithm = process.env.REFRESH_ALGORITHM;

    const payload_token = { state: 'true', email: req.body.email, username: req.body.username };
    const payload_refresh = { email: req.body.email };
    const options_token = { algorithm: token_algorithm, expiresIn: '15m' };
    const options_refresh = { algorithm: refresh_algorithm, expiresIn: '1d' };

    const token = jwt.sign(payload_token, token_secret, options_token);
    const refresh = jwt.sign(payload_refresh, refresh_secret, options_refresh);

    res.json({
        token: token,
        refresh: refresh,
        auth: true,
        email: req.email,
        username: req.username,
        fname: req.fname,
        lname: req.lname,
        photoUrl: req.photoUrl,
        userId: req.userId,
		type: req.type,
		role: req.role
    });
});

// REGISTER ROUTE
router.post('/register', [
    check('email').isEmail().not().isEmpty().withMessage('Field can\'t be empty')
        .normalizeEmail({all_lowercase: true}),

    check('password').escape().trim().not().isEmpty().withMessage('Field can\'t be empty')
        .isLength({min: 6}).withMessage("must be 6 characters long"),
    body('email').custom(value => {
        return helper.database.table('users').filter({
            $or:
                [
                    {email: value}, {username: value.split("@")[0]}
                ]
        }).get().then(user => {
            if (user) {
                return Promise.reject('Email / Username already exists, choose another one.');
            }
        })
    })
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    } else {
        let email = req.body.email;
        let username = email.split("@")[0];
        let password = await bcrypt.hash(req.body.password, 10);
        let fname = req.body.fname;
        let lname = req.body.lname;
        let typeOfUser = req.body.typeOfUser;
        let photoUrl = req.body.photoUrl === null ? 'https://image.shutterstock.com/image-vector/person-gray-photo-placeholder-man-260nw-1259815156.jpg' : req.body.photoUrl

        /**
         * ROLE 777 = ADMIN
         * ROLE 555 = CUSTOMER
         **/
        helper.database.table('users').insert({
            username: username,
            password: password || null,
            email: email,
            role: 555,
            lname: lname || null,
            fname: fname || null,
            type: typeOfUser || 'local',
            photoUrl: photoUrl
        }).then(lastId => {
            if (lastId > 0) {
                res.status(201).json({message: 'Registro exitoso'});
            } else {
                res.status(501).json({message: 'Registro fallido'});
            }
        }).catch(err => res.status(433).json({error: err}));
    }
});

router.post(
    '/refresh',
    AuthValidators.sanitizador_refresh(),
    AuthValidators.validador_refresh(),
    ErrorsValidationHandler.handler,
    async (req, res) => {
        try {
            const user = req.essential.user;
            if (!user) {
                return res.status(404).send({ message: 'Algo ocurrió' })
            }

            const token_secret = process.env.TOKEN_SECRET;
            const token_algorithm = process.env.TOKEN_ALGORITHM;
        
            const payload_token = { state: 'true', email: user.email, username: user.username };
            const options_token = { algorithm: token_algorithm, expiresIn: '15m' };
        
            const nuevo_token = jwt.sign(payload_token, token_secret, options_token);

            return res.status(200).send({ token: nuevo_token });
        } catch (error) {
            return res.status(500).send({ message: 'Algo ocurrió al refrescar el token' });
        }
    }
);

module.exports = router;

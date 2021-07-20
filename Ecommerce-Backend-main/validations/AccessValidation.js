"use strict";
const jwt = require('jsonwebtoken');
const helper = require('../config/helpers');

const AccessValidator = {

    // * VALIDADORES
    normal_user: async (req, res, next) => {
        try {
            if (req.headers.authorization) {
                const authorization_header = req.headers.authorization.split(' ')[1];
                const authToken = jwt.verify(authorization_header, process.env.TOKEN_SECRET);

                const user = await helper.database.query(`SELECT * FROM users WHERE email='${authToken.email}' LIMIT 1;`);
                if (!user) return res.status(404).send({ message: 'Usuario no registrado' });

                if (authToken.email === user[0].email) {
                    // Usuario Actual
                    req.essentials = new Object();
                    req.essentials.user = user;
                    next();
                }
                else {
                    return res.status(404).send({ message: 'No tiene autorizacion' });
                }
            }
            else {
                return res.status(404).send({ message: 'Usted no esta logueado para realizar esta acción' });
            }
        }
        catch (error) {
            return res.status(401).send({ message: 'Algo ocurrió' });
        }
    },

    admin_user: async (req, res, next) => {
        try {
            if (req.headers.authorization) {
                const authorization_header = req.headers.authorization.split(' ')[1];
                const authToken = jwt.verify(authorization_header, process.env.TOKEN_SECRET);

                const user = await helper.database.query(`SELECT * FROM users WHERE email='${authToken.email}' LIMIT 1;`);
                if (!user) return res.status(404).send({ message: 'Usuario no registrado' });

                if (authToken.email === user[0].email && user[0].role === 777) {
                    // Usuario Actual
                    req.essentials = new Object();
                    req.essentials.user = user;
                    next();
                }
                else {
                    return res.status(404).send({ message: 'No tiene autorizacion' });
                }
            }
            else {
                return res.status(404).send({ message: 'Usted no esta logueado para realizar esta acción' })
            }
        }
        catch (error) {
            console.log(error);
            return res.status(401).send({ message: 'Algo ocurrió' });
        }
    },

};

module.exports = AccessValidator;

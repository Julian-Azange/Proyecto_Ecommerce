"use strict";
const { body } = require('express-validator');
const jwt = require('jsonwebtoken');
const helpers = require('../config/helpers');
const database = helpers.database;


const AuthValidator = {
    // * SANITIZADORES
    sanitizador_refresh: () => {
        return [
            body('refresh').trim().escape()
        ]
    },

    // * VALIDADORES
    validador_refresh: () => {
        return [
            body('refresh')
                .notEmpty().bail()
                .custom(
                    async (value, { req }) => {
                        try {
                            const refresh_token = value;
                            const refresh_secret = process.env.REFRESH_SECRET;
                            const refresh_algorithm = process.env.REFRESH_ALGORITHM;
                            
                            const refreshObj = jwt.verify(refresh_token, refresh_secret, { algorithms: refresh_algorithm });
                            const user = await database.query(`SELECT * FROM users WHERE email = '${refreshObj.email}'`);
                            if (!user[0]) {
                                throw new Error('Error');
                            }
                            
                            req.essential = new Object();
                            req.essential.user = user[0];
                        } catch (error) {
                            throw new Error(error);
                        }
                    }
                )
        ]
    }


}

module.exports = AuthValidator;

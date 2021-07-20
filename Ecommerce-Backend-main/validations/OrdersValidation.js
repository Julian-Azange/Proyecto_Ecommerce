"use strict";
const { body } = require('express-validator');

const OrdersValidation = {
    // * SANITIZADORES
    sanitizador_cart: () => {
        return [
            body('carrito*product_id').trim().escape(),
            body('carrito*quantity').trim().escape()
        ]
    },

    // * VALIDADORES
    validador_cart: () => {
        return [
            body('carrito')
                .notEmpty().bail()
                .isArray().bail()
                .custom((value, { req }) => {
                    req.body.carrito = value.map(ele => {
                        return { product_id: ele.product_id, quantity: ele.quantity }
                    });
                }),

            body('carrito*product_id')
                .isInt().bail()
                .notEmpty().bail(),

            body('carrito*quantity')
                .isInt().bail()
                .notEmpty().bail()
        ]
    }


}

module.exports = OrdersValidation;

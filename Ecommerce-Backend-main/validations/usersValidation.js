"use strict";
const { param, body } = require("express-validator");

const categoriaValidadorSanitizador = {
    // * SANITIZADORES
    sanitizador_post_producto: () => {
        return [
            body('nombre').trim().escape(),
            body('descripcion').trim().escape(),
            body('costo').trim().escape(),
            body('idEmpresa').trim().escape(),
            body('prodAlternos.*').trim().escape(),
            body('costoOferta').trim().escape(),
            body('ofertaActiva').trim().escape(),
            body('oculto').trim().escape(),
            body('colores.*').trim().escape(),
            body('dimensiones.*').trim().escape(),
            body('categoria').trim().escape(),
            body('agotado').trim().escape(),
        ]
    },

    // * VALIDADORES
    validador_param_idProducto: () => {
        return [
            checkSchema({
                idProducto: {
                    in: ['params'],
                    isMongoId: { bail: true },
                    notEmpty: { bail: true }
                }
            })
        ]
    }


}

module.exports = categoriaValidadorSanitizador;

const express = require('express');
const router = express.Router();
const { database } = require('../config/helpers');

const AccessValidator = require('../validations/AccessValidation');

/* OBTENER TODOS LAS CATEGORIAS */
router.get('/',
    async (req, res) => {
        try {
            const categories = await database.query('SELECT id, title FROM categories');
            if (!categories) return res.status(404).send({ message: 'no hay categorias' });
            return res.status(200).send({ data: categories });
        } catch (error) {
            return res.status(500).send({ message: 'Algo ocurrió' })
        }
    }
);


/* OBTENER UNA CATEGORIA */
router.get('/:idCategory',
    async (req, res) => {
        try {
            const idCategory = req.params.idCategory;

            const category = await database.query(`SELECT id, title FROM categories WHERE id=${idCategory} LIMIT 1`);
            if (!category) return res.status(404).send({ message: 'no hay categorias' });
            return res.status(200).send({ data: category });
        } catch (error) {
            return res.status(500).send({ message: 'Algo ocurrió' })
        }
    }
);


/* POST UNA CATEGORIA */
router.post('/',
    AccessValidator.admin_user,
    async (req, res) => {
        try {
            const title = req.body.title;
            const category = await database.query(`INSERT INTO categories(id, title) VALUES (null, '${title}')`);
            if (!category) return res.status(404).send({ message: 'no se guardó' });
            return res.status(200).send({ data: category });
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: 'Algo ocurrió' })
        }
    }
);

/* PUT UNA CATEGORIA */
router.put('/:idCategory',
    AccessValidator.admin_user,
    async (req, res) => {
        try {
            const idCategory = req.params.idCategory;
            const title = req.body.title;
            const category = await database.query(`UPDATE categories SET title='${title}' WHERE id=${idCategory}`);
            if (!category) return res.status(404).send({ message: 'no se guardó' });
            return res.status(200).send({ data: category });
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: 'Algo ocurrió' })
        }
    }
);

/* DELETE UNA CATEGORIA */
router.delete('/:idCategory',
    AccessValidator.admin_user,
    async (req, res) => {
        try {
            const idCategory = req.params.idCategory;
            const category = await database.query(`DELETE FROM categories WHERE id=${idCategory}`);
            if (!category) return res.status(404).send({ message: 'no se guardó' });
            return res.status(200).send({ data: category });
        } catch (error) {
            return res.status(500).send({ message: 'Algo ocurrió' })
        }
    }
);


/* GET DETAILS CATEGORIA */
router.get('/details/:idCategory',
    AccessValidator.admin_user,
    async (req, res) => {
        try {
            const idCategory = req.params.idCategory;
            const detalle = await database.query(`
                SELECT p.id, p.title, p.images, p.price, SUM(o.quantity) as sum_prods
                FROM orders_details o
                INNER JOIN products p
                ON p.id=o.product_id
                WHERE p.cat_id=${idCategory}
                GROUP BY o.product_id  
                ORDER BY p.title ASC
            `);
            if (!detalle) return res.status(404).send({ message: 'no se guardó' });
            return res.status(200).send({ data: detalle });
        } catch (error) {
            return res.status(500).send({ message: 'Algo ocurrió' })
        }
    }
);


module.exports = router;

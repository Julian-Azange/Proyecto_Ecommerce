const express = require('express');
const router = express.Router();
const { database } = require('../config/helpers');

const AccessValidator = require('../validations/AccessValidation');

/* OBTENER TODOS LOS PRODUCTOS */
router.get('/',
    function (req, res) {
        let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1;
        const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 01;   // LIMITE DE ITEMS POR PAGINA
        let startValue;
        let endValue;
        if (page > 0) {
            startValue = (page * limit) - limit;     // 0, 10, 20, 30
            endValue = page * limit;                  // 10, 20, 30, 40
        } else {
            startValue = 0;
            endValue = 10;
        }
        database.table('products as p')
            .join([
                {
                    table: "categories as c",
                    on: `c.id = p.cat_id`
                }
            ])
            .withFields(['c.title as category',
                'p.title as name',
                'p.price',
                'p.quantity',
                'p.description',
                'p.image',
                'p.id'
            ])
            .slice(startValue, endValue)
            .sort({ id: .1 })
            .getAll()
            .then(prods => {
                if (prods.length > 0) {
                    res.status(200).json({
                        count: prods.length,
                        products: prods
                    });
                } else {
                    res.json({ message: "No products found" });
                }
            })
            .catch(err => console.log(err));
    }
);


/* OBTENER UN PRODUCTO*/
router.get('/:prodId',
    (req, res) => {
        let productId = req.params.prodId;
        database.table('products as p')
            .join([
                {
                    table: "categories as c",
                    on: `c.id = p.cat_id`
                }
            ])
            .withFields(['c.title as category',
                'p.title as name',
                'p.price',
                'p.quantity',
                'p.description',
                'p.image',
                'p.id',
                'p.images'
            ])
            .filter({ 'p.id': productId })
            .get()
            .then(prod => {
                // console.log(prod);
                if (prod) {
                    res.status(200).json(prod);
                } else {
                    res.json({ message: `No product found with id ${productId}` });
                }
            }).catch(err => res.json(err));
    }
);


router.get('/admin/getAll',
    AccessValidator.admin_user,
    async (req, res) => {
        try {
            const products = await database.query(`
                SELECT p.id, p.title, p.image, p.images, p.description, p.price, p.quantity, p.short_desc, c.title as category FROM products p INNER JOIN categories c ON p.cat_id=c.id
            `);
            if (!products) return res.status(404).send({ message: 'no hay productos' });
            return res.status(200).send({ data: products });
        } catch (error) {
            return res.status(500).send({ message: 'Algo ocurrió' })
        }
    }
)


router.get('/admin/:idProduct',
    AccessValidator.admin_user,
    async (req, res) => {
        try {
            const idProduct = req.params.idProduct;

            const product = await database.query(`SELECT * FROM products WHERE id=${idProduct} LIMIT 1`);
            if (!product) return res.status(404).send({ message: 'No existe el producto' });
            return res.status(200).send({ data: product });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'Algo ocurrió' })
        }
    }
)


/* POST UNA PRODUCTO */
router.post('/',
    AccessValidator.admin_user,
    async (req, res) => {
        try {
            const title = req.body.title;
            const image = req.body.image;
            const images = req.body.images;
            const description = req.body.description;
            const price = req.body.price;
            const quantity = req.body.quantity;
            const short_desc = req.body.short_desc;
            const cat_id = req.body.cat_id;

            const product = await database.query(`
                INSERT INTO products(id, title, image, images, description, price, quantity, short_desc, cat_id)
                VALUES (null, "${title}", "${image}", "${images}", "${description}", "${price}", "${quantity}", "${short_desc}", "${cat_id}")
            `);
            if (!product) return res.status(404).send({ message: 'no se guardó' });
            return res.status(200).send({ data: product[0] });
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: 'Algo ocurrió' })
        }
    }
);


/* PUT UNA PRODUCTO */
router.put('/:idProduct',
    AccessValidator.admin_user,
    async (req, res) => {
        try {
            const id = req.params.idProduct;
            const title = req.body.title;
            const image = req.body.image;
            const images = req.body.images;
            const description = req.body.description;
            const price = req.body.price;
            const quantity = req.body.quantity;
            const short_desc = req.body.short_desc;
            const cat_id = req.body.cat_id;

            const product = await database.query(`
                UPDATE products
                SET title="${title}", image="${image}", images="${images}", description="${description}",
                price=${price}, quantity=${quantity}, short_desc="${short_desc}", cat_id=${cat_id}
                WHERE id=${id}
            `);
            if (!product) return res.status(404).send({ message: 'no se guardó' });
            return res.status(200).send({ data: product[0] });
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: 'Algo ocurrió' })
        }
    }
);


/* DELETE UNA PRODUCTO */
router.delete('/:idProduct',
    AccessValidator.admin_user,
    async (req, res) => {
        try {
            const id = req.params.idProduct;
            const product = await database.query(`DELETE FROM products WHERE id=${id}`);
            if (!product) return res.status(404).send({ message: 'no se guardó' });
            return res.status(200).send({ data: product });
        } catch (error) {
            return res.status(500).send({ message: 'Algo ocurrió' })
        }
    }
);


/* OBTENER TODOS LOS PRODUCTOS DE UNA CATEGORIA */
router.get('/category/:catName',
    (req, res) => {
        let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1;
        const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10;
        let startValue;
        let endValue;
        if (page > 0) {
            startValue = (page * limit) - limit;      // 0, 10, 20, 30
            endValue = page * limit;                  // 10, 20, 30, 40
        } else {
            startValue = 0;
            endValue = 10;
        }

        // OBTENER PARAMETROS A PARTIR DEL TITULO DE LA CATEGORIA
        const cat_title = req.params.catName;

        database.table('products as p')
            .join([
                {
                    table: "categories as c",
                    on: `c.id = p.cat_id WHERE c.title LIKE '%${cat_title}%'`
                }
            ])
            .withFields(['c.title as category',
                'p.title as name',
                'p.price',
                'p.quantity',
                'p.description',
                'p.image',
                'p.id'
            ])
            .slice(startValue, endValue)
            .sort({ id: 1 })
            .getAll()
            .then(prods => {
                if (prods.length > 0) {
                    res.status(200).json({
                        count: prods.length,
                        products: prods
                    });
                } else {
                    res.json({ message: `No se encontraron productos que coincidan con la categoría ${cat_title}` });
                }
            }).catch(err => res.json(err));

    }
);


/* OBTENER PRODUCTOS DE BUSQUEDA */
router.get('/search/:page/:text',
    async (req, res) => {
        try {
            const text = req.params.text;
            const page = req.params.page;

            const resultados = await database.query(
                `SELECT id, title, image, images, description, price, quantity, short_desc, cat_id
                FROM products
                WHERE title LIKE '%${text}%' OR description LIKE '%${text}%'
                LIMIT ${page * 7}, ${(page * 7) + 6}`
            )

            if (!resultados) {
                return res.status(404).send({ message: 'No existe productos con este criterio' });
            }

            return res.status(200).send({ data: resultados });

        } catch (error) {
            res.status(500).send({ message: 'Algo ocurrió' });
        }
    }
);



/* OBTENER PRODUCTOS DE BUSQUEDA */
router.get('/category/:page/:idCategory',
    async (req, res) => {
        try {
            const idCategory = req.params.idCategory;
            const page = req.params.page;

            const resultados = await database.query(
                `SELECT id, title, image, images, description, price, quantity, short_desc, cat_id
                FROM products
                WHERE cat_id=${idCategory}
                LIMIT ${page * 7}, ${(page * 7) + 6}`
            )

            if (!resultados) {
                return res.status(404).send({ message: 'No existe productos con este criterio' });
            }

            return res.status(200).send({ data: resultados });

        } catch (error) {
            res.status(500).send({ message: 'Algo ocurrió' });
        }
    }
);


/* GET DETAILS PRODUCTO */
router.get('/details/:idProduct',
    AccessValidator.admin_user,
    async (req, res) => {
        try {
            const idProduct = req.params.idProduct;
            const detalle = await database.query(`
                SELECT p.id, p.title, p.images, p.price, SUM(o.quantity) as sum_prods
                FROM orders_details o
                INNER JOIN products p
                ON p.id = o.product_id
                WHERE p.id=${idProduct}
                GROUP BY o.product_id
            `);
            console.log(detalle);
            if (!detalle) return res.status(404).send({ message: 'no se guardó' });
            return res.status(200).send({ data: detalle });
        } catch (error) {
            return res.status(500).send({ message: 'Algo ocurrió' })
        }
    }
);

module.exports = router;

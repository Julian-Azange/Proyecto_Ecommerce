const express = require('express');
const router = express.Router();
const { database } = require('../config/helpers');
const crypto = require('crypto');

const OrdersValidation = require('../validations/OrdersValidation');

const AccessValidator = require('../validations/AccessValidation');
const ErrorsValidationHandler = require('../validations/ErrorsValidationHandler');

// GET ALL ORDERS
// router.get('/', (req, res) => {
//     database.table('orders_details as od')
//         .join([
//             {
//                 table: 'orders as o',
//                 on: 'o.id = od.order_id'
//             },
//             {
//                 table: 'products as p',
//                 on: 'p.id = od.product_id'
//             },
//             {
//                 table: 'users as u',
//                 on: 'u.id = o.user_id'
//             }
//         ])
//         .withFields(['o.id', 'p.title', 'p.description', 'p.price', 'u.username'])
//         .getAll()
//         .then(orders => {
//             if (orders.length > 0) {
//                 res.json(orders);
//             } else {
//                 res.json({ message: "No orders found" });
//             }

//         }).catch(err => res.json(err));
// });

// // Get Single Order
// router.get('/:id', async (req, res) => {
//     let orderId = req.params.id;
//     console.log(orderId);

//     database.table('orders_details as od')
//         .join([
//             {
//                 table: 'orders as o',
//                 on: 'o.id = od.order_id'
//             },
//             {
//                 table: 'products as p',
//                 on: 'p.id = od.product_id'
//             },
//             {
//                 table: 'users as u',
//                 on: 'u.id = o.user_id'
//             }
//         ])
//         .withFields(['o.id', 'p.title', 'p.description', 'p.price', 'p.image', 'od.quantity as quantityOrdered'])
//         .filter({ 'o.id': orderId })
//         .getAll()
//         .then(orders => {
//             console.log(orders);
//             if (orders.length > 0) {
//                 res.json(orders);
//             } else {
//                 res.json({ message: "No orders found" });
//             }

//         }).catch(err => res.json(err));
// });

// // Place New Order
// router.post('/new', async (req, res) => {
//     // let userId = req.body.userId;
//     // let data = JSON.parse(req.body);
//     let { userId, products } = req.body;
//     console.log(userId);
//     console.log(products);

//     if (userId !== null && userId > 0) {
//         database.table('orders')
//             .insert({
//                 user_id: userId
//             }).then((newOrderId) => {

//                 if (newOrderId > 0) {
//                     products.forEach(async (p) => {

//                         let data = await database.table('products').filter({ id: p.id }).withFields(['quantity']).get();



//                         let inCart = parseInt(p.incart);

//                         // Deduct the number of pieces ordered from the quantity in database

//                         if (data.quantity > 0) {
//                             data.quantity = data.quantity - inCart;

//                             if (data.quantity < 0) {
//                                 data.quantity = 0;
//                             }

//                         } else {
//                             data.quantity = 0;
//                         }

//                         // Insert order details w.r.t the newly created order Id
//                         database.table('orders_details')
//                             .insert({
//                                 order_id: newOrderId,
//                                 product_id: p.id,
//                                 quantity: inCart
//                             }).then(newId => {
//                                 database.table('products')
//                                     .filter({ id: p.id })
//                                     .update({
//                                         quantity: data.quantity
//                                     }).then(successNum => {
//                                     }).catch(err => console.log(err));
//                             }).catch(err => console.log(err));
//                     });

//                 } else {
//                     res.json({ message: 'New order failed while adding order details', success: false });
//                 }
//                 res.json({
//                     message: `Order successfully placed with order id ${newOrderId}`,
//                     success: true,
//                     order_id: newOrderId,
//                     products: products
//                 })
//             }).catch(err => res.json(err));
//     }

//     else {
//         res.json({ message: 'New order failed', success: false });
//     }

// });

// Payment Gateway
router.post('/payment',
    (req, res) => {
        setTimeout(() => {
            res.status(200).json({ success: true });
        }, 3000)
    }
);

// GET CARRITOS POR USUARIO
router.get('/all_orders',
    AccessValidator.normal_user,
    ErrorsValidationHandler.handler,
    async (req, res) => {
        try {
            const user = req.essentials.user;
            const idUser = user[0].id;
            const user_orders = await database.query(
                `SELECT o.id as idOrder, od.id as idOrderDetail, p.id as prodId, od.quantity, p.title, p.image, p.images, p.description, p.price, p.short_desc
                FROM orders o INNER JOIN orders_details od INNER JOIN products p INNER JOIN categories c
                ON o.id=od.order_id AND p.id=od.product_id AND c.id=p.cat_id 
                WHERE o.user_id=${idUser}`
            );
            if (!user_orders) {
                return res.status(404).send({ message: 'No existe ordenes en este carrito' });
            }
            return res.status(200).send({ user_orders });
        } catch (error) {
            return res.status(500).send({ message: 'Algo ocurrió' })
        }
    }
);

// GET ULTIMA COMPRA DE USUARIO
router.get('/purchase/:idOrder',
    AccessValidator.normal_user,
    ErrorsValidationHandler.handler,
    async (req, res) => {
        try {
            const user = req.essentials.user;
            const idUser = user[0].id;
            const idOrder = req.params.idOrder;
            const user_orders = await database.query(`
                SELECT p.id, p.title, p.price, p.image, od.quantity
                FROM orders_details od
                INNER JOIN orders o
                ON od.order_id=o.id
                INNER JOIN products p
                ON p.id=od.product_id
                WHERE o.id=${idOrder} AND o.user_id=${idUser}
            `);
            if (!user_orders) {
                return res.status(404).send({ message: 'No existe ordenes en este carrito' });
            };
            console.log('*********************************');
            console.log('*********************************');
            console.log(idOrder, idUser);
            console.log(user_orders);
            console.log('*********************************');
            console.log('*********************************');
            return res.status(200).send({ data: user_orders });
        } catch (error) {
            return res.status(500).send({ message: 'Algo ocurrió' })
        }
    }
);

// GET CARRITOS DE USER CON TOKEN
router.get('/get_order/:idUser',
    AccessValidator.admin_user,
    ErrorsValidationHandler.handler,
    async (req, res) => {
        try {
            const idUser = req.params.idUser;
            const user_orders = await database.query(
                `SELECT o.id as idOrder, od.id as idOrderDetail, p.id as prodId, od.quantity, p.title, p.image, p.images, p.description, p.price, p.short_desc
                FROM orders o INNER JOIN orders_details od INNER JOIN products p INNER JOIN categories c
                ON o.id=od.order_id AND p.id=od.product_id AND c.id=p.cat_id 
                WHERE o.user_id=${idUser}`
            );
            if (!user_orders) {
                return res.status(404).send({ message: 'No existe ordenes en este carrito' });
            }
            return res.status(200).send({ user_orders });
        } catch (error) {
            return res.status(500).send({ message: 'Algo ocurrió' })
        }
    }
);

// POST Carrito to Order
router.post('/new_order',
    AccessValidator.normal_user,
    OrdersValidation.sanitizador_cart(),
    OrdersValidation.validador_cart(),
    async (req, res) => {
        try {
            const user = req.essentials.user;

            const order_details = req.body.carrito || [];
            const order = await database.query(`INSERT INTO orders(id, user_id) VALUES (null,${user[0].id})`);

            await Promise.all(
                order_details.map(async (detail) => {
                    const h = await database.query(
                        `INSERT INTO orders_details(id, order_id, product_id, quantity) VALUES (null ,${order.insertId} , ${Number(detail.product_id)}, ${Number(detail.quantity)})`
                    );
                    console.log(h);
                })
            )

            return res.status(200).send({ message: 'Ok', data: { id: order.insertId } });
        } catch (error) {
            return res.status(500).send({ message: 'Algo ocurrió' });
        }
    }
);

module.exports = router;

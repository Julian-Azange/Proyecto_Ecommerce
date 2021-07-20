const express = require('express');
const router = express.Router();
const { database } = require('../config/helpers');

const AccessValidator = require('../validations/AccessValidation');
const bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/',
    function (req, res) {
        database.table('users')
            .withFields(['username', 'email', 'fname', 'lname', 'age', 'role', 'id'])
            .getAll().then((list) => {
                if (list.length > 0) {
                    res.json({ users: list });
                } else {
                    res.json({ message: 'USUARIO NO ENCONTRADO' });
                }
            }).catch(err => res.json(err));
    }
);

/**
 * ROLE 777 = ADMIN
 * ROLE 555 = CUSTOMER
 */


/* GET ONE USER MATCHING ID */
router.get('/:userId',
    (req, res) => {
        let userId = req.params.userId;
        database.table('users').filter({ id: userId })
            .withFields(['username', 'email', 'fname', 'lname', 'age', 'role', 'id'])
            .get().then(user => {
                if (user) {
                    res.json({ user });
                } else {
                    res.json({ message: `USUARIO NO ENCONTRADO CON ID : ${userId}` });
                }
            }).catch(err => res.json(err));
    }
);


/* GET ONE USER WITH EMAIL MATCH  */
router.get('/validate/:email',
    (req, res) => {

        let email = req.params.email;

        database.table('users').filter({ email: email })
            .get()
            .then(user => {
                if (user) {
                    res.json({ user: user, status: true });
                } else {
                    res.json({ status: false, user: null });
                }
            })
            .catch(err => res.json(err));
    }
);



/* UPDATE USER DATA */
router.patch('/:userId',
    async (req, res) => {
        let userId = req.params.userId;     // Get the User ID from the parameter

        // Search User in Database if any
        let user = await database.table('users').filter({ id: userId }).get();
        if (user) {

            let userEmail = req.body.email;
            let userPassword = req.body.password;
            let userFirstName = req.body.fname;
            let userLastName = req.body.lname;
            let userUsername = req.body.username;
            let age = req.body.age;

            // Replace the user's information with the form data ( keep the data as is if no info is modified )
            database.table('users').filter({ id: userId }).update({
                email: userEmail !== undefined ? userEmail : user.email,
                password: userPassword !== undefined ? userPassword : user.password,
                username: userUsername !== undefined ? userUsername : user.username,
                fname: userFirstName !== undefined ? userFirstName : user.fname,
                lname: userLastName !== undefined ? userLastName : user.lname,
                age: age !== undefined ? age : user.age
            }).then(result => res.json('User updated successfully')).catch(err => res.json(err));
        }
    }
);



// router.get(
//     '/users',
//     async(req, res) => {
//         const users = await helper.database.query('SELECT * FROM customers');
//         if (!users) return res.status(401).send({ message: 'Empty users' });
//         res.status(200).send({ data: users });
//     }
// );

// GET MY USER BY TOKEN
router.get('/myUser/user',
    AccessValidator.normal_user,
    async (req, res) => {
        const user = req.essentials.user;
        if (!user) return res.status(404).send({ message: 'No existe el usuario' });

        res.json({
            auth: true,
            email: user[0].email,
            username: user[0].username,
            fname: user[0].fname,
            lname: user[0].lname,
            photoUrl: user[0].photoUrl,
            userId: user[0].userId,
            type: user[0].type,
            role: user[0].role,
            userId: user[0].id
        });
    }
);



/* GET USUARIOS */
router.get('/admin/get_all',
    AccessValidator.admin_user,
    async (req, res) => {
        try {
            const users = await database.query(`
                SELECT id, username, password, email, fname, lname, age, role, photoUrl, type
                FROM users
            `);
            if (!users) return res.status(404).send({ message: 'no hay usuarios' });
            return res.status(200).send({ data: users });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'Algo ocurrió' })
        }
    }
);

/* GET UN USUARIO */
router.get('/admin/get/:idUser',
    AccessValidator.admin_user,
    async (req, res) => {
        try {
            const id = req.params.idUser;
            const users = await database.query(`
                SELECT id, username, password, email, fname, lname, age, role, photoUrl, type
                FROM users
                WHERE id='${id}' LIMIT 1
            `);
            console.log(users)
            if (!users) return res.status(404).send({ message: 'no hay usuarios' });
            return res.status(200).send({ data: users[0] });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'Algo ocurrió' })
        }
    }
);

/* POST UN USUARIO */
router.post('/admin/post',
    AccessValidator.admin_user,
    async (req, res) => {
        try {
            const username = req.body.username;
            const password = await bcrypt.hash(req.body.password, 10);
            const email = req.body.email;
            const fname = req.body.fname;
            const lname = req.body.lname;
            const age = req.body.age;
            const role = req.body.role;
            const photoUrl = req.body.photoUrl === null ? 'https://image.shutterstock.com/image-vector/person-gray-photo-placeholder-man-260nw-1259815156.jpg' : req.body.photoUrl
            const type = req.body.type || 'local';

            const user = await database.query(`
                INSERT INTO users(id, username, password, email, fname, lname, age, role, photoUrl, type)
                VALUES (null, "${username}", "${password}", "${email}", "${fname}", "${lname}", ${age}, ${role}, "${photoUrl}", "${type}")
            `);
            if (!user) return res.status(404).send({ message: 'no se guardó' });
            return res.status(200).send({ data: user[0] });
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: 'Algo ocurrió' })
        }
    }
);


/* PUT UNA USUARIO */
router.put('/admin/put/:idUser',
    AccessValidator.admin_user,
    async (req, res) => {
        try {
            const id = req.params.idUser
            const username = req.body.username;
            const password = await bcrypt.hash(req.body.password, 10);
            const email = req.body.email;
            const fname = req.body.fname;
            const lname = req.body.lname;
            const age = req.body.age;
            const role = req.body.role;
            const photoUrl = req.body.photoUrl === null ? 'https://image.shutterstock.com/image-vector/person-gray-photo-placeholder-man-260nw-1259815156.jpg' : req.body.photoUrl
            const type = req.body.type || 'local';

            const user = await database.query(`
                UPDATE users
                SET id=${id}, username='${username}', password='${password}', email='${email}',
                fname='${fname}', lname='${lname}', age=${age}, role=${role}, photoUrl='${photoUrl}', type='${type}'
                WHERE id=${id}
            `);
            if (!user) return res.status(404).send({ message: 'no se guardó' });
            return res.status(200).send({ data: user[0] });
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: 'Algo ocurrió' })
        }
    }
);


/* DELETE UNA USUARIO */
router.delete('/admin/delete/:idUser',
    AccessValidator.admin_user,
    async (req, res) => {
        try {
            const id = req.params.idUser;
            const user = await database.query(`DELETE FROM users WHERE id=${id}`);
            if (!user) return res.status(404).send({ message: 'no se guardó' });
            return res.status(200).send({ data: user });
        } catch (error) {
            return res.status(500).send({ message: 'Algo ocurrió' })
        }
    }
);


module.exports = router;

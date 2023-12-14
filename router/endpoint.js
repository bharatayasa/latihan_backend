const express = require('express');
const router = express.Router();
const verifyAccessToken = require('../verifyAccessToken');

const userController = require('../controller/users');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/user/me', verifyAccessToken, userController.getMe);
router.get('/get/all/users', verifyAccessToken, userController.getAllUsers);
router.get('/get/user/:id', verifyAccessToken, userController.getUserById);
router.post('/add/user', verifyAccessToken, userController.addUser);
router.put('/update/user/:id', verifyAccessToken, userController.updateUser);
router.delete('/delete/user/:id', verifyAccessToken, userController.deleteUser);

module.exports = router;

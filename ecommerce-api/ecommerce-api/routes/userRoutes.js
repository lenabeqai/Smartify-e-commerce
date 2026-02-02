const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const auth = require('../middleware/auth');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.put('/:id', userController.editUser); // Edit user
router.delete('/:id', userController.deleteUser); // Delete user
router.get('/',userController.getAllUsers);

module.exports = router;

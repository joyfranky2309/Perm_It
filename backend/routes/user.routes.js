const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const checkRole = require('../middleware/role.middleware');

router.get('/', authMiddleware, checkRole(['admin', 'manager']), userController.getAllUsers);
router.get('/me', authMiddleware, userController.getMe);
router.put('/me', authMiddleware, userController.updateMe);
router.get('/:id', authMiddleware, checkRole(['admin', 'manager']), userController.getUserById);
router.post('/', authMiddleware, checkRole(['admin']), userController.createUser);
router.put('/:id', authMiddleware, checkRole(['admin', 'manager']), userController.updateUser);
router.delete('/:id', authMiddleware, checkRole(['admin']), userController.deleteUser);

module.exports = router;

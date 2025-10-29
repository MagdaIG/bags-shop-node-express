const express = require('express');
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/users.controller');
const {
  validateUser,
  validateUserUpdate,
  validateId
} = require('../middleware/validators');

// Rutas para usuarios
router.post('/', validateUser, createUser);
router.get('/', getAllUsers);
router.get('/:id', validateId, getUserById);
router.put('/:id', validateId, validateUserUpdate, updateUser);
router.delete('/:id', validateId, deleteUser);

module.exports = router;

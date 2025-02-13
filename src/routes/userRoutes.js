const express = require('express');
const { ManageAuth } = require('./../controllers/authController');

// Importar el controlador de usuarios
const { UserController } = require('./../controllers/userController');

const router = express.Router();

// Rutas para operaciones CRUD de usuarios
router
    .route('/')
    .get(ManageAuth.protect, ManageAuth.restrictTo('admin'), UserController.listUser);

router
    .route('/:id')
    .get(ManageAuth.protect, ManageAuth.restrictTo('admin'), UserController.retrieveUser)
    .patch(ManageAuth.protect, ManageAuth.restrictTo('admin'), UserController.updateUser)
    .delete(ManageAuth.protect, ManageAuth.restrictTo('admin'), UserController.destroyUser);

// Ruta para actualizar datos del usuario autenticado
router.route('/updateMe').patch(ManageAuth.protect, UserController.updateMe);

module.exports = router;



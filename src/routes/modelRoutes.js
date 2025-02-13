const express = require('express');
const { ManageAuth } = require('./../controllers/authController');

// Importar el controlador de modelos
const ModelController = require('./../controllers/modelController');

const router = express.Router();

// Rutas para operaciones CRUD de modelos de vehículos
router
  .route('/')
  .get(ManageAuth.protect, ModelController.listModel)
  .post(ManageAuth.protect, ManageAuth.restrictTo('admin'), ModelController.createModel);

router
  .route('/:id')
  .get(ManageAuth.protect, ModelController.retrieveModel)
  .patch(ManageAuth.protect, ManageAuth.restrictTo('admin'), ModelController.updateModel)
  .delete(ManageAuth.protect, ManageAuth.restrictTo('admin'), ModelController.destroyModel);

module.exports = router;


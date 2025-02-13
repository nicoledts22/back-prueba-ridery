const express = require('express');
const { ManageAuth } = require('./../controllers/authController');

// Importar el controlador de marcas
const BrandController = require('./../controllers/brandController');

const router = express.Router();

// Rutas para operaciones CRUD de marcas de vehículos
router
  .route('/')
  .get(ManageAuth.protect, BrandController.listBrand)
  .post(ManageAuth.protect, ManageAuth.restrictTo('admin'), BrandController.createBrand);

router
  .route('/:id')
  .get(ManageAuth.protect, BrandController.retrieveBrand)
  .patch(ManageAuth.protect, ManageAuth.restrictTo('admin'), BrandController.updateBrand)
  .delete(ManageAuth.protect, ManageAuth.restrictTo('admin'), BrandController.destroyBrand);

module.exports = router;


const express = require('express');
const { ManageAuth } = require('./../controllers/authController');

// Importar el controlador de tipos de vehículos
const { VehicleTypeController } = require('./../controllers/vehicleTypeController');

const router = express.Router();

// Rutas para listar tipos de vehículos
router
  .route('/')
  .get(ManageAuth.protect, VehicleTypeController.listVehicleType);

// Rutas para mostrar un tipo de vehículo
router
  .route('/:id')
  .get(ManageAuth.protect, VehicleTypeController.retrieveVehicleType);

module.exports = router;


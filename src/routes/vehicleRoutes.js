const express = require('express');
const { ManageAuth } = require('./../controllers/authController');

// Importar el controlador de vehículos
const { VehicleController, VehicleStats } = require('./../controllers/vehicleController');

const router = express.Router();

// Rutas para operaciones CRUD de vehículos
router
  .route('/')
  .get(ManageAuth.protect, VehicleController.listVehicle)
  .post(ManageAuth.protect, ManageAuth.restrictTo('admin'), VehicleController.createVehicle);

router
  .route('/:id')
  .get(ManageAuth.protect, VehicleController.retrieveVehicle)
  .patch(ManageAuth.protect, ManageAuth.restrictTo('admin'), VehicleController.updateVehicle)
  .delete(ManageAuth.protect, ManageAuth.restrictTo('admin'), VehicleController.destroyVehicle);

// Rutas para mostrar estadísticas de vehículos
router.route('/total').get(ManageAuth.protect, VehicleStats.getTotalVehicles);
router.route('/getByType').get(ManageAuth.protect, VehicleStats.getVehiclesByType);
router.route('/getByStatus').get(ManageAuth.protect, ManageAuth.restrictTo('admin'), VehicleStats.getVehiclesByStatus);
router.route('/getByDateRange').get(ManageAuth.protect, ManageAuth.restrictTo('admin'), VehicleStats.getVehiclesByDateRange);

module.exports = router;

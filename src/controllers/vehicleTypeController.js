const VehicleType = require('./../models/vehicleTypeModel');
const handleFactory = require('./../utils/handleFactory');

// Controlador para operaciones CRUD de tipos de vehículos
const VehicleTypeController = {
    listVehicleType: handleFactory.getAll(VehicleType),
    retrieveVehicleType: handleFactory.getOne(VehicleType)
};

module.exports = {
    VehicleTypeController
};


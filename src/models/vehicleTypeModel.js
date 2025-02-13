const mongoose = require('mongoose');

const vehicleTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El tipo de vehículo debe tener un nombre'],
        unique: true,
        maxlength: [25, 'El nombre del tipo de vehículo debe ser al menos o igual a 25 caracteres'],
        minlength: [5, 'El nombre del tipo de vehículo debe ser al menos o igual a 5 caracteres']
    }
});

const VehicleType = mongoose.model('VehicleType', vehicleTypeSchema);

module.exports = VehicleType;

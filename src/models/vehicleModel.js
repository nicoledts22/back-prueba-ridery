const mongoose = require('mongoose');
const auditPlugin = require('./plugins/auditPlugin');

const vehicleSchema = new mongoose.Schema({
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    model: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Model',
        required: true
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VehicleType',
        required: true
    },
    year: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                const currentYear = new Date().getFullYear();
                return value >= 1950 && value <= currentYear;
            },
            message: props => `${props.value} no es un año válido. Debe estar entre 1950 y ${new Date().getFullYear()}.`
        }
    },
    status: {
        type: String,
        enum: ['disponible', 'en servicio', 'en mantenimiento'],
        required: true
    },
    color: {
        type: String,
        required: [true, 'Por favor indica un color'],
        maxlength: [25, 'El color debe ser al menos o igual a 25 caracteres'],
        minlength: [3, 'El color debe ser al menos o igual a 3 caracteres']
    },
    placa: {
        type: String,
        required: [true, 'Por favor indica una placa'],
        maxlength: [7, 'La placa debe ser al menos o igual a 7 caracteres'],
        minlength: [7, 'La placa debe ser al menos o igual a 7 caracteres']
    }
});

vehicleSchema.plugin(auditPlugin);

// Virtual para poblar los nombres de la marca, modelo y tipo de vehículo
vehicleSchema.virtual('brandName', {
    ref: 'Brand',
    localField: 'brand',
    foreignField: '_id',
    justOne: true
});

vehicleSchema.virtual('modelName', {
    ref: 'Model',
    localField: 'model',
    foreignField: '_id',
    justOne: true
});

vehicleSchema.virtual('vehicleTypeName', {
    ref: 'VehicleType',
    localField: 'type',
    foreignField: '_id',
    justOne: true
});

// Hacer que los virtuales se incluyan al convertir el documento a JSON (por ejemplo, al hacer `.toJSON()` o `.toObject()`)
vehicleSchema.set('toObject', { virtuals: true });
vehicleSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret.id;
        return ret;
    }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;




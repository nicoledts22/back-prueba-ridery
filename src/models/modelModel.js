const mongoose = require('mongoose');
const Vehicle = require('./vehicleModel');

// Esquema de modelos de vehiculos asociados a una marca
const modelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: [25, 'El nombre del tipo de vehículo debe ser al menos o igual a 25 caracteres'],
        minlength: [5, 'El nombre del tipo de vehículo debe ser al menos o igual a 5 caracteres']
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    }
});

// Virtual para poblar el nombre de la marca
modelSchema.virtual('brandName', {
    ref: 'Brand',
    localField: 'brand',
    foreignField: '_id',
    justOne: true,
});

// Middleware para verificar si el modelo ya existe para una misma marca
modelSchema.pre('save', async function(next) {
    const model = this;

    const existingModel = await this.constructor.findOne({
        name: model.name,
        brand: model.brand
    });

    if (existingModel) {
        const error = new Error('Este modelo ya está asociado a esta marca');
        return next(error);
    };

    next();
});

// Middleware para evitar eliminar un modelo si hay vehículos asociados
modelSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const model = this;

    // Verifica si hay vehículos asociados a este modelo
    const vehiclesAssociated = await Vehicle.find({ model: model._id });

    if (vehiclesAssociated.length > 0) {
        const error = new Error('No se puede eliminar el modelo, ya que hay vehículos asociados a él');
        return next(error);
    }

    next();
});

// Hacer que los virtuales se incluyan al convertir el documento a JSON (por ejemplo, al hacer `.toJSON()` o `.toObject()`)
modelSchema.set('toObject', { virtuals: true });
modelSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret.id;
        return ret;
    }
});

const Model = mongoose.model('Model', modelSchema);

module.exports = Model;

const mongoose = require('mongoose');
const Model = require('./modelModel');

// Esquema de marcas de vehiculos asociados a un tipo de vehiculo
const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: [25, 'El nombre del tipo de vehículo debe ser al menos o igual a 25 caracteres'],
        minlength: [5, 'El nombre del tipo de vehículo debe ser al menos o igual a 5 caracteres']
    },
    vehicleType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VehicleType',
        required: true
    }
});

// Agregar un campo virtual para obtener el nombre del 'vehicleType' relacionado
brandSchema.virtual('vehicleTypeName', {
    ref: 'VehicleType',
    localField: 'vehicleType',
    foreignField: '_id',
    justOne: true,
    options: { select: 'name' }
});

// Middleware para verificar si la marca ya existe para el mismo tipo de vehículo
brandSchema.pre('save', async function(next) {
    const brand = this;

    const existingBrand = await this.constructor.findOne({
        name: brand.name,
        vehicleType: brand.vehicleType
    });

    if (existingBrand) {
        const error = new Error('La marca ya existe para este tipo de vehículo');
        return next(error);
    };

    next();
});

// Middleware para evitar eliminar una marca si hay modelos asociados
brandSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const brand = this;

    // Verifica si hay modelos asociados a esta marca
    const modelsAssociated = await Model.find({ brand: brand._id });

    if (modelsAssociated.length > 0) {
        const error = new Error('No se puede eliminar la marca, ya que hay modelos asociados a ella');
        return next(error);
    }

    next();
});

// Hacer que los virtuales se incluyan al convertir el documento a JSON (por ejemplo, al hacer `.toJSON()` o `.toObject()`)
brandSchema.set('toObject', { virtuals: true });
brandSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret.id;
        return ret;
    }
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;

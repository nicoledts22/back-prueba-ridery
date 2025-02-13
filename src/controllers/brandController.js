const Brand = require('./../models/brandModel');
const handleFactory = require('../utils/handleFactory');

// Usamos `handleFactory` para generar los controladores CRUD para el modelo `Brand`
const BrandController = {
    listBrand: handleFactory.getAll(Brand, {
        path: 'vehicleType',
        select: 'name'
    }),
    createBrand: handleFactory.createOne(Brand),
    retrieveBrand: handleFactory.getOne(Brand, {
        path: 'vehicleType',
        select: 'name'
    }),
    updateBrand: handleFactory.updateOne(Brand),
    destroyBrand: handleFactory.deleteOne(Brand)
};

module.exports = BrandController;


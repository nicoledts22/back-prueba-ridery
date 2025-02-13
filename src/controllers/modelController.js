const Model = require('./../models/modelModel');
const handleFactory = require('./../utils/handleFactory');

// Usamos `handleFactory` para generar los controladores CRUD para el modelo `Model`
const ModelController = {
    listModel: handleFactory.getAll(Model, [
        { path: 'brand', select: 'name' }
    ]),
    createModel: handleFactory.createOne(Model),
    retrieveModel: handleFactory.getOne(Model, [
        { path: 'brand', select: 'name' }
    ]),
    updateModel: handleFactory.updateOne(Model),
    destroyModel: handleFactory.deleteOne(Model)
};

module.exports = ModelController;

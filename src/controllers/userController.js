const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./../utils/handleFactory');

// Función para filtrar solo los campos permitidos
const filterBody = (body, ...allowedFields) => {
    const filteredData = {};
    Object.keys(body).forEach(field => {
        if (allowedFields.includes(field)) {
            filteredData[field] = body[field];
        }
    });
    return filteredData;
};

// Controlador para actualizar un usuario (solo admins pueden acceder)
const updateUser = catchAsync(async (req, res, next) => {
    const filteredBody = filterBody(req.body, 'name', 'lastname', 'email', 'role');

    // Verificar que no intenten actualizar la contraseña
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('No puedes actualizar la contraseña desde esta ruta.', 400));
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, filteredBody, {
        new: true,
        runValidators: true
    });

    if (!updatedUser) {
        return next(new AppError('No se encontró el usuario.', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

// Controlador para que el usuario autenticado actualice su propia información
const updateMe = catchAsync(async (req, res, next) => {
    // Evitar cambios en contraseña desde esta ruta
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('No puedes actualizar tu contraseña desde esta ruta. Usa /updatePassword.', 400));
    }

    const filteredBody = filterBody(req.body, 'name', 'lastname', 'email');

    // Actualizar usuario autenticado
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

// Controlador para listar usuarios
const listUsers = catchAsync(async (req, res, next) => {
    const users = await User.find({ _id: { $ne: req.user.id } });

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
});

// Controlador con restricciones de actualización
const UserController = {
    listUser: factory.getAll(User),
    retrieveUser: factory.getOne(User),
    updateUser, // Admin puede actualizar cualquier usuario
    updateMe, // Usuario autenticado puede actualizar solo su perfil
    destroyUser: factory.deleteOne(User)
};

module.exports = {
    UserController
};

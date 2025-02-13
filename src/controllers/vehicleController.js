const Vehicle = require('./../models/vehicleModel');
const handleFactory = require('./../utils/handleFactory');
const catchAsync = require('./../utils/catchAsync');

// Controlador para operaciones CRUD estándar
const VehicleController = {
    listVehicle: handleFactory.getAll(Vehicle, [
        { path: 'brand', select: 'name' },
        { path: 'model', select: 'name' },
        { path: 'type', select: 'name' }
    ]),
    createVehicle: handleFactory.createOne(Vehicle),
    retrieveVehicle: handleFactory.getOne(Vehicle, [
        { path: 'brand', select: 'name' },
        { path: 'model', select: 'name' },
        { path: 'type', select: 'name' }
    ]),
    updateVehicle: handleFactory.updateOne(Vehicle),
    destroyVehicle: handleFactory.deleteOne(Vehicle)
};

// Funciones personalizadas para estadísticas
class VehicleStats {
    // Función para obtener el total de vehículos registrados
    getTotalVehicles = catchAsync(async (req, res, next) => {
        const totalVehicles = await Vehicle.countDocuments();
        if (totalVehicles === null) {
            return next(new AppError('No se pudo obtener el total de vehículos.', 500));
        }
        res.status(200).json({ totalVehicles });
    });

    // Función para obtener los vehículos agrupados por tipo
    getVehiclesByType = catchAsync(async (req, res, next) => {
        const vehiclesByType = await Vehicle.aggregate([
            {
                $lookup: {
                    from: 'vehicletypes',
                    localField: 'type',
                    foreignField: '_id',
                    as: 'vehicleType'
                }
            },
            { $unwind: '$vehicleType' },
            {
                $group: {
                    _id: '$vehicleType.name',
                    total: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    type: '$_id',
                    total: 1
                }
            }
        ]);

        if (!vehiclesByType.length) {
            return next(new AppError('No se encontraron vehículos por tipo.', 404));
        }
        res.status(200).json({ vehiclesByType });
    });

    // Función para obtener los vehículos agrupados por estado
    getVehiclesByStatus = catchAsync(async (req, res, next) => {
        const vehiclesByStatus = await Vehicle.aggregate([
            {
                $group: {
                    _id: '$status',
                    total: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    status: '$_id',
                    total: 1
                }
            }
        ]);

        if (!vehiclesByStatus.length) {
            return next(new AppError('No se encontraron vehículos por estado.', 404));
        }
        res.status(200).json({ vehiclesByStatus });
    });

    // Función para obtener los vehículos registrados dentro de un rango de fechas
    getVehiclesByDateRange = catchAsync(async (req, res, next) => {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return next(new AppError('Se deben proporcionar las fechas de inicio y fin.', 400));
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start) || isNaN(end)) {
            return next(new AppError('Las fechas proporcionadas no son válidas.', 400));
        }

        if (start > end) {
            return next(new AppError('La fecha de inicio no puede ser posterior a la fecha de fin.', 400));
        }

        const vehiclesInDateRange = await Vehicle.countDocuments({
            createdAt: { $gte: start, $lte: end }
        });

        if (vehiclesInDateRange === 0) {
            return next(new AppError('No se encontraron vehículos en el rango de fechas especificado.', 404));
        }

        res.status(200).json({ totalVehicles: vehiclesInDateRange });
    });
}

module.exports = {
    VehicleController,
    VehicleStats: new VehicleStats()
};


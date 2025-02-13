const mongoose = require('mongoose');

const auditPlugin = (schema) => {
    schema.add({
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    });

    // Middleware para actualizar el campo `updatedAt` automáticamente antes de cualquier actualización
    schema.pre('save', function (next) {
        if (this.isNew) {
            // Si el documento es nuevo, `createdAt` y `updatedAt` son iguales.
            this.updatedAt = this.createdAt;
        } else {
            this.updatedAt = Date.now();
        }
        next();
    });
};

module.exports = auditPlugin;

const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Por favor escribe tu nombre'],
        maxlength: [25, 'El nombre del tipo de vehículo debe ser al menos o igual a 25 caracteres'],
        minlength: [3, 'El nombre del tipo de vehículo debe ser al menos o igual a 3 caracteres']
    },
    lastname: {
        type: String,
        required: [true, 'Por favor escribe tu apellido'],
        maxlength: [25, 'El nombre del tipo de vehículo debe ser al menos o igual a 25 caracteres'],
        minlength: [3, 'El nombre del tipo de vehículo debe ser al menos o igual a 3 caracteres']
    },
    email: {
        type: String,
        required: [true, 'Por favor escribe tu correo electrónico'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Por favor escribe un correo electrónico válido']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Por favor escribe una contraseña'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Por favor confirma tu contraseña'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Las contraseñas no son iguales!'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
});

// Middleware que encripta la contraseña si fue modificada
userSchema.pre('save', async function (next) {
    // Solo se ejecuta esta función si la contraseña fue modificada
    if (!this.isModified('password')) return next();

    // Se encripta la contraseña con un costo de 12
    this.password = await bcrypt.hash(this.password, 12);

    // Se elimina el campo passwordConfirm
    this.passwordConfirm = undefined;
    next();
});

// Si la contraseña fue modificada, se actualiza la fecha de cambio de contraseña
userSchema.pre('save', function (next) {
    // Si la contraseña no fue modificada o es un documento nuevo, se pasa al siguiente middleware
    if (!this.isModified('password') || this.isNew) return next();

    // Se actualiza la fecha de cambio de contraseña con la hora actual menos 1000 milisegundos
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

// Filtrar los documentos donde active sea false
userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});

// Método para comparar la contraseña ingresada con la guardada en la base de datos
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    // Compara la contraseña propuesta con la contraseña almacenada
    return await bcrypt.compare(candidatePassword, userPassword);
};

// Método para verificar si la contraseña ha sido modificada después de un determinado tiempo
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    // Si existe la fecha de cambio de contraseña, se compara con el timestamp del JWT
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );

        // Devuelve true si el JWT fue emitido antes del cambio de contraseña
        return JWTTimestamp < changedTimestamp;
    }

    // Devuelve false si la contraseña no fue cambiada
    return false;
};

// Método para crear un token de restablecimiento de contraseña
userSchema.methods.createPasswordResetToken = function () {
    // Se genera un token aleatorio
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Se encripta el token
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Se establece la fecha de expiración del token a 10 minutos
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    // Se retorna el token original (sin encriptar)
    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

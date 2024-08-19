import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { uniqueId } from '../utils/index.js';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    token: {
        type: String,
        default: () => uniqueId()
    },
    verified: {
        type: Boolean,
        default: true
    },
    superauth: {
        type: Boolean,
        default: false
    },
    admin: {
        type: Boolean,
        default: false
    }
});

//Para hashear la contraseña
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Método para verificar la contraseña
userSchema.methods.checkPassword = async function (inputPassword) {
    return bcrypt.compare(inputPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;


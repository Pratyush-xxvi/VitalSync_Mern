import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    gender: {
        type: String,
        default: ''
    },
    dob: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    roles: [{
        type: String,
        enum: ['ROLE_USER', 'ROLE_ADMIN'],
        default: 'ROLE_USER'
    }]
}, {
    timestamps: true
});

export default mongoose.model('User', userSchema);

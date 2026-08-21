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
    roles: [{
        type: String,
        enum: ['ROLE_USER', 'ROLE_ADMIN'],
        default: 'ROLE_USER'
    }]
}, {
    timestamps: true
});

export default mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    doctorName: {
        type: String,
        required: true
    },
    patientName: {
        type: String,
        required: true
    },
    patientEmail: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    appointmentDate: {
        type: String,
        required: true
    },
    appointmentTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Map Mongoose _id to virtual id string property for frontend compatibility
appointmentSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

module.exports = mongoose.model('Appointment', appointmentSchema);

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    
    car : {
        type: Schema.Types.ObjectId,
        ref: 'Car'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    bookingDays: {
        type: Number,
        required: true
    },
    completed: {
        type: Boolean,
        default: false,
        required: true
    }

},
{timestamps: true},
);
module.exports = mongoose.model('Booking', bookingSchema);
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        enum: ["male", "female", "others"],
        
    },
    age: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    bookings:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Booking'
        }
    ]
});
module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const carSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    tint: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    available: {
        type: Boolean,
        required: false,
        default: true
    },
    // imageUrl: {
    //   type: String,
    //   required: true
    // },
    activeUser: {
        type: Schema.Types.ObjectId,
        required : false
    },
    bookings: [
        {
        type: Schema.Types.ObjectId,
        ref: 'Booking'
      }
    ]
});
module.exports = mongoose.model('Car', carSchema);

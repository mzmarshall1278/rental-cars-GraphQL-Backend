const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

const User = require('../../models/userModel');
const Car = require('../../models/carModel');
const Booking = require('../../models/bookingModel');

const getBookings = async (ids) => {
    try {
        const foundBookings = await Booking.find({_id: {$in: ids}});
        return foundBookings.map(booking => {
            // console.log(booking._doc.user);
            return {...booking._doc, car: getCar.bind(this, booking._doc.car), user: getUser.bind(this, booking._doc.user), createdAt: new Date(booking._doc.createdAt).toISOString()};
        })
    } catch (err) {
        throw err;
    }
};

const getUser = async (userId) => {
    try {
        const theUser = await User.findById(userId);
        // console.log(theUser);
        return {...theUser._doc, bookings: getBookings.bind(this, theUser._doc.bookings), password: null};
    } catch (err) {
        throw err;
    }
};

const getCar = async (id) => {
    try {
        const foundCar = await Car.findById(id);
    return {...foundCar._doc, bookings: getBookings.bind(this, foundCar._doc.bookings), activeUser: getUser.bind(this, foundCar._doc.activeUser)};
    } catch (err) {
        throw err;
    }
};


module.exports = {

    bookings : async () => {
        if(!req.isAuth){
            throw new Error('Not Authorized')
        }
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return {...booking._doc, user: getUser.bind(this, booking._doc.user), car: getCar.bind(this, booking._doc.car), createdAt: new Date(booking._doc.createdAt).toISOString()};
            })
        } catch (err) {
            throw err;
        }
    },
    cars : async () => {
        try{
            const cars = await Car.find();
            return cars.map(car => {
                // console.log(car._doc.bookings)
                return {...car._doc, activeUser: getUser.bind(this, car._doc.activeUser), bookings: getBookings.bind(this, car._doc.bookings)};
            })
        } catch(err){
            throw err;
        }
    },
    addCar : async (args)=>{
        if(!req.isAuth){
            throw new Error('Not Authorized')
        }
        if(req.userId !== "admin's id"){ //use admin's id
            throw new Error('Only admins can confirm perform this task')
        }
        try {
            const car = new Car({
                name: args.carInput.name,
                color: args.carInput.color,
                model: args.carInput.model,
                year: args.carInput.year,
                type: args.carInput.type,
                tint: args.carInput.tint,
                price: args.carInput.price,
                available: args.carInput.available
            });

            const addedCar = await car.save();
            return {...addedCar._doc};
        } catch (err) {
            throw err;
        }
    },
    signup: async (args) =>  {

        try {
            const foundUser = await User.findOne({email:args.userInput.email});
            if(foundUser){
                throw new Error('User Already exists');
            }
            const hp = await bcrypt.hash(args.userInput.password, 12);
            const user = new User({
                name: args.userInput.name,
                email: args.userInput.email,
                password: hp,
                gender: args.userInput.gender,
                age: args.userInput.age,
                address: args.userInput.address,
            });
            const result = await user.save();
            return {...result._doc, password:null}
        } catch (err) {
            throw err;
        }
    },
    makeBooking: async (args) => {
        if(!req.isAuth){
            throw new Error('Not Authorized')
        }
        try {
            const fetchedCar = await Car.findOne({_id: args.bookingInput.car});
            if(!fetchedCar.available){
                throw new Error('Sorry!!! This vehicle is not available');
            };
            const booking = new Booking({
                user: req.userId,
                car: fetchedCar,
                bookingDays: args.bookingInput.bookingDays
            });
            const result = await booking.save();
            // console.log(result._doc._id);
            await User.updateOne({_id: req.userId}, {$push: {"bookings": result._doc._id}});
            await Car.updateOne({_id: fetchedCar._id}, {$set :{"activeUser": req.userId, available: false}, $push: {"bookings": result._doc._id}});
            return {...result._doc, createdAt: new Date(result._doc.createdAt).toISOString()};
        } catch (err) {
            throw err;
        }
    },
    finishBooking: async (args) => {
        if(!req.isAuth){
            throw new Error('Not Authorized')
        }
        if(req.userId !== "admin's id"){ //use admin's id
            throw new Error('Only admins can perform this task')
        }
        try {
            const updatedBooking = await Booking.findOneAndUpdate({_id: args.bookingId}, {$set: {"completed": true}});

            await Car.updateOne({_id: updatedBooking._doc.car}, {$set: {"available": true, "activeUser": null}})
            return {...updatedBooking._doc, car: getCar.bind(this, updatedBooking._doc.car), user: getUconfirmser.bind(this, updatedBooking._doc.user)};

        } catch (err) {
            throw err;
        }
    },
    // login: async ({email, password}) => {
    //   try {
    //       const user = await User.findOne({email: email});
    //       if(!user){
    //           throw new Error('User does not exist.')
    //       }
    //       const matched = await bcrypt.compare(password, user.password);
    //       if(!matched){
    //           throw new Error('Wrong password');
    //       }
    //       const token = await jwt.sign({userId: user._id, email: user.email}, 'someSortOfSuperSophisticatedSecretString5', {expiresIn: '1h'});
    //       return {
    //           userId: user._id,
    //           token: token,
    //           expiration: 1  
    //       }
    //   } catch (err) {
    //       throw err;
    //   }
    // }
};

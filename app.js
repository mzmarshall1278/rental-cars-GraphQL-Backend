const express = require('express');
const bodyParser = require('body-parser');
const gqlHTTP = require('express-graphql');
const mongoose = require('mongoose');

const Schema = require('./graphql/schema');
const Resolvers = require('./graphql/resolvers');
const isAuth = require('./middleware/isAuth')

const app = express();

app.use(bodyParser.json());

app.use(isAuth);

app.use('/graphql', gqlHTTP({
    schema: Schema,
    rootValue : Resolvers,
    graphiql: true
    })
);

// mutation{
//     addCar(carInput:{name:"Rolls Royce", color: "Blue", model:"Phantom", year:"2019", type:"Limousine",tint: "super dark", price:75000, available: true}){
//       name
//       color
//       model
//       year
//       tint
//     }
//   }

// mutation{
//     signup(userInput:{name:"Marshall", email:"marshall@gmail.com", password:"mypassword", gender:"male", age:24, address: "marshall's empire", onRent:false}){
//       email
//       name
//       password
//     }
//   }

mongoose.connect('mongodb://localhost:27017/rental-cars', {useNewUrlParser:true, useUnifiedTopology: true}).then(() => {
    app.listen(1278, () => console.log('listening at port 1278'));
    }).catch(err => console.log(err));

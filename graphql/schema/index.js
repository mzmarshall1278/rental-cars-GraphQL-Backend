const { buildSchema } = require('graphql');

module.exports = buildSchema(`
            type Booking{
                _id: ID!
                car: Car!
                user: User!
                bookingDays: Int!
                completed: Boolean!
                createdAt: String!
                updatedAt: String!
            }

            type Car {
                _id: ID!
                name: String!
                color: String!
                model: String!
                year: String!
                type: String!
                tint : String!
                price: Int!
                available: Boolean!
                activeUser: User
                bookings: [Booking!]!
            }

            type User {
                _id: ID!
                name: String!
                email: String!
                password: String
                gender: String!
                age: String!
                address: Int!
                bookings: [Booking!]!
            }

            type AuthData {
              userId: ID!
              token: String!
              tokenExpiration: Int!
            }

            input BookingInput {
                car: ID!
                bookingDays: Int!
            }

            input CarInput {
                name: String!
                color: String!
                model: String!
                year: String!
                type: String!
                tint : String!
                price: Int!
            }

            input UserInput {
                name: String!
                email: String!
                password: String!
                gender: String!
                age: Int!
                address: String!

            }

            type RootQuery {
                cars: [Car!]!
                bookings: [Booking!]!
                login(email: String!, password: String!): AuthData
            }

            type RootMutation {
                addCar(carInput: CarInput): Car
                signup(userInput: UserInput): User
                makeBooking(bookingInput: BookingInput): Booking
                finishBooking(bookingId:ID!): Booking
            }

            schema {
                query: RootQuery
                mutation: RootMutation
            }
        `)

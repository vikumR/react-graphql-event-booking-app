const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const app = express();

const Event = require('./models/event');
const User = require('./models/user');

app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(` 
        type Event {
            _id: ID!
            title: String!
            price: Float!
            description: String!
            date: String!
        }

        type User {
            _id: ID!
            email: String!
            password: String
        }

        input EventInput {
            title: String!
            price: Float!
            description: String!
            date: String!
        }

        input UserInput {
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event!]!
            users: [User!]!
        }
        type RootMutation {
            createEvent (eventInput: EventInput): Event
            createUser (userInput: UserInput): User
        }
        schema {
            query: RootQuery 
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Event
                .find()
                .then(events => {
                    return events.map(event => {
                        return {
                            ...event._doc,
                            date: new Date(event._doc.date).toISOString()
                        };
                    });
                })
                .catch(err => console.log(err));
        },

        users: () => {
            return User.find()
                .then(users => {
                    return users.map(user => {
                        return { ...user._doc, password: null }
                    })
                })
                .catch(err => console.log(err))
        },

        createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                price: +args.eventInput.price,
                description: args.eventInput.description,
                date: new Date(args.eventInput.date),
                creator: '643285729058d2a2d0582d70'
            });

            let enventCreated;

            return event
                .save()
                .then(result => {
                    enventCreated = {
                        ...result._doc,
                        date: new Date(result._doc.date).toISOString()
                    };
                    return User.findById('643285729058d2a2d0582d70');
                })
                .then(user => {
                    if (!user) {
                        throw new Error('User does not exist!');
                    }
                    user.createdEvents.push(event);
                    return user.save();

                })
                .then(result => {
                    return enventCreated;
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });
        },

        createUser: (args) => {
            return User.findOne({ email: args.userInput.email })
                .then(user => {
                    if (user) {
                        throw new Error('User exists already!');
                    } else {
                        return bcrypt.hash(args.userInput.password, 12)
                    }
                })
                .then(hashedPassword => {
                    const user = new User({
                        email: args.userInput.email,
                        password: hashedPassword
                    });

                    return user.save();
                })
                .then(result => {
                    return { ...result._doc, password: null }
                })
                .catch(err => {
                    throw err;
                });
        }
    },
    graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:
${process.env.MONGO_PASSWORD}
@cluster01.1s7bqpe.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(3000, '127.0.0.1');
    })
    .catch(err => console.log(err));

const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const app = express();

const Event = require('./models/event');

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

        input EventInput {
            title: String!
            price: Float!
            description: String!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }
        type RootMutation {
            createEvent (eventInput: EventInput): Event
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
                .catch(err => console.log(err))
        },
        createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                price: +args.eventInput.price,
                description: args.eventInput.description,
                date: new Date(args.eventInput.date)
            });

            return event
                .save()
                .then(result => {
                    console.log(result);
                    return {
                        ...result._doc,
                        date: new Date(result._doc.date).toISOString()
                    };
                })
                .catch(err => {
                    console.log(err);
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

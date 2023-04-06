const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const app = express();

const events = [];

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
            return events;
        },
        createEvent: (args) => {
            const event = {
                _id: Math.random().toString(),
                title: args.eventInput.title,
                price: +args.eventInput.price,
                description: args.eventInput.description,
                date: args.eventInput.date
            };
            events.push(event);
            return event;
        }
    },
    graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:
${process.env.MONGO_PASSWORD}
@cluster01.1s7bqpe.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(3000, '127.0.0.1');
    })
    .catch(err => console.log(err));

const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');

const user = async userId => {
    try {
        const user = await User.findById(userId);
        return {
            ...user._doc,
            createdEvents: events.bind(this, user._doc.createdEvents)
        };
    } catch (err) {
        throw new Error(err);
    }
};

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        return events.map(event => {
            return {
                ...event._doc,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            };
        });
    } catch (err) {
        throw new Error(err);
    }
};

module.exports = {
    events: async () => {
        try {
            const events = await Event
                .find();
            return events.map(event => {
                return {
                    ...event._doc,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event._doc.creator)
                };
            });
        } catch (err) {
            return console.log(err);
        }
    },

    users: async () => {
        try {
            const users = await User.find();
            return users.map(user => {
                return {
                    ...user._doc,
                    password: null,
                    createdEvents: events.bind(this, user._doc.createdEvents)
                };
            });
        } catch (err) {
            return console.log(err);
        }
    },

    createEvent: async (args) => {
        const event = new Event({
            title: args.eventInput.title,
            price: +args.eventInput.price,
            description: args.eventInput.description,
            date: new Date(args.eventInput.date),
            creator: '643285729058d2a2d0582d70'
        });

        let enventCreated;

        try {
            const result = await event.save();
            enventCreated = {
                ...result._doc,
                date: new Date(result._doc.date).toISOString(),
                creator: user.bind(this, result._doc.creator)
            };

            const creator = await User.findById('643285729058d2a2d0582d70');
            if (!creator) {
                throw new Error('User does not exist!');
            }

            creator.createdEvents.push(event);
            await creator.save();
            return enventCreated;

        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    createUser: async (args) => {
        try {
            const userExists = await User.findOne({ email: args.userInput.email });
            if (userExists) {
                throw new Error('User exists already!');
            }

            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });

            const result = await user.save();
            return {
                ...result._doc,
                password: null,
                createdEvents: events.bind(this, result._doc.createdEvents)
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}
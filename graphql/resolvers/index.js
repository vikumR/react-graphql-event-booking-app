const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');

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

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return {
            ...event._doc,
            creator: user.bind(this, event._doc.creator)
        };
    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return {
                    ...event._doc,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event._doc.creator)
                };
            });
        } catch (err) {
            console.log(err);
            throw err;
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

    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return {
                    ...booking._doc,
                    user: user.bind(this, booking._doc.user),
                    event: singleEvent.bind(this, booking._doc.event),
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString()
                }
            });
        } catch (error) {
            console.log(error);
            throw new Error(error);
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
    },

    bookEvent: async args => {
        try {
            const fetchedEvent = await Event.findOne({ _id: args.eventId });
            const booking = new Booking({
                user: '643285729058d2a2d0582d70',
                event: fetchedEvent
            });
            const result = await booking.save();
            return {
                ...result._doc,
                user: user.bind(this, booking._doc.user),
                event: singleEvent.bind(this, booking._doc.event),
                createdAt: new Date(result._doc.createdAt).toISOString(),
                updatedAt: new Date(result._doc.updatedAt).toISOString()
            };
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    cancelBooking: async args => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = {
                ...booking.event._doc,
                creator: user.bind(this, booking.event._doc.creator)
            }
            await Booking.deleteOne({ _id: args.bookingId });
            return event;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}
const Event = require('../../models/event');
const User = require('../../models/user');

const user = userId => {
    return User.findById(userId)
        .then(user => {
            return {
                ...user._doc,
                createdEvents: events.bind(this, user._doc.createdEvents)
            }
        })
        .catch(err => {
            throw new Error(err)
        })
};

const events = eventIds => {
    return Event.find({ _id: { $in: eventIds } })
        .then(events => {
            return events.map(event => {
                return {
                    ...event._doc,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event.creator)
                }
            });
        })
        .catch(err => {
            throw new Error(err)
        })
};

module.exports = {
    events: () => {
        return Event
            .find()
            .then(events => {
                return events.map(event => {
                    return {
                        ...event._doc,
                        date: new Date(event._doc.date).toISOString(),
                        creator: user.bind(this, event._doc.creator)
                    };
                });
            })
            .catch(err => console.log(err));
    },

    users: () => {
        return User.find()
            .then(users => {
                return users.map(user => {
                    return {
                        ...user._doc,
                        password: null,
                        createdEvents: events.bind(this, user._doc.createdEvents)
                    }
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
                    date: new Date(result._doc.date).toISOString(),
                    creator: user.bind(this, result._doc.creator)
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
                return {
                    ...result._doc,
                    password: null,
                    createdEvents: events.bind(this, result._doc.createdEvents)
                }
            })
            .catch(err => {
                throw err;
            });
    }
}
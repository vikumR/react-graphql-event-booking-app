const Event = require('../../models/event');
const User = require('../../models/user');

const { transformEvent } = require('./merge');

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return transformEvent(event);
            });
        } catch (err) {
            console.log(err);
            throw err;
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
            enventCreated = transformEvent(result);

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
    }
}
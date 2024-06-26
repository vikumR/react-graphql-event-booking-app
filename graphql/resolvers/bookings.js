const Booking = require('../../models/booking');
const Event = require('../../models/event');
const { transformEvent, transformBooking } = require('./merge');

module.exports = {
    bookings: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            const bookings = await Booking.find({ user: req.userId });
            return bookings.map(booking => {
                return transformBooking(booking);
            });
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    },

    bookEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            const fetchedEvent = await Event.findOne({ _id: args.eventId });
            if (!fetchedEvent) {
                throw new Error('Event does not exist!');
            }

            const existingBooking = await Booking.findOne({
                event: fetchedEvent._id,
                user: req.userId
            });
            if (existingBooking) {
                throw new Error('Booking already exists for this event!');
            }

            const booking = new Booking({
                user: req.userId,
                event: fetchedEvent
            });
            const result = await booking.save();
            return transformBooking(result);
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    cancelBooking: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = transformEvent(booking.event);
            await Booking.deleteOne({ _id: args.bookingId });
            return event;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}
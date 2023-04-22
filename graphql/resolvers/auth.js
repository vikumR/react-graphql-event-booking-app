const bcrypt = require('bcryptjs');
const User = require('../../models/user');

const { events } = require('./merge');

module.exports = {
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
const mongoose = require('mongoose');
const shortid = require('shortid');


const UserScheme = mongoose.Schema({
    _id: {
        'type': String,
        'default': shortid.generate
    },
    username: {
        'type': String,
        'required': true
    },
    exercises : [
        {
            description: {
                type: String,
                required: true
            },
            duration: {
                type: Number,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ]
})


module.exports = User = mongoose.model('user', UserScheme);
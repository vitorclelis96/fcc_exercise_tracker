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
    }
})


module.exports = User = mongoose.model('user', UserScheme);
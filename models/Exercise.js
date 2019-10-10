const mongoose = require('mongoose');


const ExerciseSchema = mongoose.Schema({
    user: {
        type: String,
        ref: 'user',
        required: true
    },
    exercise : [
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


module.exports = Exercise = mongoose.model('exercise', ExerciseSchema);
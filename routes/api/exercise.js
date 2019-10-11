const express = require('express');
const router = express.Router();
const User = require('../../models/User');

// Middleware
const validateNewUserBody = (req, res, next) => {
    if (!req.body.username) {
        return res.status(400).json({
            "error": "username is required"
        });
    }
    next();
}

// Middleware
const checkIfUserExists = async (req, res, next) => {
    try {
        const user = await User.findOne({username: req.body.username});
        if (user) {
            return res.status(400).json({
                "error": "Username already registered"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            "error": "INTERNAL SERVER ERROR"
        });
    }
}

// @route       POST api/exercise/new-user
router.post('/new-user', validateNewUserBody, checkIfUserExists, async (req, res) => {
    try {
        const newUser = new User({
            username : req.body.username
        });
        await newUser.save();
        return res.json({
            "username": newUser.username,
            "_id": newUser._id
        })
    } catch (error) {
        // console.log(error.message);
        return res.status(500).json({
            "error": "INTERNAL SERVER ERROR"
        });
    }
})

// Middleware
const validateAddBody = (req, res, next) => {
    if (!req.body.userId || !req.body.description || !req.body.duration) {
        return res.status(400).json({
            "error": "Invalid Body Request"
        })
    }
    req.body.duration = parseInt(req.body.duration);
    if (isNaN(req.body.duration)) {
        return res.status(400).json({
            "error": "duration must be a Integer"
        });
    }
    next();
}

// Middleware
const getUserInReqBody = async (req, res, next) => {
    try {
        const user = await User.findById(req.body.userId);
        if (!user) {
            return res.status(400).json({
                "error": "Invalid UserId"
            });
        }
        req.user = user;
        next();
    } catch (error) {
        // console.log(error.message);
        return res.status(500).json({
            "error": "INTERNAL SERVER ERROR"
        });
    }
}

// Middleware
const validateDate = (req, res, next) => {
    if (!req.body.date) {
        return next();
    }
    const userDate = new Date(req.body.date);
    if (isNaN(userDate)) {
        req.body.date = null;
        return next();
    }
    req.body.date = userDate;
    return next();
}

// @route       POST api/exercise/add
router.post('/add', validateAddBody, getUserInReqBody, validateDate, async (req, res) => {
    try {
        const newExercise = {
            description: req.body.description,
            duration: req.body.duration,
        }
        if (req.body.date) {
            newExercise.date = req.body.date
        }
        req.user.exercises.unshift(newExercise);
        await req.user.save();
        return res.json({
            "username": req.user.username,
            "description": newExercise.description,
            "duration": newExercise.duration,
            "_id": req.user._id,
            "date": req.user.exercises[0].date
        })
    } catch (error) {
        return res.status(500).json({
            "error": "INTERNAL SERVER ERROR"
        });
    }
})


// Middleware
const getUserInQuery = async (req, res, next) => {
    try {
        if (!req.query.userId) {
            return res.status(400).json({
                "error": "Need userId"
            });
        }
        const user = await User.findById(req.query.userId);
        if (!user) {
            return res.status(400).json({
                "error": "User Not Found"
            })
        }
        req.user = user;
        next();
    } catch (error) {
        // console.log(error.message);
        return res.status(500).json({
            "error": "INTERNAL SERVER ERROR"
        })
    }
}

const validateQuery = (req, res, next) => {
    if (req.query.from) {
        const fromDate = new Date(req.query.from);
        isNaN(fromDate) ? req.query.from = null : req.query.from = fromDate;
    }
    if (req.query.to) {
        const toDate = new Date(req.query.to);
        isNaN(toDate) ? req.query.to = null : req.query.to = toDate;
    }
    if (req.query.limit) {
        req.query.limit = parseInt(req.query.limit);
        if (isNaN(req.query.limit)) {
            req.query.limit = null
        }
        if (req.query.limit <= 0) {
            req.query.limit = null
        }
    }
    next();
}


// @route   api/exercise/log?query
router.get('/log', getUserInQuery, validateQuery, (req, res) => {
    let userExercises = [...req.user.exercises];
    const responseJson = {
        "_id": req.query.userId,
        "username": req.user.username,
    }
    if (req.query.from) {
        responseJson.from = req.query.from;
        userExercises = userExercises.filter((exercise) => exercise.date >= req.query.from);
    }
    if (req.query.to) {
        responseJson.to = req.query.to;
        userExercises = userExercises.filter((exercise) => exercise.date <= req.query.to);
    }
    if (req.query.limit) {
        responseJson.count = req.query.limit;
        userExercises = userExercises.slice(0, req.query.limit);
    }
    // Couldn't remove exercise._id directly, idk why, so i just made
    // a new copy of userExercises explicitly not including _id
    testExercises = userExercises.map((exercise) => {
        return {
            date: exercise.date.toString(),
            description: exercise.description,
            duration: exercise.duration
        }
    });
    responseJson.log = testExercises;
    return res.json(responseJson);
})


module.exports = router;
// zTFxQUga
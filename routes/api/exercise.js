const express = require('express');
const router = express.Router();
const User = require('../../models/User');

const validateRequestMiddleware = (req, res, next) => {
    if (!req.body.username) {
        return res.status(400).json({
            "error": "username is required"
        });
    }
    next();
}

const checkUsernameMiddleware = async (req, res, next) => {
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
router.post('/new-user', validateRequestMiddleware, checkUsernameMiddleware, async (req, res) => {
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


module.exports = router;
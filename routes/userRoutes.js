const express = require('express');
const passport = require('../auth');
const User = require('../models/user');
const router = express.Router();


router.post('/signup', async (req, res) => {
    try {
        const { full_name, username, password, phone } = req.body;

        if (!full_name || !username || !password || !phone) {
            return res.status(400).json({ ERROR: "Missing required fields" });
        }

        const existingUser = await User.findOne({ $or: [{ username }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ ERROR: "Username or phone already exists" });
        }

        const newUser = new User(req.body);
        const response = await newUser.save();

        req.login(response, error=>{
            if(error) return next(err);
            return res.status(201).json({message:"sign up and login successful", response:response});
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ ERROR: 'Internal Server Error' });
    }
});


router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ ERROR: info.message });

        req.login(user, (err) => {
            if (err) return next(err);
            return res.json({ message: "Login successful", user });
        });
    })(req, res, next);
});


router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ ERROR: 'Logout Failed' });
        res.json({ message: "Logged out successfully" });
    });
});


const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ ERROR: "Unauthorized, please log in" });
};


router.get('/', isAuthenticated, async (req, res) => {
    try {
        const userId=req.user.id;
        const users = await User.findById(userId);
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ ERROR: 'Internal Server Error' });
    }
});


router.put('/:id', isAuthenticated, async (req, res) => {
    try {
        const id = req.params.id;
        const newData = req.body;

        const response = await User.findByIdAndUpdate(id, newData, {
            new: true,
            runValidators: true
        });

        if (!response) {
            return res.status(404).json({ ERROR: "User not found" });
        }

        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ ERROR: 'Internal Server Error' });
    }
});


router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const id = req.params.id;
        const response = await User.findByIdAndDelete(id);

        if (!response) {
            return res.status(404).json({ ERROR: "User not found" });
        }

        res.status(200).json({ Message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ ERROR: 'Internal Server Error' });
    }
});

module.exports = router;

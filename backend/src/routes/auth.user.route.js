const express = require('express');

const User = require('../model/user.model');
const generateToken = require('../middleware/generateToken');

const router = express.Router();

// register a new user
router.post('/register', async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const user = new User({email, password, username});
        //console.log(user);
        await user.save();
        res.status(200).send({message: "User registered successfully!", user: user}); 
    } catch (error) {
        console.error("Failed to register", error);
        res.status(500).json({ message: 'Registration failed' });
    }
})

// login a user 
router.post('/login', async (req, res) => {
    try {
        //console.log(req.body);
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send({ message: 'User not found!' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).send({ message: 'Invalid password!' });
        }

        // generate token here
        const token = await generateToken(user._id);
        res.cookie("token", token, {
            httpOnly: true, // enable tjis only when you have https://
            secure: true,
            sameSite: true
        })

        res.status(200).send({ message: 'Login successful!', token,user: {
            _id: user._id,
            email: user.email,
            username: user.username,
            role: user.role
        } });





    } catch (error) {
        console.error("Failed to login", error);
        res.status(500).json({ message: 'Login failed! Try again' });
    }
})

// logout a user
router.post("/logout", async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).send({ message: "Logged out successfully done!" });
    } catch (error) {
        console.error("Failed to log out", error);
        res.status(500).json({ message: 'Failed to log out!' });
    }
})

// get all users

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, 'id email role');
        res.status(200).send({ message: "Users found successfully", users})
        
    } catch (error) {
        console.error("Erroe fetching users", error);
        res.status(500).send({ message: "Failed to fetch user!" });
    }
});

module.exports =router;
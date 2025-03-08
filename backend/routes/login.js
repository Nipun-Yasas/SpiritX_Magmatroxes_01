const User = require('../models/User');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET; 

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

    
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username' });
        }

        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

       
        const token = jwt.sign({ id: user._id, username: user.username }, secretKey, { expiresIn: '1h' });

        res.json({ message: `Hello, ${username}!`, token });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
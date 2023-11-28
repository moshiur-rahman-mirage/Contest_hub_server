const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Users = require('../models/Users');

// get all users who participated in a specific contest
router.get('/contest/:id', async (req, res) => {
    try {
        const contestId = req.params.id;
        console.log('Contest ID:', contestId);

        const users = await Users.find({ participatedContests: contestId })
            .populate('participatedContests')
            .exec();

        console.log('Users who have submitted for the contest:', users);
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

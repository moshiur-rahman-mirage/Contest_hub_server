const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Users = require('../models/Users');
const Contests = require('../models/Contests');

// get all users who participated in a specific contest
router.get('/contest333/:id', async (req, res) => {
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

router.get('/contest/:id', async (req, res) => {
    Users.aggregate([
        {
            $lookup: {
                from: 'contests',
                localField: 'participatedContests',
                foreignField: '_id',
                as: 'participatedContestsInfo',
            },
        },
        // {
        //   $unwind: '$participatedContestsInfo',
        // },
        {
            $project: {
                _id: 0,
                name: 1,
                'participatedContestsInfo.contest_name': 1,
                'participatedContestsInfo._id': 1,
                'participatedContestsInfo.contest_deadline': 1,
                'participatedContestsInfo.contest_price': 1,
                'participatedContestsInfo.contest_prize': 1,
            },
        },
    ])
        .then((results) => {
            //   console.log(results);
            res.json(results);
        })
        .catch((error) => {
            console.error(error);
        });
})


router.get('/contest-users-inner-join/:contestId', async (req, res) => {
    const contestId = new mongoose.Types.ObjectId(req.params.contestId);

    try {
        const result = await Users.aggregate([
            {
                $match: {
                    'participatedContests': contestId,
                },
            },
            {
                $lookup: {
                    from: 'contests',
                    localField: 'participatedContests',
                    foreignField: '_id',
                    as: 'contestDetails',
                },
            },
            {
                $unwind: '$contestDetails',
            },
            {
                $match: {
                    'contestDetails._id': contestId,
                },
            },
            {
                $project: {
                    _id: 1,
                    userName: '$name',
                    userEmail: '$email',
                    // contestDetails: {
                    contest_name: '$contestDetails.contest_name',
                    contest_deadline: '$contestDetails.contest_deadline',
                    contest_price: '$contestDetails.contest_price',
                    contest_prize: '$contestDetails.contest_prize',
                    contest_id: '$contestDetails._id',
                    contest_category: '$contestDetails.contest_category',
                    contest_winner: '$contestDetails.contest_winner',
                    // },
                },
            },
        ]);

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})








router.patch('/contest-users-winner', async (req, res) => {
    const userId = req.query.userId
    const contestId = req.query.contestId
    console.log(req)
    try {
        const userFilter = { _id: userId }
        const userUpdate = { $inc: { win: 1 } }
        const contestFilter = { _id: contestId }
        const contestUpdate = { contest_winner: userId }

        const result = await Users.findOneAndUpdate(userFilter, userUpdate, {
            new: true
        });

        const updatedContest = await Contests.findOneAndUpdate(contestFilter, contestUpdate, {
            new: true,
        });

        res.json('Updated All');

    } catch (error) {
        console.error('Error :', error.message);
    } finally {

    }
})

module.exports = router;

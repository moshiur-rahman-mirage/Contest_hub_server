const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Users = require('../models/Users');
const setToken = require('../authentication/setToken');
const verifyToken = require('../applyMiddleWare/verifyToken');
const verifyAdmin = require('../applyMiddleWare/verifyAdmin');
const Contests = require('../models/Contests');

// const User = require('../models/Users');

router.post('/jwt', setToken)


router.get('/', verifyToken, verifyAdmin, async (req, res) => {
    console.log('called')
    try {
        const data = await Users.find({})
        res.json(data);
    }
    catch (error) {
        // console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
})


router.get('/admin/:email', verifyToken, async (req, res) => {
    const email = req.params.email;
    // console.log(email)
    if (email !== req.decoded.email) {
        return res.status(403).send({ message: 'unauthorized access' });
    }

    const user = await Users.findOne({ email: email })
    console.log(user)
    let admin = false;
    if (user) {
        admin = user?.role === 'admin';
    }
    res.send({ admin });
})






router.get('/creator/:email', verifyToken, async (req, res) => {
    const email = req.params.email;
    if (email !== req.decoded.email) {
        return res.status(403).send({ message: 'unauthorized access' });
    }
    const query = { email: email };
    const user = await Users.findOne({ email: email })
    let creator = false;
    if (user) {
        creator = user?.role === 'creator';
    }
    res.send({ creator });
})















// get one by id
router.get('/contest/:id', async (req, res) => {
    try {
        console.log('here')
        const userData = await Users.find({ _id: req.params.id })

        const participatedContests = userData.map(user => user.participatedContests);
        console.log(participatedContests)
        const transformedData = {
            "participatedContests": participatedContests.map(innerArray => ({ "contestId": innerArray[0] }))
        };
        console.log('Participated Contests:', transformedData);
        res.json(transformedData)
    } catch {
        // console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// post one
router.post('/', async (req, res) => {
    try {
        const newUser = new Users(req.body);

        const savedInstance = await newUser.save()
        res.json(savedInstance);
    }
    catch (error) {
        // console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})







router.put('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const updatedDocument = await Users.findByIdAndUpdate(
            { _id: id },
            { new: true, runValidators: true }
        );
        if (!updatedDocument) {
            return res.status(404).json({ error: 'Document not found' });
        }

        res.json(updatedDocument);
    } catch (error) {
        // console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// delete
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const id = req.params.id
        const deletedDocument = await Users.findByIdAndDelete(id)
        if (!deletedDocument) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.json({ message: 'Document deleted successfully' });
    } catch (error) {
        // console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})



router.patch('/admin/:id', verifyToken, verifyAdmin, async (req, res) => {
    const id = req.params.id;
    try {
        const updatedContest = await Users.findByIdAndUpdate(id, { role: 'admin' }, {
            new: true,
        });

        res.json(updatedContest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


router.patch('/creator/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const updatedContest = await Users.findByIdAndUpdate(id, { role: 'creator' }, {
            new: true,
        });

        res.json(updatedContest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})



router.get('/:email', verifyToken, async (req, res) => {
    try {
        const userData = await Users.find({ email: req.params.email })
        res.json(userData);
    } catch (error) {

        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/contests/win', async (req, res) => {
    console.log('called win')
    try {
        const top3Items = await Users
            .find()
            .sort({ win: -1 })
            .limit(3);
        res.json(top3Items)
    } catch (error) {
        console.error('Error:', error.message);
    }


});



router.get('/topxx/creator', async (req, res) => {
    console.log('called')

    try {
        const result = await Contests.aggregate([
            {
                $group: {
                    _id: '$contest_creator',
                    totalParticipants: {
                        $sum: {
                            $ifNull: ['$participants', 0], // Use $ifNull to handle missing or null participants
                        },
                    },
                },
            },
            {
                $sort: {
                    totalParticipants: -1,
                },
            },
            {
                $limit: 3,
            },
        ]);
        console.log(res)
        res.json(result.map((entry) => entry._id)); // Returns an array of the top 3 contest creators
    } catch (error) {
        console.error('Error finding top contest creators:', error);
        throw error;
    }


})



router.get('/top/creator', async (req, res) => {
    console.log('called');

    try {
        const result = await Contests.aggregate([
            {
                $group: {
                    _id: '$contest_creator',
                    totalParticipants: {
                        $sum: {
                            $ifNull: ['$participants', 0],
                        },
                    },
                },
            },
            {
                $sort: {
                    totalParticipants: -1,
                },
            },
            {
                $limit: 3,
            },
            {
                $lookup: {
                    from: 'users', // Assuming your User model is named 'User'
                    localField: '_id',
                    foreignField: 'email', // Adjust this based on the actual field in the User model that corresponds to the contest_creator
                    as: 'userData',
                },
            },
            {
                $addFields: {
                    contestCreatorName: {
                        $arrayElemAt: ['$userData.name', 0],
                    },
                    contestCreatorPhoto: {
                        $arrayElemAt: ['$userData.img', 0],
                    },
                    creatorId: {
                        $arrayElemAt: ['$userData._id', 0],
                    },
                },
            },
            {
                $project: {
                    userData: 0, // Exclude the userData array from the final result
                },
            },
        ]);

        console.log(res);
        res.json(result.map((entry) => ({ creator: entry._id, totalParticipants: entry.totalParticipants, creatorId: entry.creatorId, contestCreatorPhoto: entry.contestCreatorPhoto, contestCreatorName: entry.contestCreatorName })));
    } catch (error) {
        console.error('Error finding top contest creators:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});







router.get('/winner/top', async (req, res) => {
  
    try {
        const topWinners = await Users.aggregate([
            {
                $project: {
                    name: 1,
                    win: { $ifNull: ['$win', 0] }, // If win is null, use 0
                },
            },
            { $sort: { win: -1 } },
            { $limit: 3 },
        ]);

        if (topWinners.length > 0) {
                res.json(topWinners)
        } else {
            console.log('No users found.');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
    
});



module.exports = router;
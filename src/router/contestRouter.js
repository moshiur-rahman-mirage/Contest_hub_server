const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Contests = require('../models/Contests');
const verifyToken = require('../applyMiddleWare/verifyToken');


const Contest = require('../models/Contests');

// get all
router.get('/', async (req, res) => {
    try {
        let query = {};
        if (req.query?.contest_category) {
            query = { contest_category: req.query.contest_category };
        }
        if (req.query?.creatorEmail) {
            query = { contest_creator: req.query.creatorEmail };
            // console.log(query);
        }
        if (req.query?.contest_status) {
            query = { contest_status: req.query.contest_status };
            // console.log(query);
        }
        const data = await Contest.find(query).limit(parseInt(req.query?.size) > 3 ? 4 : 100);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// get TOP 5
router.get('/top', async (req, res) => {
    try {
        const top5Items = await Contest
            .find()
            .sort({ participants: -1 })
            .limit(6);
        res.json(top5Items)
    } catch (error) {
        console.error('Error:', error.message);
    }


});

// get one by id
router.get('/:id', async (req, res) => {
    try {
        const data = await Contest.findById(req.params.id);
        res.json(data);
    } catch (error) {
        // console.log('why here?');
        // console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// category
router.get('/contest_category/category', async (req, res) => {
    try {
        const data = await Contest.distinct('contest_category');
        res.json(data);
    } catch {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// post one
router.post('/', verifyToken, async (req, res) => {
    try {
        const newContest = new Contest(req.body);

        const savedInstance = await newContest.save();
        res.json(savedInstance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const updatedContest = await Contest.findByIdAndUpdate(id, req.body, {
            new: true,
        });

        res.json(updatedContest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/admin/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const updatedContest = await Contest.findByIdAndUpdate(id, { contest_status: 'Accepted' }, {
            new: true,
        });

        res.json(updatedContest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// delete
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedDocument = await Contest.findByIdAndDelete(id);
        if (!deletedDocument) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/', async (req, res) => {
    try {
        const deletedDocument = await Contest.deleteMany({});
        if (!deletedDocument) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.json({ message: 'Documents deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

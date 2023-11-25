const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Contests = require('../models/Contests');
const verifyToken = require('../applyMiddleWare/verifyToken');


// model
const Contest = new mongoose.model("Contest", Contests);




// get all
router.get('/', async (req, res) => {
    try {
        let query = {};
        if (req.query?.contest_category) {
            query = { contest_category: req.query.contest_category }
        }
        if (req.query?.creatorEmail) {
            query = { contest_creator: req.query.creatorEmail }
            console.log(query)
        }
        const data = await Contest.find(query)
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
})

// get one by id
router.get('/:id', async (req, res) => {
    try {
        const data = await Contest.find({ _id: req.params.id })
        res.json(data)
    } catch {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// post one
router.post('/', verifyToken, async (req, res) => {
    try {
        const newContest = new Contest(req.body);

        const savedInstance = await newContest.save()
        res.json(savedInstance);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})



router.put('/:id',verifyToken, async (req, res) => {
    const { id } = req.params;

    const filter = { _id: id };
    console.log(filter)
    const update = { 
        contest_name:req.body.contest_name,
        contest_description:req.body.contest_description,
        contest_prize:req.body.contest_prize,
        contest_deadline:req.body.contest_deadline,
        contest_category:req.body.contest_category,
        contest_price:req.body.contest_price,
        contest_instruction:req.body.contest_instruction
    };
    console.log(update)
    const doc = await Contest.findOneAndUpdate(filter, update, {
        new: true
    });
    res.json(doc);

});




router.put('/admin/:id',verifyToken, async (req, res) => {
    const { id } = req.params;
    console.log(id)
    const filter = { _id: id };
    console.log(filter)
    const update = { contest_status: 'Accepted' };
    console.log(update)
    const doc = await Contest.findOneAndUpdate(filter, update, {
        new: true
    });
    res.json(doc);

});

// delete
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const deletedDocument = await Contest.findByIdAndDelete(id)
        if (!deletedDocument) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


router.delete('/', async (req, res) => {
    try {
        const id = req.params.id
        const deletedDocument = await Contest.deleteMany({})
        if (!deletedDocument) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


module.exports = router;
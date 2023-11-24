const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Users = require('../models/Users');
const setToken = require('../authentication/setToken');


// model
const User = new mongoose.model("User", Users);



router.post('/jwt',setToken)


router.get('/', async (req, res) => {
    console.log('called')
    try {
        const data = await User.find({})
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
        const data = await User.find({ _id: req.params.id })
        res.json(data)
    } catch {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// post one
router.post('/', async (req, res) => {
    try {
        const newUser = new User(req.body);

        const savedInstance = await newUser.save()
        res.json(savedInstance);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


// put todo
router.put('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const updatedDocument = await User.findByIdAndUpdate(
            { _id: id },
            { new: true, runValidators: true }
        );
        if (!updatedDocument) {
            return res.status(404).json({ error: 'Document not found' });
        }

        res.json(updatedDocument);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// delete
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const deletedDocument = await User.findByIdAndDelete(id)
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
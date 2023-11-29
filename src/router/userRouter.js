const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Users = require('../models/Users');
const setToken = require('../authentication/setToken');
const verifyToken = require('../applyMiddleWare/verifyToken');
const verifyAdmin = require('../applyMiddleWare/verifyAdmin');

// const User = require('../models/Users');

router.post('/jwt', setToken)


router.get('/', verifyToken,verifyAdmin, async (req, res) => {
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
        // console.log(newUser)
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
router.delete('/:id',verifyToken,verifyAdmin, async (req, res) => {
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



router.get('/:email', async (req, res) => {
    try {
        const userData = await Users.find({ email: req.params.email })
        res.json(data);
    } catch (error) {
       
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
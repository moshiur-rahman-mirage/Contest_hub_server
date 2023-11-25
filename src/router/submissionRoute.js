const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Submissions = require('../models/Submissions');



// model
const Submission = new mongoose.model("Submission", Submissions);




// get all
router.get('/contest/${params.id}', async (req, res) => {
    try {
        let query = {};
        if (req.query?.contest_category) {
            query = { contest_category: req.query.contest_category }
        }
        if (req.query?.creatorEmail) {
            query = { contest_creator: req.query.creatorEmail }
            console.log(query)
        }
        const data = await Submission.find(query)
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
})




module.exports = router;
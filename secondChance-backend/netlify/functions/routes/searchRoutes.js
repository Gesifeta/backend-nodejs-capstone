const express = require('express')

const connectToDatabase = require('../models/db')

const router = express.Router()
//  Search for gifts
router.get('/secondchance/search', async (req, res, next) => {
    try {
        console.log(req.query)
        //  Task 1: Connect to MongoDB using connectToDatabase database. Remember to use the await keyword and store the connection in `db`
        //  {{insert code here}}
        const db = await connectToDatabase()
        // to store request body
        const collection = db.collection('secondChanceItems')
        // query collection

        // console.log(gifts)
        //  Initialize the query object
        let query = {}
        //  Add the name filter to the query if the name parameter is not empty
        if (req.query.name) {
            query.name = { $regex: req.query.name, $options: 'i' } //  Using regex for partial match, case-insensitive
        }

        //  Task 3: Add other filters to the query
        if (req.query.category ) {
            query.category = { $regex: req.query.category, $options: 'i' }
        }
        if (req.query.condition ) {
            query.condition = { $regex: req.query.condition, $options: 'i' }
        }
        if (req.query.age_years) {
            query.age_years = req.query.age_years
            query.age_years = { $lte: parseInt(req.query.age_years) }
        }

        //  Task 4: Fetch filtered gifts using the find(query) method. Make sure to use await and store the result in the `gifts` constant
        const gifts = await collection.find(query).toArray()
        return res.json(gifts)
    } catch (e) {
        next(e)
    }
})

module.exports = router

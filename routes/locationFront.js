const express = require('express')
const router = express.Router()
const Location = require('../models/Location')

router.get('/locations',async (req,res) =>{
    try{
        let locations = await Location.find({})
        return res.status(200).render('location/index',{
            locations
        })
    }catch (error){
        return res.status(500).render('errors/internal',{
            error: error.message
        })
    }
})

router.get('/locations/create',(req,res) =>{
    return res.status(200).render('location/create')
})

router.get('/locations/:id/update', async (req,res) =>{
    try{
        let location = await Location.findOne({ _id: req.params.id })
        return res.status(200).render('location/update',{
            location
        })
    }catch (error){
        return res.status(500).render('errors/internal',{
            error:error.message
        })
    }
})

module.exports = router
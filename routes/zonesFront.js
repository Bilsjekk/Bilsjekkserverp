const express = require('express')
const router = express.Router()
const Zone = require('../models/Zone')

router.get('/zones',async (req,res) =>{
  try{
    let zones = await Zone.find()
    return res.status(200).render('zones/index',{
      zones
    })
  }catch(error){
    return res.status(500).json(error.message)
  }
})

router.get('/zones/:id/edit',async (req,res) =>{
  try{
    let current = await Zone.findOne({ _id: req.params.id })
    return res.status(200).render('zones/edit',{
      zone: current
    })
  }catch(error){
    return res.status(500).json(error.message)
  }
})

router.get('/zones/new',async (req,res) =>{
  try{
    return res.status(200).render('zones/create')
  }catch(error){
    return res.status(500).json(error.message)
  }
})

module.exports = router
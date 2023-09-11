const express = require('express')
const router = express.Router()
const IMEI = require('../models/IMEI')

router.get('/imeis',async (req,res) =>{
  try{
    let imeis = await IMEI.find().populate({
      path: 'zone',
      ref: 'Zone'
    })
    
    return res.status(200).render('imeis/index',{
      imeis
    })
  }catch(error){
    return res.status(500).json(error.message)
  }
})

router.get('/imeis/:id/edit',async (req,res) =>{
  try{
    let current = await IMEI.findOne({ _id: req.params.id })
    return res.status(200).render('imeis/edit',{
      imei: current
    })
  }catch(error){
    return res.status(500).json(error.message)
  }
})

router.get('/imeis/new',async (req,res) =>{
  try{
    return res.status(200).render('imeis/create')
  }catch(error){
    return res.status(500).json(error.message)
  }
})

module.exports = router
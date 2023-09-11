const express = require('express')
const router = express.Router()
const NotificationModel = require('../models/NotificationModel')

router.get('/notifications',async (req,res) =>{
  try{
    let notifications = await NotificationModel.find()
    return res.status(200).json(notifications)
  }catch(error){
    return res.status(500).json(error.message)
  }
})

router.get('/notifications/imei/:id',async (req,res) =>{
  try{
    let { id } = req.params
    let notifications = await NotificationModel.find({
      imeis:{
        $in: [id,'*']
      }
    })

    return res.status(200).json(notifications)
  }catch(error){
    console.log(error.message)
    return res.status(500).json(error.message)
  }
})

router.get('/notifications/zones/:id',async (req,res) =>{
  try{
    let { id } = req.params
    let notifications = await NotificationModel.find({
      zones:{
        $in: [id]
      }
    })

    return res.status(200).json(notifications)
  }catch(error){
    return res.status(500).json(error.message)
  }
})



module.exports = router
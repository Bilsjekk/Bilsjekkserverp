const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

router.get('/info/car',async (req,res) =>{
  try{
    let applicationData = fs.readFileSync(path.join(__dirname,'../data/application.json'),{ 
      encoding: 'utf8',
      flag: 'r'
     })
     let applicationJson = JSON.parse(applicationData)

     return res.status(200).send(applicationJson.car)
  }catch(error){
    return res.status(500).send(error.message)
  }
})

router.get('/info/shift',async (req,res) =>{
  try{
    let applicationData = fs.readFileSync(path.join(__dirname,'../data/application.json'),{ 
      encoding: 'utf8',
      flag: 'r'
     })
     let applicationJson = JSON.parse(applicationData)
     console.log(applicationJson)

     return res.status(200).send(applicationJson.shift)
  }catch(error){
    console.log(error.message)
    return res.status(500).send(error.message)
  }
})

router.get('/info/kilometer',async (req,res) =>{
  try{
    let applicationData = fs.readFileSync(path.join(__dirname,'../data/application.json'),{ 
      encoding: 'utf8',
      flag: 'r'
     })
     let applicationJson = JSON.parse(applicationData)

     return res.status(200).send(applicationJson.kilometer)
  }catch(error){
    return res.status(500).send(error.message)
  }
})

module.exports = router
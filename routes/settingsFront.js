const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

router.get('/settings',(req,res) =>{
  let emailData = fs.readFileSync(path.join(__dirname,'../data/email.json'),{ 
    encoding: 'utf8',
    flag: 'r'
   })

   let smsData = fs.readFileSync(path.join(__dirname,'../data/sms.json'),{ 
    encoding: 'utf8',
    flag: 'r'
   })


   let credentialsData = fs.readFileSync(path.join(__dirname,'../data/credentials.json'),{ 
    encoding: 'utf8',
    flag: 'r'
   })

   let applicationData = fs.readFileSync(path.join(__dirname,'../data/application.json'),{ 
    encoding: 'utf8',
    flag: 'r'
   })

   let emailJson = JSON.parse(emailData)
   let smsJson = JSON.parse(smsData)
   let credentialsJson = JSON.parse(credentialsData)
   let applicationJson = JSON.parse(applicationData)


  return res.status(200).render('settings/index',{
    email_template: emailJson.text,
    email_subject: emailJson.subject,

    sms_template: smsJson.text,

    username: credentialsJson.username,
    password: credentialsJson.password,

    kilometer: applicationJson.kilometer,
    car: applicationJson.car,
    shift: applicationJson.shift,

  })
})


module.exports = router
const express = require('express');
const router = express.Router();
const IssueReport = require('../models/IssueReport')
const jwt = require('jsonwebtoken')
const Manager = require('../models/Manager')



router.get('/reports', async (req, res) => {
  try{
    let jwt_access_token = req.cookies.jwt_token
    let decoded = jwt.verify(jwt_access_token,process.env.JWT_SECRET_KEY)
    let manager = await Manager.findOne({ _id: decoded.id })

    let reports = await IssueReport.find()
    res.status(200).render('reports/index',{
        reports: reports.reverse(),
        isAdmin: decoded.role === 'admin',
        permissions: manager.permissions 
    })
  }catch(err){
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = router
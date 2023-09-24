const express = require('express');
const router = express.Router();
const IssueReport = require('../models/IssueReport')


router.get('/reports', async (req, res) => {
  try{
    let reports = await IssueReport.find()
    res.status(200).render('reports/index',{
        reports: reports.reverse()
    })
  }catch(err){
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = router
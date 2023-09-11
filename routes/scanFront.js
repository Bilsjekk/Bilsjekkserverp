const express = require('express')
const router = express.Router()
const PostalScan = require('../models/PostalScan')

router.get('/scans',async (req,res) =>{
  try{
    let scans = await PostalScan.find()
    console.log(scans);
    return res.status(200).render('scans/read',{
      scans: scans
    })
  }catch(error){
    return res.status(500).json(error.message)
  }
})

router.get('/scans/:id', async (req, res) => {
  try {
      const scan = await PostalScan.findById(req.params.id);
      if (!scan) {
          return res.status(404).json({ error: 'PDF not found' });
      }
      return res.status(200).render('scans/postal_show', { scan });
  } catch (error) {
    console.log(error.message)
      return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router
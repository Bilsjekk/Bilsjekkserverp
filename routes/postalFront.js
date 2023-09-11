const express = require('express')
const router = express.Router()
const Postal = require('../models/PostalViolation')

router.get('/postals',async (req,res) =>{
  try{
    let postals = await Postal.find()
    return res.status(200).render('postals/read',{
      postalViolations: postals
    })
  }catch(error){
    return res.status(500).json(error.message)
  }
})

router.get('/postals/:id', async (req, res) => {
  try {
      const postal = await Postal.findById(req.params.id);
      if (!postal) {
          return res.status(404).json({ error: 'PDF not found' });
      }
      return res.status(200).render('postals/postal_show', { postal });
  } catch (error) {
    console.log(error.message)
      return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router
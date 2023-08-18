const express = require('express')
const router = express.Router()
const PDF = require('../models/PDF')

router.delete('/pdfs/:id', async (req,res) =>{
    try{
        await PDF.findOneAndDelete({ _id: req.params.id });
        return res.status(200).send("PDF Was Deleted")
    }catch (error){
        return res.status(500).send(error.message)
    }
})

router.delete('/pdfs',async (req,res) =>{
    try{
        await PDF.deleteMany({})
        return res.status(200).send("All PDFS Were Deleted")
    }catch (error){
        return res.status(500).send(error.message)
    }
})

module.exports = router
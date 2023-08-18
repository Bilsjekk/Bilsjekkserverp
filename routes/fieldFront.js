const express = require('express')
const router = express.Router()
const axios = require('axios')
const FormField = require('../models/FormField')
router.get('/fields',async (req,res) =>{
    try{


        const formFields = await FormField.find({});
        return res.render('fields/index',{
            formFields: formFields
        })
    }catch (error){
        return res.render('errors/internal',{
            error:error.message
        })
    }
})
const Group = require('../models/Group')
router.get('/fields/create',async (req,res) =>{
    let groups = await Group.find({})
    return res.render('fields/create',{
        groups: groups
    })
})
router.get('/fields/:id/update', async (req,res) => {
    try{
        let formField = await FormField.findOne({_id:req.params.id})
        let groups = await Group.find({})
        return res.status(200).render('fields/edit',{
            formField,
            groups
        })
    }catch (error){
        return res.status(500).send(error.message)
    }
})

module.exports = router
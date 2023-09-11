const express = require('express')
const router = express.Router()
const User = require('../models/usersModel')


router.get('/users',async  (req,res) =>{
    try{
        let users = await User.find({})
        return res.status(200).render('users/read',{
            users: users
        })
    }catch (error){

    }
})

router.get('/users/create', (req,res) =>{
    return res.status(200).render('users/create')
})

router.get('/users/:id/violations', (req,res) =>{
    return res.status(200).render('users/violations',{
        accountId: req.params.id
    })
})

router.get('/users/:id/edit', async (req,res) =>{
    try{
        let user = await User.findOne({ _id: req.params.id })
        return res.status(200).render('users/update',{
            user: user
        })
    }catch (error){

    }
})

module.exports = router
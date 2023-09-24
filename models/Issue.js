const mongoose = require('mongoose')

const IssueSchema = new mongoose.Schema({
    machine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'machine'
    },

    date: {
        type: String,
        required: true
    },

    boardNumber: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    notes:{
        type: String,
        default: 'No Notes'
    },

    status: {
        type: String,
        default: 'incomplete'
    },

    zone:{
        type: String,
        required: true
    },

    zoneLocation:{
        type: String,
        required: true
    },

    serial:{
        type: String,
        required: true
    }
})

const IsseModel = mongoose.model('Issue', IssueSchema)

module.exports = IsseModel
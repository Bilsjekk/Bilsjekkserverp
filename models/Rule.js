const mongoose = require('mongoose')

const RuleSchema = new mongoose.Schema({
    route: {
        name: String,
        url: String
    },

    permission:{
        name: String,
        method: String
    }
})

const RuleModel = mongoose.model('Rule',RuleSchema)

model.exports = RuleModel
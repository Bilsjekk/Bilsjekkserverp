const mongoose = require('mongoose')
const uri = 'mongodb://admin:admin123@127.0.0.1:27017/admin'; // Replace with your MongoDB connection URI


mongoose.connect(uri).then(() => console.log('connected mongoose'))

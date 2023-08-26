const mongoose = require('mongoose')
const uri = 'mongodb://admin:admin123@62.72.18.83:27017/admin'; // Replace with your MongoDB connection URI


mongoose.connect(uri).then(() => console.log('connected mongoose'))

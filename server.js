require('dotenv').config()
require('./utils/mongodbConnection')
const qr = require('qr-image');
const fs = require('fs')

const express = require('express')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const cookieParser = require('cookie-parser');
app.use(cookieParser())

const cors = require('cors')
app.use(cors())

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs')


app.get('/qrcode', (req, res) => {
    const data = JSON.stringify({
        data:{x:'y'},
        list:[1,2,32]
    }); // URL or any data you want to encode
    const qrCode = qr.image(data, { type: 'png' });

    // Generate a unique filename
    const filename = `qrcode_${Date.now()}.png`;
    const filePath = `./public/qrcodes/${filename}`;

    const qrStream = qrCode.pipe(fs.createWriteStream(filePath));

    qrStream.on('finish', () => {
        res.send(`QR Code saved as ${filename}`);
    });
});

app.get('/login', (req,res) =>{
    return res.status(200).render('auth/login')
})

app.get('/api/logout',(req,res) =>{

    res.cookie('isLogged',{
        expires: Date.now()
    })

    return res.redirect('/')
})

app.post('/api/login', async (req,res) =>{
    const { username, password } = req.body
    if(username == "admin" && password == "Admin"){
        res.cookie('isLogged','true',{
            maxAge: 36000000000000, // Cookie expiration time in milliseconds (1 hour in this case)
            httpOnly: true,
        })

        res.redirect('/')
    }else{
        return res.status(500).json({ message: "Error Message"})
    }
})
app.use((req,res,next) =>{
    if(
        req.url.includes('/api/')
        || req.url.includes('/images/')
        || req.url.includes('/profiles/')
        || req.url.includes('/css/')
    ){
      return next()
    }else{
        if(req.cookies.isLogged == "true" && (req.url != "/login" ) ){
            next();
        }else{
            return res.redirect('/login')
        }
    }

})

const driverRouter = require('./routes/driverRoute')
const groupRouter = require('./routes/groupRoute')
const fieldRouter = require('./routes/fieldRoute')

const userRouter = require('./routes/usersRouter')
const pdfRouter = require('./routes/pdfRoute')
const carRouter = require('./routes/carRoute')
const locationRouter = require('./routes/locationRoute')
app.use('/api',driverRouter,groupRouter,fieldRouter,userRouter,pdfRouter,carRouter, locationRouter)

const driverFront = require('./routes/driverFront')
const groupFront = require('./routes/groupFront')
const fieldFront = require('./routes/fieldFront')
const pdfFront = require('./routes/pdfFront')
const usersFront = require('./routes/usersFront')
const carFront = require('./routes/carFront')
const locationFront = require('./routes/locationFront')

app.use(driverFront,groupFront,fieldFront,pdfFront,usersFront,carFront,locationFront)


app.get('/',(req,res) =>{
    return res.status(200).render('index')
})

const port = process.env.port || 3000
app.listen(port, () => console.log(`Server is running on port ${port}`))

require('dotenv').config()
require('./utils/mongodbConnection')
const qr = require('qr-image');
const fs = require('fs')

const http = require('http');
const socketIo = require('socket.io');

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

const server = http.createServer(app);
const io = socketIo(server,{
    transports: ["websocket"], // Specify the transports you want to use
  });
const IMEI = require('./models/IMEI')


// WebSocket connection handling
io.on('connection', (socket) => {
    socket.on('imei', async (imei) =>{
        console.log('A user connected ' + imei);
    })

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const NotificationModel = require('./models/NotificationModel')

app.post('/api/notifications/users', async (req,res) =>{
    try{
        const now = new Date();
        const localDate = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
        const localDateString = localDate.toISOString().split('T')[0];
    
        let notification = new NotificationModel({
            title: req.body.title,
            body: req.body.body,
            date:localDateString,
            fullDate: localDate.toDateString()
        })
    
        await notification.save()
    
        console.log(req.body)
        io.emit('users', JSON.stringify(req.body))
        return res.sendStatus(200)
    }catch(error){
        console.log(error.message)
        return res.status(500).json(error.message)
    }
})


app.post('/api/notifications/zones', async (req,res) =>{
    try{
        const now = new Date();
        const localDate = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
        const localDateString = localDate.toISOString().split('T')[0];
   
        
        let imeis = await IMEI.find({
            zone: {
                $in: req.body.zones
            }
        })

        let notification = new NotificationModel({
            title: req.body.title,
            body: req.body.body,
            zones: req.body.zones,
            imeis:imeis,
            date:localDateString,
            fullDate: localDate.toDateString()
        })
    
        await notification.save()
    
        

        imeis = imeis.map(e =>{
            return e.serial
        })

        console.log(imeis)
        io.emit('zones', JSON.stringify({
            title: req.body.title,
            body: req.body.body,
            imeis: imeis
        }))
        return res.sendStatus(200)
    }catch(error){
        console.log(error.message)
        return res.status(500).json(error.message)
    }
})

app.post('/api/notifications/devices', async (req,res) =>{
    try{
        const now = new Date();
        const localDate = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
        const localDateString = localDate.toISOString().split('T')[0];
    
        let notification = new NotificationModel({
            title: req.body.title,
            body: req.body.body,
            zones: [],
            imeis:req.body.imeis,
            date:localDateString,
            fullDate: localDate.toDateString()
        })
    
        await notification.save()
    
        console.log(req.body)
        io.emit('devices', JSON.stringify(req.body))
        return res.sendStatus(200)
    }catch(error){
        console.log(error.message)
        return res.status(500).json(error.message)
    }
})

app.get('/login', (req,res) =>{
    return res.status(200).render('auth/login')
})

const PDFArchieve = require('./models/PdfArchieve')

app.get('/archieve',async (req,res) =>{
    let archieves = await PDFArchieve.find({})
    return res.status(200).render('pdfArchieve/pdf_list',{
        pdfs: archieves
    })
})

const PDF = require('./models/PDF')
app.post('/api/archieves', async (req,res) =>{
    try{
        let pdfs = await PDF.find({}).populate({
            path:'userId',
            ref:'User'
        })

        for(let pdf of pdfs){
            let isExisting = await PDFArchieve.findOne({
                accountId: pdf.userId.accountId,
                link:pdf.link,
                createdAt:pdf.createdAt
            })

            if(isExisting){
                continue;
            }

            let archieve = new PDFArchieve({
                name:pdf.name,
                username:pdf.userId.name,
                accountId:pdf.userId.accountId,
                link:pdf.link,
                createdAt:pdf.createdAt,
            })

            await archieve.save()
        }

        return res.sendStatus(200) 
    }catch(error){
        console.log(error.message)
        return res.status(500).send(error.message)
    }
})

// READ - Get a specific PDF by ID
app.get('/archieves/:id', async (req, res) => {
    try {
        const pdf = await PDFArchieve.findById(req.params.id);
        if (!pdf) {
            return res.status(404).json({ error: 'PDF not found' });
        }
        return res.status(200).render('pdfArchieve/pdf_show.ejs', { pdf });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/logout',(req,res) =>{

    res.cookie('isLogged',{
        expires: Date.now()
    })

    return res.redirect('/')
})

const path = require('path')

app.post('/api/login', async (req,res) =>{
    const { username, password } = req.body
    const file = fs.readFileSync('data/credentials.json',{
        encoding:'utf-8'
    })

    const json = JSON.parse(file)



    if(username == json.username && password == json.password){
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
const settingsRouter = require('./routes/settingsRoute')
const violationRouter = require('./routes/violationRoute')
const informationRouter = require('./routes/information')
const accidentRouter = require('./routes/accident')
const vpsRouter = require('./routes/vpsRouter')
const zoneRouter = require('./routes/zoneRouter')
const imeiRouter = require('./routes/imeiRouter')
const postalRouter = require('./routes/postalRoute')
const mapRouter = require('./routes/mapRouter')
const notificationRouter = require('./routes/notificationRouter')
const scanRouter = require('./routes/scanRoute')

app.use(
    '/api',
    vpsRouter,
    scanRouter,
    notificationRouter,
    mapRouter,
    postalRouter,
    violationRouter,
    accidentRouter,
    informationRouter,
    driverRouter,
    settingsRouter,
    groupRouter,
    fieldRouter,
    userRouter,
    pdfRouter,
    carRouter,
    locationRouter,
    imeiRouter,
    zoneRouter
    )

const driverFront = require('./routes/driverFront')
const groupFront = require('./routes/groupFront')
const fieldFront = require('./routes/fieldFront')
const pdfFront = require('./routes/pdfFront')
const usersFront = require('./routes/usersFront')
const carFront = require('./routes/carFront')
const locationFront = require('./routes/locationFront')
const settingsFront = require('./routes/settingsFront')
const zonesFront = require('./routes/zonesFront')
const imeiFront = require('./routes/imeiFront')
const postalFront = require('./routes/postalFront')
const mapFront = require('./routes/mapFront')
const notificationFront = require('./routes/notificationFront')
const scanFront = require('./routes/scanFront')


app.use(
    mapFront,
    scanFront,
    notificationFront,
    settingsFront,
    driverFront,
    postalFront,
    groupFront,
    fieldFront,
    pdfFront,
    usersFront,
    carFront,
    locationFront,
    zonesFront,
    imeiFront
)



const Violation = require('./models/Violation')
app.get('/',async (req,res) =>{
    let violations = await Violation.find({});

const combinedViolations = violations.reduce((result, v) => {
    const existingEntry = result.find(entry => entry.date === v.createdAt);
    if (existingEntry) {
        existingEntry.value += v.violations;
    } else {
        result.push({
            date: v.createdAt,
            value: v.violations
        });
    }
    return result;
}, []);

    console.log(combinedViolations)

    const violationsJSON = JSON.stringify(combinedViolations);

    return res.status(200).render('index',{
        violations: violationsJSON
    })
})


const port = process.env.port || 9090
server.listen(port, () => console.log(`Socket Server is running on port ${port}`))
app.listen(5555, () => console.log(`Normal Server is running on port ${5555}`))


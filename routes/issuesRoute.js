const express = require('express');
const router = express.Router();
const IssueNotification = require('../models/IssueNotification')
const Issue = require('../models/Issue')
const User = require('../models/usersModel')
const IssueReport = require('../models/IssueReport');
const admin = require('../utils/firebase');
const { sendAlertSMS } = require('../utils/sms_service')
const Machine = require('../models/Machine')


router.get('/issues/complete', async (req, res) => {
    try{
        let issues = await Issue.find({
            status: 'complete'
        }).populate({
            path: 'machine',
            ref: 'Machine'
        })
        return res.status(200).json(issues.reverse())
    }catch(err){
        return res.status(500).json(err.message)
    }
})

router.get('/issues/current', async (req, res) => {
    try{
        let issues = await Issue.find({
            status: 'incomplete'
        }).populate({
            path: 'machine',
            ref: 'machine'
        })

        return res.status(200).json(issues.reverse())
    }catch(err){
        return res.status(500).json(err.message)
    }
})


router.post('/issues', async (req, res) => {
    try{
        const {
            boardNumber,
            notes,
            id,
        } = req.body

        const machine = await Machine.findOne({
            _id: id
        }).populate({
            path: 'zone',
            ref: 'Zone'
        })

        const message = {
            data: {
                title: `Fei på ${machine.zoneLocation} Automat`,
                body: `Automat som ligger på ${machine.zone.name} i adressen ${machine.zoneLocation} kanskje er ute av drift, klagen har kommet gjennom bilfører med skilt nr ${boardNumber}`,
                type: 'issue',
                id:id,
            },
            topic: 'nordic', // Replace with the topic you want to use
          };
          
          let response = await admin
            .messaging()
            .send(message)

            console.log('Message sent:', response);
            const now = new Date();
            const localDate = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
            const localDateString = localDate.toISOString().split('T')[0];

            const issueNotification = new IssueNotification({
                title: `Fei på ${machine.zoneLocation} Automat`,
                body: `Automat som ligger på ${machine.zone.name} i adressen ${machine.zoneLocation} kanskje er ute av drift, klagen har kommet gjennom bilfører med skilt nr ${boardNumber}`,
                date: localDateString,
                fullDate: localDate.toDateString(),
                type: 'issue'
            })

            await issueNotification.save()
            const issue = new Issue({
                title: `Feil på Automat ${machine.zoneLocation}`,
                description: `Automat som ligger på ${machine.zone.name} i adressen ${machine.zoneLocation} kanskje er ute av drift, klagen har kommet gjennom bilfører med skilt nr ${boardNumber}`,
                notes: notes ?? null,
                date: localDateString,
                machine: id ,
                serial: machine.serial,
                zone: machine.zone.name,
                zoneLocation: machine.zoneLocation,
                boardNumber: boardNumber
            })


            await issue.save()

                await sendAlertSMS({
                    text: `Automat som ligger på ${machine.zone.name} i adressen ${machine.zoneLocation} kanskje er ute av drift, klagen har kommet gjennom bilfører med skilt nr ${boardNumber}`,
                    to: `4740088605`
                })
            await Machine.updateOne({
                _id:id,
            },{ status: 'inactive' })

            return res.json({ 
                message: 'Message sent successfully'
             })

    }catch(err){
        console.log(err.message)
        return res.status(500).json({message: err.message});
    }
})

const multer = require('multer')
const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')
// Set up multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Set the destination folder where files will be saved
        cb(null, 'public/images/reports/'); // Create a folder named 'uploads' in your project root
    },
    filename: function (req, file, cb) {
        // Set the file name with original name + timestamp to make it unique
        cb(null, Date.now() + '_' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/issues/:id/report', upload.single('report') ,async (req, res) => {
    console.log(req.params);
    try{
        const {
            details,
            notes,
            zone,
            zoneLocation,
            serial,
            pnid
        } = req.body

        console.log(req.body);

        let image = process.env.BASE_URL + req.file.path.split('public')[1].replaceAll('\\','/')
        let currentIssue = await Issue.findOne({_id: req.params.id})
        const currentUser = await User.findOne({
            accountId: pnid.toUpperCase(),
        })


        const browser = await puppeteer.launch({
            headless: 'new',
            args:['--no-sandbox']
        });
        const page = await browser.newPage();

        // Load the HTML template
        const htmlTemplate = fs.readFileSync('templates/machine_fix_report.html', 'utf8');

        const now = new Date();
        const localDate = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
        const localDateString = localDate.toISOString().split('T')[0];

        console.log(localDateString);
        console.log(localDate);

        // Replace placeholders with dynamic data
        const template_data = {
            details: details,
            notes: notes ,
            clientNotes: currentIssue.notes,
            image,
            boardNumber:currentIssue.boardNumber,
            date: localDateString,
            fullDate: localDate.toDateString(),
            serial: currentIssue.serial,
            zone: currentIssue.zone,
            zoneLocation: currentIssue.zoneLocation,
            pnid: currentUser.accountId,
            name: currentUser.name
        };

        const filledTemplate = Handlebars.compile(htmlTemplate)(template_data);

        let filename = `machine_fix_report_${Date.now()}.pdf`

        // Generate PDF from filled template
        await page.setContent(filledTemplate);
        await page.pdf({ path: `./public/profiles/${filename}`,
        
        printBackground: true,

        format: 'A3' });

        await browser.close();

        const issueReport = new IssueReport({
            details: details,
            notes: notes,
            date: localDateString,
            image: image,
            pdf: process.env.BASE_URL + 'profiles/' + filename,
            serial: currentIssue.serial,
            zone: currentIssue.zone,
            zoneLocation: currentIssue.zoneLocation
        })

        await issueReport.save()

        const issueNotification = new IssueNotification({
            title: `P-Autmat ${currentIssue.zoneLocation} er i orden`,
            body: `P-Automat på  ${currentIssue.zone} i adressen ${currentIssue.zoneLocation} fikset av ${currentUser.name}`,
            date: localDateString,
            fullDate: localDate.toDateString(),
            type: 'activation'
        })

        await issueNotification.save()

        let currentIssueUpdated = await Issue.updateOne({
            _id: req.params.id,
        },{
            status: 'complete',
        })

        if(currentIssueUpdated){
            console.log('Issue updated and closed');
        }

        let machineId = currentIssue.machine

        let machineActivation = await Machine.updateOne({
            _id: machineId,
        },{
            status: 'active',
        })

        if(machineActivation){
            console.log('Machine activated');
        }

        const message = {
            data: {
                title: `P-Autmat ${currentIssue.zoneLocation} er i orden`,
                body: `P-Automat på  ${currentIssue.zone} i adressen ${currentIssue.zoneLocation} fikset av ${currentUser.name}`,
                type: 'issue_closed',
            },
            topic: 'nordic', // Replace with the topic you want to use
          };
          
          let response = await admin
            .messaging()
            .send(message)




        return res.status(200).json({ message: 'PDF generated and saved successfully' });
    }catch(err){
        console.log(err.message)
        return res.status(500).json({message: err.message});
    }
})

router.post('/issues/:id/external/notify', async (req,res) =>{
    try{
        const { reason } = req.body

        const issue = await Issue.findOne({
            _id: req.params.id
        })

        let smsMessageFormatted = `
Feil på P-Automat ${issue.serial} på ${issue.zone} som ligger på ${issue.zoneLocation} ute av drift.

Den trenger teknikker.
Grunn: ${reason}
        `

        sendAlertSMS({
            text: smsMessageFormatted,
            to: `4740088605`
        })

        return res.status(200).json({message: smsMessageFormatted})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({message: error.message});
    }
})
module.exports = router;

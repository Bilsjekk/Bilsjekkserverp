const express = require('express');
const router = express.Router();
const IssueNotification = require('../models/IssueNotification')

router.get('/issues/notifications', async (req, res) => {
    
    const issuenotifications = await IssueNotification.find()

    res.render('issueNotifications/index', { issuenotifications: issuenotifications.reverse() });
});

module.exports = router;
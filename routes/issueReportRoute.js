const express = require('express');
const router = express.Router()
const Machine = require('../models/Machine')
const Issue = require('../models/Issue')
const SMS = require('../models/SMS')
const moment = require('moment');

router.get('/reports/leaderboard/:id', async (req, res) => {
    try{
        const { id } = req.params
        let completedIssues = await Issue.find({
            status: 'complete'
        })

        if(id == 0){
            let currentMonth = moment(moment.now()).month()
            completedIssues = completedIssues.filter(issue =>{
                return moment(issue.fixedAt).month() == currentMonth
            })
        }else if(id == 1){
          let currentDay = moment(moment.now()).day()
          let currentMonth = moment(moment.now()).month()
          completedIssues = completedIssues.filter(issue =>{
            return moment(issue.fixedAt).day() == currentDay && moment(issue.fixedAt).month() == currentMonth
        })
        }else if(id == 2){
          let currentDate = moment(moment().format('YYYY-MM-DD'))
          let twoDaysAgo = moment(moment().subtract(2,'days').format('YYYY-MM-DD'))

          completedIssues = completedIssues.filter(issue =>{
            return moment(moment(issue.fixedAt).format('YYYY-MM-DD')).isBetween(twoDaysAgo,currentDate,'days','[]')
          })

        }else if(id == 3){
          let currentDate = moment(moment().format('YYYY-MM-DD'))
          let oneWeekAgo = moment(moment().subtract(1,'weeks').format('YYYY-MM-DD'))

          completedIssues = completedIssues.filter(issue =>{
            return moment(moment(issue.fixedAt).format('YYYY-MM-DD')).isBetween(oneWeekAgo,currentDate,'days','[]')
          })

        }else if(id == 4){
          let currentDate = moment(moment().format('YYYY-MM-DD'))
          let oneMonthAgo = moment(moment().subtract(1,'months').format('YYYY-MM-DD'))

          completedIssues = completedIssues.filter(issue =>{
            return moment(moment(issue.fixedAt).format('YYYY-MM-DD')).isBetween(oneMonthAgo,currentDate,'days','[]')
          })
        }else if(id == 5){
          const lowerBoundDate = req.headers.lowerbound
          const upperBoundDate = req.headers.upperbound
          if(!lowerBoundDate  || !upperBoundDate){
            return res.status(400).json({
              message: 'Bad Request Lower Bound or Uppper Bound Date is required',
              lowerBoundDate
            }) 
          }

          let start = moment(moment(lowerBoundDate).format('YYYY-MM-DD'))
          let end = moment(moment(upperBoundDate).format('YYYY-MM-DD'))

          completedIssues = completedIssues.filter(issue =>{
            return moment(moment(issue.fixedAt).format('YYYY-MM-DD')).isBetween(start,end,'days','[]')
          })
        }


        let issueGroupedIntoIdentifiers = completedIssues.reduce((result, item) => {
            const key = item.fixedByIdentifier;
            if (key !== undefined && key !== null) {
              if (!result[key]) {
                result[key] = [];
              }
              result[key].push(item);
            }
            return result;
          }, {});
      
          
      
          let holder = {}
          
          Object.keys(issueGroupedIntoIdentifiers).forEach((key) =>{
            let list = issueGroupedIntoIdentifiers[key]
            let sumx = list.reduce((sum, item) =>{
              let end = moment(item.fixedAt)
            let start = moment(item.date)
      
         
      
            let diff = moment.duration(end.diff(start))
            return sum + diff.asHours()
            },0)
      
            avgx = sumx / list.length
      
            holder[key] = avgx
          })
      
          let holderSortableArray = []
          for(let key in holder){
            holderSortableArray.push({
              identifier: key,
              value: holder[key]
            })
          }
      
          holderSortableArray.sort((a,b) =>{
            return a.value - b.value
          })
        
          return res.status(200).json(holderSortableArray)
    }catch(err){
        return res.status(500).json({ error: err.message })
    }
})

router.get('/reports/averages/:id', async (req, res) => {
  const { id } = req.params

  try{
    let completedIssues = await Issue.find({
      status: 'complete'
    })

    let issuesWereInWaitingState = await Issue.find({
      wasInWaitingState: true
    })

    let issueWereRedirected = await Issue.find({
      wasRedirected: true
    })

    if(id == 0){
      let currentMonth = moment(moment.now()).month()
      completedIssues = completedIssues.filter(issue =>{
          return moment(issue.fixedAt).month() == currentMonth
      })

      issuesWereInWaitingState = issuesWereInWaitingState.filter(issue =>{
        return moment(issue.fixedAt).month() == currentMonth
      })

      issueWereRedirected = issueWereRedirected.filter(issue =>{
        return moment(issue.fixedAt).month() == currentMonth
      })
  }else if(id == 1){
    let currentDay = moment(moment.now()).day()
    let currentMonth = moment(moment.now()).month()
    completedIssues = completedIssues.filter(issue =>{
      return moment(issue.fixedAt).day() == currentDay && moment(issue.fixedAt).month() == currentMonth
    })

    issueWereRedirected = issueWereRedirected.filter(issue =>{
      return moment(issue.fixedAt).day() == currentDay && moment(issue.fixedAt).month() == currentMonth
    })

    issuesWereInWaitingState = issuesWereInWaitingState.filter(issue =>{
      return moment(issue.fixedAt).day() == currentDay && moment(issue.fixedAt).month() == currentMonth
    })
  }else if(id == 2){
    let currentDate = moment(moment().format('YYYY-MM-DD'))
    let twoDaysAgo = moment(moment().subtract(2,'days').format('YYYY-MM-DD'))

    completedIssues = completedIssues.filter(issue =>{
      return moment(moment(issue.fixedAt).format('YYYY-MM-DD')).isBetween(twoDaysAgo,currentDate,'days','[]')
    })

    issueWereRedirected = issueWereRedirected.filter(issue =>{
      return moment(moment(issue.fixedAt).format('YYYY-MM-DD')).isBetween(twoDaysAgo,currentDate,'days','[]')
    })

    issuesWereInWaitingState = issuesWereInWaitingState.filter(issue =>{
      return moment(moment(issue.fixedAt).format('YYYY-MM-DD')).isBetween(twoDaysAgo,currentDate,'days','[]')
    })
  }else if(id == 3){
    let currentDate = moment(moment().format('YYYY-MM-DD'))
    let oneWeekAgo = moment(moment().subtract(1,'weeks').format('YYYY-MM-DD'))

    completedIssues = completedIssues.filter(issue =>{
      return moment(moment(issue.fixedAt).format('YYYY-MM-DD')).isBetween(oneWeekAgo,currentDate,'days','[]')
    })

    issueWereRedirected = issueWereRedirected.filter(issue =>{
      return moment(moment(issue.fixedAt).format('YYYY-MM-DD')).isBetween(oneWeekAgo,currentDate,'days','[]')
    })

    issuesWereInWaitingState = issuesWereInWaitingState.filter(issue =>{
      return moment(moment(issue.fixedAt).format('YYYY-MM-DD')).isBetween(oneWeekAgo,currentDate,'days','[]')
    })

  }else if(id == 4){
    let currentDate = moment(moment().format('YYYY-MM-DD'))
    let oneMonthAgo = moment(moment().subtract(1,'months').format('YYYY-MM-DD'))

    completedIssues = completedIssues.filter(issue =>{
      return moment(moment(issue.fixedAt).format('YYYY-MM-DD')).isBetween(oneMonthAgo,currentDate,'days','[]')
    })

    issueWereRedirected = issueWereRedirected.filter(issue =>{
      return moment(moment(issue.fixedAt).format('YYYY-MM-DD')).isBetween(oneMonthAgo,currentDate,'days','[]')
    })

    issuesWereInWaitingState = issuesWereInWaitingState.filter(issue =>{
      return moment(moment(issue.fixedAt).format('YYYY-MM-DD')).isBetween(oneMonthAgo,currentDate,'days','[]')
    })
  }else if(id == 5){
    const lowerBoundDate = req.headers.lowerbound
    const upperBoundDate = req.headers.upperbound
    if(!lowerBoundDate || !upperBoundDate){
      return res.status(400).json({
        message: 'Bad Request Lower Bound or Upper Bound Date is required',
        lowerBoundDate
      }) 
    }

    let start = moment(moment(lowerBoundDate).format('YYYY-MM-DD'))
    let end = moment(moment(upperBoundDate).format('YYYY-MM-DD'))

    completedIssues = completedIssues.filter(issue =>{
      return moment(moment(issue.fixedAt).format('YYYY-MM-DD')).isBetween(start,end,'days','[]')
    })

    issueWereRedirected = issueWereRedirected.filter(issue =>{
      return moment(moment(issue.fixedAt).format('YYYY-MM-DD')).isBetween(start,end,'days','[]')
    })

    issuesWereInWaitingState = issuesWereInWaitingState.filter(issue =>{
      return moment(moment(issue.fixedAt).format('YYYY-MM-DD')).isBetween(start,end,'days','[]')
    })
  }


    let issueSolvedHours = completedIssues.map(ic => {
      let end = moment(ic.fixedAt)
      let start = moment(ic.date)
  
      let diff = moment.duration(end.diff(start))
      return diff.asHours()
    })
  
    issueSolvedHours = issueSolvedHours.filter(Boolean)
    let issueSolvedHoursSum = issueSolvedHours.reduce((sum, hour) => sum + hour,0)
    let issueSolvedHoursAverage = (issueSolvedHoursSum / issueSolvedHours.length).toFixed(2)
    let fraction = issueSolvedHoursAverage.split('.')
    fraction[0] = fraction[0] + 'H'
    fraction[1] = ((+fraction[1] / 100) * 60).toFixed(2) + 'M'
    issueSolvedHoursAverage = issueSolvedHours.length > 0 ? fraction.join(' ') : 0


    let issueWaitingHours = issuesWereInWaitingState.map(iws => {
      let end = moment(iws.WaitingEndTime)
      let start = moment(iws.waitingStartTime)
  
      let diff = moment.duration(end.diff(start))
      return diff.asHours()
    })
  
    issueWaitingHours = issueWaitingHours.filter(Boolean)
    let issueSolvedWaitingHoursSum = issueWaitingHours.reduce((sum, hour) => sum + hour,0)
    let issueSolvedWaitingHoursAverage = issueWaitingHours.length > 0 ? 
      (issueSolvedWaitingHoursSum / issueWaitingHours.length).toFixed(2) : 0


      let issueRedirectHours = issueWereRedirected.map(iwr =>{
    let end = moment(iwr.fixedAt)
    let start = moment(iwr.redirectStartTime)

    let diff = moment.duration(end.diff(start))
    return diff.asHours()
  })

  issueRedirectHours = issueRedirectHours.filter(Boolean)
  let issueRedirectHoursSum = issueRedirectHours.reduce((sum, hour) => sum + hour, 0)
  let issueRedirectHoursAverage = issueRedirectHours.length > 0 ?
    (issueRedirectHoursSum / issueRedirectHours.length) : 0
    

    return res.status(200).json({
      issueSolvedHoursAverage,
      issueSolvedWaitingHoursAverage,
      issueRedirectHoursAverage,
    })
  }catch(err){
    return res.status(500).json(err.message)
  }
});

router.get('/reports/general/:id', async (req, res) => {
  const { id } = req.params

  try{
    let issues = await Issue.find()
    let waitingIssues = await Issue.find({
      status: 'waiting'
    })

    let completedIssues = await Issue.find({
      status: 'complete'
    })

    let inCompletedIssues = await Issue.find({
      status: 'incomplete'
    })

    let issuePublishedByDriver = await Issue.find({
      publisher: 'driver'
    })

    let issueSolvedByDriver = await Issue.find({
      fixedBy: 'driver'
    })

    console.log(inCompletedIssues.length);

    if(id == 0){
      let currentMonth = moment().month()
      completedIssues = completedIssues.filter(issue =>{
          return moment(issue.fixedAt).month() == currentMonth
      })

      inCompletedIssues = inCompletedIssues.filter(issue =>{
        return moment(moment(issue.date).format('YYYY-MM-DD')).isSame(moment().format('YYYY-MM-DD'),'month')
      })

      console.log(inCompletedIssues.length);
      issues = issues.filter(issue =>{
        return moment(issue.date).month() == currentMonth
      })


      issuePublishedByDriver = issuePublishedByDriver.filter(issue =>{
        return moment(issue.date).month() == currentMonth
      })

      issueSolvedByDriver = issueSolvedByDriver.filter(issue =>{
        return moment(issue.fixedAt).month() == currentMonth
      })
    }else if(id == 1){
      let currentDay = moment(moment.now()).day()
      let currentMonth = moment(moment.now()).month()
      completedIssues = completedIssues.filter(issue =>{
        return moment(issue.fixedAt).day() == currentDay && moment(issue.fixedAt).month() == currentMonth
      })

      issues = issues.filter(issue =>{
        return moment(issue.date).day() == currentDay && moment(issue.fixedAt).month() == currentMonth
      })

      waitingIssues = waitingIssues.filter(issue =>{
        return moment(issue.date).day() == currentDay && moment(issue.fixedAt).month() == currentMonth
      })

      inCompletedIssues = inCompletedIssues.filter(issue =>{
        return moment(issue.date).day() == currentDay && moment(issue.fixedAt).month() == currentMonth
      })

      issuePublishedByDriver = issuePublishedByDriver.filter(issue =>{
        return moment(issue.date).day() == currentDay && moment(issue.fixedAt).month() == currentMonth
      })

      issueSolvedByDriver = issueSolvedByDriver.filter(issue =>{
        return moment(issue.fixedAt).day() == currentDay && moment(issue.fixedAt).month() == currentMonth
      })
    }else if(id == 2){
      let currentDate = moment(moment().format('YYYY-MM-DD'))
      let twoDaysAgo = moment(moment().subtract(2,'days').format('YYYY-MM-DD'))

      completedIssues = completedIssues.filter(issue =>{
        return moment(moment(issue.fixedAt).format('YYYY-MM-DD')).isBetween(twoDaysAgo,currentDate,'days','[]')
      })

      issues = issues.filter(issue =>{
        return moment(moment(issue.date).format('YYYY-MM-DD')).isBetween(twoDaysAgo,currentDate,'days','[]')
      })

      inCompletedIssues = inCompletedIssues.filter(issue =>{
        return moment(moment(issue.date).format('YYYY-MM-DD')).isBetween(twoDaysAgo,currentDate,'days','[]')
      })

      waitingIssues = waitingIssues.filter(issue =>{
        return moment(moment(issue.date).format('YYYY-MM-DD')).isBetween(twoDaysAgo,currentDate,'days','[]')
      })

      issuePublishedByDriver = issuePublishedByDriver.filter(issue =>{
        return moment(moment(issue.date).format('YYYY-MM-DD')).isBetween(twoDaysAgo,currentDate,'days','[]')
      })

      issueSolvedByDriver = issueSolvedByDriver.filter(issue =>{
        return moment(moment(issue.fixedAt).format('YYYY-MM-DD')).isBetween(twoDaysAgo,currentDate,'days','[]')
      })
    }else if(id == 3){
      let currentDate = moment(moment().format('YYYY-MM-DD'))
      let oneWeekAgo = moment(moment().subtract(1,'weeks').format('YYYY-MM-DD'))

      completedIssues = completedIssues.filter(issue =>{
        return moment(moment(issue.fixedAt).format('YYYY-MM-DD')).isBetween(oneWeekAgo,currentDate,'days','[]')
      })

      issues = issues.filter(issue =>{
        return moment(moment(issue.date).format('YYYY-MM-DD')).isBetween(oneWeekAgo,currentDate,'days','[]')
      })

      inCompletedIssues = inCompletedIssues.filter(issue =>{
        return moment(moment(issue.date).format('YYYY-MM-DD')).isBetween(oneWeekAgo,currentDate,'days','[]')
      })

      waitingIssues = waitingIssues.filter(issue =>{
        return moment(moment(issue.date).format('YYYY-MM-DD')).isBetween(oneWeekAgo,currentDate,'days','[]')
      })

      issuePublishedByDriver = issuePublishedByDriver.filter(issue =>{
        return moment(moment(issue.date).format('YYYY-MM-DD')).isBetween(oneWeekAgo,currentDate,'days','[]')
      })

      issueSolvedByDriver = issueSolvedByDriver.filter(issue =>{
        return moment(moment(issue.fixedAt).format('YYYY-MM-DD')).isBetween(oneWeekAgo,currentDate,'days','[]')
      })
    }else if(id == 4){
      let currentDate = moment(moment().format('YYYY-MM-DD'))
      let oneMonthAgo = moment(moment().subtract(1,'months').format('YYYY-MM-DD'))

      completedIssues = completedIssues.filter(issue =>{
        return moment(moment(issue.fixedAt).format('YYYY-MM-DD')).isBetween(oneMonthAgo,currentDate,'days','[]')
      })

      issues = issues.filter(issue =>{
        return moment(moment(issue.date).format('YYYY-MM-DD')).isBetween(oneMonthAgo,currentDate,'days','[]')
      })

      inCompletedIssues = inCompletedIssues.filter(issue =>{
        return moment(moment(issue.date).format('YYYY-MM-DD')).isBetween(oneMonthAgo,currentDate,'days','[]')
      })

      waitingIssues = waitingIssues.filter(issue =>{
        return moment(moment(issue.date).format('YYYY-MM-DD')).isBetween(oneMonthAgo,currentDate,'days','[]')
      })

      issuePublishedByDriver = issuePublishedByDriver.filter(issue =>{
        return moment(moment(issue.date).format('YYYY-MM-DD')).isBetween(oneMonthAgo,currentDate,'days','[]')
      })

      issueSolvedByDriver = issueSolvedByDriver.filter(issue =>{
        return moment(moment(issue.fixedAt).format('YYYY-MM-DD')).isBetween(oneMonthAgo,currentDate,'days','[]')
      })
    }else if(id == 5){
      const lowerBoundDate = req.headers.lowerbound
      const upperBoundDate = req.headers.upperbound
      if(!lowerBoundDate || !upperBoundDate){
        return res.status(400).json({
          message: 'Bad Request Lower Bound or Upper Bound Date is required',
          lowerBoundDate
        }) 
      }

      let start = moment(moment(lowerBoundDate).format('YYYY-MM-DD'))
      let end = moment(moment(upperBoundDate).format('YYYY-MM-DD'))

      completedIssues = completedIssues.filter(issue =>{
        return moment(moment(issue.fixedAt).format('YYYY-MM-DD')).isBetween(start,end,'days','[]')
      })

      issues = issues.filter(issue =>{
        return moment(moment(issue.date).format('YYYY-MM-DD')).isBetween(start,end,'days','[]')
      })

      inCompletedIssues = inCompletedIssues.filter(issue =>{
        return moment(moment(issue.date).format('YYYY-MM-DD')).isBetween(start,end,'days','[]')
      })

      waitingIssues = waitingIssues.filter(issue =>{
        return moment(moment(issue.date).format('YYYY-MM-DD')).isBetween(start,end,'days','[]')
      })

      issuePublishedByDriver = issuePublishedByDriver.filter(issue =>{
        return moment(moment(issue.date).format('YYYY-MM-DD')).isBetween(start,end,'days','[]')
      })

      issueSolvedByDriver = issueSolvedByDriver.filter(issue =>{
        return moment(moment(issue.fixedAt).format('YYYY-MM-DD')).isBetween(start,end,'days','[]')
      })
    }

    return res.status(200).json({
      totalIssues: issues.length,
      waitingIssues: waitingIssues.length,
      completedIssues: completedIssues.length,
      inCompletedIssues: inCompletedIssues.length,
      issuePublishedByDriver: issuePublishedByDriver.length,
      issueSolvedByDriver: issueSolvedByDriver.length,
    })

  }catch(e){
    return res.status(500).json(e.message)
  }
});

router.get('/reports/sms/total', async (req, res) => {
  try{
    let smss = await SMS.find()
    return res.status(200).json(smss.length)
  }catch(e){
    return res.status(500).json(e.message)
  }
})

router.get('/reports/repeated', async (req, res) => {
  try{
    let now = moment(moment().format('YYYY-MM-DD'))
    let monthAgo = moment(moment().subtract(1,'months').format('YYYY-MM-DD'))

    let issues = await Issue.find()
    issues = issues.filter(issue => {
      let issueDate = moment(moment(issue.date).format('YYYY-MM-DD'))
      return issueDate.isBetween(monthAgo,now)
    })

    let issueGroupedIntoSerials = issues.reduce((result, item) => {
      const key = item.serial;
      if (key !== undefined && key !== null) {
        if (!result[key]) {
          result[key] = [];
        }
        result[key].push(item);
      }
      return result;
    }, {});

    let groupsIntoNumbers = []
    for(let key in issueGroupedIntoSerials){
      if(issueGroupedIntoSerials.hasOwnProperty(key) && issueGroupedIntoSerials[key].length > 2){
        groupsIntoNumbers.push({
          serial: key,
          total: issueGroupedIntoSerials[key].length
        })
      }
    }

    return res.status(200).json(groupsIntoNumbers);
  }catch(e){
    return res.status(500).json(e.message)
  }
})
module.exports = router
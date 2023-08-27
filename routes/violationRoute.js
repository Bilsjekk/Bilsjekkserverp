const express = require('express')
const router = express.Router()
const Violation = require('../models/Violation')

router.get('/violations/:id',async (req,res) =>{
  try{
    let { id } = req.params

    if(id == 0){
      let violations = await Violation.find({})
      let totalViolations = 0;
    
      violations.forEach(violation => {
        totalViolations += violation.violations;
      });

      return res.send(totalViolations.toString())      
    }else if(id == 1){
      let currentDate = new Date().toISOString().split('T')[0]

      let violations = await Violation.find({
        createdAt: currentDate
      })
      let totalViolations = 0;
    
      violations.forEach(violation => {
        totalViolations += violation.violations;
      });

      return res.send(totalViolations.toString())      
    }else if(id == 2){
      const now = new Date();
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(now.getDate() - 3);

      try {
        const result = await Violation.aggregate([
          {
            $match: {
              createdAt: {
                $gte: threeDaysAgo.toISOString(), // Filter for documents created after three days ago
                $lt: now.toISOString() // Filter for documents created until now
              }
            }
          },
          {
            $group: {
              _id: null,
              totalViolations: { $sum: '$violations' } // Sum the violations field
            }
          }
        ]);

        const totalViolations = result.length > 0 ? result[0].totalViolations : 0;
        console.log('Total violations in the last 3 days:', totalViolations);
        return res.send(totalViolations.toString())
      } catch (err) {
        console.error('Error:', err);
      }
    }else if(id == 3){
      const now = new Date();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);

      try {
        const result = await Violation.aggregate([
          {
            $match: {
              createdAt: {
                $gte: oneWeekAgo.toISOString(), // Filter for documents created after one week ago
                $lt: now.toISOString() // Filter for documents created until now
              }
            }
          },
          {
            $group: {
              _id: null,
              totalViolations: { $sum: '$violations' } // Sum the violations field
            }
          }
        ]);

        const totalViolations = result.length > 0 ? result[0].totalViolations : 0;
        console.log('Total violations in the last one week:', totalViolations);
        return res.send(totalViolations.toString())
      } catch (err) {
        console.error('Error:', err);
      }
    }else if(id == 4){
      const now = new Date();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);

      try {
        const result = await Violation.aggregate([
          {
            $match: {
              createdAt: {
                $gte: oneMonthAgo.toISOString(), // Filter for documents created after one month ago
                $lt: now.toISOString() // Filter for documents created until now
              }
            }
          },
          {
            $group: {
              _id: null,
              totalViolations: { $sum: '$violations' } // Sum the violations field
            }
          }
        ]);

        const totalViolations = result.length > 0 ? result[0].totalViolations : 0;
        console.log('Total violations in the last one month:', totalViolations);
        return res.send(totalViolations.toString())
      } catch (err) {
        console.error('Error:', err);
      }
    }else if(id == 5){
      const now = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(now.getFullYear() - 1);

      try {
        const result = await Violation.aggregate([
          {
            $match: {
              createdAt: {
                $gte: oneYearAgo.toISOString(), // Filter for documents created after one year ago
                $lt: now.toISOString() // Filter for documents created until now
              }
            }
          },
          {
            $group: {
              _id: null,
              totalViolations: { $sum: '$violations' } // Sum the violations field
            }
          }
        ]);

        const totalViolations = result.length > 0 ? result[0].totalViolations : 0;
        console.log('Total violations in the last one year:', totalViolations);
        return res.send(totalViolations.toString())
      } catch (err) {
        console.error('Error:', err);
      }
    }else if(id == 6){
      const now = new Date();
      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);
    
      try {
        const result = await Violation.aggregate([
          {
            $match: {
              createdAt: {
                $gte: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0),
                $lt: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59)
              }
            }
          },
          {
            $group: {
              _id: null,
              totalViolations: { $sum: '$violations' } // Sum the violations field
            }
          }
        ]);
    
        const totalViolations = result.length > 0 ? result[0].totalViolations : 0;
        console.log('Total violations for yesterday:', totalViolations);
        return res.send(totalViolations.toString())
      } catch (err) {
        console.error('Error:', err);
      }
    }else{
      return res.send("0")
    }
  }catch(error){
    console.log(error.message)
    return res.status(500).send(error.message)
  }
})

module.exports = router
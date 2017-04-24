const express    = require('express'),
      bodyParser = require('body-parser'),
      createJOB  = require('./src/job/create'),
      deleteJOB  = require('./src/job/delete'),
      updateJOB  = require('./src/job/update');

// Create our app
const app = express();

app.use(bodyParser.json());

// @TODO create a response manager (avoid duplicating the res.json...)
app.post('/jobs/create', (req, res) => {
    if (createJOB.checkData(req.body))
        createJOB.addJobs(req.body).then(suc => {
            res.json({
                status : suc,
                error : null
            })
        }).catch(e => {
            res.json({
                status : 'failed',
                error : e
            })
        });
});

// @TODO create a response manager (avoid duplicating the res.json...)
app.post('/jobs/delete/:id', (req, res) => {
    deleteJOB.deleteJob(req.params.id).then(suc => {
        res.json({
            status : suc,
            error: null
        });
    })
    .catch(e => {
        res.json({
            status : 'failed',
            error : e
        })
    });
});

// @TODO create a response manager (avoid duplicating the res.json...)
app.post('/jobs/update/:id', (req, res) => {
    updateJOB.updateUser(req.body, req.params.id).then(suc => {
        res.json({
            status : suc,
            error: null
        });
    })
    .catch(e => {
        res.json({
            status : 'failed',
            error : e
        })
    });
});

app.listen(3000, () => {
    console.log('jobs crud is running');
});


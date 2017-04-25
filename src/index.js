const express    = require('express'),
      bodyParser = require('body-parser'),
      createJOB  = require('./job/create'),
      deleteJOB  = require('./job/delete'),
      updateJOB  = require('./job/update'),
      askManager = require('./ask/manager');

// Create our app
const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json({test : 'k'});
})

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

app.post('/ask/create/', (req, res) => {
    askManager.add.create(req.body)
        .then(suc => {
            res.json({
                status : suc,
                error : null
            });
        })
        .catch(e => {
            res.json({
                status : 'failed',
                error: e
            });
        });
});

app.post('/ask/delete/:id', (req, res) => {
    askManager.del.delete(req.params.id)
        .then(suc => {
            res.json({
                status: suc,
                error: null
            })
        })
        .catch(e => {
            res.json({
                status: 'failed',
                error: e
            })
        })
});

app.listen(3000, () => {
    console.log('jobs crud is running');
});


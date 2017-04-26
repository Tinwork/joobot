const express = require('express'),
    router = express.Router(),
    jobManager = require('../job/manager'),
    askManager = require('../ask/manager'),
    helper     = require('../helper/helper'),
    fileHelper = require('../helper/file');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index.html.ejs', { title: 'Express' });
});

/* GET admin page. */
router.get('/admin', (req, res) => {
    res.render('admin/admin.html.ejs', {privileges: 'admin'});
});

router.get('/admin/job', (req, res) => {
    res.render('admin/job.html.ejs', {privilege: 'admin'});
});

// @TODO create a response manager (avoid duplicating the res.json...)
router.post('/jobs/create', (req, res) => {
    if (jobManager.create.checkData(req.body))
        jobManager.create.addJobs(req.body).then(suc => {
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
router.post('/jobs/delete/:id', (req, res) => {
    jobManager.delete.deleteJob(req.params.id).then(suc => {
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
router.post('/jobs/update/:id', (req, res) => {
    jobManager.update.updateUser(req.body, req.params.id).then(suc => {
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

router.get('/jobs/getjob/:id', (req, res) => {
    jobManager.retrieve.retrieveSomePropsJob(req.params.id)
        .then(suc => {
            res.json(suc)
        })
        .catch(e => {
            res.json({
                status : 'failed',
                error :e
            })
        });
});

router.get('/jobs/getalljob', (req, res) => {
    jobManager.retrieve.retrieveAllJobs()
        .then(suc => {
            res.json(suc)
        })
        .catch(e => {
            res.json({
                status : 'failed',
                error : e
            });j
        })
})

router.get('/jobs/getdetailjob/:id', (req, res) => {
    jobManager.retrieve.retrieveAllPropsJob(req.params.id)
        .then(suc => {
            sanitize = helper.raboot(suc);
            res.json(sanitize)
        }, reason => {
            console.log(reason)
        })
        .catch(e => {
            res.json({
                status : 'failed',
                error: e
            })
        })
})

router.post('/ask/create/', (req, res) => {
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

router.post('/ask/delete/:id', (req, res) => {
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

router.post('/ask/update/:id', (req, res) => {
    askManager.up.update(req.params.id, req.body)
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

// router.post('/api/candidate', (req, res) => {
//     fileHelper.manager.export(req.body);

//     res.json({
//         status: 'OK',
//         error: null
//     });
// });

module.exports = router;
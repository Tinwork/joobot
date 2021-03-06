const express = require('express'),
    router = express.Router(),
    jobManager = require('../job/manager'),
    askManager = require('../ask/manager'),
    botDao     = require('../bot/botDao'),
    helper     = require('../helper/helper'),
    fileHelper = require('../helper/file'),
    candidateManager  = require('../candidate/candidate'),
    readf = require('../helper/readfile')


/* GET home page. */
router.get('/', function(req, res) {
    jobManager.retrieve.getLastCandidate()
    .then(jobs => {
        res.render('index.html.ejs', { title: 'Tableau de bord' , jobs: jobs});
    })
    .catch(e => res.render('index.html.ejs', { title: 'Tableau de bord', jobs: null}))
    
});

router.get('/questions', (req, res) => {
    askManager.get.allQuestion().then(suc => {
        res.render('question/question.html.ejs', { title: 'Questions' , questions: suc});
    })
    .catch(e => {
        res.render('question/question.html.ejs', { title: 'Questions' , questions: null});

    });
});

router.get('/questions/new', (req, res) => {
    res.render('question/new.html.ejs', { title: 'Ajouter une question' });
});

router.get('/jobs', (req, res) => {
    jobManager.retrieve.retrieveAllJobs()
        .then(suc => {
            res.render('job/job.html.ejs', { 
                title: 'Profils',
                jobs: suc
            });
        })
        .catch(e => {
            res.render('job/job.html.ejs', { 
                title: 'Profils',
                jobs: null
            });
    
    })
    
});

router.get('/jobs/new', (req, res) => {
    res.render('job/new.html.ejs', { title: 'Création profil' });
});

router.get('/user/edit', (req, res) => {
    res.render('user/account.html.ejs', { title: 'Mon compte' });
});

router.get('/rabbots', (req, res) => {
    botDao.getBots().then(d => {
        res.render('rabbots/list.html.ejs', { title: 'Rabbots', bot: d });
    })
    .catch(e => {
        res.render('rabbots/list.html.ejs', { title: 'Rabbots', bot: {}, error: 'Oops an error happened please contact the techncal services' });
    }) 
    
});

router.get('/rabbots/new', (req, res) => {
    
    let pm1 = jobManager.retrieve.retrieveAllJobs();
    let pm2 = askManager.get.allQuestion();

    Promise.all([pm1, pm2])
        .then(data => {
             if (data.length === 2)
                res.render('rabbots/new.html.ejs', { title: 'Rabbots', jobs : data[0], questions: data[1]});
            else 
                res.render('rabbots/new.html.ejs', { title: 'Rabbots', jobs : [], questions: []});
        })
        .catch(e => console.log(e));
});


router.get('/candidats', (req, res) => {
    jobManager.retrieve.getAllCandidate()
        .then(r => {
            res.render('candidate/list.html.ejs', { title: 'Candidats', data: r});
        })
        .catch(e => {
            res.render('candidate/list.html.ejs', { title: 'Candidats', data: null});
            console.log(e);
        })
    
});

router.get('/candidats/:id', (req, res) => {
    candidateManager.retrieveByID(req.params.id)
        .then(suc => {
            res.render('candidate/view.html.ejs', { title: 'Candidats', data : suc});
        })
        .catch(e => {
            res.render('candidate/view.html.ejs', { title: 'Candidats', data : e});
        })
    
});

router.get('/candidats/remove/:id', (req, res) => {
    candidateManager.remove(req.params.id)
        .then(suc => res.redirect('/candidats'))
        .catch(e => {
            console.log(e);
            res.redirect('/candidats')
        });
});

router.post('/loadmd/:name', (req, res) => {

});

// @TODO create a response manager (avoid duplicating the res.json...)
router.post('/jobs/create', (req, res) => {
    if (jobManager.create.checkData(req.body))
        jobManager.create.addJobs(req.body).then(suc => {
            res.redirect('/jobs');
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
            });
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

router.post('/ask/set/', (req, res) => {
    askManager.add.chooseQuestion(req.body)
        .then(suc => {
            res.json({
                status : 'success',
                error : null
            });
        })
        .catch(e => {
            res.json({
                status: 'failed',
                error: e
            })
        })
})

router.post('/bot/update/:id', (req, res) => {
    askManager.up.updateBot(req.params.id, req.body)
        .then(suc => {
            res.json({
                status: 'success',
                error: 'null'
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

router.get('/api/md/:id', (req, res) => {
    readf.read(req.params.id)
        .then(suc => {
            res.json({
                data : suc,
                error: null
            })
        })
        .catch(e => {
            console.log(e);
            res.json({
                data : null,
                error : e
            })
        })
});

router.post('/api/candidate', (req, res) => {
    fileHelper.manager.export(req.body);

    res.json({
        status: 'OK',
        error: null
    });
});

module.exports = router;
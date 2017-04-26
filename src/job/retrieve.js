const SQLManager = require('../db/dbabstract'),
      SQLHelper  = require('../db/dbhelper'),
      helper     = require('../helper/helper');

const retrieveJobs = Object.create({});

/**
 * Retrieve Some Props Job f
 *          Retrieve some prop of a job with an id
 * @param {String} id [default = null]
 * @return {Promise <resolve> | <reject>} promises 
 */
retrieveJobs.retrieveSomePropsJob = (id = null) => {
    if (id === nulel)
        return Promise.reject('id is empty');

    return new Promise((resolve, reject) => {
        SQLManager.initDB()
            .then(con => SQLHelper.query(con, 'SELECT title, img, description, id FROM jobs WHERE id = ?', [id]))
            .then(SQLHelper.select)
            .then(res => {resolve(res);})
            .catch(e => {
                reject(e);
            });
    });
};

/**
 * Retrieve All Props Job
 *          Retrieve all the property of a job
 *          (!) We don't use an inner join
 * @param {String} id
 * @return {Promise <Resolve> | <Reject>} promises
 */
retrieveJobs.retrieveAllPropsJob = (id = null) => {
    if (id === null)
        reject('id is null');

    let pm1 = new Promise((resolve, reject) => {
        // Check if the param is empty
        SQLManager.initDB()
            .then(con => SQLHelper.query(con, 'SELECT * FROM jobs WHERE id = ?', [id]))
            .then(SQLHelper.select.bind(null, false))
            .then(res => SQLHelper.setprops('job', res))
            .then(() => SQLHelper.getprops('job'))
            .then(res => {
                resolve(res);
            })
            .catch(e => {
                reject(e);
            });
    });

    let pm2 = new Promise((resolve, reject) => {
        SQLManager.initDB()
            .then(con => SQLHelper.query(con, 'SELECT * FROM question WHERE id_job = ?', [id]))
            .then(SQLHelper.select)
            .then(res => {
                res.map((d, i) => {
                    if (d.enum.length === 0) {
                        delete res[i].enum;
                        return;
                    }

                    let parselist = helper.skill(d, false, 'enum');
                    // inject the enum type
                    parselist.type = 'enum';
                    res[i] = parselist;
                });

                SQLHelper.setprops('questions', res);
            })
            .then(() => SQLHelper.getprops('questions'))
            .then(res => {
                resolve(res);
            })
            .catch(e => {
                reject(e);
            })
    });

    return Promise.all([pm1, pm2]);
};

/**
 * Retrieve All Jobs
 * @public
 * @return Promise
 */
retrieveJobs.retrieveAllJobs = () => {
    return new Promise((resolve, reject) => {
        SQLManager.initDB()
            .then(con => SQLHelper.query(con, 'SELECT * FROM jobs'))
            .then(SQLHelper.select)
            .then(res => {
                res.map(data => {
                    let d = helper.skill(data, false, 'skills');
                });
                
                return Promise.resolve(res);
            })
            .then(res => resolve(res))
            .catch(e => reject(e));
    });
};

module.exports = retrieveJobs;
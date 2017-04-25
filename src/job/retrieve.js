const SQLManager = require('../db/dbabstract'),
    helper = require('../helper/helper');

const retrieveJobs = Object.create({});

/**
 * Retrieve Some Props Job 
 *          Retrieve some prop of a job with an id
 * @param {String} id [default = null]
 * @return {Promise <resolve> | <reject>} promises 
 */
retrieveJobs.retrieveSomePropsJob = (id = null) => {
    if (id === null)
        return Promise.reject('id is empty');

    return new Promise((resolve, reject) => {
        SQLManager.initDB()
            .then(con => {
                con.query('SELECT title, img, description, id FROM jobs WHERE id = ?', [
                    id
                ], (e, res, fields) => {
                    if (e)
                        reject(e);

                    if (res === undefined)
                        reject(`no job has been found with the id ${id}`);

                    if (res.length === 0)
                        reject('no data has been found')

                    resolve(res);
                })
            })
            .catch(e => {
                reject(e);
            });
    });
};

/**
 * Retrieve All Props Job
 *          Retrieve all the property of a job
 * @param {String} id
 * @return {Promise <Resolve> | <Reject>} promises
 */
retrieveJobs.retrieveAllPropsJob = (id = null) => {
    if (id === null)
        reject('id is null');

    return new Promise((resolve, reject) => {
        // Check if the param is empty
        SQLManager.initDB()
            .then(con => {
                con.query('SELECT * FROM jobs WHERE id = ?', [
                    id
                ], (e, res, fields) => {
                    if (e) {
                        console.log(e);
                        reject(e)
                    }
                    
                    if (res.length === 0)
                        reject(`no job has been found with the id ${id}`);

                    resolve(res);
                })
            })
            .catch(e => {
                reject(e);
            });
    });
}

module.exports = retrieveJobs;
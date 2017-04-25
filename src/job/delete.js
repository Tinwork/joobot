const sqlManager = require('../db/dbabstract');

// @TODO export this Object into one interfaces...
const deleteJobManager = Object.create({});

/**
 * Check ID 
 *      Check the ID
 * @TODO move this function into the commontask file
 * @return {Promise} promises
 */
deleteJobManager.checkID = (id = null, con) => {
    return new Promise((resolve, reject) => {
        con.query('SELECT * FROM jobs WHERE id = ?', [
            id
        ], (e, res, fields) => {
            if (res.length)
                resolve(con);

            if (e || !res.length) {
                message = res.length === 0 ? `job with id ${id} does not exist` : e
                reject(message);
            }
                
        });
    });
};

/**
 * Delete Job 
 *          Delete a job
 * @param {Object} con
 * @param {Object} json
 * @return {Promise} promises
 */
deleteJobManager.deleteJob = (id = null) => {
    if (id === null)
        return Promise.reject('id is not provided');

    let del = sqlManager.initDB()
        .then(con => deleteJobManager.checkID.call(null, id, con))
        .then(con => {
            con.query('DELETE FROM jobs WHERE id = ?', [
                id
            ], (e, res, fields) => {
                if (e) {
                    return Promise.reject(e);
                }

                return Promise.resolve(res);
            });
        })
        .then(() => {
            return `job with id ${id} removed`;
        })
        .catch(e => {
            return Promise.reject(e);
        });

    return Promise.resolve(del);
};

module.exports = deleteJobManager;
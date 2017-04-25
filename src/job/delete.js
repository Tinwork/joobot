const SQLManager = require('../db/dbabstract'),
      SQLHelper  = require('../db/dbhelper');

// @TODO export this Object into one interfaces...
const deleteJobManager = Object.create({});

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

    return new Promise((resolve, reject) => {
        SQLManager.initDB()
            .then(con => SQLHelper.query(con, 'SELECT * FROM jobs WHERE id = ?', [id]))
            .then(SQLHelper.select)
            .then(() => {
                let con = SQLManager.getDbInstance();
                SQLHelper.query(con, 'DELETE FROM jobs WHERE id = ?', [id])
            })
            .then(() => resolve(`job with id ${id} removed`))
            .catch(e => reject(e));
    });
};

module.exports = deleteJobManager;
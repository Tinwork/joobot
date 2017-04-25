const SQLManager = require('../db/dbabstract')
      SQLHelper  = require('../db/dbhelper');

// @TODO export this Object into one interfaces...
const updateJobManager = Object.create({});

/**
 * Update user
 *          Update the user
 * @TODO should we reset everything ?
 * @param {Object} con
 * @param {Object} json
 * @return {Promise} promises
 */
updateJobManager.updateUser = (json, id = null) => {
    if (id === null || json == null)
        return Promise.reject('data are not provided');

    return new Promise((resolve, reject) => {
        SQLManager.initDB()
            .then(con => SQLHelper.query(con, 'UPDATE jobs SET title = ?, description = ?, skills = ?, date_start = ?, date_end = ? WHERE id = ?', [
                json.title,
                json.description,
                json.skills,
                json.date_start,
                json.date_end,
                id
            ]))
            .then(() => resolve('success'))
            .catch(e => reject(e));
    }); 
};

module.exports = updateJobManager;
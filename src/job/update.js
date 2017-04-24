const sqlManager = require('../db/con');

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

    let update = sqlManager.initDB()
        .then(con => {
            con.query('UPDATE jobs SET title = ?, description = ?, skills = ?, date_start = ?, date_end = ? WHERE id = ?', [
                json.title,
                json.description,
                json.skills,
                json.date_start,
                json.date_end,
                id
            ], (e, res, fields) => {
    
                if (e) {
                    return Promise.reject(e);
                }

                return Promise.resolve('success');
            });
        })
        .then(() => {
            return 'success';
        })
        .catch(e => {
            return Promise.reject(e);
        });

    return Promise.resolve(update);
};

module.exports = updateJobManager;
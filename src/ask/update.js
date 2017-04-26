const SQLManager = require('../db/dbabstract'),
      SQLHelper  = require('../db/dbhelper');

const updateQuestion = Object.create({});

/**
 * Update
 *          Update a question
 * @param {Object} json [default = {}]
 * @return {Promise} promises
 */
updateQuestion.update = (id, json = {}) => {
    if (json === null || json === undefined || Object.keys(json).length === 0)
        return Promise.reject('data is empty');

    return new Promise((resolve, reject) => {
        SQLManager.initDB()
            .then(con => SQLHelper.query(con, 'UPDATE question SET body = ?, details = ?, type = ? WHERE id = ?', [
                json.body,
                json.details,
                json.type,
                id
            ]))
            .then(() => resolve('success'))
            .catch(e => reject(e));
    });
};

module.exports = updateQuestion;
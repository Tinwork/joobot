const SQLManager = require('../db/dbabstract'),
      SQLHelper  = require('../db/dbhelper'),
      helper     = require('../helper/helper');

const createQuestion = Object.create({});

/**
 * Create
 *          Create a set of questions
 *          (!) We allow the user to create the same multiple question as there might be some variation...
 * @param {Object} json
 * @return {Promise} promises
 */
createQuestion.create = (json = {}) => {
    if (helper.empty(json))
        return Promise.reject('data is empty');

    return new Promise((resolve, reject) => {
        SQLManager.initDB()
            .then(con => SQLHelper.query(con, 'INSERT INTO question (id_job, body, details, type) VALUES (?, ?, ?, ?)', [
                json.id_job,
                json.body,
                json.details,
                json.type
            ]))
            .then(() => resolve('success'))
            .catch(e => reject(e));
    });
};

module.exports = createQuestion;
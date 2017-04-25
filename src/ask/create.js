const SQLManager = require('../db/dbabstract'),
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
        let create = SQLManager.initDB()
            .then(con => {
                con.query('INSERT INTO question (id_job, body, details) VALUES (?, ?, ?)', [
                    json.id_job,
                    json.body,
                    json.details
                ], (e, res, fields) => {
                    if (e)
                        reject(e);

                    resolve('success');
                });
            })
            .catch(e => {
                return Promise.reject(e);
            });
    });
};

module.exports = createQuestion;
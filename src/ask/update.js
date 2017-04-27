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

    if (json.list !== undefined)
        json.list = SQLHelper.prepList(json.list);

    return new Promise((resolve, reject) => {
        SQLManager.initDB()
            .then(con => SQLHelper.query(con, 'UPDATE question SET body = ?, tips = ?, type = ?, enum = ? WHERE id = ?', [
                json.body,
                json.tips,
                json.type,
                json.list,
                id
            ]))
            .then(() => resolve('success'))
            .catch(e => reject(e));
    });
};

/**
 * Update Bot
 * @param {Int} id 
 * @param {Object} json
 */
updateQuestion.updateBot = (id, json = {}) => {

    let str = JSON.stringify({questions: json.questions});
    return new Promise((resolve, reject) => {
        SQLManager.initDB()
            .then(con => SQLHelper.query(con, 'UPDATE bot SET id_job = ?, id_question = ? WHERE id = ?', [
                json.id_job,
                str,
                id
            ]))
            .then(res => resolve('success'))
            .catch(e => reject(e));
    }); 
};

module.exports = updateQuestion;
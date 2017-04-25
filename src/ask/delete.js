const SQLManager = require('../db/dbabstract'),
      SQLHelper  = require('../db/dbhelper'),
      helper = require('../helper/helper');

const deleteQuestion = Object.create({});

/**
 * Delete
 *          Delete a question
 * @param {String} id
 * @return {Promise} promises
 */
deleteQuestion.delete = (id = null) => {
    if (typeof id === null || typeof id === undefined)
        return Promise.reject('id is empty');

    return new Promise((resolve, reject) => {
        SQLManager.initDB()
            .then(con => SQLHelper.query(con, 'SELECT * FROM question WHERE id = ?', [id]))
            .then(SQLHelper.select)
            .then(() => {
                let con = SQLManager.getDbInstance();
                SQLHelper.query(con, 'DELETE FROM question WHERE id = ?', [id])
            })
            .then(() => resolve('success'))
            .catch(e => reject(e));
    });
};

module.exports = deleteQuestion;
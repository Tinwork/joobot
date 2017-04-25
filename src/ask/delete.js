const SQLManager = require('../db/dbabstract'),
    helper = require('../helper/helper');

const deleteQuestion = Object.create({});

/**
 * Is Present 
 *          Check if the question is present
 * @param {String} id
 * @param {Object} con
 * @return {Promise} promise
 */
deleteQuestion.isPresent = (id, con) => {
    return new Promise((resolve, reject) => {
        con.query('SELECT * FROM question WHERE id = ?', [
            id
        ], (e, res, fields) => {
            if (e)
                reject(e);

            if (res.length === 0)
                reject(`question with id ${id} does not exist`);

            resolve(con);
        });
    });
};

/**
 * Delete
 *          Delete a question
 * @param {String} id
 * @return {Promise} promises
 */
deleteQuestion.delete = (id = null) => {
    if (typeof id === null || typeof id === undefined)
        return Promise.reject('id is empty');

    let del = SQLManager.initDB()
        .then(con => deleteQuestion.isPresent.call(null, id, con))
        .then(con => {
            con.query('DELETE FROM question WHERE id = ?', [
                id
            ], (e, res, fields) => {
                if (e)
                    return Promise.reject(e);

                return 'success';
            });
        })
        .then(() => {
            return 'success';
        })
        .catch(e => {
            return Promise.reject(e);
        })

    return Promise.resolve(del);
};

module.exports = deleteQuestion;
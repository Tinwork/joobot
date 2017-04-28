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

    if (json.list !== undefined)
        json.list = SQLHelper.prepList(json.list);
        
    return new Promise((resolve, reject) => {
        SQLManager.initDB()
            .then(con => SQLHelper.query(con, 'INSERT INTO question (body, tips, type, enum, open) VALUES (?, ?, ?, ?, ?)', [
                json.body,
                json.tips,
                json.type,
                json.list,
                json.open
            ]))
            .then(() => resolve('success'))
            .catch(e => {
                console.log(e);
                reject(e)
            });
    });
};

/**
 * Choose Question
 * @param {Object} json
 */
createQuestion.chooseQuestion = (json = []) => {
  //  let str = JSON.stringify({questions: json.questions});
    let sql = 'INSERT INTO bot (id_job, id_question) VALUES ';
    let arr = new Array();
    json.map((data, i) => {
        if (i !== json.length - 1)
            sql += ' (?, ?),';
        else 
            sql += ' (?, ?)';

        arr.push(data);
    });


    return new Promise((resolve, reject) => {
        SQLManager.initDB()
            .then(con => SQLHelper.query(con, sql, arr))
            .then(res => resolve(res))
            .catch(e => {
                console.log(e);
                reject(e)
            });
    }); 
};

module.exports = createQuestion;
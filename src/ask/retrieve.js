const SQLManager = require('../db/dbabstract'),
      SQLHelper  = require('../db/dbhelper'),
      helper     = require('../helper/helper');

const retrieve = Object.create({});

/**
 * All Question
 * @return {Promise} promises
 * @public
 */
retrieve.allQuestion = () => {
    return new Promise((resolve, reject) => {
        SQLManager.initDB()
            .then(con => SQLHelper.query(con, 'SELECT * FROM question'))
            .then(SQLHelper.select)
            .then(res => resolve(res))
            .catch(e => reject(e));
    });
};

module.exports = retrieve;
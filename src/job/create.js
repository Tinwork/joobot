const SQLManager = require('../db/dbabstract'),
      SQLHelper  = require('../db/dbhelper');

// @TODO export this Object into one interfaces...
const createJobManager = Object.create({});

/**
 * Add Jobs
 *      Add job to the database
 * @param {Object} json
 * @return {Boolean} 
 */
createJobManager.checkData = (json = {}) => {
    if (Object.keys(json).length === 0)
        return false;

    // Now we need to check the data and or convert the data in order to put it into the database
    for (let idx in json)
        if (typeof idx !== 'string')
            return false;

    return true;
};

/**
 * Check Jobs
 *          Check if the jobs exist with the same value...
 * @param {Object} con
 * @param {Object} json
 * @return {Promise} promises
 */
createJobManager.checkJobs = (con, json) => {
     return SQLHelper.query(con, 'SELECT * FROM jobs WHERE title = ? AND description = ? AND skills = ? AND date_start = ? AND date_end = ?', [
            json.title,
            json.description,
            json.skills,
            json.date_start,
            json.date_end
    ]);
};

/**
 * Add Jobs
 *      Adding jobs into the database return @boolean if succeed
 * @param {Object} json
 * @return {Promise} promises 
 * @TODO close the connection when finish
 */
createJobManager.addJobs = json => {
    return new Promise((resolve, reject) => {
        SQLManager.initDB()
        .then(con => createJobManager.checkJobs.call(null, con, json))
        .then(SQLHelper.isEmpty)
        .then(() => {
            let con = SQLManager.getDbInstance();
            SQLHelper.query(con, 'INSERT INTO jobs (title, description, skills, date_start, date_end) VALUES (?, ?, ?, ?, ?)', [
                json.title,
                json.description,
                json.skills,
                json.date_start,
                json.date_end
            ])
        })
        .then(() => resolve('success'))
        .catch(e => {
            reject(e);
        })
    });
};



module.exports = createJobManager;
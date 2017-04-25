const sqlManager = require('../db/dbabstract');

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
    return new Promise((resolve, reject) => {
        con.query('SELECT * FROM jobs WHERE title = ? AND description = ? AND skills = ? AND date_start = ? AND date_end = ?', [
            json.title,
            json.description,
            json.skills,
            json.date_start,
            json.date_end
        ], (e, res, fields) => {

            if (e) {
                reject(e);
            }

            if (res !== undefined)
                if (res.length !== 0)
                reject('data already exist')

            resolve(con);
        });
    });
};

/**
 * Add Jobs
 *      Adding jobs into the database return @boolean if succeed
 * @param {Object} json
 * @return {Promise} promises 
 * @TODO close the connection when finish
 */
createJobManager.addJobs = json => {
    let add = sqlManager.initDB().then(con => createJobManager.checkJobs.call(null, con, json))
        .then((con) => {
            con.query('INSERT INTO jobs (title, description, skills, date_start, date_end) VALUES (?, ?, ?, ?, ?)', [
                json.title,
                json.description,
                json.skills,
                json.date_start,
                json.date_end
            ], (e, res, fields) => {
                if (e) 
                    return Promise.reject(e);

                return Promise.resolve(fields);
            });
        })
        .then(() => {
            return 'success';    
        })
        .catch(e => {
           return Promise.reject(e);
        });

    return Promise.resolve(add);
};



module.exports = createJobManager;
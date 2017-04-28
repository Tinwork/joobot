const SQLManager = require('../db/dbabstract'),
      SQLHelper  = require('../db/dbhelper'),
      helper     = require('../helper/helper');

const candidate = (() => {

    /**
     * Ret ID 
     * @param {*} id 
     */
    const retID = id => {

        let keys;
        let candidateData;

        return new Promise((resolve, reject) => {
            SQLManager.initDB()
                .then(con => SQLHelper.query(con, 'SELECT * FROM candidate WHERE id = ?', [id]))
                .then(SQLHelper.select)
                .then(res => {
                    candidateData = res;
                    let jobs = JSON.parse(res[0].apply_list);
                    keys = Object.keys(jobs);

                    keys.map((d, i) => {
                        keys[i] = d.split('_')[1];
                    });

                    return res;
                })
                .then(() => {
                    let con = SQLManager.getDbInstance();
                    let sql = 'SELECT * FROM jobs WHERE ';
                    let param = new Array();

                    keys.map((d, i) => {
                        if (i !== keys.length - 1)
                            sql += ' id = ? OR ';
                        else
                            sql += 'id = ?';  

                        param.push(parseInt(d));
                    });

                    let pmSQL = SQLHelper.query(con, sql, param)
                    return Promise.resolve(pmSQL);
                })
                .then(SQLHelper.select)
                .then(res => {
                    resolve({res, candidateData});
                })
                .catch(e => {
                    console.log(e);
                    reject(e)
                });
        });
    };

    /**
     * Retrieve Candidate By Name
     * @param {*} id 
     */
    const retrieveCandidateByName = id => {
        return new Promise((resolve, reject) => {
            SQLManager.initDB()
                .then(con => SQLHelper.query(con, 'SELECT * FROM candidate WHERE id = ?', [id]))
                .then(SQLHelper.select)
                .then(res => resolve(res))
                .catch(e => reject(e));
        });
    };

    /**
     * Remove Candidate
     * @param {*} id 
     * @return {Promise} promises
     */
    const removeCandidate = id => {
        return new Promise((resolve, reject) => {
            console.log(id);
            SQLManager.initDB()
                .then(con => SQLHelper.query(con, 'DELETE FROM candidate WHERE id = ?', [id]))
                .then(res => resolve(res))
                .catch(e => reject(e));
        });
    };  

    return {
        retrieveByID : retID,
        retrieveByName: retrieveCandidateByName,
        remove: removeCandidate
    }
})();

module.exports = candidate;
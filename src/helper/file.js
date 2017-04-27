/**
 * Packages
 */
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const SQLManager = require('../db/dbabstract');
const SQLHelper = require('../db/dbhelper');
const jobs = require('../job/manager');
/**
 * Const
 */
const EXPORT_FOLDER = "export";
const FILE_EXTENSION = "md";


// SQL Handler for the file manager
const fileSQLManager = function () {

    let user = Object.create({});
    let question = Object.create({});
    let id;
    let jobid;

    /**
     * Check if the user exist in the database
     */
    const checkUserExistance = () => {
        return new Promise((resolve, reject) => {
            SQLManager.initDB()
                .then(con => SQLHelper.query(con, 'SELECT * FROM candidate WHERE firstname = ? AND lastname = ? AND email = ? AND mobile = ?', [
                    user.firstname,
                    user.lastname,
                    user.email,
                    user.mobile
                ]))
                .then(SQLHelper.isEmpty)
                .then(() => resolve(false))
                .catch(e => {
                    if (e === 'data already defined')
                        resolve(true)
                    
                    reject(e);
                });
        });
    };

    /**
     * Update List
     *      Update the list
     * @param {*} newlist 
     * @param {*} user_id 
     */
    const updateList = (newlist, user_id) => {
        id = user_id;
        return new Promise((resolve, reject) => {
            SQLManager.initDB()
                .then(con => SQLHelper.query(con, 'UPDATE candidate SET apply_list = ? WHERE id = ?', [
                    newlist,
                    user_id
                ]))
                .then(() => resolve('success'))
                .catch(e => reject(e));
        });
    };

    /**
     * Set User
     *          Set the user locally
     * @param {Object} data 
     */
    this.setProps = (data, jobID) => {
        cleanProps();
        // wipe the old prop
        if (data !== undefined || data !== null) {
            Object.assign(user, data.candidat);

            // now we mutate the object, we delete the candidate object from the original object
            delete data.candidat;

            // set the rest of the object which are the questions...
            Object.assign(question, data);
            jobid = Object.keys(question)[0];
        }
    };

    const cleanProps = () => {
        question = Object.create({});
        user = Object.create({});
    }

    /**
     * Set User Apply List
     * @param {Object} data 
     */
    const getUserApplyList = (user_id) => {
        // First we need to check if the candidate have already apply for a job once
        return new Promise((resolve, reject) => {
            SQLManager.initDB()
                .then(con => SQLHelper.query(con, 'SELECT apply_list FROM candidate WHERE id = ?', [user_id]))
                .then(SQLHelper.select)
                .then(res => resolve(res))
                .catch(e => reject(e));
        });
    };

    /**
     * Make List Data
     * @param {*} data 
     * @param {*} current_data 
     */
    const makeListData = (current_data) => {
        let profileuid = new Array();
        // we try to avoid mutation of the object we might use it after...
        let copy = new Array();
        // The type of the current_data is an ARRAY and shall ALWAYS be an ARRAY...
        if (current_data[0].apply_list === '')
            copy.push(JSON.stringify(question));
        else {
            current_data.map((d, i) => {
                if (Array.isArray(JSON.parse(d.apply_list))){
                    let p = JSON.parse(d.apply_list);
                    p.map(u => {
                        copy.push(u);
                    });
                } else {
                    copy.push(JSON.parse(d.apply_list));
                }
            });

            copy.push(question);
            
            let str = '[';
            copy.map((d,i) => {
                if (i !== copy.length - 1)
                    str += `${JSON.stringify(d)},`;
                else 
                    str += `${JSON.stringify(d)}`;
            });

            str += ']';
           
            return str;
        }


        // extract the ID from the last job 
        return copy;
    }

    /**
     * Implement Apply List
     * @param {*} data 
     * @param {*} user_id 
     */
    const implementApplyList = (data) => {
        return new Promise((resolve, reject) => {
            getUserApplyList(data.id)
                .then(res => {
                    let data = makeListData.call(null, res);
                    return Promise.resolve(data);
                })
                .then(applyList => {
                    return Promise.resolve(updateList(applyList, data.id))
                })
                .then(() => resolve('success'))
                .catch(e => {
                    console.log(e);
                    reject(e);
                });
        });
    };

    /**
     * Add User 
     */
    const addUser = () => {
        return new Promise((resolve, reject) => {
            SQLManager.initDB()
                .then(con => SQLHelper.query(con, 'INSERT INTO candidate (firstname, lastname, email, mobile, apply_list) VALUES (?, ?, ?, ?, ?)', [
                    user.firstname,
                    user.lastname,
                    user.email,
                    user.mobile,
                    makeListData([{apply_list: ''}])
                ]))
                .then(res => {
                    id = res.insertId;
                    resolve('success');
                })
                .catch(e => reject(e));
        });
    };


    const updateCandidateInJob = (list) => {
    
        let ev ='';
        if (list[0].candidate === null)
            ev = id;
        else {
             ev = list[0].candidate;
             ev += `, ${id}`;
        }
           
        
        return ev;
    }

    /**
     * Exec Flow 
     *      Define the flow of how we're going to save the user
     */
    const execFlow = function (data) {
        // First we need to set the property to our IFEE
        // We don't want to pass again and again the data
        this.setProps(data);

        // Now we check the existance of the data
        checkUserExistance()
            .then(res => {
                if (!res)
                    return Promise.resolve(addUser());
                else 
                    return Promise.resolve(SQLHelper.select());       
            })
            // Let's say that the data is define
            .then(data => {
                if (data === 'success')
                    return Promise.resolve('success');

                return Promise.resolve(implementApplyList(data))
            })
            .then(() => {
                return Promise.resolve(jobs.retrieve.candidate(jobid));
            })
            .then(list => {
                let l = updateCandidateInJob(list);
                return Promise.resolve(jobs.update.updateCandidateList(l, jobid));
            })
            .catch(e => {
                console.log(e);
                reject(e);
            });

    };

    return {
        exec: execFlow.bind(this)
    }
}.bind({})();



/**
 * FileManager Entity
 * @type {Object}
 */
const fileManager = (() => {

    /**
     * Add title
     *
     * @param file
     * @param title
     */
    const addHeader = (file, title) => {
        let buffer = new Buffer(`## ${title} \n`);
        fs.write(file, buffer, 0, buffer.length, null, function (err) {
            if (err) throw 'error writing file: ' + err;
        });
    };

    /**
     * Add row
     *
     * @param file
     * @param output
     * @returns {boolean}
     */
    const addRow = (file, output) => {
        if (!output) {
            return false;
        }
        let buffer = new Buffer(output);
        fs.write(file, buffer, 0, buffer.length, null, function (err) {
            if (err) throw 'error writing file: ' + err;
        });
    };

    /**
     * Write data in file
     *
     * @param file
     * @param row
     * @param {boolean} isCandidat
     * @returns {boolean}
     */
    const write = (file, row, isCandidat = false) => {
        if (isCandidat) {
            addHeader(file, 'Candidat');
            let data = row['candidat'];
            for (let key in data) {
                let output = `- ${capitalize(key)} : ${data[key]} \n`;
                addRow(file, output);
            }
        } else {
            for (let key in row) {
                let question = row[key].libelle;
                let isOpen = row[key].open;
                let response = row[key].response;

                let output = `>**${question}**<br />&#8594;${response}\n\n`;
                addRow(file, output);
            }
        }
    };

    /**
     * Check directory
     *
     * @param directory
     * @param callback
     */
    const checkDirectory = (directory, callback) => {
        return new Promise(function (resolve, reject) {
            if (!fs.existsSync(directory)) {
                mkdirp(directory, function (err) {
                    if (err) console.log(err);
                });
            }

            resolve(true);
        });
    };

    /**
     * Get date folder output
     *
     * @returns {string}
     */
    const getDateFolder = () => {
        const now = new Date();

        return now.getFullYear().toString() + rebuildIndex(now.getMonth() + 1) + rebuildIndex(now.getDate());
    };

    /**
     * Rebuild index if number < 10
     *
     * @param index
     * @returns {string}
     */
    const rebuildIndex = (index) => {
        return index >= 10 ? index.toString() : '0' + index.toString();
    };

    /**
     * Capitalize first letter
     *
     * @param string
     * @returns {string}
     */
    const capitalize = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return {
        directory: {
            check: checkDirectory
        },
        getDate: getDateFolder,
        file: {
            write: write,
            addRow: addRow,
            addHeader: addHeader
        }
    }
})();

/**
 * Export new profile to export folder
 *
 * @param {Object} con
 * @param {Object} data
 */
fileManager.export = data => {
    data = data.data;
    const copy = JSON.stringify(data);
    const dateFolder = fileManager.getDate();
    const folderExportPath = path.resolve("./public/export/" + dateFolder);

    fileManager.directory.check(folderExportPath).then(function () {
        fileManager.write(folderExportPath, data);
    }).catch(function (err) {
        console.log(err)
    });

    fileSQLManager.exec(JSON.parse(copy));
};

fileManager.write = (exportPath, data) => {
    const fileExportPath = exportPath + '/' + (data.candidat.lastname).toString().toLowerCase() + (data.candidat.firstname).toString().toLowerCase() + '.' + FILE_EXTENSION;
    const result = [];
    for (const key in data) {
        result[key] = data[key];
    }
    fs.open(fileExportPath, 'w', function (err, fd) {
        if (err) {
            throw 'Error opening file: ' + err;
        }
        fileManager.file.addRow(fd, '#GFI Candidature n°3243 \n');
        for (const key in result) {
            if (key == "candidat") {
                const candidate = result[key];
                fileManager.file.write(fd, {
                    "candidat": candidate
                }, true);
                continue;
            }
            const output = result[key];
            fileManager.file.addHeader(fd, 'Compte Rendu');
            for (const row in output) {
                fileManager.file.write(fd, {
                    "data": output[row]
                }, false);
            }
        }
        fs.close(fd);
    });
};

module.exports = {
    manager: fileManager
};
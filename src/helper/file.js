/**
 * Packages
 */
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const SQLManager = require('../db/dbabstract');
/**
 * Const
 */
const EXPORT_FOLDER = "export";
const FILE_EXTENSION = "md";
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
        fs.write(file, buffer, 0, buffer.length, null, function(err) {
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
        fs.write(file, buffer, 0, buffer.length, null, function(err) {
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
                mkdirp(directory, function(err) {
                    if(err) console.log(err);
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
        directory : {
            check : checkDirectory
        },
        getDate : getDateFolder,
        file : {
            write : write,
            addRow : addRow,
            addHeader : addHeader
        }
    }
})();

/**
 * Export new profile to export folder
 *
 * @param {Object} con
 * @param {Object} data
 */
fileManager.export = (data) => {
    return new Promise((resolve, reject) => {
        let con = SQLManager.initDB()
            .then(con => {

            })
            .catch(e => reject(e));
    });
    
    data = {
        "candidat": {
            "firstname": "Salut",
            "lastname": "Dupont",
            "email": "john@gmail.com",
            "mobile": "+3365518743"
        },
        "profile_1244": {
            "question_1": {
                "libelle": "Quel est vôtre âge ?",
                "open": true,
                "response": "27 ans"
            },
            "question_2": {
                "libelle": "Quels sont vos centres d'activités ?",
                "open": false,
                "response": "Le sport, la musique et la cuisine"
            }
        }
    };

    const dateFolder = fileManager.getDate();
    const folderExportPath = path.resolve("./public/export/" + dateFolder);

    fileManager.directory.check(folderExportPath).then(function() {
        fileManager.write(folderExportPath, data);
    }).catch(function (err) {
        console.log(err)
    });
};

fileManager.write = (exportPath, data) => {
    const fileExportPath = exportPath + '/' + (data.candidat.lastname).toString().toLowerCase() + (data.candidat.firstname).toString().toLowerCase() + '.' + FILE_EXTENSION;
    const result = [];
    for (const key in data) {
        result[key] = data[key];
    }
    fs.open(fileExportPath, 'w', function(err, fd) {
        if (err) {
            throw 'Error opening file: ' + err;
        }
        fileManager.file.addRow(fd, '#GFI Candidature n°3243 \n');
        for (const key in result) {
            if (key == "candidat") {
                const candidate = result[key];
                fileManager.file.write(fd, { "candidat" : candidate }, true);
                continue;
            }
            const output = result[key];
            fileManager.file.addHeader(fd, 'Compte Rendu');
            for (const row in output) {
                fileManager.file.write(fd, { "data" : output[row] }, false);
            }
        }
        fs.close(fd);
    });
};

module.exports = {
    manager : fileManager
};
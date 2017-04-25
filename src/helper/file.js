/**
 * Packages
 */
const fs = require('fs');
const path = require('path');
/**
 * Const
 */
const EXPORT_FOLDER = "export";
const FILE_EXTENSION = "txt";

/**
 * FileManager Entity
 * @type {Object}
 */
const fileManager = (() => {

    /**
     * Check directory
     *
     * @param directory
     * @param callback
     */
    const checkDirectory = (directory, callback) => {
        return new Promise(function (resolve, reject) {
            fs.stat(directory, function(err, stats) {
                if (err && err.errno === 34) {
                    fs.mkdir(directory, callback);
                } else {
                    callback(err)
                }
            });
        });
    };

    const createDirectory = (path) => {
        fs.mkdir(path);
    };

    const getDateFolder = () => {
        const now = new Date();

        return now.getFullYear().toString() + rebuildIndex(now.getMonth() + 1) + rebuildIndex(now.getDate());
    };

    const rebuildIndex = (index) => {
        return index >= 10 ? index.toString() : '0' + index.toString();
    };

    return {
        directory : {
            check : checkDirectory,
            create : createDirectory
        },
        getDate : getDateFolder
    }
})();

const data = {
    "candidat": {
        "firstname": "John",
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

/**
 * Export new profile to export folder
 *
 * @param {Object} con
 * @param {Object} data
 */
fileManager.export = (con, data) => {
    const dateFolder = fileManager.getDate();
    const folderExportPath = "../../public/export/" + dateFolder;

    fileManager.directory.check(folderExportPath).then(function() {

    }).catch(function (err) {
        console.log(err)
    });
    const promise = new Promise(function(resolve, reject) {
        fileManager.directory.check(folderExportPath, function(error) {
            if (error) {
                fileManager.directory.create(folderExportPath);
            }
        });
    });

    promise.then(function() {
        const fileExportPath = folderExportPath + '/' + (data.candidat.lastname).toString().toLowerCase() + (data.candidat.firstname).toString().toLowerCase() + '.' + FILE_EXTENSION;
        const file = fs.openSync(fileExportPath, 'w');
    });
};

fileManager.read = (id) => {

};

fileManager.write = (data) => {

};

fileManager.export(null, data);
const fs = require('fs');
const path = require('path');
const candidate = require('../candidate/candidate');

const reader = (function(){

    /**
     * Get Candidate Name
     * @param {*} name 
     */
    const getCandidateName = (id) => {
        return new Promise((resolve, reject) => {
            candidate.retrieveByName(id)
                .then(res => {
                    resolve(res);
                })
                .catch(e => reject(e));
        })
    };

    const readHandler = (name) => {
        return new Promise((resolve, reject) => {
            fs.readdir(path.resolve("./public/export"), (e, data) => {
                data.map(d => {
                    fs.readdir(path.resolve(`./public/export/${d}/`), (e, file) => {
                        // If error then return
                        if (e) 
                            return;

                        file.map(filename => {
                            console.log(name)
                            if (filename === `${name}.md`) {
                                let b = fs.readFileSync(path.resolve(`./public/export/${d}/${filename}`));
                                resolve(b.toString())
                            }
                        });
                    }); 
                });
            });
        });
    }

    /**
     * Read File
     */
    const readFile = (id) => {
        let name;
        return new Promise((resolve, reject) => {
            getCandidateName(id)
                .then(res => {
                    let name = `${res[0].lastname}${res[0].firstname}`.toLocaleLowerCase();
                    return Promise.resolve(readHandler(name));
                })
                .then(suc => resolve(suc))
                .catch(e => {
                    console.log(e);
                    reject(e);
                });
        })
        
    };

    return {
        read : readFile
    };
})();

module.exports = reader;
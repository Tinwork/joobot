const fs = require('fs');
const path = require('path');

const reader = (function(){

    /**
     * Read File
     */
    const readFile = (name) => {
        return new Promise((resolve, reject) => {
            fs.readdir(path.resolve("./public/export"), (e, data) => {
                data.map(d => {
                    fs.readdir(path.resolve(`./public/export/${d}/`), (e, file) => {
                        // If error then return
                        if (e) 
                            return;

                        file.map(filename => {
                            if (filename === `${name}.md`) {
                                let b = fs.readFileSync(path.resolve(`./public/export/${d}/${filename}`));
                                resolve(b.toString())
                            }
                        });
                    }); 
                });
            });
        });
    };

    return {
        read : readFile
    };
})();

module.exports = reader;
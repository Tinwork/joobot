const helper = (() => {

    let trimdata;

    /**
     * Is Empty
     *      Check if empty
     * @param {*} json 
     */
    const isEmpty = (json = {}) => {
        if (Object.keys(json).length === 0)
            return true;

        return false;
    };

    /**
     * Generate Skills
     * @param {*} data 
     */
    const generateSkills = (data, isall = false, propname) => {
        if (!isall)
            trimdata = data[propname].split(',');
        else 
            trimdata = data.job[propname].split(',');

        let jobsk = trimdata.map((d, i) => {
            trimdata[i] = d.trim();
        });

        if (!isall)
            data[propname] = trimdata;
        else 
            data.job[propname] = trimdata;


        return data;
    };

      /**
     * Generate Bot Object
     *          Generate an Object for the Microsoft Bot Framework
     * @param {*} job 
     * @param {*} questions 
     * @private
     */
    const generateBotObject = (data) => {
        let botdata = Object.create({});

        data.map((prop, i) => {
           if (i === 0)
                botdata.job = prop;
            else 
                botdata.questions = prop;
        });

        return generateSkills(botdata, true, 'skills');
    }

    
    return {
        empty : isEmpty,
        raboot: generateBotObject,
        skill : generateSkills
    }
})();

module.exports = helper;
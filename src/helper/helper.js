const helper = (() => {

    let skill;

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
    const generateSkills = (data, isall = false) => {
        
        if (!isall)
            skill = data.skills.split(',');
        else 
            skill = data.job.skills.split(',');

        let jobsk = skill.map((d, i) => {
            skill[i] = d.trim();
        });

        if (!isall)
            data.skills = skill;
        else 
            data.job.skills = skill;

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

        return generateSkills(botdata, true);
    }

    
    return {
        empty : isEmpty,
        raboot: generateBotObject,
        skill : generateSkills
    }
})();

module.exports = helper;
const helper = (() => {

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
                botdata.quo = prop;
        });
  
        return botdata;
    }


    return {
        empty : isEmpty,
        raboot: generateBotObject
    }
})();

module.exports = helper;
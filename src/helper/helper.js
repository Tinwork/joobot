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

    return {
        empty : isEmpty
    }
})();

module.exports = helper;
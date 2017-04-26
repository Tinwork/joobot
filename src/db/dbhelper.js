const dbHelper = (() => {

    let error,
        res,
        fields,
        props = {};

    /**
     * Treat Select Data
     * @param {Exception} e 
     * @param {Object} res 
     * @param {Object} fields 
     * @private
     */
    const selectCallback = (ismul = false) => {
        return new Promise((resolve, reject) => {
            if (error) 
                return reject(error);

            if (res === undefined)
                reject('res not defined')

            if (res.length === 0)
                reject('data not defined')

            if (ismul)
                resolve(res);
            else 
                resolve(res[0])
        });
    };

    /**
     * Check Empty
     *      Check if the data is empty
     */
    const checkEmpty = () => {
        return new Promise((resolve, reject) => {
            if (error)
                reject(error);
            
            if (res === undefined)
                resolve(true);
            
            if (res.length === 0)
                resolve(true);
            
            if (res)
                reject('data already defined');
        });
    }

    /**
     * Set Props
     * @param {String} name 
     * @param {Object} prop 
     */
    const setProps = (name, prop) => {
        props[name] = prop;
        return Promise.resolve(props);
    };

    /**
     * Get Prop
     *      return a property of an object
     * @param {*} name 
     * @return {Object} prop[name]
     */
    const getProp = (name) => {
        return props[name];
    }

    /**
     * Insert Callback
     * @param {Exception} e 
     * @param {Object} res 
     * @param {Object} fields 
     * @private
     */
    const insertCallback = (e, res, fields) => {
        if (e)
            return Promise.reject(e);
        
        return Promise.resolve('success');
    };

    /**
     * Db Query
     *      Query the database by returning a new promise
     */
    const dbQuery = (con, query = '', params = []) => {
        if (con === undefined || con === null)
            return Promise.reject('con not defined');

        return new Promise((resolve ,reject) => {
            con.query(query, params, (e, result, field) => {
                error = e;
                res = result;
                fields = field;

                if (error)
                    reject(error);

                resolve(true);
            });
        });
    };

    /**
     * Prepare List
     * @param {*} list
     * @private 
     */
    const prepareList = (lists = []) => {
        let datalist = '';
        lists.map((choice, i) => {
            if (i == lists.length - 1)
                datalist += `${choice}`;
            else
                datalist += `${choice},`;
        });

        return datalist;
    };

    return {
        select    : selectCallback,
        insert    : insertCallback,
        setprops  : setProps,
        getprops  : getProp,
        query     : dbQuery,
        isEmpty   : checkEmpty,
        prepList  : prepareList
    }
}).bind({})();

// Export the helper
module.exports = dbHelper;
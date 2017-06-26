const SQLManager = require('../db/dbabstract'),
      SQLHelper  = require('../db/dbhelper'),
      helper     = require('../helper/helper')

/**
 * Bot Dao
 */
const botDao = (() => {

    const SQL = 'SELECT * FROM bot';


    /**
     * Filter
     * @param {Object} d 
     */
    const filter = (d) => {
         const filterDatas = Object.assign({}, {
                manager: [],
                dev: [],
                design: []
        });
        
        d.map(data => {
            switch (data.profile) {
                case 'dev':
                    filterDatas.dev.push(data);
                break;
                case 'design':
                    filterDatas.design.push(data);
                break;
                default:
                    filterDatas.manager.push(data);
            }
        });

        return Promise.resolve(filterDatas);
    }
    
    /**
     * Get Bots
     */
    const getBots = () => {
        return SQLManager.initDB()
                  .then(con => SQLHelper.query(con, SQL))
                  .then(SQLHelper.select)
                  .then(filter)
                  .then(dataFilter => Promise.resolve(dataFilter))
    };

    return {
        getBots: getBots
    }
})();

module.exports = botDao;
const mysql = require('mysql');
/**
 * Sql Manager
 *      Manage the SQL database
 * @return {Object} this
 */
const sqlManager = (() => {

    let connection;
    const dbProps = Object.assign({}, {
        user : 'root',
        password : 'root',
        port : '3306',
        host : 'localhost',
        database : 'joobot'
    });

    /**
     * Create Connection
     *      Create a connection to the database
     * @return {Object} con
     */
    const createConnection = () => {
        if (connection !== undefined && connection !== null)
            return Promise.resolve(connection);

        connection = mysql.createConnection(dbProps);

        return new Promise((resolve, reject) => {
            connection.connect(err => {
                if (err) {
                    reject(err);
                }
                
                resolve(connection);
            });
        })
    };

    /**
     * Close Connection
     *      Close the sql connection
     */
    const closeConnection = () => {
        connection.end();
    };

    /**
     * Get DB Instance 
     *      Return an instance of the database connection
     * @return {Object} connection
     */
    const getDbInstance = () => {
        return connection;
    };

    return {
        initDB : createConnection,
        close : closeConnection,
        dbInstance : getDbInstance
    }
})();

// Export our sqlManager
module.exports = sqlManager;
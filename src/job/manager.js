 const createJOB  = require('./create'),
       deleteJOB  = require('./delete'),
       updateJOB  = require('./update'),
       retrieveJOB= require('./retrieve');

module.exports = {
    create : createJOB,
    delete : deleteJOB,
    update : updateJOB,
  retrieve : retrieveJOB
}
const remove = require('./delete');
const create = require('./create');
const retrieve = require('./retrieve');
const updateMethod = require('./update');

module.exports = {
    del : remove,
    add : create,
    up : updateMethod,
    get: retrieve
};

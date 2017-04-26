const remove = require('./delete');
const create = require('./create');
const updateMethod = require('./update');

module.exports = {
    del : remove,
    add : create,
    up : updateMethod
};

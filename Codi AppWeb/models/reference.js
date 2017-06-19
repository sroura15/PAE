const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// Tag Schema
const ReferenceSchema = mongoose.Schema({
  referencename: {
    type: String,
    required: true
  },
  coorX: {
    type: Number,
    required: true
  },
  coorY: {
    type: Number,
    required: true
  },
    coorZ: {
    type: Number,
    required: true
  },
   map: {
    type: String,
    //required: true
  },
});


const Reference = module.exports = mongoose.model('Reference', ReferenceSchema);

module.exports.getById = function(id, callback){
  Reference.findById(id, callback);
}

module.exports.getReferenceByName = function(referencename, callback){
  const query = {referencename: referencename}
  Reference.findOne(query, callback);
}

module.exports.addReference = function(newReference, callback){
  newReference.save(callback);
}


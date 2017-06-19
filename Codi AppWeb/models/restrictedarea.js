const mongoose = require('mongoose');
const config = require('../config/database');

//  Schema
const restrictedAreaSchema = mongoose.Schema({
  areaname: {
    type: String
  },
  coorX: {
    type: Number
  },
  coorY: {
    type: Number
  },
  coorX2: {
    type: Number
  },
  coorY2: {
    type: Number
  },
  tags: {
    type: Array
  },
});


const RestrictedArea= module.exports = mongoose.model('RestrictedArea', restrictedAreaSchema);

module.exports.getById = function(id, callback){
  RestrictedArea.findById(id, callback);
}

module.exports.findByName = function(areaname, callback){
  const query = {areaname: areaname}
  RestrictedArea.findOne(query, callback);
}

module.exports.addRestrictedArea = function(newRestrictedArea, callback){
  newRestrictedArea.save(callback);
}

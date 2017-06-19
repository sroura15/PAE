const mongoose = require('mongoose');
const config = require('../config/database');

// Map Schema
const mapSchema = mongoose.Schema({
  mapname: {
    type: String
  },
  image: {
    type: String
  },
  height: {
    type: Number
  },
  width: {
    type: Number
  },
  references: {
    type: Array
  },
  scale: {
    type: Number
  },
});


const Map= module.exports = mongoose.model('Map', mapSchema);

module.exports.findMapById = function(id, callback){
  Map.findById(id, callback);
}

module.exports.findMapByMapName = function(mapname, callback){
  const query = {mapname: mapname}
  Map.findOne(query, callback);
}

module.exports.addMap = function(newMap, callback){
  newMap.save(callback);
}

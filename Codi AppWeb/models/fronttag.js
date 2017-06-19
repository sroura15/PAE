const mongoose = require('mongoose');
const config = require('../config/database');

// Tag Schema
const FrontTagSchema = mongoose.Schema({
  name: {
    type: String
  },
  tipoTag: {
    type: String,
  },
  restricted: {
    type: Boolean,
    
  },
  });


const FrontTag = module.exports = mongoose.model('FrontTag', FrontTagSchema);

module.exports.getById = function(id, callback){
  FrontTag.findById(id, callback);
}

module.exports.getByName = function(name, callback){
  const query = {tagname: tagname}
  FrontTag.findOne(query, callback);
}

module.exports.addFrontTag = function(newFrontTag, callback){
  newFrontTag.save(callback);
}

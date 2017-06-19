const mongoose = require('mongoose');
const config = require('../config/database');

// Tag Schema
const TagSchema = mongoose.Schema({
  tagname: {
    type: String
  },
  idTag:{
    type: Number,
  },
  coorX: {
    type: Number,
    required: true
  },
  coorY: {
    type: Number,
    required: true
  },
  restricted: {
    type: Boolean,
    // required: true
  },
  tipoTag: {
    type: String,
    //required:true
    }
  });


const Tag = module.exports = mongoose.model('Tag', TagSchema);

module.exports.getById = function(id, callback){
  Tag.findById(id, callback);
}

module.exports.getTagByTagName = function(tagname, callback){
  const query = {tagname: tagname}
  Tag.findOne(query, callback);
}

module.exports.addTag = function(newTag, callback){
  newTag.save(callback);
}

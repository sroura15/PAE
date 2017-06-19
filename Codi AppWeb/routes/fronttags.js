const express = require('express');
const router = express.Router();
const FrontTag = require('../models/fronttag');
const config = require('../config/database');


//Register a new tag + update
router.post('/registerftags', (req, res, next) => {
    FrontTag.getById(req.body._id, (err, tag) => {
        if(err) {
            res.json({success: false, msg: 'ERROR'});
        }else if(tag == null) {
            console.log(tag);
            let newFrontTag = new FrontTag({
              name: req.body.tagname,
              tipoTag: req.body.tipoTag,
              restricted: req.body.restricted
              
          });
            FrontTag.addFrontTag(newFrontTag, (err, tag) => {
                if(err){
                    res.json({success: false, msg:'Failed to register a new tag'});
                } else {
                    res.json({success: true, msg:'New Tag registered'});
                }});
        }else {
          tag.update({
                name : req.body.tagname,
                tipoTag : req.body.tipoTag,
                restricted: req.body.restricted
              },
          function(err, tag) {
              if(!err) {
                  console.log('TAG modificado correctamente');
                  res.end('success');
              }else{
              console.log('ERROR: Tag no modificado: ' +err);
              }
          });
        }
    });
});


//Show all tags (GET)
router.get('/getAllTags', (req, res) => {
    FrontTag.find(function(err, tags) {
        if(err) {
            res.send(err);
        }
        res.json(tags);
    });
});

//Show one tag (GET)
// router.get('/getTagByName/:tagname', (req, res) => {
//     Tag.getTagByTagName(, (err, tag) => {
//         if(err) {
//             res.send(err);
//             console.log("Imposible encontrar");
//         }
//         res.json(tag);
//         console.log("Encontrado");
//     });
// });

router.get('/getTagById/:id', (req, res) => {
  Tag.getById(req.params.id, (err, tag) => {
    if(err){
      res.send(err);
    }else if(tag == null){
      res.json({success: false, msg:'Tag not found'});
    }else res.json({tag});
  });
});

//Delete a tag (DELETE)
router.delete('/deleteTagById/:id', (req, res) => {
            Tag.getById(req.params.id, (err, tag) => {
            tag.remove(function(err) {
               if(!err) res.json({success: true, msg: 'Tag eliminado correctamente'});
                else res.json({success: false, msg: 'Tag no eliminado'});
            })
        });
    });

//Delete a tag (DELETE)
router.delete('/deleteTagByName', (req, res) => {
            Tag.getTagByTagName(req.body.tagname, (err, tag) => {
            tag.remove(function(err) {
               if(!err) res.json({success: true, msg: 'Tag eliminado correctamente'});
                else res.json({success: false, msg: 'Tag no eliminado'});
            })
        });
    });

    module.exports = router;

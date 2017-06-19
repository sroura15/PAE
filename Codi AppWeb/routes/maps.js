const express = require('express');
const router = express.Router();
const Map = require('../models/map');
const config = require('../config/database');


//New map register + Update
router.post('/registerMap', (req, res, next) => {
    Map.findMapByMapName(req.body.mapname, (err, map) =>{
        if(err) {
            res.json({success: false, msg: 'ERROR'});
        }else if(map == null) {
          let newMap = new Map({
            mapname: req.body.mapname,
            image: req.body.image,
            height: req.body.height,
            width: req.body.width,
            references: req.body.references,
            scale: req.body.scale
          });
          Map.addMap(newMap, (err, map) => {
            if(err){
                res.json({success: false, msg:'Failed to upload the map'});
            } else {
                res.json({success: true, msg:'New map created'});
            }
          });
        }else {
          map.update({
            mapname: req.body.mapname,
            image: req.body.image,
            height: req.body.height,
            width: req.body.width,
            references: req.body.references,
            scale: req.body.scale
          },
          {upsert: true},
          function(err, map) {
            if(!err) {
              console.log('Map correctly modified');
            } else{
              console.log('ERROR: Map not modified: ' +err);
            }
              res.end('success');
          });
        }
    });
});
//Get all maps
router.get('/getAllMaps', (req, res) => {
  Map.find(function(err, maps) {
      if(err) {
        res.send(err);
      }
      res.json(maps);
  });});

//get map by id
router.get('/getMapById/:id', (req, res) => {
  Map.findMapById(req.params.id,(err,map) => {
    if(err){
       res.send(err);
     }else if(map == null){
       res.json({success: false, msg: 'Map not found'});
     }else res.json({map});
   });
});

//Metodo DELETE
router.delete('/deleteMapById/:id', (req, res) => {
            Map.findMapById(req.params.id, (err, map) => {
            map.remove(function(err) {
               if(!err) res.json({success: true, msg: 'Map deleted'});
              else res.json({success: false, msg: 'Error map not deleted'});
            })
        });
    });
module.exports = router;

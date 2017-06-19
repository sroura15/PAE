const express = require('express');
const router = express.Router();
const RestrictedArea = require('../models/restrictedarea');


//New register + Update
router.post('/registerRestrictedArea', (req, res, next) => {
    RestrictedArea.getById(req.body._id, (err, ra) =>{
        if(err) {
            res.json({success: false, msg: 'ERROR'});
        }else if(ra == null) {
          let newRestrictedArea = new RestrictedArea({
            areaname: req.body.areaname,
            coorX: req.body.coorX,
            coorY: req.body.coorY,
            coorX2: req.body.coorX2,
            coorY2: req.body.coorY2,
            tags: req.body.tags
          });
          RestrictedArea.addRestrictedArea(newRestrictedArea, (err, ra) => {
            if(err){
                res.json({success: false, msg:'Failed to upload the Restricted Area'});
            } else {
                res.json({success: true, msg:'New restricted area created'});
            }
          });
        }else {
          ra.update({
            areaname: req.body.areaname,
             coorX: req.body.coorX,
            coorY: req.body.coorY,
            coorX2: req.body.coorX2,
            coorY2: req.body.coorY2,
            tags: req.body.tags
          },
          function(err, ra) {
            if(!err) {
              console.log('Restricted Area correctly modified');
            }else{
              console.log('ERROR: Restricted Area not modified: ' +err);
            }
              res.end('success');
          });
        }
    });
});
//Get all RestrictedAreas
router.get('/getAllRestrictedAreas', (req, res) => {
  RestrictedArea.find(function(err, ra) {
      if(err) {
        res.send(err);
      }
      res.json(ra);
  });
});

//get by id
router.get('/getById/:id', (req, res) => {
  RestrictedArea.getById(req.params.id,(err,ra) => {
    if(err){
       res.send(err);
     }else if(ra == null){
       res.json({success: false, msg: 'Restricted Area not found'});
     }else res.json({ra});
   });
});

//Metodo DELETE
router.delete('/deleteById/:id', (req, res) => {
            RestrictedArea.findById(req.params.id, (err, ra) => {
            ra.remove(function(err) {
               if(!err) res.json({success: true, msg: 'Restricted Area deleted'});
              else res.json({success: false, msg: 'Error restricted area not deleted'});
            })
        });
    });
module.exports = router;

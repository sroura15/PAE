const express = require('express');
const router = express.Router();
const Reference = require('../models/reference');
const config = require('../config/database');




//Registrar una nueva referencia + update
router.post('/registerReference', (req, res, next) => {
    Reference.getById(req.body._id, (err, reference) =>{
        if(err) {
            res.json({success: false, msg: 'ERROR' +err});
        }else if(reference == null) {
            let newReference = new Reference({
                referencename: req.body.referencename,
                coorX: req.body.coorX,
                coorY: req.body.coorY,
                coorZ: req.body.coorZ,
                map:req.body.map

            });
            Reference.addReference(newReference, (err, reference) => {
                if(err){
                    res.json({success: false, msg:'Failed to create a new reference '+err});
                } else {
                    res.json({success: true, msg:'New Reference created'});
                }});
        }else {
            reference.update({
                    referencename: req.body.referencename,
                    coorX: req.body.coorX,
                    coorY: req.body.coorY,
                    coorZ: req.body.coorZ,
                    map:req.body.map

            },

            function(err, reference) {
                if(!err) {
                    console.log('Reference modified');
                    res.end('success');

                }else{
                console.log('ERROR: Reference not modified: ' +err);
                }
            });
        }
    });
});



//Metodo GET de todas las referencias
router.get('/getAllReferences', (req, res) => {
    Reference.find(function(err, references) {
        if(err) {
          res.send(err);
        }
        res.json(references);
    });
});

//Metodo Get one reference by id
router.get('/getReferenceById/:id', (req, res) => {
  Reference.findById(req.params.id,(err,reference) => {
    if(err){
       res.send(err);
     }else if(reference == null){
       res.json({success: false, msg: 'Reference not found'});
     }else res.json({reference});
  });
});

//Metodo DELETE
router.delete('/deleteReferenceById/:id', (req, res) => {
            Reference.getById(req.params.id, (err, reference) => {
            reference.remove(function(err) {
               if(!err) res.json({success: true, msg: 'Reference deleted'});
                else res.json({success: false, msg: 'ERROR: Reference not deleted' +err});
            })
        });
    });

router.delete('/deleteReferenceByName', (req, res) => {
            Reference.getReferenceByName(req.body.referencename, (err, reference) => {
            reference.remove(function(err) {
               if(!err) res.json({success: true, msg: 'Reference deleted'});
                else res.json({success: false, msg: 'ERROR: Reference not deleted' +err});
            })
        });
    });

module.exports = router;

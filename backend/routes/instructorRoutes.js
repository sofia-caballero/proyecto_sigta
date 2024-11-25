// routes
const express = require('express');
const { getAllInstructores,createInstructor,updateInstructor } = require('../controllers/instructorController');

const router = express.Router();

//consultar 
router.get('/', getAllInstructores);

// crear
router.post('/', createInstructor);


router.put('/:id', updateInstructor);



module.exports = router;

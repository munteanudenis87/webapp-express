const express = require('express')
const router = express.Router();

// importo il controller della risorsa post
const movieController = require('../controllers/movieController');

// index
router.get('/', movieController.index);

// show
router.get('/:id', movieController.show);

// store
router.post('/', movieController.store);

// update
router.put('/:id', movieController.update);

// destroy
router.delete('/:id', movieController.destroy);

// esporto il router per poterlo usare in app
module.exports = router;
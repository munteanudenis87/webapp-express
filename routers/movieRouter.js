// richiamo libreria
const express = require('express')
// estrapolo e uso la parte di router
const router = express.Router();

// importo il controller della risorsa movie
const movieController = require('../controllers/movieController');

// definisco le varie rotte relative alla risorsa specifica
// index
router.get('/', movieController.index);

// show
router.get('/:id', movieController.show);

// store reviews
router.post('/:id/reviews', movieController.storeReview);

// store movie
router.post('/', movieController.store);

// update
router.put('/:id', movieController.update);

// destroy
router.delete('/:id', movieController.destroy);

// esporto il router per poterlo usare in app
module.exports = router;
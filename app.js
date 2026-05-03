const express = require('express')
const app = express()
const port = process.env.PORT
// import cors middleware
const cors = require("cors");

// abilitiamo dominio FE
app.use(cors({origin: process.env.FE_APP}));

const movieRouter = require('./routers/movieRouter');

// importo middleware di gestione errore interni server 500
const errorsHandler = require('./middlewares/errorsHandler');

// importo middleware di gestione errore di chiamata su rotta inesistente 404
const notFound = require('./middlewares/notFound');

// importo middleware per path images
const imagePath = require('./middlewares/imagePath');

app.use(imagePath);

app.use(express.static('public'));

// Attivazione body parser per formato json per le rotte
app.use(express.json());

// rotta di home
app.get('/', (req, res) => {
    res.send('Setup Web App Express')
});

// rotte di CRUD
app.use('/api/movies', movieRouter);

// registra globalmente il middleware di gestione errore interno server 500
app.use(errorsHandler);

// registra globalmente il middleware di gestione chiamata su rotta inesistente 404
app.use(notFound);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
// Importiamo il file di connessione al database
const connection = require('../data/db');

// elenco funzioni relative alle rotte della risorsa movie

function index (req, res) {
    // prepariamo la query
    const sql = 'SELECT * FROM movies';
    
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });

        const movies = results.map((movie) => {
            return {
                ...movie,
                image: req.imagePath + movie.image
            }
        })

        res.json(movies);
});
};
function show (req, res) {
    // recuperiamo l'id dall' URL
    const id = req.params.id

    /// query da eseguire con ?segnaposto per prepared statement per movie
    const sql = 'SELECT * FROM movies WHERE id = ?';

    // query da eseguire con ?segnaposto per le reviews del movie
    const reviewsSql = `select * from reviews where movie_id = ?`;

    connection.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        if (results.length === 0) return res.status(404).json({ error: 'Movie not found' });

        // Recuperiamo il post
        const movie = results[0];

        movie.image = req.imagePath + movie.image;

        // Se è andata bene, eseguiamo la seconda query per i reviews
        connection.query(reviewsSql, [id], (err, results) => {
            if (err) return res.status(500).json({ error: 'Database query failed'});

            // Aggiungiamo i reviews del movi
            movie.tags = results;
            // Returniamo il movie con la nuova prop reviews
            res.json(movie);
        })
});
};
function store (req, res) {
    const { title, director, genre, release_year, abstract, image } = req.body;
    // prepariamo la query
    const sql = 'INSERT INTO movies (title, director, genre, release_year, abstract, image, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ? )'
    // eseguiamo la query
    connection.query(
        sql,
        [title, director, genre, release_year, abstract, image],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Failed to insert post' });
                res.status(201); // status corretto
                console.log(results)
                res.json({ id: results.insertId }); // restituiamo l'id assegnato dal DB
        });
};

// inserimento di review specifica legata ad un movie
function storeReview(req, res) {
    // recuperiamo l'id dall' URL
    const id = req.params.id;

    // recuperiamo inf nel body
    const { text, name, vote } = req.body;

    // prepariamo la query
    const sql = 'INSERT INTO reviews (text , name, vote, movie_id) VALUES (?,?,?,?)';

    // chiamata per esecuzione query aggiunta review
    connection.query(sql, [text, name, vote, id], (err, reviewResult) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        // restituiamo codice rest corretto
        res.status(201);
        res.json({ message: 'Review succesfully added', id: reviewResult.insertId })
    })
}

function update (req, res) {
    // recuperiamo l'id dall' URL
    const { id } = req.params;
    // recuperiamo i dati dal body della richiesta
    const { title, director, genre, release_year, abstract, image } = req.body;
    // Prepariamo la query per aggiornare il movie
    connection.query(
        'UPDATE movies SET title = ?,  director = ?, genre = ?, release_year = ?, abstract = ?, image = ? WHERE id = ?',
        [title, director, genre, release_year, abstract, image, id],
        (err) => {
            if (err) return res.status(500).json({ error: 'Failed to update movie' });
                res.json({ message: 'Movie updated successfully' });
        });
};
function destroy (req, res) {
    // recuperiamo l'id dall' URL
    const { id } = req.params;
    //Eliminiamo il movie
    connection.query('DELETE FROM movies WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: 'Failed to delete movie' });
        res.sendStatus(204)
    });
};

// esportiamo le funzioni per il router
module.exports = { index, show, store, storeReview, update, destroy };
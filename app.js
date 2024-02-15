const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // tambahkan ini untuk menggunakan path.join()

const app = express();
const port = 3000;

// Pastikan app.use(cors()) ditempatkan setelah mendeklarasikan app
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'movie_comments'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL');
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/detail.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/detail.html'));
});

app.post('/api/comments', (req, res) => {
    const { movieId, name, comment } = req.body;

    const query = 'INSERT INTO comments (movie_id, name, comment) VALUES (?, ?, ?)';
    db.query(query, [movieId, name, comment], (err, result) => {
        if (err) {
            console.error('Error inserting comment:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.status(201).send('Comment added successfully');
        }
    });
});

app.get('/api/comments/:movieId', (req, res) => {
    const movieId = req.params.movieId;

    const query = 'SELECT * FROM comments WHERE movie_id = ?';
    db.query(query, [movieId], (err, results) => {
        if (err) {
            console.error('Error getting comments:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(results);
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

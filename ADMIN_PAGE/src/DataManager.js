const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql2/promise');

const app = express();
const cors = require('cors');
app.use(cors());

// Middleware for parsing JSON requests
app.use(bodyParser.json());

// Session configuration for storing user data between requests
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }
}));

// Setting up a connection to the database
/* createPool manages a pool
* of connections. createPool is preferable
* over createConnection. */
let pool;
async function initializeDatabase() {
    try {
        pool = await mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'axd944',
            database: 'Science_Center',
        });
        console.log("Database pool created.");
    } catch (error) {
        console.error("Failed to create a database pool: ", error);
    }
}

initializeDatabase();

/* Route to handle POST requests
* path '/' indicates the end point of the server,
* for example http://localhost:3000/ */
app.post('/:identifier', async (req, res) => {
    const identifier = req.params.identifier;

    console.log(req.body);
    const { firstName, lastName, email, password } = req.body;
    let connection;

    try {
        switch (identifier) {
            case 'registerAdmin':  // Handle admin registration
                const connection = await pool.getConnection();

                const [rows] = await connection
                    .execute('INSERT INTO STAFF_MEMBERS (F_NAME, L_NAME, EMAIL, PASSWORD) ' +
                        'VALUES (?, ?, ?, ?)', [firstName, lastName, email, password]);

                req.session.uname = email;
                req.session.pw = password;

                res.json({ success: true });

                break;
        }
    } catch (error) {
        console.log("Error", error);
        res.json({ success: false, message: error.message });
    } finally {
        if (connection) { connection.release(); }
    }

});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


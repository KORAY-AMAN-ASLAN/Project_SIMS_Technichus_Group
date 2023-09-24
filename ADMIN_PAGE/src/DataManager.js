const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

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

initializeDatabase().then(r => {});

/* Route to handle POST requests
* path '/' indicates the end point of the server,
* for example http://localhost:3000/ */
app.post('/:identifier', async (req, res) => {
    const identifier = req.params.identifier;

    console.log(req.body);
    const connection = await pool.getConnection();

    try {
        switch (identifier) {
            case 'registerAdmin':  // Handle admin registration
                const { firstName, lastName, email, password } = req.body;

                const [rows] = await connection
                    .execute('INSERT INTO ADMINISTRATORS (F_NAME, L_NAME, EMAIL, PASSWORD) ' +
                        'VALUES (?, ?, ?, ?)', [firstName, lastName, email, password]);

                req.session.uname = email;
                req.session.pw = password;

                res.json({ success: true });

                break;

            case 'signIn':
                [rows] = await connection
                    .execute('SELECT ADMIN_ID FROM ADMINISTRATORS' +
                        'WHERE EMAIL = ?', [email]);
                if (rows.length > 0) {
                    const user = rows[0];
                    const match = await bcrypt.compare(password, user.PASSWORD);

                    if (match) {
                        req.session.uname = email;
                        req.session.pw = password;
                        res.json({success: true});
                    }
                    else {
                        res.json({success: false, message: 'Incorrect password'});
                    }
                } else {
                    res.json({success: false, message: 'Incorrect password'});
                }

                break;

            case 'registerMediaPlayer':
                const { station, width, height, resolution,
                        screen_name, mac_address, ip_address } = req.body;

                [rows] = await connection
                    .execute('INSERT INTO DIGITAL_SIGNS ' +
                        '(STATION, WIDTH, HEIGHT, RESOLUTION, SCREEN_NAME' +
                        ' MAC_ADDRESS, IP_ADDRESS) VALUES ' +
                        '(?, ?, ?, ?, ?, ?)', [station, width, height,
                        resolution, screen_name,
                        mac_address, ip_address]);
                break;

            case 'registerExhibit':
                const { exh_name, exh_theme, exh_descr,
                        created_at, updated_at } = req.body;

                [rows] = await connection
                    .execute('INSERT INTO EXHIBITS ' +
                        '(EXH_NAME, EXH_THEME, EXH_DESCR, ' +
                        'CREATED_AT, UPDATED_AT) VALUES ' +
                        '(?, ?, ?, ?, ?)', [exh_name, exh_theme, exh_descr,
                        created_at, updated_at]);
                break;

            case 'manageMediaPlayers':
                [rows] = await connection
                    .execute
                    ('SELECT EXH_NAME, EXH_THEME, STATION, MAC_ADDRESS,' +
                        ' IP_ADDRESS, STATUS_NAME, RESOLUTION, ' +
                        'SCREEN_NAME FROM EXHIBITS JOIN MEDIA_PLAYERS ON' +
                        'EXHIBITS.EXH_ID = MEDIA_PLAYERS.SIGN_ID' +
                        'J');
                break;
        }
    } catch (error) {
        console.log("Error", error);
        res.json({ success: false, message: error.message });
    } finally { if (connection) { connection.release(); } }

});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


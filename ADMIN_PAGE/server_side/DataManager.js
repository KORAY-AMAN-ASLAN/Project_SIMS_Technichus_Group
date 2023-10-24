const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const PORT = 3000;

const app = express();
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:63342',
    credentials: true
}));

// Middleware for parsing JSON requests
app.use(bodyParser.json());

// Session configuration for storing user data between requests
app.use(session({
    secret: 'session_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: 'lax'
    }
}));

// Setting up a connection to the database
let pool;

async function initializeDatabase() {
    /* createPool manages a pool
    * of connections, and is preferable
    * over createConnection for this application. */
    try {
        pool = await mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'password',
            database: 'Science_Center',
        });
        console.log("Database pool created.");
    } catch (error) {
        console.error("Failed to create a database pool: ", error);
    }
}

initializeDatabase().then(r => {});

/* path '/' indicates the end point of the server,
* equivalent to http://localhost:3000/:identifier */
/* ----------------------------------------------- ROUTE FOR HANDLING POST REQUESTS ------------------------------------------*/
app.post('/:identifier', async (req, res) => {

    const identifier = req.params.identifier;

    console.log("The current endpoint is:", identifier);

    const connection = await pool.getConnection();

    try {
        switch (identifier) {
            case 'registerAdmin':  // Handle admin registration

                console.log("In registerAdmin route handler");

                const { firstName, lastName, email, password } = req.body;

                const [rows] = await connection
                    .execute('INSERT INTO ADMINISTRATORS (F_NAME, L_NAME, EMAIL, PASSWORD) ' +
                        'VALUES (?, ?, ?, ?)', [firstName, lastName, email, password]);

                req.session.uname = email;
                req.session.pw = password;

                // sends back a response to the client
                res.json({ success: true, sessionActive: true, email: email });

                break;

            case 'signIn':
                try {
                    console.log("Inside signIn case");
                    const email = req.body.email;
                    const pw = req.body.password;
                    console.log("Received email:", email);
                    console.log("Received password: ", pw);

                    const [results] = await connection
                        .execute('SELECT ADMIN_ID FROM ADMINISTRATORS WHERE EMAIL = ? AND PASSWORD = ?', [email, pw]);
                    console.log("The query result is: ", [results]);
                    if (results.length > 0) {
                        console.log("administrator credentials found a match");
                        const admin_name_data = await connection
                            .execute('SELECT F_NAME FROM ADMINISTRATORS WHERE EMAIL = ?', [email]);

                        const key_value_pair = admin_name_data[0][0];
                        const admin_name = key_value_pair.F_NAME;

                        console.log("admin name to return: ", admin_name);

                        console.log("user has logged in. Setting session variables");
                        req.session.isLoggedIn = true;
                        req.session.uname = admin_name;
                        console.log("Current logged in admin has the name: ", req.session.uname);
                        // send json response back to the client
                        res.json({ success: true, name: admin_name });
                    }
                    else {
                        res.json({ success: false, message: 'Incorrect password' });
                    }
                }
                catch (err) {
                    console.log('An error has occurred:', err.message);
                    res.json({success: false, message: "Unknown identifier"});
                }

                break;

            case 'registerExhibit':

                console.log("In case registerExhibit");

                const { exh_name, exh_theme, exh_descr,
                    created_at, updated_at } = req.body;

                console.log("On server side,\n");
                console.log("received data: ", req.body);

                try {
                    [rows] = await connection
                        .execute('INSERT INTO EXHIBITS ' +
                            '(EXH_NAME, EXH_THEME, EXH_DESCR, ' +
                            'CREATED_AT, UPDATED_AT) VALUES ' +
                            '(?, ?, ?, ?, ?)', [exh_name, exh_theme, exh_descr,
                            created_at, updated_at]);

                    console.log("Exhibit has been stored in the database");
                    connection.release();
                    res.response({success: true, message: "Exhibit was successfully registered!"});
                }
                catch (error) { res.json({ success: false, message: error.message }) }

                break;

            case 'registerMediaPlayer':
                const { station, width, height, resolution,
                        screen_name, mac_address, ip_address } = req.body;

                [rows] = await connection
                    .execute('INSERT INTO DIGITAL_SIGNS ' +
                        '(STATION, WIDTH, HEIGHT,' +
                        ' MAC_ADDRESS, IP_ADDRESS) VALUES ' +
                        '(?, ?, ?, ?, ?, ?)', [station, width, height,
                        resolution, screen_name,
                        mac_address, ip_address]);
                break;
        }
    } catch (error) {
        console.log("Error", error);
        res.json({ success: false, message: error.message });
    } finally { if (connection) { connection.release(); } }
});


/* ----------------------------------------------- ROUTE FOR HANDLING GET REQUESTS ------------------------------------------*/
app.get('/:identifier', async (req, res) => {

    console.log("Inside route for GET requests");

    console.log("GET request received for identifier:", req.params.identifier);

    const connection = await pool.getConnection();

    const identifier = req.params.identifier;

    switch (identifier) {
        case 'is-logged-in':

            console.log('inside the case for ´is-logged-in´ endpoint in DataManager.js');

            if (req.session.isLoggedIn) {
                console.log("An administrator is logged in");
                connection.release();
                res.json({ isLoggedIn: true, name: req.session.uname });
            } else {
                console.log("No administrator is logged in");
                connection.release();
                res.json({ isLoggedIn: false });
            }
            break;

        case 'showStations':
            console.log('inside showStation case');
            try {
                [rows] = await connection.execute
                ('SELECT EXH_NAME, EXH_THEME, STATION, MAC_ADDRESS,' +
                    'STATUS_NAME, SCREEN_NAME' +
                    'FROM EXHIBITS' +
                    'JOIN MEDIA_PLAYERS ON EXHIBITS.EXH_ID = MEDIA_PLAYERS.STATION' +
                    'JOIN LAYOUTS ON MEDIA_PLAYERS.SIGN_ID = LAYOUTS.MEDIA_PLAYER' +
                    'JOIN LAYOUT_STATUS ON LAYOUTS.LAYOUT_ID = LAYOUT_STATUS.STATUS_ID');

                connection.release();
                res.json({ success: true, data: rows });
            }
            catch (error) { res.json({ success: false, message: error.message }) }

            break;

        case 'logout':
            console.log('\nIn logout case');

            req.session.destroy(err => {
                if (err) {
                    console.log("could not destroy session");
                    // Handle error
                    res.send('Error occurred while destroying session');
                } else {
                    console.log("erasing client side cookies");
                    // Optionally clear the client-side cookie as well
                    res.clearCookie('connect.sid');
                    connection.release();
                    res.redirect('../public/dashboard.html'); // Or wherever you'd like to redirect the user after logout
                }
            });
            break;
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


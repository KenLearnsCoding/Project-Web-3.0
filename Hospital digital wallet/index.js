const express = require('express');
const app = express();
const port = 2000;
const path = require('path');

async function setupServer() {
    app.set("view engine", "ejs");
    app.set('views', path.join(__dirname, 'front-end'));
    app.use(express.static(path.join(__dirname, 'front-end')));
    // Corrected the path to the 'assets' directory
    app.use("/Assets", express.static(path.join(__dirname, 'assets')));

    app.get('/', async (req, res) => {
        res.render('index');
    });

    app.listen(port, () => {
        console.log(`Server started on port: ${port}`);
    });
}

setupServer();
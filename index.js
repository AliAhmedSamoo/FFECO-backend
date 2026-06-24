
const express = require("express");
const https = require('https');
const fs = require('fs');
const app = express();
require('./DB/connection');
const cors = require('cors');



app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.get('/', (req, res) => {
    const date = Date.now();
    res.send("Server is running new " + date);
});
app.get('/favicon.ico', (req, res) => res.status(204));

app.use(require('./pages/admin/addItem'));
app.use(require('./pages/admin/vendor'));
app.use(require('./pages/admin/orders'));


app.use(require('./pages/inventory'));
app.use(require('./pages/batch'));
app.use(require('./pages/verifyBatch'));

// app.use('/additem', additem);


app.listen(1337, () => console.log("running on 1337"));
// Imports Node modules
const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const authentication = require('./routes/authentication')(router);
const bodyParser = require('body-parser');
const cors = require('cors');


// Database Connection
mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
    if(err){
        console.log('error');
    }else{
        console.log('contected to '+ config.db);
    }
});

app.use(cors({
    origin: 'http://localhost:4200'
}));


// Express middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Provide static directory for frontend
app.use(express.static(__dirname + '/client/dist/client/'));
app.use('/authentication', authentication);


// Connect Server to Angular 6 Index.html
app.get('/', (req, res) => {
    res.sendFile(Path2D.join(__dirname + '/client/dist/client/index.html'));
});

// Start Server: Listen on port 8080
app.listen(8080, () => {
    console.log('Listening on port 8080');
});
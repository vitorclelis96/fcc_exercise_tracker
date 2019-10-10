const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');


const appConfig = () => {
    // build App
    const app = express();
    // Cors
    app.use(cors());
    // BodyParser
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(express.static('public'));
    return app;
}


module.exports = appConfig;
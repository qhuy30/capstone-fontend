
// const debug = require('debug');
// const favicon = require('serve-favicon');
//var cookieParser = require('cookie-parser');
// const fs = require('fs-extra');
const express = require('express');
const path = require('path');
// const log = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const httpModule = require('http');


const setting = require('./utils/setting');
const {LogProvider} = require('./shared/log_nohierarchy/log.provider');


const app = express();

class Server{
    constructor(){
        this.initViewEngine();
        this.initExpressMiddleware();
        this.setRender();
        
        this.start();
    }

    start(){
        //const https = require('https');
        //const hostname = setting.hostname;
        //const options = {
        //    ca: fs.readFileSync('./SSL/devspo.com/ca_bundle.crt'),
        //    key: fs.readFileSync('./SSL/devspo.com/private.key'),
        //    cert: fs.readFileSync('./SSL/devspo.com/certificate.crt')
        //};
        //var server = https.createServer(options, app).listen(port, hostname, function () {
        //    logger.info("Server is listening port " + port);
        //});
        const http = httpModule.Server(app);
        var server = http.listen(setting.port, setting.hostname, function () {
            LogProvider.info("Server is listening port " + setting.port,
                 "server.start",
                "system",
                "startserver"
            );
        });
        server.setTimeout(3000);
        process.on('uncaughtException', err => {
            console.error('There was an uncaught error', err)
            process.exit(1) //mandatory (as per the Node.js docs)
          })
    }

    initViewEngine(){
        app.set('views', path.join(__dirname, 'views')); 
        app.set('view engine', 'ejs');
    }

    initExpressMiddleware(){
        // app.use(log('dev'));
        app.use(cors());
        app.use(bodyParser.json({ limit: '10mb' }));
        app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
        app.use(express.static('public')); 
    }

    setRender(){
        app.use(function(req, res) {
            // Use res.sendfile, as it streams instead of reading the file into memory.
            let domain = req.protocol + '://' + req.headers.host;
            res.render('home', { host: domain });
        });
    }
}

new Server();











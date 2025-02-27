
const express = require('express');
const path = require('path');
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
        app.use(cors());
        app.use(bodyParser.json({ limit: '10mb' }));
        app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
        app.use(express.static('public')); 
    }

    setRender(){
        app.use(function(req, res) {
            let domain = req.protocol + '://' + req.headers.host;
            res.render('home', { host: domain });
        });
    }
}

new Server();











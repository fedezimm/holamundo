const http = require('http');
const url = require('url');
const phone = require('phone');
const { multiplication} = require('../utils/operations');
const port = 5000;


const server = http.createServer((req, res) => {

    console.log(req.url)
    const urlData = url.parse(req.url, true)
    const path = urlData.pathname;
    const query = urlData.query;

    console.log('path',path);
    console.log('query',query);

    switch(path){
        case "/":
            res.writeHead(200,{'Content-Type':'text/html'});
            res.write('<html><head><meta charset=\"utf-8\"/></head><body>HOME</body></html>');
            break;
        case "/info":
            res.writeHead(200,{'Content-Type':'application/json'});
            res.write(JSON.stringify({version:"0.0.1", appName:"Curso Node.js"}));
            break;
        case "/detail":
            res.writeHead(200,{'Content-Type':'text/html'});
            res.write('<html><head><meta charset=\"utf-8\"/></head><body>DETAIL</body></html>');
            break;
        case "/phone":
            try {
                const result = phone(query.value, query.country.toUpperCase());
                res.writeHead(200,{'Content-Type':'application/json'});
                res.write(JSON.stringify(result));
            } catch (err) {
                res.writeHead(400,{'Content-Type':'text/html'});
                res.write(err.message);
            }
            break;    
        default:
            res.writeHead(404,{'Content-Type':'text/html'});
            res.write('');
            break;
    }
    res.end();
});


console.log("multiplication: ", multiplication(3,3))
server.listen(port);

var http = require('http');
var port = 3000;

function requestHandler(request, response) {
    "use strict"; console.log(request.url);
    response.end('hello world');
};

var server = http.createServer(requestHandler);

server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    };
    console.log(`server is listening on ${port}`)
});

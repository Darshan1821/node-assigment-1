const fs = require('fs');

const routeHandler = (req, res) => {
    const url = req.url;
    const method = req.method;

    if(url == '/') {
        res.setHeader('Content-Type','text/html');
        res.write(`
            <html>
                <head>
                    <title>Welcome</title>
                </head>
                <body>
                    <h1>Welcome to my page !!</h1>
                    <form action = '/create-user' method = 'POST'>
                        <input type = 'text' placeholder = 'Enter Name...' name = 'username'/>
                        <button type = 'submit' value = 'Register'> Register </button>
                    </form>
                </body>
            </html>`);
        res.end();
    } else if (url == '/create-user' && method == 'POST') {

        const body = [];

        req.on('data', chunk => body.push(chunk));
        req.on('end', () => {
            const name = Buffer.concat(body).toString().split('=')[1];
            let names = [];

            fs.readFile('names.txt', (err, data) => {
                if(data != ''){
                    names = data.toString().split(',');
                    names.push(name);
                } else {
                    names.push(name);
                }
                fs.writeFile('names.txt', names.join(','), () => {
                    res.statusCode = 201;
                    res.setHeader('Location','/users');
                    res.end();
                });
            });
        });
    } else if (url == '/users') {
        res.setHeader('Content-Type','text/html');
        
        fs.readFile('names.txt', (err, data) => {

            res.write(`
            <html>
                <head>
                    <title>Users</title>
                </head>
                <body>`);

            let names = [];

            if(data.toString() != ''){
                names = data.toString().split(',');
                res.write(`<h1>Users:</h1><ul>`);
                for(let i = 0; i < names.length; i++) {
                    res.write(`<li>` + names[i] + `</li>`);
                }
                res.write(`</ul>`);
            } else {
                res.write(`<h1>No user found !!</h1>`);
            }

            res.write(`</body></html>`);
            res.statusCode = 200;
            res.end();
        });
    }
};

exports.handler = routeHandler;
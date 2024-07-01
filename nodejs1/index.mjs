import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { config } from 'dotenv';

config();

const PORT = process.env.PORT
const BACKUP_FILE_PATH = process.env.BACKUP_FILE_PATH

const server = http.createServer((req, res) => {

    switch (req.method) {
        case 'GET':
            switch (req.url) {
                case '/ping':
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    console.log(req);
                    res.end('pong');
                    break;
                case '/read':
                    fs.readFile(String(BACKUP_FILE_PATH), (err, data) => {
                        res.end(data)
                    })
                        .then(r  => res.end(r))
                    break;
                default:
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Not Found');
            }
            break;
        case 'POST':
            switch (req.url) {
                case '/echo':
                    let body = '';
                    req.on('data', chunk => {
                        body += chunk.toString(); // Конкатенируем полученные части данных
                    });
                    req.on('end', () => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(body); // Возвращаем полученные данные
                    });
                    break;
                default:
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Not Found')
            }
            break;
        default:
            res.writeHead(405, { 'Content-Type': 'text/plain' });
            res.end('Method Not Allowed');
    }

});

// Запускаем сервер на указанном порту
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
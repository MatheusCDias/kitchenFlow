import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import {
    getAllOrders,
    claimOrderForStation,
    completeOrderForStation,
    releaseOrderForStation,
    deleteOrderForStation,
    createOrder,
    resetAllOrders,
} from './state/orders';
import { getOccupiedStations, claimStation, releaseStationBySocket } from './state/stationPresence';
import { getMenu } from './state/menu';
import { HttpError } from './errors/HttpError';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/orders', (_req, res) => {
    res.json(getAllOrders());
});

app.get('/menu', (_req, res) => {
    res.json(getMenu());
});

app.post('/orders', (req, res) => {
    try {
        const order = createOrder(req.body);
        res.status(201).json(order);
    } catch (err) {
        handleError(err, res);
    }
});

app.post('/orders/:id/claim', (req, res) => {
    try {
        const order = claimOrderForStation(req.params.id, req.body.stationNumber);
        res.json(order);
    } catch (err) {
        handleError(err, res);
    }
});

app.post('/orders/:id/complete', (req, res) => {
    try {
        const order = completeOrderForStation(req.params.id, req.body.stationNumber);
        res.json(order);
    } catch (err) {
        handleError(err, res);
    }
});

// "Desistir": devolve o pedido pra fila.
app.post('/orders/:id/release', (req, res) => {
    try {
        const order = releaseOrderForStation(req.params.id, req.body.stationNumber);
        res.json(order);
    } catch (err) {
        handleError(err, res);
    }
});

// "Excluir": cancela o pedido do cliente de vez.
app.delete('/orders/:id', (req, res) => {
    try {
        deleteOrderForStation(req.params.id, req.body.stationNumber);
        // Corpo simples (não 204) porque o cliente sempre tenta ler JSON da resposta.
        res.status(200).json({ success: true });
    } catch (err) {
        handleError(err, res);
    }
});

// Apaga tudo (inclusive os pedidos mockados) e volta a contar do #1.
// É um botão de "reiniciar o ambiente de testes", não uma função de restaurante de verdade.
app.post('/admin/reset', (_req, res) => {
    resetAllOrders();
    res.status(200).json({ success: true });
});

function handleError(err: unknown, res: express.Response): void {
    if (err instanceof HttpError) {
        res.status(err.statusCode).json({ message: err.message });
        return;
    }
    console.error(err);
    res.status(500).json({ message: 'Erro interno do servidor.' });
}

// Servidor HTTP "cru" por baixo do Express, porque o WebSocket (socket.io)
// precisa se pendurar nele — não dá pra só usar app.listen().
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

io.on('connection', (socket) => {
    // Assim que conecta, já manda quem está ocupado agora.
    socket.emit('stations:update', getOccupiedStations());

    socket.on('station:claim', (stationNumber: number, callback: (ok: boolean) => void) => {
        const ok = claimStation(stationNumber, socket.id);
        if (ok) {
            io.emit('stations:update', getOccupiedStations());
        }
        callback(ok);
    });

    // Dispara sozinho quando a conexão cai: fechou a aba, fechou o navegador,
    // caiu a rede. É assim que a bancada libera sem precisar de aviso manual.
    socket.on('disconnect', () => {
        releaseStationBySocket(socket.id);
        io.emit('stations:update', getOccupiedStations());
    });
});

httpServer.listen(PORT, () => {
    console.log(`Servidor do KitchenFlow rodando em http://localhost:${PORT}`);
});

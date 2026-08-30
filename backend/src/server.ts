import cors from 'cors';
import express from 'express';
import {
    getAllOrders,
    claimOrderForStation,
    completeOrderForStation,
    cancelOrderForStation,
    createOrder,
} from './state/orders';
import {
    getOccupiedStations,
    claimStation,
    heartbeatStation,
    releaseStation,
} from './state/stations';
import { HttpError } from './errors/HttpError';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/orders', (_req, res) => {
    res.json(getAllOrders());
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

// "Cancelar" aqui é o mesmo "devolver pra fila" que já existia no app.
app.post('/orders/:id/cancel', (req, res) => {
    try {
        const order = cancelOrderForStation(req.params.id, req.body.stationNumber);
        res.json(order);
    } catch (err) {
        handleError(err, res);
    }
});

app.get('/stations', (_req, res) => {
    res.json({ occupied: getOccupiedStations() });
});

app.post('/stations/:number/claim', (req, res) => {
    try {
        const stationNumber = parseStationNumber(req.params.number);
        claimStation(stationNumber, req.body.holderId);
        res.json({ occupied: getOccupiedStations() });
    } catch (err) {
        handleError(err, res);
    }
});

app.post('/stations/:number/heartbeat', (req, res) => {
    try {
        const stationNumber = parseStationNumber(req.params.number);
        heartbeatStation(stationNumber, req.body.holderId);
        res.json({ ok: true });
    } catch (err) {
        handleError(err, res);
    }
});

// Liberar nunca falha pro cliente — mesmo que a bancada já não seja mais
// dessa pessoa (perdeu a corrida, ou já expirou), o resultado desejado
// (bancada livre) já é verdade.
app.post('/stations/:number/release', (req, res) => {
    try {
        const stationNumber = parseStationNumber(req.params.number);
        releaseStation(stationNumber, req.body.holderId);
        res.json({ ok: true });
    } catch (err) {
        handleError(err, res);
    }
});

function parseStationNumber(raw: string): number {
    const stationNumber = Number(raw);
    if (!Number.isInteger(stationNumber) || stationNumber <= 0) {
        throw new HttpError(400, 'Número de bancada inválido.');
    }
    return stationNumber;
}

function handleError(err: unknown, res: express.Response): void {
    if (err instanceof HttpError) {
        res.status(err.statusCode).json({ message: err.message });
        return;
    }
    console.error(err);
    res.status(500).json({ message: 'Erro interno do servidor.' });
}

app.listen(PORT, () => {
    console.log(`Servidor do KitchenFlow rodando em http://localhost:${PORT}`);
});

// Controla quem está usando cada bancada agora — separado do "quem está
// preparando qual pedido" (isso já é o assignedStation em orders.ts).
// Aqui é só "essa bancada tem alguém logado nela neste momento ou não".
import { HttpError } from '../errors/HttpError';

// Se a bancada não renovar a posse dentro desse tempo, ela é liberada
// sozinha — cobre o caso de fechar a aba/cair a conexão sem avisar.
const HEARTBEAT_TIMEOUT_MS = 15000;

interface StationHold {
    holderId: string;
    lastHeartbeat: number;
}

const heldStations = new Map<number, StationHold>();

const isExpired = (hold: StationHold): boolean =>
    Date.now() - hold.lastHeartbeat > HEARTBEAT_TIMEOUT_MS;

const purgeExpired = (): void => {
    for (const [stationNumber, hold] of heldStations) {
        if (isExpired(hold)) heldStations.delete(stationNumber);
    }
};

export const getOccupiedStations = (): number[] => {
    purgeExpired();
    return Array.from(heldStations.keys());
};

// Reivindica a bancada pro holderId informado. Se já for o mesmo holder
// (recarregou o efeito, tentou de novo), só renova. Se for de outra
// pessoa ainda ativa, recusa com 409.
export const claimStation = (stationNumber: number, holderId: string): void => {
    purgeExpired();
    const existing = heldStations.get(stationNumber);
    if (existing && existing.holderId !== holderId) {
        throw new HttpError(409, 'Essa bancada já está sendo usada por outra pessoa.');
    }
    heldStations.set(stationNumber, { holderId, lastHeartbeat: Date.now() });
};

export const heartbeatStation = (stationNumber: number, holderId: string): void => {
    purgeExpired();
    const existing = heldStations.get(stationNumber);
    if (!existing || existing.holderId !== holderId) {
        throw new HttpError(409, 'A sessão desta bancada expirou.');
    }
    existing.lastHeartbeat = Date.now();
};

// Idempotente de propósito: liberar duas vezes, ou liberar uma bancada que
// já não é mais sua (perdeu a corrida), não deve quebrar nada no cliente.
export const releaseStation = (stationNumber: number, holderId: string): void => {
    const existing = heldStations.get(stationNumber);
    if (existing && existing.holderId === holderId) {
        heldStations.delete(stationNumber);
    }
};

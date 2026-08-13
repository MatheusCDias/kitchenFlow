// Quem está em cada bancada agora, enquanto a conexão (aba do navegador)
// continuar aberta. Some sozinho quando a conexão cai — ver server.ts.
const occupiedStations = new Map<number, string>(); // stationNumber -> socket.id

export const getOccupiedStations = (): number[] => Array.from(occupiedStations.keys());

export const claimStation = (stationNumber: number, socketId: string): boolean => {
    if (occupiedStations.has(stationNumber)) {
        return false;
    }
    occupiedStations.set(stationNumber, socketId);
    return true;
};

export const releaseStationBySocket = (socketId: string): void => {
    for (const [station, ownerId] of occupiedStations) {
        if (ownerId === socketId) {
            occupiedStations.delete(station);
            return;
        }
    }
};

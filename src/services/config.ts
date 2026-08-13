// Endereço do computador que está rodando o backend (pasta backend/).
//
// Em vez de fixar um IP (que muda de rede pra rede e de máquina pra
// máquina), a gente usa o mesmo endereço de onde a própria página foi
// carregada — se o site abriu em "http://192.168.15.11:8081" ou em
// "http://localhost:8081", o backend está no mesmo lugar, só que na
// porta 3000. Isso funciona sozinho em qualquer computador, sem precisar
// editar esse arquivo toda vez que muda de rede ou de máquina.
const SERVER_PORT = 3000;

const getServerHost = (): string => {
    if (typeof window !== 'undefined' && window.location?.hostname) {
        return window.location.hostname;
    }
    // Fallback pra quando não tem "window" (ex: rodando fora do navegador).
    return 'localhost';
};

export const SERVER_URL = `http://${getServerHost()}:${SERVER_PORT}`;

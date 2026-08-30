// Endereço do computador que está rodando o backend (pasta backend/).
//
// Em vez de fixar um IP, a gente usa o mesmo endereço de onde a própria
// página foi carregada — se o site abriu em "http://192.168.15.11:8081"
// ou em "http://localhost:8081", o backend está no mesmo lugar, só que
// na porta 3000. Funciona sozinho em qualquer computador, sem editar
// esse arquivo toda vez que muda de rede ou de máquina.
const SERVER_PORT = 3000;

const getServerHost = (): string => {
    if (typeof window !== 'undefined' && window.location?.hostname) {
        return window.location.hostname;
    }
    return 'localhost';
};

export const SERVER_URL = `http://${getServerHost()}:${SERVER_PORT}`;

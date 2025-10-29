const url = import.meta.env.VITE_APP_APIURL || window.location.origin || 'http://localhost:9000';

function safeParse(urlString: string) {
    if (URL.parse) {
        return URL.parse(urlString);
    } else {
        try {
            return new URL(urlString);
        } catch {
            return null;
        }
    }
}

const apiUrl = safeParse(url);

const isSecure = apiUrl?.protocol === 'https:';
const host = apiUrl?.hostname || 'localhost';
const port = apiUrl?.port && apiUrl.port !== '' ? parseInt(apiUrl.port, 10) : isSecure ? 443 : 80;

const PeerEnv = {
    host,
    secure: isSecure,
    peerkey: import.meta.env.VITE_APP_PEER_KEY || 'genaikey',
    port,
    apiUrl: url,
};

export default PeerEnv;

/**
 * useBiometric — Hook para autenticação biométrica via WebAuthn
 * 
 * Utiliza a Web Authentication API nativa do browser para:
 * - Detectar suporte a biometria no dispositivo
 * - Cadastrar credencial biométrica de um funcionário
 * - Autenticar via biometria sem necessidade de senha
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const RP_ID = window.location.hostname; // domínio do portal (ex: portal-tarsila.vercel.app)
const RP_NAME = 'Portal Tarsila';

// Chave no localStorage para armazenar credenciais cadastradas neste dispositivo
const LOCAL_STORAGE_KEY = 'portal_biometric_credentials';

// Estrutura armazenada localmente por dispositivo
interface LocalCredential {
    credentialId: string; // base64url
    id_func: string;
}

// ------- Helpers -------

function bufferToBase64url(buffer: ArrayBuffer | Uint8Array): string {
    const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    let str = '';
    bytes.forEach(b => (str += String.fromCharCode(b)));
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64urlToBuffer(base64url: string): Uint8Array {
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    const binary = atob(padded);
    return new Uint8Array([...binary].map(c => c.charCodeAt(0)));
}

async function fetchEdgeFunction(slug: string, body: object): Promise<Response> {
    return fetch(`${SUPABASE_URL}/functions/v1/${slug}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify(body),
    });
}

// ------- API pública do hook -------

/** Verifica se o browser e dispositivo suportam WebAuthn com autenticador de plataforma (biometria local) */
export async function checkBiometricSupport(): Promise<boolean> {
    try {
        if (typeof window === 'undefined') return false;
        if (!window.PublicKeyCredential) return false;
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        return available;
    } catch {
        return false;
    }
}

/** Retorna a credencial biométrica cadastrada neste dispositivo para o usuário, ou null */
export function getLocalCredential(id_func: string): LocalCredential | null {
    try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!raw) return null;
        const creds: LocalCredential[] = JSON.parse(raw);
        return creds.find(c => c.id_func === id_func) || null;
    } catch {
        return null;
    }
}

/** Retorna a credencial cadastrada neste dispositivo (qualquer usuário), para mostrar o botão de login */
export function getAnyLocalCredential(): LocalCredential | null {
    try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!raw) return null;
        const creds: LocalCredential[] = JSON.parse(raw);
        return creds.length > 0 ? creds[0] : null;
    } catch {
        return null;
    }
}

/** Salva credencial no localStorage */
function saveLocalCredential(cred: LocalCredential): void {
    try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        const creds: LocalCredential[] = raw ? JSON.parse(raw) : [];
        const filtered = creds.filter(c => c.id_func !== cred.id_func);
        filtered.push(cred);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    } catch {
        // silencioso
    }
}

/** Remove credencial biométrica do localStorage (para este dispositivo) */
export function removeLocalCredential(id_func: string): void {
    try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!raw) return;
        const creds: LocalCredential[] = JSON.parse(raw);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(creds.filter(c => c.id_func !== id_func)));
    } catch {
        // silencioso
    }
}

/**
 * Registra a biometria do dispositivo atual para um funcionário.
 * Deve ser chamado após login bem-sucedido com senha.
 */
export async function registerBiometric(
    id_func: string,
    userName: string,
    deviceName?: string
): Promise<{ success: boolean; error?: string }> {
    try {
        // 1. Obter challenge do servidor
        const challengeRes = await fetchEdgeFunction('webauthn-challenge', { id_func });
        const challengeData = await challengeRes.json();
        if (!challengeRes.ok) return { success: false, error: challengeData.error };

        const challengeBuffer = base64urlToBuffer(challengeData.challenge);

        // 2. Criar credencial no dispositivo (abre diálogo biométrico nativo)
        const credential = await navigator.credentials.create({
            publicKey: {
                challenge: challengeBuffer,
                rp: { id: RP_ID, name: RP_NAME },
                user: {
                    id: new TextEncoder().encode(id_func),
                    name: userName,
                    displayName: userName,
                },
                pubKeyCredParams: [
                    { type: 'public-key', alg: -7 },  // ES256
                    { type: 'public-key', alg: -257 }, // RS256
                ],
                authenticatorSelection: {
                    authenticatorAttachment: 'platform', // sensor local do dispositivo
                    userVerification: 'required',         // exige biometria
                    residentKey: 'preferred',
                },
                timeout: 60000,
                attestation: 'none',
            },
        }) as PublicKeyCredential;

        if (!credential) return { success: false, error: 'Cadastro cancelado.' };

        const response = credential.response as AuthenticatorAttestationResponse;

        // 3. Enviar credencial ao servidor
        const registerRes = await fetchEdgeFunction('webauthn-register', {
            id_func,
            device_name: deviceName || getDeviceName(),
            credential: {
                id: credential.id,
                rawId: bufferToBase64url(credential.rawId),
                type: credential.type,
                response: {
                    clientDataJSON: bufferToBase64url(response.clientDataJSON),
                    attestationObject: bufferToBase64url(response.attestationObject),
                },
            },
        });

        const registerData = await registerRes.json();
        if (!registerRes.ok) return { success: false, error: registerData.error };

        // 4. Salvar referência local
        saveLocalCredential({ credentialId: credential.id, id_func });

        return { success: true };
    } catch (err: any) {
        if (err.name === 'NotAllowedError') {
            return { success: false, error: 'Cadastro cancelado pelo usuário.' };
        }
        return { success: false, error: err.message || 'Erro inesperado.' };
    }
}

/**
 * Autentica o usuário via biometria.
 * Retorna os dados do usuário (mesmo formato do login por senha).
 */
export async function authenticateWithBiometric(
    credentialId: string,
    id_func: string
): Promise<{ user?: any; error?: string }> {
    try {
        // 1. Obter challenge do servidor
        const challengeRes = await fetchEdgeFunction('webauthn-challenge', { id_func });
        const challengeData = await challengeRes.json();
        if (!challengeRes.ok) return { error: challengeData.error };

        const challengeBuffer = base64urlToBuffer(challengeData.challenge);

        // 2. Solicitar assinatura biométrica ao dispositivo
        const assertion = await navigator.credentials.get({
            publicKey: {
                challenge: challengeBuffer,
                rpId: RP_ID,
                allowCredentials: [{
                    type: 'public-key',
                    id: base64urlToBuffer(credentialId),
                    transports: ['internal'],
                }],
                userVerification: 'required',
                timeout: 60000,
            },
        }) as PublicKeyCredential;

        if (!assertion) return { error: 'Autenticação cancelada.' };

        const response = assertion.response as AuthenticatorAssertionResponse;

        // 3. Verificar assinatura no servidor
        const verifyRes = await fetchEdgeFunction('webauthn-verify', {
            credential: {
                id: assertion.id,
                rawId: bufferToBase64url(assertion.rawId),
                type: assertion.type,
                response: {
                    clientDataJSON: bufferToBase64url(response.clientDataJSON),
                    authenticatorData: bufferToBase64url(response.authenticatorData),
                    signature: bufferToBase64url(response.signature),
                    userHandle: response.userHandle ? bufferToBase64url(response.userHandle) : null,
                },
            },
        });

        const verifyData = await verifyRes.json();
        if (!verifyRes.ok) return { error: verifyData.error };

        return { user: verifyData.user };
    } catch (err: any) {
        if (err.name === 'NotAllowedError') {
            return { error: 'Autenticação cancelada pelo usuário.' };
        }
        return { error: err.message || 'Erro inesperado.' };
    }
}

/** Detecta um nome amigável para o dispositivo atual */
function getDeviceName(): string {
    const ua = navigator.userAgent;
    if (/iPhone/.test(ua)) return 'iPhone';
    if (/iPad/.test(ua)) return 'iPad';
    if (/Android/.test(ua)) return 'Android';
    if (/Mac/.test(ua)) return 'Mac';
    if (/Windows/.test(ua)) return 'Windows';
    return 'Dispositivo';
}

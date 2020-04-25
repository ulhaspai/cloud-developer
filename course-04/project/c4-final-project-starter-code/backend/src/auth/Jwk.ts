export interface Jwk {
    alg: string;
    kty: string;
    use: string;
    n: string;
    e: string;
    kid: string;
    x5t: string;
    x5c: Array<string>;
}

export interface SigningKey {
    kid: string
    nbf: string
    publicKey: string
}

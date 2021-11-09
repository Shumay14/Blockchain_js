import canonicalizeData from 'canonicalize'

export interface JWTHeader {
  typ: 'JWT'
  alg: string
}

// issuer, subject, audience, issued at, Not Before, expiration
export interface JWTPayload {
  iss?: string              
  sub?: string
  aud?: string | string[]
  iat?: number
  nbf?: number
  exp?: number
  
}

// JWTSigniture is JWS = encode JWT header + payload
export interface JWTSigniture {
  siginture: string
}



export async function createJWT(
  header: Partial<JWTHeader>,
  payload: Partial<JWTPayload>

  
): Promise<string> {

  const timestamps: Partial<JWTPayload> = {
    iat: Math.floor(Date.now() / 1000),
    exp: undefined,
  }
  const fullPayload = { ...timestamps, ...payload, iss: issuer }
  return createJWS(fullPayload, signer, header)
}

export interface JWTDecoded {
  header: JWTHeader
  payload: JWTPayload
  signature: string
  data: string
}

export function decodeJWT(jwt: string): JWTDecoded {
  if (!jwt) throw new Error('invalid_argument: no JWT passed into decodeJWT')
  try {
    const jws = decodeJWS(jwt)
    const decodedJwt: JWTDecoded = Object.assign(jws, { payload: JSON.parse(decodeBase64url(jws.payload)) })
    return decodedJwt
  } catch (error) {
    throw new Error('invalid_argument: Incorrect format JWT')
  }
}




const defaultAlg = 'ES256K'
const DID_JSON = 'application/did+json'

function encodeSection(data: any, shouldCanonicalize = false): string {
  if (shouldCanonicalize) {
    return encodeBase64url(<string>canonicalizeData(data))
  } else {
    return encodeBase64url(JSON.stringify(data))
  }
}









const claim = JSON.stringify({ ... }); // Data representing the user's access
const proof = sign(claim); // Sign data with Ethereum's `personal_sign` method
const DIDToken = btoa(JSON.stringify([proof, claim]));


// Construct the user's claim
const claim = JSON.stringify({
  iat: Math.floor(Date.now() / 1000),
  ext: Math.floor(Date.now() / 1000) + lifespan,
  iss: `did:ethr:${user_public_address}`,
  sub: subject,
  aud: audience,
  nbf: Math.floor(Date.now() / 1000),
  tid: uuid(),
});

// Sign the claim with the user's private key
// (this way the claim is verifiable and impossible to forge).
const proof = sign(claim);

// Encode the DIDToken so it can be transported over HTTP.
const DIDToken = btoa(JSON.stringify([proof, claim]));
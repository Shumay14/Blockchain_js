// convert data into canonical(standard or normal) format
import canonicalizeData from 'canonicalize'
import { decodeBase64url, encodeBase64url } from './util'



export type Signer = (data: string | Uint8Array) => Promise<string>
export type SignerAlgorithm = (payload: string, signer: Signer) => Promise<string>


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
// export interface JWTSigniture {
//   siginture: string
// }


export interface JWTData {

}


export interface JWTDecoded {
  header: JWTHeader
  payload: JWTPayload
  signature: string
  data: string
}


export async function createJWT(
  header: Partial<JWTHeader>,
  payload: Partial<JWTPayload>,
  signer: Signer 
  
): Promise<string> {

  const timestamps: Partial<JWTPayload> = {
    iat: Math.floor(Date.now() / 1000),
    exp: undefined,
  }
  const fullPayload = { ...timestamps, ...payload, iss: issuer }
  return createJWS(fullPayload, signer, header)
}

export async function createJWS(
  payload: string | Partial<JWTPayload>,
  signer: Signer,
  header: Partial<JWTHeader> = {},
  options: JWSCreationOptions = {}
): Promise<string> {
  if (!header.alg) header.alg = defaultAlg
  const encodedPayload = typeof payload === 'string' ? payload : encodeSection(payload, options.canonicalize)
  const signingInput: string = [encodeSection(header, options.canonicalize), encodedPayload].join('.')

  const jwtSigner: SignerAlgorithm = SignerAlg(header.alg)
  const signature: string = await jwtSigner(signingInput, signer)
  return [signingInput, signature].join('.')
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

// signer redeclared...
const signer = ES256KSigner(process.env.PRIVATE_KEY)
const jws = await createJWS({ my: 'payload' }, signer)


const defaultAlg = 'ES256K'
const DID_JSON = 'application/did+json'

function encodeSection(data: any, shouldCanonicalize = false): string {
  if (shouldCanonicalize) {
    return encodeBase64url(<string>canonicalizeData(data))
  } else {
    return encodeBase64url(JSON.stringify(data))
  }
}




const audAddress = '0x20c769ec9c0996ba7737a4826c2aaff00b1b2040'
const aud = `did:ethr:${audAddress}`
const address = '0xf3beac30c498d9e26865f34fcaa57dbb935b0d74'
const did = `did:ethr:${address}`
const alg = 'ES256K'

const privateKey = '278a5de700e29faae8e40e366ec5012b5ec63d36ec77e8a2417154cc1d25383f'
const publicKey = '03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479'
const verifier = new TokenVerifier(alg, publicKey)
const signer = ES256KSigner(privateKey)
const recoverySigner = ES256KSigner(privateKey, true)

const didDocLegacy = {
  '@context': 'https://w3id.org/did/v1',
  id: did,
  publicKey: [
    {
      id: `${did}#keys-1`,
      type: 'Secp256k1VerificationKey2018',
      owner: did,
      publicKeyHex: publicKey,
    },
  ],
  authentication: [
    {
      type: 'Secp256k1SignatureAuthentication2018',
      publicKey: `${did}#keys-1`,
    },
  ],
}

const didDoc = {
  didDocument: {
    '@context': 'https://w3id.org/did/v1',
    id: did,
    verificationMethod: [
      {
        id: `${did}#keys-1`,
        type: 'EcdsaSecp256k1VerificationKey2019',
        controller: did,
        publicKeyHex: publicKey,
      },
    ],
    authentication: [`${did}#keys-1`],
    assertionMethod: [`${did}#keys-1`],
    capabilityInvocation: [`${did}#keys-1`],
    capabilityDelegation: [`${did}#some-key-that-does-not-exist`],
  },
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
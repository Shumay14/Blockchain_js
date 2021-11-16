// convert data into canonical(standard or normal) format
import canonicalizeData from 'canonicalize'

import { decodeBase64url, encodeBase64url } from './util'


const defaultAlg = 'ES256K'


// export type getVC = string
export type publicKey = string
// export type rawData = string

export interface JWTHeader {
  typ: 'JWT'
  alg: string
}
  
  
// issuer, subject, audience, issued at, Not Before, expiration
export interface JWTPayload {
  title?: string              
  sub?: string
  data?: string //encrypt data
}


// create jwt-did-vc
export async function createVC(
    header: Partial<JWTHeader>,
    payload: string | Partial<JWTPayload>,

): Promise<string> {
    if (!header.alg) header.alg = defaultAlg
    const encodedPayload = typeof payload === 'string' ? payload : encodeSection(payload)
    const endcodedHeader: string = [encodeSection(header), encodedPayload].join('.')
  
    return [endcodedHeader, encodedPayload].join('.')
}



export async function createVP(
    header: Partial<JWTHeader>,
    payload: string | Partial<JWTPayload>,
    pubKey: publicKey,
    rawData: string,

): Promise<string> {
  const VC = createVC(header, payload)
  
  return [VC, rawData, pubKey].join('.')
}


function encodeSection(data: any, shouldCanonicalize = false): string {
    if (shouldCanonicalize) {
      return encodeBase64url(<string>canonicalizeData(data))
    } else {
      return encodeBase64url(JSON.stringify(data))
    }
  }


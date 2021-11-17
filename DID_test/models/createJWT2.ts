// convert data into canonical(standard or normal) format
import canonicalizeData from 'canonicalize'
import { encodeBase64url } from './util'

const defaultAlg = 'X25519_XSalsa20_Poly1305'

// export type getVC = string
// export type publicKey = string
// export type rawData = string

export interface JWTHeader {
  typ: 'JWT'
  alg: string
}
  
// issuer, subject, audience, issued at, Not Before, expiration
export interface JWTPayload {   
  sub?: string // 해당 VC의 주인
  title?: string // VC 항목명
  data?: string // encrypt data
}

export interface JWTSignature {   
  rawData?: string // 개인정보의 원본
  pubKey?: string // 원본을 암호화 한 설문 의뢰자의 공개키
}

// create jwt-did-vc
// return aaaa.bbbb
export function createVC(
    header: Partial<JWTHeader>,
    payload: string | Partial<JWTPayload>,

): string{
    if (!header.alg) header.alg = defaultAlg

    // encodeSection == Base64 Encode Function, 사용자 정의 함수
    const endcodedHeader: string = encodeSection(header)
    const encodedPayload: string = encodeSection(payload) 
    
    return [endcodedHeader, encodedPayload].join('.')
}


// create jwt-did-vp
// return aaaa.bbbb.cccc
export function createVP(
    header: Partial<JWTHeader>,
    payload: string | Partial<JWTPayload>,
    signature: string | Partial<JWTSignature>
): string {
  return [header, payload, signature].join('.')
}


function encodeSection(data: any, shouldCanonicalize = false): string {
    if (shouldCanonicalize) {
      return encodeBase64url(<string>canonicalizeData(data))
    } else {
      return encodeBase64url(JSON.stringify(data))
    }
}



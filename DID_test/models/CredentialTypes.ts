import { Signer,  JWTHeader } from './createJWT'

export const JWT_ALG = 'ES256K'
// export const DID_FORMAT = /^did:([a-zA-Z0-9_]+):([:[a-zA-Z0-9_.-]+)(\/[^#]*)?(#.*)?$/
// export const JWT_FORMAT = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
export const DEFAULT_CONTEXT = 'https://www.w3.org/2018/credentials/v1'
export const DEFAULT_VC_TYPE = 'VerifiableCredential'
export const DEFAULT_VP_TYPE = 'VerifiablePresentation'
export const DEFAULT_JWT_PROOF_TYPE = 'JwtProof2020'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JwtCredentialSubject = Record<string, any>

export interface CredentialStatus {
  id: string
  type: string
}

/**
 * A JWT payload representation of a Credential
 * @see https://www.w3.org/TR/vc-data-model/#jwt-encoding
 */
export interface JwtCredentialPayload {
  iss?: string
  sub?: string
  vc: Extensible<{
    '@context': string[] | string
    type: string[] | string
    credentialSubject: JwtCredentialSubject
    credentialStatus?: CredentialStatus
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    evidence?: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    termsOfUse?: any
  }>
  nbf?: number
  aud?: string | string[]
  exp?: number
  jti?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any
}

/**
 * A JWT payload representation of a Presentation
 * @see https://www.w3.org/TR/vc-data-model/#jwt-encoding
 */
export interface JwtPresentationPayload {
  vp: Extensible<{
    '@context': string[] | string
    type: string[] | string
    verifiableCredential?: VerifiableCredential[] | VerifiableCredential
  }>
  iss?: string
  aud?: string | string[]
  nbf?: number
  exp?: number
  jti?: string
  nonce?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any
}

export type IssuerType = Extensible<{ id: string }> | string
export type DateType = string | Date

type Extensible<T> = T & { [x: string]: any }
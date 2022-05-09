import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
// import Axios from 'axios'
// import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
// const jwksUrl = '...'

const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJIenVyk1KtcPPMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi1pNzY1cHl1dC51cy5hdXRoMC5jb20wHhcNMjIwNTA3MjAxMjE2WhcN
MzYwMTE0MjAxMjE2WjAkMSIwIAYDVQQDExlkZXYtaTc2NXB5dXQudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr1X1eHcjlkOETDF4
whtqaVKkIzBY2nririvHC7sBNfmh6P/qrgOXwvtgS35Pt6Fy4H1V2VMRz28ssY3I
Zl7ZyE4pRkofTxlwqY+0UdG2JjycDvv4PylSHGPRp87PFauMJatmm6KcjO/XmnDQ
842zbl58ykj/NxcfuKirabyHtGINhUZcbvi7LGbmEFO99BAzSnaD2tlq104C5QhG
LD1zVJO/ABWFwq6taHb/VTnyujxq9Nz24VFr/hBD7X4MjZ62KKHz2FN6X1aiFate
aCbB08Xt0kB77EcOaqaC0qxoiz7mioPxdWDT7ty2m0TXBXmdlLoxCRCCE8ZkL1k3
dh2SBwIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTc0qwGAW5D
h0d6XrZyiPmWUTrBSzAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AA61NfsAxXNPLu9e1KltWPggYh3316eT6FKx2MwTYsUyw8LBebxdwxBcG5TkM4sb
aKZfZ4riSt4Q+UCFwmyWwAQGr3xn1bKBUFOK3vrDoW3VK00tp0AytJbmFRjiexop
441KVD383P1mUIDewDMHq6K5Ea9zvZsi3FCtme13zgY1TG0PwJE9ekWMZoCmhzYR
n7LhhFw1xhzcMH8DJdRfc+E5PGSMTs++1P0XulYNZ2QwCY3vQtCaEK6Eju6auGwc
ovsR4OoUGDD9DbTcDE+om+rZ1NE+7HZd3VA902zPEAMPPgnd0jl/KDrieZo8Uzkr
TJzcgpLQ605SGFnI9AJCrgs=
-----END CERTIFICATE-----`

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  // const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

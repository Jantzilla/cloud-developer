// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '44xsd02b5i'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-i765pyut.us.auth0.com',            // Auth0 domain
  clientId: '7RDKpRnQ4UKxZoCTL7PjWSTz7qhlLq1v',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}

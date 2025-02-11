const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const COGNITO_REGION = 'us-east-1'
const COGNITO_USER_POOL_ID = process.env.USER_POOL_ID
const COGNITO_APP_CLIENT_ID = process.env.CLIENT_ID

const JWKS_URI = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}/.well-known/jwks.json`;

const client = jwksClient({
  jwksUri: JWKS_URI,
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 10
});

function getKey(header, callback) {
  const kid = header.kid;

  client.getSigningKey(kid, (err, key) => {
    if (err) {
      console.error('Erro ao obter a chave de assinatura:', err);
      callback(err, null);
    } else {
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    }
  });
}

const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {};

  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {
      Version: '2012-10-17',
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource
      }]
    };
    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
};

exports.handler = async (event) => {
  const token = event.authorizationToken;

  const response = (principalId, effect, resource) => {
    return generatePolicy(principalId, effect, resource);
  };

  if (!token) {
    console.error('Token ausente');
    return response('user', 'Deny', event.methodArn);
  }

  const tokenParts = token.split(' ');
  if (tokenParts[0].toLowerCase() !== 'bearer' || tokenParts.length !== 2) {
    console.error('Formato de token inválido');
    return response('user', 'Deny', event.methodArn);
  }

  const actualToken = tokenParts[1];

  return new Promise((resolve, reject) => {
    jwt.verify(actualToken, getKey, {
      algorithms: ['RS256'],
      issuer: `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}`,
      client_id: COGNITO_APP_CLIENT_ID
    }, (err, decoded) => {
      if (err) {
        console.error('Token inválido:', err.message);
        resolve(response('user', 'Deny', event.methodArn));
      } else {
        resolve(response(decoded.sub, 'Allow', event.methodArn));
      }
    });
  });
};
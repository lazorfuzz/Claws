const SSE = require('express-sse');
const providers = require('./providers');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

function login(req, res) {
    // check if the client ID is valid
    const clientIsValid = req.body.clientID === process.env.SECRET_CLIENT_ID;
    if (!clientIsValid) return res.status(401).json({ auth: false, token: null });

    // create a token
    const token = jwt.sign({id: 'ApolloTV', message: 'This better be from our app...'}, process.env.SECRET_SERVER_ID, {
      expiresIn: 86400 // expires in 24 hours
    });

    // return the information including token as JSON
    res.json({auth: true, token});
}

function verifyToken(req, res, next) {
  // check header or url parameters or post parameters for token
  const token = req.headers['x-access-token'] || req.body.token || req.query.token;
  if (!token) return res.status(403).json({auth: false, message: 'No token provided.'});

  // verifies secret and checks exp
  jwt.verify(token, process.env.SECRET_SERVER_ID, (err, decoded) => {
    if (err) return res.status(500).json({auth: false, message: 'Failed to authenticate token.'});

    // if everything is good, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });
}

function authenticated(req, res, next) {
  // check header or url parameters or post parameters for token
  const token = req.headers['x-access-token'] || req.body.token || req.query.token;
  if (!token) return res.json({auth: false, message: 'No token provided.'});

  // verifies secret and checks exp
  jwt.verify(token, process.env.SECRET_SERVER_ID, (err, decoded) => {
    if (err) return res.json({auth: false, message: 'Failed to authenticate token.'});

    // if everything is good, save to request for use in other routes
    res.json({auth: true, message: 'Token is valid'});
  });
}

function searchMovies(req, res) {
    const sse = new SSE();
    sse.init(req, res);

    for (let provider of [...providers.movies, ...providers.universal]) {
        provider(req, sse);
    }
}

function searchTv(req, res) {
    const sse = new SSE();
    sse.init(req, res);

    for (let provider of [...providers.tv, ...providers.universal]) {
        provider(req, sse);
    }
}

exports.login = login;
exports.verifyToken = verifyToken;
exports.authenticated = authenticated;

exports.searchMovies = searchMovies;
exports.searchTv = searchTv;

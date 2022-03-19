const JWT = require('jsonwebtoken');
const client = require('../helpers/connect_redis');
const signAccessToken = async (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {
      userId,
    };
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: '1h',
    };
    JWT.sign(payload, secret, options, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};
const verifyAccessToken = async (req, res, next) => {
  const Authorization = req.headers['authorization'];
  if (!req.headers['authorization']) {
    return res.status(403).json({ error: { message: 'Unauthorized!!!!' } });
  }
  // const authHeader = Authorization;
  // const bearerToken = authHeader.split(' ');
  // const token = bearerToken[1];
  await JWT.verify(
    Authorization,
    process.env.ACCESS_TOKEN_SECRET,
    (err, payload) => {
      if (err) {
        if (err.name === 'JsonWebTokenError') {
          return res.status(403).json({ error: { message: 'Unauthorized' } });
        }
        return res.status(401).json({ error: { message: err.message } });
      }
      req.payload = payload;
      setTimeout(() => {
        next();
      }, 400);
    }
  );
};
const signRefreshToken = async (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {
      userId,
    };
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: '1y',
    };
    JWT.sign(payload, secret, options, (err, token) => {
      if (err) reject(err);
      client.set(
        userId.toString(),
        token,
        'EX',
        365 * 24 * 60 * 60,
        (err, reply) => {
          if (err) return reject(err);
          resolve(token);
        }
      );
    });
  });
};
const verifyRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    JWT.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, payload) => {
        if (err) {
          return reject(err);
        }
        client.get(payload.userId, (err, reply) => {
          if (err) return reject(err);
          if (refreshToken === reply) {
            return resolve(payload);
          }
          return reject(err);
        });
      }
    );
  });
};
module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};

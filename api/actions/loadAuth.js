import get from 'lodash/get';
import jwt from 'jsonwebtoken';
import User from '../models/user';

export default function loadAuth(req) {
  const authorization = get(req, 'headers.authorization');
  let token;
  if (authorization) {
    token = authorization.split(' ')[1];
    return new Promise((resolve, reject) => {
      jwt.verify(token, 'chu hoang son', (err, decoded) => {
        if (err) {
          return reject({
            status: 400,
            message: 'Access token is invalid'
          });
        }

        return User.findOne({ _id: decoded._id })
          .then(resolve);
      });
    });
  }

  return Promise.resolve(req.user || null);
}

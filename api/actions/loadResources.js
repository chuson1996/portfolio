import get from 'lodash/get';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import PrivateResource from '../models/privateResource';
// import PendingTag from '../models/pendingTag';
// import differenceBy from 'lodash/differenceBy';
// import getMetaData from './getMetaData';

// This api is only available for registered users
export default async function saveResource(req) {
  const authorization = get(req, 'headers.authorization');
  let token;
  let user;
  if (authorization) {
    token = authorization.split(' ')[1];
    user = await new Promise((resolve, reject) => {
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

  if (!user) {
    user = req.user;
  }

  /* Check if user is in session */
  if (!user) {
    return Promise.reject({
      status: 401,
      message: 'Unauthorized'
    });
  }

  /* Create resource */
  return PrivateResource.find({ creator: user._id })
    .exec();
}

import jwt from 'jsonwebtoken';
import SessionCode from '../models/sessionCode';

export default function createAccessToken(req) {
  const code = req.body.code;
  /* Validate code */

  return SessionCode.findOne({ code, activated: false })
    .populate('user')
    .then((sessionCode) => {
      if (!sessionCode) {
        return Promise.reject({
          status: 400
        });
      }

      sessionCode.activate();

      const { _id, email, displayName, avatarUrl } = sessionCode.user;

      const token = jwt.sign({ _id, email, displayName, avatarUrl }, 'chu hoang son', {
        expiresIn: 60 * 60 * 24
      });
      return token;
    });
}

import Suggestion from '../models/suggestion';

export default function postSuggestion(req) {
  if (!req.body) {
    return Promise.reject({
      status: 404,
      message: 'Not Found'
    });
  }

  const { url, tags, email } = req.body;
  if (!url) {
    return Promise.reject({
      status: 400,
      message: 'Bad request'
    });
  }

  return new Suggestion({ url, tags, email }).save();
}

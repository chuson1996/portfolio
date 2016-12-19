import get from 'lodash/get';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import PrivateResource from '../models/privateResource';
import PendingTag from '../models/pendingTag';
import differenceBy from 'lodash/differenceBy';
import getMetaData from './getMetaData';

// POST
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

  const { body } = req;
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

  /* Validate payload */
  if (!body ||
    !body.tags || !body.tags.length ||
    !body.resourceUrl) {
    return Promise.reject({
      status: 400,
      message: 'Bad Request'
    });
  }

  // console.log(body);

  /* Create resource */
  const privateResource = new PrivateResource({
    url: body.resourceUrl,
    tags: body.tags,
    creator: user._id,
    createdAt: Date.now()
  });

  const getMetaDataPromise = getMetaData({ query: {
    url: body.resourceUrl
  }}).then(({ title, description }) => {
    privateResource.title = title;
    privateResource.description = description;
  });

  /* Create pending tags */
  return PendingTag.find()
    .where('name').in(body.tags)
    .where('creator').equals(user._id)
    .populate('resources')
    .exec()
    .then((existingTags) => {
      // console.log('existingTags', existingTags);
      let allTags = [];

      existingTags.forEach((tag) => {
        tag.resources = [...tag.resources, privateResource];
        tag.creator = user._id;
      });

      allTags = [...existingTags];

      if (existingTags.length < body.tags.length) {
        /* There is new tag(s) */
        let newTags = differenceBy(
          body.tags.map((name) => ({ name })),
          existingTags,
          'name');

        newTags = newTags.map((tag) => new PendingTag({
          name: tag.name,
          resources: [privateResource],
          creator: user._id
        }));
        // console.log(newTags);
        allTags = [...allTags, ...newTags]; // Contains Mongoose PendingTag Models
      }

      privateResource._tags = allTags;

      return getMetaDataPromise.then(() => Promise.all([
        privateResource.save(),
        ...allTags.map((tag) => tag.save())
      ]).then(() => 'OK'));
    });
}

import PendingResource from '../models/pendingResource';
import PendingTag from '../models/pendingTag';
import differenceBy from 'lodash/differenceBy';
import getMetaData from './getMetaData';

// POST
export default function saveResource({ body, user }) {
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
  const pendingResource = new PendingResource({
    url: body.resourceUrl,
    tags: body.tags,
    creator: user._id,
    createdAt: Date.now()
  });

  const getMetaDataPromise = getMetaData({ query: {
    url: body.resourceUrl
  }}).then(({ title, description }) => {
    pendingResource.title = title;
    pendingResource.description = description;
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
        tag.resources = [...tag.resources, pendingResource];
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
          resources: [pendingResource],
          creator: user._id
        }));
        // console.log(newTags);
        allTags = [...allTags, ...newTags]; // Contains Mongoose PendingTag Models
      }

      pendingResource._tags = allTags;

      return getMetaDataPromise.then(() => Promise.all([
        pendingResource.save(),
        ...allTags.map((tag) => tag.save())
      ]).then(() => 'OK'));
    });
}

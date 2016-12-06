import '../models/resource';
import Tag from '../models/tag';
import PendingTag from '../models/pendingTag';
import union from 'lodash/union';

export default async function loadTags(req) {
  if (req.query.tag) {
    let resources = [];
    /* Find resources based on a single tag */
    const result = await Tag.findOne({ name: req.query.tag })
      .where('name').in([ req.query.tag ])
      .populate('resources')
      .exec();

    if (req.user) {
      const pendingResult = await PendingTag
        .findOne({ name: req.query.tag })
        .where('creator', req.user._id)
        .populate('resources')
        .exec();

      if (pendingResult) {
        resources = [
          ...resources,
          ...pendingResult.resources,
        ];
      }
    }

    if (result && result.resources) {
      resources = [
        ...resources,
        ...result.resources
      ];
    }

    if (!resources.length) {
      return Promise.reject({
        status: 400,
        message: 'Tag is not existed',
        tag: req.query.tag
      });
    }
    return {
      name: req.query.tag,
      resources
    };
  }

  const allTags = await Tag.find().exec();
  if (req.user) {
    const pendingTags = await PendingTag.find()
      .where('creator', req.user._id)
      .exec();
    return union(
      allTags.map((tag) => tag.name),
      pendingTags.map((tag) => tag.name)
    );
  }
  /* Get all tags */
  return allTags.map((tag) => tag.name);
}

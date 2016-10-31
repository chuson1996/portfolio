import '../models/resource';
import Tag from '../models/tag';

export default async function loadTags(req) {
  if (req.query.tag) {
    const result = await Tag.find({ name: req.query.tag })
      .where('name').in([ req.query.tag ])
      .populate('resources')
      .exec();

    if (!result.length) {
      return Promise.reject({
        status: 400,
        message: 'Tag is not existed',
        tag: req.query.tag
      });
    }
    return result[0];
  }

  const allTags = await Tag.find().exec();
  return allTags.map((tag) => tag.name);
}

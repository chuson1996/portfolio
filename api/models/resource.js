import mongoose from 'mongoose';
import Tag from './tag';
import Author from './author';
import reject from 'lodash/reject';
import includes from 'lodash/includes';
import Promise from 'bluebird';
mongoose.Promise = Promise;

const resourceSchema = new mongoose.Schema({
  title: String,
  author: String,
  description: String,
  _author: {
    type: Number,
    ref: 'Author'
  },
  tags: [String],
  _tags: [{
    type: Number,
    ref: 'Tag'
  }],
  url: String
});

resourceSchema.pre('save', async function preSave(next) {
  const resource = this;

  const tagPromise = async () => {
    /* Tags */
    const resourceTags = this.tags;
    const foundTags = await Tag.find()
      .populate('resources')
      .where('name').in(resourceTags)
      .exec();

    const unavailableTags = reject(
      resourceTags,
      (rTag) => includes(foundTags.map((fTag) => fTag.name), rTag)
    ).map((uTag) => new Tag({ name: uTag }));

    const allTags = [...unavailableTags, ...foundTags];

    for (const tag of allTags) {
      tag.resources = [...tag.resources, resource];
      await tag.save();
    }
    resource._tags = allTags;
  };

  const authorPromise = async () => {
    /* Author */
    const resourceAuthor = this.author;
    let author = await Author.where({ name: resourceAuthor })
      .findOne()
      .populate('resources')
      .exec();

    if (!author) author = new Author({ name: resourceAuthor });
    author.resources = [...author.resources, resource];
    this._author = author;
    await author.save();
  };

  await Promise.all([tagPromise(), authorPromise()]);
  /* Next */
  next();
});

export default mongoose.model('Resource', resourceSchema);

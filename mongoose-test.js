import mongoose from 'mongoose';
import Resource from './api/models/resource';
import resourcesJson from './resources.json';

mongoose.connect('mongodb://localhost:27017/codeadvisor');

(async () => {
  try {
    for (let i = 0; i < resourcesJson.length; i++) {
      const resource = resourcesJson[i];
      await new Resource({
        title: resource.title,
        tags: resource.tags,
        url: resource.url,
        description: resource.description
      }).save();
      console.log(`${Math.floor((i + 1) / resourcesJson.length * 100)} %`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
})();


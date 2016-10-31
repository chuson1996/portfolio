const MetaInspector = require('node-metainspector');

export default function getMetaData(req) {
  return new Promise((resolve, reject) => {
    try {
      const client = new MetaInspector(
        req.query.url,
        { timeout: 5000 }
      );

      client.on('fetch', () => {
        const { description, title, author, keywords, rootUrl } = client;
        resolve({ description, title, author, keywords, rootUrl });
      });

      client.on('error', () => {
        // console.log(err);
        reject({
          status: 404,
          message: `Metadata not found`
        });
      });

      client.fetch();
    } catch (error) {
      reject({
        status: 404,
        message: `Metadata not found`
      });
    }
  });
}

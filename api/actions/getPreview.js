const MetaInspector = require('node-metainspector');

export default function getPreview(req) {
  const { url } = req.query;
  if (!url) {
    return Promise.reject({
      status: 400,
      message: 'Url is not specified'
    });
  }

  return new Promise((resolve, reject) => {
    const client = new MetaInspector(
      url,
      { timeout: 5000 }
    );

    client.on('fetch', () => {
      resolve({
        description: client.description,
        title: client.title
      });
    });

    client.on('error', (/* err */) => {
      // console.log(err);
      reject({
        status: 500
      });
    });

    client.fetch();
  });
}

export const handler = async (event) => {
  const userAgent = event.headers ? event.headers['User-Agent'] || '' : '';
  // User Agent Pattern matching "PostmanRuntime/*"
  if (/^PostmanRuntime\/.*/.test(userAgent)) {
      const response = {
          statusCode: 200,
          headers: {
              'PHPerKaigi-2024': '#API-COLLABORATION'
          },
          body: 'Good Job!'
      };
      return response;
  }
  const response = {
      statusCode: 200,
      body: 'Postmanを使ってね。ダウンロードはこちらから: https://www.postman.com/downloads/'
  };
  return response;
};

var axios = require("axios");

export default async function resolveAddress (domain) {
  var config = {
    method: "get",
    url: `https://resolve.unstoppabledomains.com/reverse/${domain}`,
    headers: {
      Authorization: "Bearer d0544251-3630-4cc5-9fa1-abc098688791",
    },
  };
  try {
    const response = await axios(config);
    console.log('response: ',response);
    return response;
  } catch (error) {
    return error;
  }
}

//resolve('brad.crypto', 'ETH');
//resolve('brad.zil', 'ZIL');

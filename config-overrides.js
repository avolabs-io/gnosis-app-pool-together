module.exports = {
  webpack(config) {
    return config;
  },
  jest(config) {
    return config;
  },
  devServer(configFunction) {
    // eslint-disable-next-line func-names
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);

      config.headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      };

      return config;
    };
  },
  paths(paths) {
    return paths;
  },
};

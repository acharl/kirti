module.exports = {
  // Uncommenting the defaults below 
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks;
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  compilers: {
    solc: {
      version: "0.5.9",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  },
  networks: {
    development: {
      host: "localhost",
      port: 9545,
      network_id: "*",

    },
    test: {
      host: "localhost",
      port: 9545,
      network_id: "*"
    }
  }

};


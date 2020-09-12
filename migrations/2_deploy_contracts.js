const kirti = artifacts.require("Kirti");
// const example = artifacts.require("Example");

const sla = artifacts.require("SLA");

module.exports = function (deployer) {
  deployer.deploy(kirti);
  // deployer.deploy(example);

  deployer.deploy(sla);
};

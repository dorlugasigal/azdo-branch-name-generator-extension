const { merge } = require("webpack-merge");
const config = require("./webpack.base.js");

module.exports = merge(config, {
  mode: "production",
});

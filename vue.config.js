const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  devServer: {
    port: 9999,     // 端口
  },
  lintOnSave: false,
  chainWebpack: config => {
    config.resolve.alias
      .set("@", resolve("src"))
      .set("assets", resolve("src/assets"))
      .set("styles", resolve("src/assets/styles"))
      .set("components", resolve("src/components"))
      .set("common", resolve("src/common"))
      .set("layout", resolve("src/layout"))
      .set("base", resolve("src/base"))
      .set("api", resolve("src/api"))
      .set("static", resolve("src/static"));
  }
};

const fs = require("fs-extra");
const buildPath = process.env.BUILD_PATH || "dist";
const appPublic = process.env.BUILD_PATH || "public";
function copyPublicFolder() {
  fs.copySync(appPublic, buildPath, {
    dereference: true,
  });
}

copyPublicFolder();

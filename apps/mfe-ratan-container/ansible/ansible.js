const { execSync } = require('child_process');

const ansibleVersion = process.env.npm_config_ansible ?? "";
const loadScript = `wget -O ./ansible.zip https://artifactory.global.standardchartered.com/artifactory/generic-release/com/scb/ratanone-devops/ratan-frontend-ansible/ansible-${ansibleVersion}.zip`;
const unzip = `rm -rf ./ado-playbooks && unzip -d ./ado-playbooks ./ansible.zip`;

try {
  const loadScriptMsg = execSync(loadScript);
  console.info(loadScriptMsg.toString());

  const unzipMsg = execSync(unzip);
  console.info(unzipMsg.toString());
} catch (e) {
  console.warn("ERR:", e.toString());
  process.exit();
}

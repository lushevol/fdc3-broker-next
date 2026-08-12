Open the job  "ratan_frontend_ansible_deployment" under RATAN project, manually input all the job parameters as below:

REMEDY_TICKET_NO: CTASK1290062
ansible_playbook_name: ado_mfe_deploy.yaml
ansible_pkg_version: 20240618.2
ansible_parameters: app_name=mfe-root-config,app_version=1.5.1-production-20241029.2
targets: local
bastion_machine: webserver_ratan
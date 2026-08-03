# Notification Progress API
You can deploy the notification-progress-api with sb-notification image to your own namespace.
then allow you save notification request to your own database.
Details: [Notification Architecture](https://confluence.global.standardchartered.com/display/SERVICEBENCH/Send+Notification)

# How to Deploy
## Create schema in your database
please create schema **"sb_notification"** in your database.
if you want to use other schema, please replace the schema name in sql file
## Setup tables via SQL
please set up table with **sql** folder 
## Configure parameters for image
please go to **env** folder to configure the parameters.
* Database connection Configuration
* Configure **NOTIFICATION_PROCESS_API_HOST**, please refer: [Configure Notification Host](https://confluence.global.standardchartered.com/display/SERVICEBENCH/Notification+Java+Library)
* Ingress/Egress Configuration(you can disable in dev)
## Update Parameters for pipeline
* subITAM: update to your componentId
* imageTag: image version.[Version History](https://confluence.global.standardchartered.com/display/SERVICEBENCH/Notification+Process+Image)
* <your_team_email>: update your team email for pipeline
## Trigger the pipeline
* commit files and push to trigger the pipeline

## Run Health-Check API

**You can run health-check API to confirm if service is running or not**
```
curl --location 'https://servicebench-sit.global.standardchartered.com/rest/v1/{your-namespace-name}-notification-process-api/q/health/live'
```
* please change the namespace name before you test

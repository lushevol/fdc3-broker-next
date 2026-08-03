<!-- TOC -->
* [What is Service Bench Backend](#what-is-service-bench-backend)
* [Prerequisite](#prerequisite)
  * [NodeJS](#nodejs)
    * [Node.js installation](#nodejs-installation)
    * [Node.js setup](#nodejs-setup)
  * [Maven](#maven)
    * [Maven installation](#maven-installation)
    * [Maven setup](#maven-setup)
* [Getting Started](#getting-started)
  * [Create New Project](#create-new-project)
  * [Project Structure](#project-structure)
  * [Library Compile Time Dependencies](#library-compile-time-dependencies)
* [Development](#development)
  * [Expose REST Endpoint](#expose-rest-endpoint)
  * [Create Service Class](#create-service-class)
  * [Create POJO as DTO](#create-pojo-as-dto)
  * [How to deploy and run function in local vm](#how-to-deploy-and-run-function-in-local-vm)
  * [How to test deployed function from a curl command](#how-to-test-deployed-function-from-a-curl-command)
* [Support](#support)
<!-- TOC -->

# What is Service Bench Backend
Service Bench Backend is layer of experience api sits between client (e.g. mobile, web app) and each domain's process api, offering

- develop and deploy by using Function as a Service framework
- out of box common libraries from SC DevKit
- graphql as experience api
- CICD integration with ADO to deploy to SKE - Work in progress
- authentication and authorization by using SC-IDP policy enforcement point common library and sidecar - Work in progress

![service bench diagram](.devkit/sb.drawio.svg)

# Prerequisite
## NodeJS
Service Bench development environment runs on NodeJS v16.x+. If you have it installed, you can skip Node.js Installation section.

### Node.js installation
1. Download Node v16.x+ from Axess: https://axess.sc.net/marketplace/golden-versions/gv-nodejs-v1
2. Extract the binary and make sure node.exe and npm.exe are added to Windows PATH.
3. Verify the installation by running the following command:
```shell
node -v
npm -v
```
### Node.js setup
Open terminal prompt and run the following command to point npm registry to SCB Artifactory:
```shell
npm config set registry https://artifactory.global.standardchartered.com/artifactory/api/npm/npm-release
```
## Maven
Service Bench development environment requires Maven 3.8.3+. If you have it installed, you can skip the Maven installation section.

### Maven installation
1. Download Maven 3.9.6 from https://artifactory.global.standardchartered.com/artifactory/maven-release/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip
2. Extract the binary and make sure mvn.exe and npm.exe are added to Windows PATH.
3. Verify the installation by running the following command
```shell
mvn -version
```
### Maven setup
copy below settings.xml to your .m2/settings.xml
```xml
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<settings
    xmlns="http://maven.apache.org/SETTINGS/1.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
 
    <offline>false</offline>
    
    <profiles>
        <profile>
            <id>public-repository-group</id>
            <repositories>
                <repository>
                    <id>artifactory-repo</id>
                    <name>Artifactory Repo</name>
                    <url>https://artifactory.global.standardchartered.com/artifactory/maven-release/</url>
                    <layout>default</layout>
                    <releases>
                        <enabled>true</enabled>
                        <updatePolicy>never</updatePolicy>
                    </releases>
                    <snapshots>
                        <enabled>false</enabled>
                        <updatePolicy>never</updatePolicy>
                    </snapshots>
                </repository>
                <repository>
                    <id>gradle-release</id>
                    <name>Gradle Release</name>
                    <url>https://artifactory.global.standardchartered.com/artifactory/gradle-release/</url>
                    <layout>default</layout>
                    <releases>
                        <enabled>true</enabled>
                        <updatePolicy>never</updatePolicy>
                    </releases>
                    <snapshots>
                        <enabled>false</enabled>
                        <updatePolicy>never</updatePolicy>
                    </snapshots>
                </repository>
                <repository>
                    <id>artifactory-snapshot</id>
                    <name>Artifactory Repo</name>
                    <url>https://artifactory.global.standardchartered.com/artifactory/maven-snapshot/</url>
                    <layout>default</layout>
                    <releases>
                        <enabled>false</enabled>
                        <updatePolicy>never</updatePolicy>
                    </releases>
                    <snapshots>
                        <enabled>true</enabled>
                        <updatePolicy>never</updatePolicy>
                    </snapshots>
                </repository>
                <repository>
                    <id>artifactory-central</id>
                    <name>Artifactory Repo</name>
                    <url>https://artifactory.global.standardchartered.com/artifactory/maven-central-cache/</url>
                    <layout>default</layout>
                    <releases>
                        <enabled>false</enabled>
                        <updatePolicy>never</updatePolicy>
                    </releases>
                    <snapshots>
                        <enabled>true</enabled>
                        <updatePolicy>never</updatePolicy>
                    </snapshots>
                </repository>
            </repositories>
            <pluginRepositories>
                <pluginRepository>
                    <id>plugin-artifactory-repo</id>
                    <name>Artifactory Repo</name>
                    <url>https://artifactory.global.standardchartered.com/artifactory/maven-release/</url>
                    <layout>default</layout>
                    <releases>
                        <enabled>true</enabled>
                        <updatePolicy>never</updatePolicy>
                    </releases>
                    <snapshots>
                        <enabled>false</enabled>
                        <updatePolicy>never</updatePolicy>
                    </snapshots>
                </pluginRepository>
                <pluginRepository>
                    <id>plugin-artifactory-snapshot</id>
                    <name>Artifactory Repo</name>
                    <url>https://artifactory.global.standardchartered.com/artifactory/maven-snapshot/</url>
                    <layout>default</layout>
                    <releases>
                        <enabled>false</enabled>
                        <updatePolicy>never</updatePolicy>
                    </releases>
                    <snapshots>
                        <enabled>true</enabled>
                        <updatePolicy>never</updatePolicy>
                    </snapshots>
                </pluginRepository>
            </pluginRepositories>
        </profile>
    </profiles>
  <activeProfiles>
        <activeProfile>public-repository-group</activeProfile>
  </activeProfiles>
  <mirrors>
    <mirror>
         <id>artifactory-central</id>
         <mirrorOf>central</mirrorOf>
         <url>https://artifactory.global.standardchartered.com/artifactory/maven-central-cache/</url>
    </mirror>
  </mirrors>
</settings>
```

# Getting Started
## Create New Project
Use SC DevKit CLI to create a new project from predefined templates to start building Service Bench Plugin

1. Create a new sc project by running 'npx @scdevkit/cli@latest', enter y when prompted.\
   [<img src=".devkit/cli1.png" width="500"/>](.devkit/cli1.png)
2. Select 'Service Bench (BETA)' as your project.\
   [<img src=".devkit/cli2.png" width="500"/>](.devkit/cli2.png)
3. Choose which template to use \
   [<img src=".devkit/cli3.png" width="500"/>](.devkit/cli3.png)
4. Enter your project name, application id and bank id.\
   [<img src=".devkit/cli4.png" width="500"/>](.devkit/cli4.png)
5. After all done, should get the below message.\
   [<img src=".devkit/cli5.png" width="500"/>](.devkit/cli5.png)
6. Go to the newly created project directory, run 'mvn quarkus:dev' to run the project\
   [<img src=".devkit/cli6.png" width="500"/>](.devkit/cli6.png)

## Project Structure

| Directory/File                                         | Description                                               |
|--------------------------------------------------------|-----------------------------------------------------------|
| src/main/java/com/sc/faas/dto                          | POJO will be exposed as JSON                              |
| src/main/java/com/sc/faas/service/ProcessService.java  | Process API service layer                                 |
| src/main/java/com/sc/faas/Function.java                | REST endpoints, please keep one Function.java per project |
| src/main/resources/application.properties              | process function configuration file                       |


## Library Compile Time Dependencies
| Directory/File         | Description                                                               |
|------------------------|---------------------------------------------------------------------------|
| experience-parent-java | devkit process api parent library, which introduces quarkus dependency    |
| devkit-api-common      | provides utilities like pagination, validation, checked exception and etc |

# Development
## Expose REST Endpoint
Please keep one function with set of APIs within one domain, to keep per function only focus on one piece of business logic

```java
package com.sc.faas;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;

@Path("/api/experience/v1/")
public class Function {

    @Inject
    private ProcessService processService;

    /**
     * exposed REST GET api at /api/experience/v1/objects/{id}
     */
    @Path("/objects/{id}")
    @GET
    public Object getObjectById(@PathParam("id") Long id) {
        return processService.getObjectById(id);
    }
}

```

## Create Service Class

```java
package com.sc.faas.service;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ProcessService {
    public MyObject getObjectById(Long id) {
        return new MyObject(id, "Hello World");
    }
}
```

## Create POJO as DTO
```java
package com.sc.faas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class MyObject {
    private Long id;
    private String name;
}

```

## How to deploy and run function in local vm
Open git bash and run below command under your project folder.\
The first deployment may take a while, as need to download JDK and dependency libraries. Subsequent deployment will be faster because of caching.
```shell
./faas-cli.sh run
```

## How to test deployed function from a curl command
```shell
curl --location --request GET 'http://127.0.0.1:30901/api/experience/v1/objects/123' \
--header 'Host: <%= applicationId %>-<%= name %>.local.api.servicebench.global.standardchartered.com' \
--header 'Content-Type: application/json' 
```

# Support
Support channel: http://go/chat/sc-app-platform

<!-- TOC -->
* [What is Service Bench Backend](#what-is-service-bench-backend)
* [Prerequisite](#prerequisite)
    * [NodeJS](#nodejs)
        * [Node.js installation](#nodejs-installation)
        * [Node.js setup](#nodejs-setup)
    * [Maven](#maven)
        * [Maven installation](#maven-installation)
        * [Maven setup](#maven-setup)
* [IDE and Programming Language](#ide-and-programming-language)
* [Getting Started](#getting-started)
    * [Create New Project](#create-new-project)
    * [Project Structure](#project-structure)
    * [Library Compile Time Dependencies](#library-compile-time-dependencies)
* [Development](#development)
    * [Expose GraphQL Experience API Endpoint](#expose-graphql-experience-api-endpoint)
    * [Create GraphQL Query](#create-graphql-query)
    * [Create GraphQL Mutation](#create-graphql-mutation)
    * [How to deploy and run function in local vm](#how-to-deploy-and-run-function-in-local-vm)
    * [How to test deployed function from a curl command](#how-to-test-deployed-function-from-a-curl-command)
    * [Onboard to GraphQL Router](#onboard-to-graphql-router)
    * [Subgraph Relationship](#subgraph-relationship)
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

# IDE and Programming Language
It is recommended to use Kotlin to build your own graphql function, because of more concise syntax, lean code base comparing to Java. Please have Intellij installed from aXess (sc.net) to have better support for Kotlin.

# Getting Started
## Create New Project
Use SC DevKit CLI to create a new project from predefined templates to start building Service Bench Plugin

1. Create a new sc project by running 'npx @scdevkit/cli@latest', enter y when prompted.\
   [<img src=".devkit/cli1.png" width="500"/>](.devkit/cli1.png)
2. Select 'Service Bench' as your project.\
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

| Directory/File                                         | Description |
|--------------------------------------------------------| ----------- |
| src/main/kotlin/com/sc/faas/dto                        | POJO will be exposed as graphql schema type |
| src/main/kotlin/com/sc/faas/service/QueryService.kt    | methods inside of service will be exposed as graphql query |
| src/main/kotlin/com/sc/faas/service/MutationService.kt | methods inside of service will be exposed as graphql mutation |
| src/main/kotlin/com/sc/faas/Function.kt                | graphql faas configuration and rest endpoint |
| src/main/resources/application.properties              | graphql function configuration file |


## Library Compile Time Dependencies
| Directory/File                | Description |
|-------------------------------| ----------- |
| graphql-parent                | devkit graphql parent library, which introduces quarkus funq dependency|
| devkit-graphql-kotlin-common  | provides utilities based on graphql-kotlin|

# Development
## Expose GraphQL Experience API Endpoint
Hook up graphql schema type containing package, query service and mutation service. And expose graphql REST endpoint via function as a service.
```kotlin
package com.sc.faas
 
import com.expediagroup.graphql.generator.TopLevelObject
import com.sc.devkit.graphql.dto.Input
import com.sc.devkit.graphql.service.GraphQLServer
import com.sc.faas.service.MutationService
import com.sc.faas.service.QueryService
import io.quarkus.funqy.Funq
import jakarta.inject.Inject
 
class Function {
    @Inject
    private lateinit var queryService: QueryService
 
    @Inject
    private lateinit var mutationService: MutationService
 
    private val graphQLServer by lazy {
        GraphQLServer.Builder()
            .federatedSupportedPackages(
                listOf(
                    "com.sc.faas.dto",
                )
            )
            .queries(listOf(TopLevelObject(queryService, QueryService::class)))
            .mutations(listOf(TopLevelObject(mutationService, MutationService::class)))
            .build()
    }
 
    @Funq
    fun graphql(input: Input): Any {
        return graphQLServer.serve(input)
    }
}
```

## Create GraphQL Query
All functions in QueryService will be exposed as graphql query
```kotlin
package com.sc.faas.service
 
import com.sc.faas.dto.Object
import jakarta.enterprise.context.ApplicationScoped
 
@ApplicationScoped
class QueryService {
    /**
     * graphql query expose as
     * { "query": "query { objects {id name} }" }
     */
    fun objects(): List<Object> {
        return listOf(Object(id = 1, name = "TEST"))
    }
}
```

## Create GraphQL Mutation
All functions in MutationService will be exposed as graphql mutation
```kotlin

package com.sc.faas.service
 
import com.sc.faas.dto.Object
import jakarta.enterprise.context.ApplicationScoped
 
@ApplicationScoped
class MutationService {
    /**
     * graphql mutation expose as
     * { "query": "mutation updateObjectMutation { updateObject ( id: 1, name: \"hello\") { id name }}" }
     */
    fun updateObject(id: Int, name: String): Object {
        // your own mutation logic
        return Object(id, name)
    }
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
curl --location --request POST 'http://127.0.0.1:30901/graphql' \
--header 'Host: <%= name %>.<%= applicationId %>.local.api.servicebench.global.standardchartered.com' \
--header 'Content-Type: application/json' \
--data-raw '{"query":"query { objects { id name } }"}'
```

## Onboard to GraphQL Router
Please contact support channel: http://go/chat/sc-app-platform to onboard subgraph to Hasura GraphQL router.

## Subgraph Relationship
work in progress

# Support
Support channel: http://go/chat/sc-app-platform

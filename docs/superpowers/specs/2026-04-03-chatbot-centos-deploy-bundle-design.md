# Chatbot CentOS Deploy Bundle Design

## Goal

Add a repeatable packaging flow for `services/chatbot-backend` so developers can build the service on macOS, upload a CentOS-friendly deployment bundle manually to a Linux server, and run it with clear startup validation.

## Scope

- Add npm scripts in the chatbot backend workspace for build, bundle creation, and bundle-local execution.
- Add a bundle assembly script that packages the runnable JAR, startup script, env template, and short deployment notes.
- Add a runtime script that fails fast when Java, the JAR, or the `.env` file is missing.
- Update service documentation to describe the manual upload and run flow.

## Non-Goals

- No Docker or system service setup.
- No remote deployment automation.
- No change to chatbot runtime behavior beyond startup validation.

## Design

The deploy artifact will be a single `tar.gz` archive under `services/chatbot-backend/dist/`. The archive will contain:

- `chatbot-backend.jar`
- `run.sh`
- `.env.example`
- `README.txt`

`run.sh` will:

- resolve its own directory so it can be run from anywhere
- require `java` to be installed and print a Java 17+ guidance message if missing
- require `.env` and the JAR to exist
- export variables from `.env`
- launch the Spring Boot JAR

The bundle assembly script will:

- run a production package build for the chatbot service
- verify the packaged JAR exists
- create a clean bundle directory
- copy the runtime assets into the bundle
- archive the bundle into `dist/chatbot-backend-centos.tar.gz`

## Testing

- Verify the Maven package command succeeds.
- Verify the bundle script creates the expected archive.
- Verify the archive contains the expected files.

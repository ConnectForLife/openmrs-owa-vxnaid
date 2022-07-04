# Vxnaid UI OWA for OpenMRS

## Prerequisites
* [Maven](https://maven.apache.org/install.html)

## Deployment
1. Run `mvn clean install` in the root directory. This should create a file called `target/vxnaid-<version>.zip`.
    1. Where `<version>` is the current version of the Vxnaid UI OWA.
1. Log in to OpenMRS as an admin.
1. Go to `System Administration` -> `Advanced Administration` -> `Open Web Apps Module` -> `Manage Apps`.
1. Rename the `target/vxnaid-<version>.zip` by removing the version, to `vxnaid.zip`.
1. Upload the `vxnaid.zip`. 
    1. The file name must be exactly the same for the module to work correctly, the OpenMRS uses filename to match URLs.
1. The app is up and running!

## Available Scripts

The Node project is wrapped in Maven. The Maven downloads correct node and npm, then runs the npm build.
It is perfectly fine to use Maven build for development, but in some cases it might be more convenient to run npm directly. 

If you are going to skip Maven wrapper, then make sure you use the correct node and npm versions.
The supported node and npm versions are located in `pom.xml` file.

To use npm, just run:

#### `npm run build`

Builds the app for production.\
It correctly bundles React in production mode and optimizes the build for the best performance.

**By wary,** that npm does not pack the project into ZIP file. 
In case of using NPM directly, you need to create ZIP file out of content of `build` directory by yourself.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

#### `npm watch`

Development: deploys the app to `~/.cfl-dev` when files change - facilitates hot-redeployment of FE changes.

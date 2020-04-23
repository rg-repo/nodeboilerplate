# Node Boiler Plate

This is README for Node Boiler Plate.

# Features (order of implementation may vary)

- [x] default env file to be used for setip
- [x] dockerised setup of application, mysql, redis, elasticsearch
- [x] middleware to validate APIs (body, query params and route params) with message translation
- [x] APIs for Users (CRUD for users, login)
- [ ] APIs for todo (sample feature)
- [x] update swagger docs
- [x] redis and elasticsearch setup (establishing of connections)
- [ ] Redis integration with APIs and services
- [ ] Elastic search integration with APIs and services
- [ ] Testing setup write sample tests
- [ ] upgrade the mysql version (in docker container)
- [ ] upgrade the node version for the application(in docker container setup)

# File and Folder naming conventions

naming conventions are invoked from
[here](https://github.com/airbnb/javascript#naming-conventions)
in crux from the article

- folder names are to be in snake case
  - example - `node_modules`
- file names are to be in camel case
  - example - `userController.js` and this file should export module as `UserController`

# IDE setup/plugins integration (VS Code)

This setup guide is written with respect to VS Code.

- From your extensions tab install the `Setting Sync` plugin
  - Identifier for the extension is `shan.code-settings-sync`
  - VS Code marketplace url is `https://marketplace.visualstudio.com/items?itemName=Shan.code-settings-sync`
- After installing the extension, on its description page, under configration section there is a link to download from public gist. Click on it.
- use `6c21c58df5ec76eaafd846544a4fad28` as your gist id and press enter.
- All the required extensions will be automatically downloaded on your VS Code.

# Setup

Project is setup using Docker. As of now it supports redis, elasticsearch, mysql.
docker folder contains all the yml (docker-compose) files to complete the setup.
This setup is constructed assuming mysql will always be used in every project and environment.

## Setup only for mysql

`docker-compose -f docker/base.yml up -d`

## Setup for mysql and redis

`docker-compose -f docker/base.yml -f docker/redis.yml up -d`

## Setup for mysql, redis and elasticsearch

`docker-compose -f docker/base.yml -f docker/redis.yml -f docker/elastic-search.yml up -d`

** example codes in this template project uses mysql, redis and elasticsearch, so use the above command to setup all the containers.
** all the above commands uses base.yml to setup the project. In order to have the smooth setup, create a new file named as `web-variables.env` in `docker` folder with keys from `web-variables.sample.env` file and fill their respective values

## Run application on your local

- copy the contents of `default.env` file to a new file named as `.env`
- update the values for all the keys
- to setup docker containers for mysql, redis or elasticsearch use above commands
- if you have nodemon installed use `nodemon src/index.js` or simply `npm start`
- search for `TODO-SETUP:` tag in the entire code. comments beside this tag are helpful for different implementations like use of elastic search and redis

# How to configure and setup database, refer to `DATABASE-SETUP.md`

# module aliasing

`module-alias` package is used to create aliases for modules. Which in turn helps to reduce the complexity and increase the readability of importing modules in other files.

As of now there is only 1 alias defined i.e. `@src`. If you visit any file in the directory all imports for modules that belong to other folders start with `@src`. `@src` indicates to the `src` folder of the project.

## Adding new aliases

In order to create more aliases in your `package.json` file update the `_moduleAliases` object.
As of now it looks like

    "\_moduleAliases": {
        "@src": "./src"
    },

If you have add another alias, say `@public` that refers to the public folder, then the `_moduleAliases` will look like

    "\_moduleAliases": {
        "@src": "./src",
        "@public": "./public"
    },

# Error Handling

In order to maintain the ease of using proper statuscodes and consistency throughout the application we have used [this package](https://www.npmjs.com/package/http-errors).

For reference of its use checkout `src/service/userService.js`

# For conventions followed and expected to be followed for better maintainability refer to `CONVENTIONS.md`

# API

## structure viewpoint

- Everything related to API is located in `src/api` folder.
- `src/api/index.js` contains the list/registration of all the APIs.
- `src/api/controller` contains the code for respective controllers
- `src/api/swagger-docs` contains the documentation for the APIs
- `src/api/validation` contains all the validations for the APIs
- API routes registered in `index.js` file establish a link between any validation, controller method and any other middleware

## validations

all validations can be found in `src/api/validation`

- validations are used as a middleware like auth middleware in `index.js` file located in `src/api` folder
- common validations that can be shared among different validation schemas are kept in `commonValidation.js` file. This file is intended to have partial schemas or particular joi string to be used in different schemas
- rest of the files are 1-1 mapping of controllers from `src/api/controller`
- custom validation middleware (`validationMiddleware.js`) is written and placed in `src/middleware` folder. It translates the error messages by default and is transmitted in `data` section of response object.

# Architechtural Approach

- This boilerplate follows the 3-layer architecture approach. (Controller-Service-Database)
- For detailed explaination refer to [node project architecture](https://softwareontheroad.com/ideal-nodejs-project-structure/)

## conventions / Not so called rules but to be followed

- There should be no business logic present in controllers.
- Controller methods should have call to services and send back the response.
- All the business logic and interaction with Database layer is to be done in service layer.
- Database layer interacts with DB. Interaction with elasticsearch, redis or anyother data storage is to be considered in database layer.

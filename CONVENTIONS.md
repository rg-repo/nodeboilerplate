# Conventions followed in CodeBase

## Differentiation of public and private methods in a module

All public functions are exported using an object variable.

All private functions are directly declared and defined, unlike the public functions are defined as a property of an object.

Example

    const iAmPrivate = (message) => alert(message);
    const iContainPublicMethods = {};
    iContainPublicMethods.popMessage = (message) => {
        //do something else
        iAmPrivate(message);
    }

## Naming conventions

naming conventions are invoked from
https://github.com/airbnb/javascript#naming-conventions
in crux from the article

- folder names are to be in snake case
  - example - `node_modules`
- file names are to be in camel case
  - example - `userController.js` and this file should export module as `UserController`

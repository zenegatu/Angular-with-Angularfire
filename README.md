### Angular Web App

angular 15.2.1,
angularfire 7.5.0,
angular material 15.2.1

website: https://fbdb-c2b17.firebaseapp.com/

This is a web app where users can see book recommendation.
Logged in users can upload,edit or delete their recommendation.
Data is stored in Firebase database and respective images are stored in Firebase storage.

To build your own copy,you need a Firebase account (a free one will do)
then copy and paste your firebase config in your environment folder
and point to it in your app.module

provideFirebaseApp(() => initializeApp(environment.firebaseConfig))

providers: [
{
provide: FIREBASE_OPTIONS,
useValue: environment.firebaseConfig,
},

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.6.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you
change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also
use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a
package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out
the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

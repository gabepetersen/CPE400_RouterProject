/*
  Setup routing for Angular. Considering the barebones-usage of Angular in our project, the main
  point of this router is just to ensure that the templateUrl and controller get loaded.
 */
GLOB_cpeAngularApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'sidepanel_partial.html',
        controller: 'SidePanelController'
      })
      .otherwise({
        templateUrl: 'sidepanel_partial.html',
        controller: 'SidePanelController'
      });
  }
]);
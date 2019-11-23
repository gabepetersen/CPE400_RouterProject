angular.module('cpeAngularApp', [])
    .controller('SidePanelController', ['$scope', function ($scope) {

  $scope.currentRouter = null;
  $scope.property = {};

  let selectedRouterTaskId = null;

  $scope.setFailChance = function() {
    $scope.currentRouter.setFailChance($scope.property.failChance);

    $scope.property.failChance = $scope.currentRouter.FailChance;
    console.log($scope.currentRouter.FailChance);
  };

  function taskCheckSelectedRouter() {
    let routerChanged = false;

    // check if the selected router has changed, and if so update the current router and subsequently the page
    if (GLOB_selectedRouter === null && $scope.currentRouter !== null) {
      routerChanged = true;
    }
    else if (GLOB_selectedRouter !== null) {
      if ($scope.currentRouter === null || $scope.currentRouter.Id != GLOB_selectedRouter.Id) {
        routerChanged = true;
      }
    }

    if (routerChanged) {
      $scope.currentRouter = GLOB_selectedRouter;
      $scope.property.failChance = $scope.currentRouter ? $scope.currentRouter.FailChance : null;
    }

    $scope.$apply();
  }

  function init() {
    console.log("initializing SidePanel Controller");

    // start a task that continually checks if the selected router has changed
    selectedRouterTaskId = setInterval(taskCheckSelectedRouter, 200);
  }

  init();
}]);
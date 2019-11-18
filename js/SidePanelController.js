angular.module('cpeAngularApp', [])
    .controller('SidePanelController', ['$scope', function ($scope) {

  $scope.currentRouter = null;

  let selectedRouterTaskId = null;



  function taskCheckSelectedRouter() {
    // check if the selected router has changed, and if so update the current router and subsequently the page
    if (GLOB_selectedRouter === null && $scope.currentRouter !== null) {
      $scope.currentRouter = GLOB_selectedRouter;
      $scope.$apply();
    }
    else if (GLOB_selectedRouter !== null) {
      if ($scope.currentRouter === null || $scope.currentRouter.Id != GLOB_selectedRouter.Id) {
        $scope.currentRouter = GLOB_selectedRouter;
        $scope.$apply();
      }
    }
  }

  function init() {
    console.log("initializing SidePanel Controller");

    // start a task that continually checks if the selected router has changed
    selectedRouterTaskId = setInterval(taskCheckSelectedRouter, 200);

    $scope.currentRouter = {Id: 'ASDF'};
  }

  init();
}]);
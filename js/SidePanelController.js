/*
 * An angular controller. This code allows the side panel to the left of the canvas to dynamically update with
 * the latest information for the currently selected router, if a router IS currently selected.
 *
 * ~
 *
 * It's a fairly technical note, but this angular controller does data binding in a very atypical and unsafe
 * for production type of way. By this I mean that instead of a 2-way data binding, the controller is running
 * a task on a timer to update an angular object which is then used to update the entire side panel.
 *
 * For a school project, this angular controller represents an incredibly novel way of surpassing a technical
 * limitation put on us by our choice to use an HTML5 canvas. This novelty will mostly be lost considering the
 * project's main purpose is to design a routing algorithm.
 */
angular.module('cpeAngularApp', [])
    .controller('SidePanelController', ['$scope', function ($scope) {

  $scope.tickTime = 0;
  $scope.currentRouter = null;
  $scope.property = {};

  let selectedRouterTaskId = null;

  // update the chance to fail in the current router
  $scope.setFailChance = function() {
    $scope.currentRouter.setFailChance($scope.property.failChance);

    $scope.property.failChance = $scope.currentRouter.FailChance;
    console.log($scope.currentRouter.FailChance);
  };

  // run a task which, on each iteration, updates the currently selected router according to a globally chosen router
  function taskCheckSelectedRouter() {
    let routerChanged = false;

    // check if the selected router has changed, and if so update the current router and subsequently the page
    if (GLOB_selectedRouter === null && $scope.currentRouter !== null) {
      routerChanged = true;
    }
    else if (GLOB_selectedRouter !== null) {
      if ($scope.currentRouter === null || $scope.currentRouter.Id !== GLOB_selectedRouter.Id) {
        routerChanged = true;
      }
    }

    if (routerChanged) {
      $scope.currentRouter = GLOB_selectedRouter;
      $scope.property.failChance = $scope.currentRouter ? $scope.currentRouter.FailChance : null;
    }

    $scope.tickTime = GLOB_tick_time;
    $scope.$apply();
  }

  function init() {
    console.log("Initializing the SidePanel controller.");

    // start a task that continually checks if the selected router has changed
    selectedRouterTaskId = setInterval(taskCheckSelectedRouter, 200);
  }

  init();
}]);
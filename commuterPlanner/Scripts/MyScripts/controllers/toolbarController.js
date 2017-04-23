app.controller('ToolbarController', ['$scope', '$mdSidenav', '$mdPanel', function ($scope, $mdSidenav, $mdPanel) {
    $scope.toggleSidenav = function (side) {
        $mdSidenav(side).toggle();
    };

    $scope.showPanel = function () {

        var position = $mdPanel.newPanelPosition()
             .absolute()
             .center();

        var config = {
            attachTo: angular.element(document.body),
            controller: 'tableController',
            // controllerAs: 'ctrl',
            // disableParentScroll: this.disableParentScroll,
            templateUrl: '/Templates/timeTablePanel.html',
            hasBackdrop: true,
            panelClass: 'demo-dialog-example',
            position: position,
            trapFocus: true,
            zIndex: 150,
            clickOutsideToClose: true,
            escapeToClose: true,
            focusOnOpen: true
        };
        $mdPanel.open(config);
    };
}]);
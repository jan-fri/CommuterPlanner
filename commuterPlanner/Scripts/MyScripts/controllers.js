app.controller('AppCtrl', function ($scope) {
    $scope.myDate = new Date();

    $scope.minDate = new Date(
        $scope.myDate.getFullYear(),
        $scope.myDate.getMonth() - 2,
        $scope.myDate.getDate());

    $scope.maxDate = new Date(
        $scope.myDate.getFullYear(),
        $scope.myDate.getMonth() + 2,
        $scope.myDate.getDate());

    $scope.onlyWeekendsPredicate = function (date) {
        var day = date.getDay();
        return day === 0 || day === 6;
    };
});




app.controller('MapController', function ($scope) {

    var map = L.map('mapid').setView([49.822, 19.058], 13);

    L.tileLayer('http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([49.822, 19.058]).addTo(map)
        .bindPopup('Bielsko-Biała.')
        .openPopup();
});

app.controller('PlanController', function ($scope) {
    $scope.myDate = new Date();
    $scope.time;

});

app.controller('ToolbarController', function ($scope, $mdSidenav, $mdPanel) {
    $scope.toggleSidenav = function (side) {
        $mdSidenav(side).toggle();
    };

    $scope.showPan = function () {

       var position = $mdPanel.newPanelPosition()
            .absolute()
            .center();

        var config = {
            attachTo: angular.element(document.body),
           // controller: PanelDialogCtrl,
           // controllerAs: 'ctrl',
            disableParentScroll: this.disableParentScroll,
            templateUrl: '/Content/Template/panel.html',
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

});

//app.controller('BasicDemoCtrl', BasicDemoCtrl);
//app.controller('PanelDialogCtrl', PanelDialogCtrl);


//function BasicDemoCtrl($mdPanel) {
//    this._mdPanel = $mdPanel;

//    this.desserts = [
//      'Apple Pie',
//      'Donut',
//      'Fudge',
//      'Cupcake',
//      'Ice Cream',
//      'Tiramisu'
//    ];

//    this.selected = { favoriteDessert: 'Donut' };
//    this.disableParentScroll = false;
//}


//BasicDemoCtrl.prototype.showDialog = function () {
//    var position = this._mdPanel.newPanelPosition()
//        .absolute()
//        .center();

//    var config = {
//        attachTo: angular.element(document.body),
//        controller: PanelDialogCtrl,
//        controllerAs: 'ctrl',
//        disableParentScroll: this.disableParentScroll,
//        template:
//            '<div role="dialog" aria-label="Eat me!" layout="column" layout-align="center center">' +
//            '<md-toolbar>' +
//            '<div class="md-toolbar-tools">' +
//            '<h2>Surprise!</h2>' +
//            '</div>' +
//            '</md-toolbar>' +
//            '<div class="demo-dialog-content">' +
//            '<p> You hit the secret button. Heres a donut: </p>' +
//            '<div layout="row">' +
//            '<img flex alt="Delicious donut" src="img/donut.jpg">' +
//            '</div>' +
//            '</div>' +
//            '<div layout="row" class="demo-dialog-button">' +
//            '<md-button md-autofocus flex class="md-primary" ng-click="ctrl.closeDialog()">' +
//            'Close' +
//            '</md-button>' +
//            '</div>' +
//            '</div>',
//        hasBackdrop: true,
//        panelClass: 'demo-dialog-example',
//        position: position,
//        trapFocus: true,
//        zIndex: 150,
//        clickOutsideToClose: true,
//        escapeToClose: true,
//        focusOnOpen: true
//    };

//    this._mdPanel.open(config);
//};


//BasicDemoCtrl.prototype.showMenu = function (ev) {
//    var position = this._mdPanel.newPanelPosition()
//        .relativeTo('.demo-menu-open-button')
//        .addPanelPosition(this._mdPanel.xPosition.ALIGN_START, this._mdPanel.yPosition.BELOW);

//    var config = {
//        attachTo: angular.element(document.body),
//        controller: PanelMenuCtrl,
//        controllerAs: 'ctrl',
//        template:
//            '<div class="demo-menu-example" ' +
//            '     aria-label="Select your favorite dessert." ' +
//            '     role="listbox">' +
//            '  <div class="demo-menu-item" ' +
//            '       ng-class="{selected : dessert == ctrl.favoriteDessert}" ' +
//            '       aria-selected="{{dessert == ctrl.favoriteDessert}}" ' +
//            '       tabindex="-1" ' +
//            '       role="option" ' +
//            '       ng-repeat="dessert in ctrl.desserts" ' +
//            '       ng-click="ctrl.selectDessert(dessert)"' +
//            '       ng-keydown="ctrl.onKeydown($event, dessert)">' +
//            '    {{ dessert }} ' +
//            '  </div>' +
//            '</div>',
//        panelClass: 'demo-menu-example',
//        position: position,
//        locals: {
//            'selected': this.selected,
//            'desserts': this.desserts
//        },
//        openFrom: ev,
//        clickOutsideToClose: true,
//        escapeToClose: true,
//        focusOnOpen: false,
//        zIndex: 2
//    };

//    this._mdPanel.open(config);
//};


//function PanelDialogCtrl(mdPanelRef) {
//    this._mdPanelRef = mdPanelRef;
//}


//PanelDialogCtrl.prototype.closeDialog = function () {
//    var panelRef = this._mdPanelRef;

//    panelRef && panelRef.close().then(function () {
//        angular.element(document.querySelector('.demo-dialog-open-button')).focus();
//        panelRef.destroy();
//    });
//};



//function PanelMenuCtrl(mdPanelRef, $timeout) {
//    this._mdPanelRef = mdPanelRef;
//    this.favoriteDessert = this.selected.favoriteDessert;
//    $timeout(function () {
//        var selected = document.querySelector('.demo-menu-item.selected');
//        if (selected) {
//            angular.element(selected).focus();
//        } else {
//            angular.element(document.querySelectorAll('.demo-menu-item')[0]).focus();
//        }
//    });
//}


//PanelMenuCtrl.prototype.selectDessert = function (dessert) {
//    this.selected.favoriteDessert = dessert;
//    this._mdPanelRef && this._mdPanelRef.close().then(function () {
//        angular.element(document.querySelector('.demo-menu-open-button')).focus();
//    });
//};


//PanelMenuCtrl.prototype.onKeydown = function ($event, dessert) {
//    var handled;
//    switch ($event.which) {
//        case 38: // Up Arrow.
//            var els = document.querySelectorAll('.demo-menu-item');
//            var index = indexOf(els, document.activeElement);
//            var prevIndex = (index + els.length - 1) % els.length;
//            els[prevIndex].focus();
//            handled = true;
//            break;

//        case 40: // Down Arrow.
//            var els = document.querySelectorAll('.demo-menu-item');
//            var index = indexOf(els, document.activeElement);
//            var nextIndex = (index + 1) % els.length;
//            els[nextIndex].focus();
//            handled = true;
//            break;

//        case 13: // Enter.
//        case 32: // Space.
//            this.selectDessert(dessert);
//            handled = true;
//            break;

//        case 9: // Tab.
//            this._mdPanelRef && this._mdPanelRef.close();
//    }

//    if (handled) {
//        $event.preventDefault();
//        $event.stopImmediatePropagation();
//    }

//    function indexOf(nodeList, element) {
//        for (var item, i = 0; item = nodeList[i]; i++) {
//            if (item === element) {
//                return i;
//            }
//        }
//        return -1;
//    }
//};



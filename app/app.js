var app = angular.module("Game", ["ngRoute", "firebase",]);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'partials/auth.html',
        controller: 'authCtrl'
      }).when('/game', {
        templateUrl: 'partials/game.html',
        controller: 'gameCtrl'
      }).otherwise({
        redirectTo: '/'
      });
  }]);

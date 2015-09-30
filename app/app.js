var app = angular.module("myGame", ["ngRoute", "firebase"])
.factory("uidHandle", function() {
  var uid = null;
  return {
    getUid: function() {
      return uid;
    },
    setUid: function(sentID) {
      uid = sentID;
    }
  };
});
// .run(function() {

//   $rootScope.$on("$locationChangeStart", function(event, next, current) { 

//   if(next==current && next=='#/game')
//     event.preventDefault();
//     $state.go('/');
//   });

//    var baseRef = new Firebase("https://bears-beets.firebaseio.com/players");

//    var authData = baseRef.getAuth();
//    if (authData !== null) {
//      window.location = '#game';
//    }

// });

app.factory('stats', 
  ['uidHandle', '$firebaseObject', 
  function(uidHandle, $firebaseObject) {

  var uid = uidHandle.getUid();

  var profileRef = new Firebase("https://bears-beets.firebaseio.com/players/" + uid);

  var gamesPlayed = 0;
  var highScore = 0;
  var gamesWon = 0;
  var gamesLost = 0;
  var userName;

  var $profile = $firebaseObject(profileRef);
  $profile.$loaded(function() {

    gamesPlayed = $profile.gamesPlayed;
    highScore = $profile.highScore;
    gamesWon = $profile.gamesWon;
    gamesLost = $profile.gamesLost;
    userName = $profile.username;

  });

    return {
      getgamesPlayed: function() {
        return gamesPlayed;
      },
      setgamesPlayed: function(played) {
        gamesPlayed = played;

        $profile.gamesPlayed = played;
        $profile.$save();
      },
      gethighScore: function() {
        return highScore;
      },
      sethighScore: function(high) {
        highScore = high;

        $profile.highScore = high;
        $profile.$save();
      },
      getgamesWon: function() {
        return gamesWon;
      },
      setgamesWon: function(won) {
        gamesWon = won;
        
        $profile.gamesWon = won;
        $profile.$save();
      },
      getgamesLost: function() {
        return gamesLost;
      },
      setgamesLost: function(lost) {
        gamesLost = lost;

        $profile.gamesLost = lost;
        $profile.$save();
      },
      getuserName: function() {
        return userName;
      }
    };
}]);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'partials/auth.html',
        controller: 'authCtrl'
      }).when('/game', {
        templateUrl: 'partials/game.html',
        controller: 'gameCtrl'
      }).when('/stats', {
        templateUrl: 'partials/stats.html',
        controller: 'savedStatsCtrl'
      }).otherwise({
        redirectTo: '/'
      });
}]);


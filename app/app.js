var app = angular.module("myGame", ["ngRoute", "firebase"])
.factory("uidHandle", function() {
  var uid = null;
  return {
    getUid: function() {
      return uid;
    },
    setUid: function(sentID) {
      uid = sentID;
      // console.log("factory uid", uid);
    }
  };
})
.run(function() {
   var baseRef = new Firebase("https://bears-beets.firebaseio.com/players");

   var authData = baseRef.getAuth();
   if (authData) {
    window.location = '#/game';
   } else {
    window.location = '#/';
   }
});



app.factory('stats', 
  ['uidHandle', '$firebaseObject', 
  function(uidHandle, $firebaseObject) {

  var uid = uidHandle.getUid();

  var profileRef = new Firebase("https://bears-beets.firebaseio.com/players/" + uid);
                  // .orderByChild("uid")
                  // .equalTo(uid);

  var $profile = $firebaseObject(profileRef);
  console.log("profile", $profile);

  var gamesPlayed = 0; 
  var highScore = 0;
  var gamesWon = 0;
  var gamesLost = 0;

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

      console.log($profile);
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
      }).otherwise({
        redirectTo: '/'
      });
}]);


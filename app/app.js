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
// .run(["uidHandle", function(uidHandle) {

//    var baseRef = new Firebase("https://bears-beets.firebaseio.com/players");

//    var authData = baseRef.getAuth();
//    uidHandle.setUid(authData.uid);
//    console.log("authData", authData);
// }]);

app.factory('stats', 
  ['uidHandle', '$firebaseObject', 
  function(uidHandle, $firebaseObject) {

  var uid = uidHandle.getUid();

  var profileRef = new Firebase("https://bears-beets.firebaseio.com/players/" + uid);

  var gamesPlayed;
  var highScore;
  var gamesWon;
  var gamesLost;
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
      }).otherwise({
        redirectTo: '/'
      });
  }]);


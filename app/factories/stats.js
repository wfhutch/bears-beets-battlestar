
app.factory('sessionStats', ['uidHandle', function(uidHandle) {

  var gamesPlayed = 0;
  var highScore = 0;
  var gamesWon = 0;
  var gamesLost = 0;
  var username = uidHandle.getUid();

  return {
    getgamesPlayed: function() {
    return gamesPlayed;
    },
    setgamesPlayed: function(played) {
      gamesPlayed = played;
    },
    gethighScore: function() {
      return highScore;
    },
    sethighScore: function(high) {
      highScore = high;
    },
    getgamesWon: function() {
      return gamesWon;
    },
    setgamesWon: function(won) {
      gamesWon = won;
    },
    getgamesLost: function() {
      return gamesLost;
    },
    setgamesLost: function(lost) {
      gamesLost = lost;
    },
    getusername: function() {
      return username;
    }
  };
}]);


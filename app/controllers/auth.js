
app.controller("authCtrl", ["$scope", "$firebaseAuth", "uidHandle", function($scope, $firebaseAuth, uidHandle) {

    var ref = new Firebase("https://bears-beets.firebaseio.com");

    // create an instance of the authentication service
    var auth = $firebaseAuth(ref);

    $scope.createUser = function(user) {
      ref.createUser({
        email    : $scope.user.email,
        password : $scope.user.password,
      }, function(error, userData) {
        if (error) {
          console.log("Error creating user:", error);
        } else {
          console.log("Successfully created user account with uid:", userData.uid);
          alert("User successfully created, please log in");
        }
        var player = ref.child(userData.uid);
        player.set(
        {
          'gamesPlayed': 0,
          'gamesWon': 0,
          'gamesLost': 0,
          'highScore': 0,
          'username': $scope.user.username,
          'uid': userData.uid
        });
      });

      $scope.email = $scope.user.email;
      $scope.password = $scope.user.password;
      $scope.username = $scope.user.username;
      console.log($scope.email, $scope.password, $scope.username);
    };

    // after user is created they must then login
    $scope.loginUser = function(user) {
      ref.authWithPassword({
        email    : $scope.user.loginEmail,
        password : $scope.user.loginPassword
      }, function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
          alert("Login failed. Please try again.");
        } else {
          console.log("Authenticated successfully with payload:", authData);
          uidHandle.setUid(authData.uid);
          window.location = '#/game';
        }
      });

      $scope.loginEmail = $scope.user.loginEmail;
      $scope.loginPassword = $scope.user.loginPassword;
      console.log($scope.loginEmail, $scope.loginPassword);
      
    };

  }]);



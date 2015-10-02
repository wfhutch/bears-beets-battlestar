
app.controller("authCtrl", ["$scope", "$firebaseAuth", "$firebaseArray", "uidHandle", 
  function($scope, $firebaseAuth, $firebaseArray, uidHandle) {

    $scope.letterLimit = 20;
    $scope.userName = "";


    var ref = new Firebase("https://bears-beets.firebaseio.com/players");

    // create an instance of the authentication service
    var auth = $firebaseAuth(ref);
    var $validUsername = $firebaseArray(ref);
    var userArray = [];

    $scope.createUser = function() {

      angular.forEach($validUsername, function(value, key) {
        userArray.push(value.username);
      });

      var valid = userArray.indexOf($scope.username);

      if (valid === -1) {
        ref.createUser({
          email    : $scope.email,
          password : $scope.password,
        }, function(error, userData) {
          if (error) {
            
            switch (error.code) {
              case "EMAIL_TAKEN":
                console.log("The new user account cannot be created because the email is already in use.");
                alert("Email address already in use.  Please enter new email");
                break;
              case "INVALID_EMAIL":
                console.log("The specified email is not a valid email.");
                alert("Invalid email address. Please try again"); 
                break;
              default:
                console.log("Error creating user:", error);
            }
          } 
          else {
            console.log("Successfully created user account with uid:", userData.uid);
            alert("User successfully created. Please log in to continue.");
          }

          $scope.usernameLength = $scope.username.length;
          console.log("username length", $scope.usernameLength);
          if ($scope.usernameLength > $scope.letterLimit) {
            $scope.userName = $scope.username.slice(0, 20);
          } else {
            $scope.userName = $scope.username;
            }

          var player = ref.child(userData.uid);
          player.set(
          {
            'gamesPlayed': 0,
            'gamesWon': 0,
            'gamesLost': 0,
            'highScore': 0,
            'username': $scope.userName,
            'uid': userData.uid
          });
        });
      }
      else {
        alert("Username already used. Please try a different name.");
      }
    };

    // after user is created they must then login
    $scope.loginUser = function() {
      ref.authWithPassword({
        email    : $scope.loginEmail,
        password : $scope.loginPassword
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
    };
  }]);



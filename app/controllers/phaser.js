
app.controller("gameCtrl", ["$scope", "stats", "sessionStats", "uidHandle", "$firebaseObject", "$firebaseArray",
    function($scope, stats, sessionStats, uidHandle, $firebaseObject, $firebaseArray) {

    var uid = uidHandle.getUid();

    var playerRef = new Firebase("https://bears-beets.firebaseio.com/players/" + uid);

    // Put the top 5 high scores in Leaderboard in stats modal 
    var ref = new Firebase("https://bears-beets.firebaseio.com/players");
    $scope.leaderBoard = $firebaseArray(ref);
    $scope.leaderBoard.$loaded(function() {

    });




    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

        //  The Google WebFont Loader will look for this object, so create it before loading the script.
        WebFontConfig = {

        //  'active' means all requested fonts have finished loading
        //  We set a 1 second delay before calling 'createText'.
        //  For some reason if we don't the browser cannot render the text the first time it's created.
        // active: function() { game.time.events.add(Phaser.Timer.SECOND, this); },

        //  The Google Fonts we want to load (specify as many as you like in the array)
        google: {
          families: ['Revalia', 'Orbitron', 'Bangers']
        }

    };
    
    game.state.add('level1', {preload: preload, create: create, update: update, render:render});
    game.state.start('level1');

    var started = false;
    var player;
    var platforms;
    var cursors;
    var beets;
    var score = 0;
    var finalScore = 0;
    var scoreText;
    var enemyText;
    var playerText;
    var endText;
    var startText;
    var sky;
    var clouds;
    var cabinet;
    var bears;
    var bears2;
    var bear3;
    var enemy;
    var grounds;
    var grass;
    var fixedCab;
    var fixedCab2;
    var bullets;
    var enemyBullets;
    var bulletTime = 0;
    var enemyHealth = 100;
    var playerHealth = 100;
    var firingTimer = 0;
    var blaster;
    var hit;
    var die;
    var enemyFireSound;
    var music;
    var button;
    var played;
    var sessionPlayed;
    var won;
    var sessionWon;
    var lost;
    var sessionLost;
    var highScore;
    var sessionHighScore;

    function preload() {
        game.load.image('sky', 'assets/sky3.png');
        game.load.image('cloud', 'assets/cloud.png');
        game.load.image('ground', 'assets/platform.png');
        game.load.image('dirt', 'assets/ground-tile.png');
        game.load.image('grass', 'assets/light_grass.png');
        game.load.image('beet', 'assets/beet.png');
        game.load.image('cabinet', 'assets/file-cabinet.png');
        game.load.image('cabinet2', 'assets/file-cabinet-clone.png');
        game.load.image('enemy', 'assets/battlestar.png');
        game.load.image('enemyBullet', 'assets/red_ball.png');
        game.load.audio('blaster', 'audio/blaster.mp3');
        game.load.audio('enemyHit', 'audio/explode1.wav');
        game.load.audio('enemyDie', 'audio/explosion.mp3');
        game.load.audio('enemyFire', 'audio/shot1.wav');
        game.load.audio('office', 'audio/office.wav');
        game.load.spritesheet('dude', 'assets/new-dude.png', 32, 48);
        game.load.spritesheet('bear', 'assets/bear.png', 32, 32);
        game.load.spritesheet('explosion1', 'assets/boom32wh12.png', 32, 32);
        game.load.spritesheet('explosion2', 'assets/explosion.png', 64, 64);
        game.load.spritesheet('button', 'assets/button_sprite_sheet.png', 193, 71);

        //  Load the Google WebFont Loader script
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js');

    }

    function create() {
        //  We're going to be using physics, so enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.world.setBounds(0, 0, 2400, 600);



        blaster = game.add.audio('blaster');
        hit = game.add.audio('enemyHit');
        die = game.add.audio('enemyDie');
        enemyFireSound = game.add.audio('enemyFire');
        music = game.add.audio('office');

        sky = game.add.tileSprite(0, 0, 2400, 600, 'sky');

        clouds = game.add.group();
        for (i=0; i<20; i++) {
            var cloud = clouds.create(Math.random() * (2300 - 30) + 30,
            Math.random() * (130 - 30) + 30, 'cloud');
        }

        // The player's bullets
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(30, 'beet');
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 0.5);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);

        // The enemy's bullets
        enemyBullets = game.add.group();
        enemyBullets.enableBody = true;
        enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
        enemyBullets.createMultiple(30, 'enemyBullet');
        enemyBullets.setAll('anchor.x', 0.5);
        enemyBullets.setAll('anchor.y', 1);
        enemyBullets.setAll('outOfBoundsKill', true);
        enemyBullets.setAll('checkWorldBounds', true);

        enemy = game.add.sprite(1500, 90, 'enemy');
        enemy.scale.setTo(4);
        enemy.enableBody = true;
        game.physics.arcade.enable(enemy);
        enemy.anchor.setTo(0.5, 0.5);
        enemy.body.setSize(20, 10, 0, 20);


        grass = game.add.tileSprite(0, 530, 8200, 530, 'grass');
        grass.scale.setTo(0.3);
        grass.enableBody = true;
        game.physics.arcade.enable(grass);
        grass.body.immovable = true;

        //  Adds row at bottom of screen that looks like dirt
        grounds = game.add.tileSprite(0, 570, 2400, 50, 'dirt');
        grounds.enableBody = true;

        // Small cabinets for depth randomly placed
        game.add.sprite(Math.random() * 2200, 505, 'cabinet');
        game.add.sprite(Math.random() * 2200, 505, 'cabinet');
        game.add.sprite(Math.random() * 2200, 505, 'cabinet');
        game.add.sprite(Math.random() * 2200, 505, 'cabinet');

        // Large cabinets randomly placed
        cabinet = game.add.group();
        cabinet.enableBody = true;
        for (i = 0; i < 12; i++) {
            var cab = cabinet.create(Math.random() * (2400 - 100) + 100, 510, 'cabinet');
            cab.scale.setTo(2);
            cab.anchor.setTo(0.5);
            game.physics.arcade.enable(cab);
            cab.body.immovable = true;
            cab.body.setSize(15, 22, 0, -3);
        }

        fixedCab = game.add.sprite(1200, 503, 'cabinet');
        fixedCab.scale.setTo(2);
        fixedCab.anchor.setTo(0.5);
        fixedCab.enableBody = true;
        game.physics.arcade.enable(fixedCab);
        fixedCab.body.immovable = true;
        fixedCab.body.setSize(15, 22, 0, -3);        

        fixedCab2 = game.add.sprite(1250, 503, 'cabinet');
        fixedCab2.scale.setTo(2);
        fixedCab2.anchor.setTo(0.5);
        fixedCab2.enableBody = true;
        game.physics.arcade.enable(fixedCab2);
        fixedCab2.body.immovable = true;
        fixedCab2.body.setSize(15, 22, 0, -3);

        fixedCab3 = game.add.sprite(1300, 503, 'cabinet');
        fixedCab3.scale.setTo(2);
        fixedCab3.anchor.setTo(0.5);
        fixedCab3.enableBody = true;
        game.physics.arcade.enable(fixedCab3);
        fixedCab3.body.immovable = true;
        fixedCab3.body.setSize(15, 22, 0, -3);

        fixedCab4 = game.add.sprite(1250, 445, 'cabinet2');
        fixedCab4.scale.setTo(2);
        fixedCab4.anchor.setTo(0.5);
        fixedCab4.enableBody = true;
        game.physics.arcade.enable(fixedCab4);
        fixedCab4.body.immovable = true;
        fixedCab4.body.setSize(15, 22, 0, -3);        

        fixedCab5 = game.add.sprite(1250, 387, 'cabinet2');
        fixedCab5.scale.setTo(2);
        fixedCab5.anchor.setTo(0.5);
        fixedCab5.enableBody = true;
        game.physics.arcade.enable(fixedCab5);
        fixedCab5.body.immovable = true;
        fixedCab5.body.setSize(15, 22, 0, -3);


        bears = game.add.group();
        bears.enableBody = true;
        for (i = 0; i < 2; i++) {
            var bear = bears.create(Math.random() * (2300 - 150) + 150, 510, 'bear');
            bear.scale.setTo(4);
            bear.anchor.setTo(0.5);
            game.physics.arcade.enable(bear);
            bear.body.setSize(23, 15, -15, 0);
            bear.animations.add('move', 
                [0, 0, 0, 0, 0, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2], 5, true);
            bear.animations.play('move', 4, true);
        }        

        bears2 = game.add.group();
        bears2.enableBody = true;
        for (i = 0; i < 3; i++) {
            var bear2 = bears2.create(Math.random() * (2300 - 150) + 150, 510, 'bear');
            bear2.scale.setTo(4);
            bear2.anchor.setTo(0.5);
            game.physics.arcade.enable(bear2);
            bear2.body.setSize(23, 15, -15, 0);
            bear2.animations.add('move', [0, 0, 0, 1, 1, 2, 3, 3, 3, 2], 3, true);
            bear2.animations.play('move', 4, true);
        }

        bear3 = game.add.sprite(775, 510, 'bear');
        bear3.frame = 0;
        bear3.anchor.setTo(0.5);
        bear3.enableBody = true;
        game.physics.arcade.enable(bear3);
        bear3.body.immovable = true;
        bear3.body.setSize(20, 10, 10, 10);
        bear3.scale.setTo(-6, 6);        

        bear4 = game.add.sprite(1700, 510, 'bear');
        bear4.frame = 0;
        bear4.anchor.setTo(0.5);
        bear4.enableBody = true;
        game.physics.arcade.enable(bear4);
        bear4.body.immovable = true;
        bear4.body.setSize(20, 10, 10, 10);
        bear4.scale.setTo(-6, 6);

        // The player and its settings
        player = game.add.sprite(32, 450, 'dude');
        player.anchor.setTo(0.5);
        player.scale.setTo(1.5);
        //  We need to enable physics on the player
        game.physics.arcade.enable(player);
        //  Player physics properties. Give the little guy a slight bounce.
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 500;
        player.body.collideWorldBounds = true;
        //  Our two animations, walking left and right.
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);
        player.body.setSize(18, 35, 0, 10);
        game.camera.follow(player);

        //  Finally some beets to collect
        beets = game.add.group();
        //  We will enable physics for any beet that is created in this group
        beets.enableBody = true;
        //  Here we'll create 12 of them evenly spaced apart
        for (var i = 0; i < 20; i++)
        {
            //  Create a beet inside of the 'beets' group
            var beet = beets.create((i * 120) + 80, 400, 'beet');
            //  Let gravity do its thing
            beet.body.gravity.y = 300;
            //  This just gives each beet a slightly random bounce value
            beet.body.bounce.y = 0.3 + Math.random() * 0.2;
        }

        //  The score
        scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '28px', fill: '#000' });
        scoreText.fixedToCamera = true;
        scoreText.cameraOffset.setTo(16, 16);

        enemyText = game.add.text(400, 35, 'Enemy Health: 100%', 
            { fontSize: '28px', fill: '#000' });
        enemyText.anchor.setTo(0.5, 0.5);
        enemyText.fixedToCamera = true;
        enemyText.cameraOffset.setTo(400, 35);

        playerText = game.add.text(590, 16, 'Health: 100%', { fontSize: '28px', fill: '#000' });
        playerText.fixedToCamera = true;
        playerText.cameraOffset.setTo(590, 16);

        scoreText.font = 'Garamond';
        enemyText.font = 'Garamond';
        playerText.font = 'Garamond';

        endText = game.add.text(400, game.world.height/4, "", 
            {fontSize: '32px Revalia', fill: '#000', align: 'center'});
        endText.anchor.setTo(0.5, 0.5);
        endText.fixedToCamera = true;
        endText.cameraOffset.setTo(400, game.world.height/4);

        startText = game.add.text(400, game.world.height/4, "", 
            {fontSize: '20px Revalia', fill: '#000', align: 'center'});
        startText.anchor.setTo(0.5, 0.5);
        startText.fixedToCamera = true;
        startText.cameraOffset.setTo(400, game.world.height/4);

        textButton = game.add.text(400, 250, 'Click Here To Play Again!', 
            {fontSize: '38px Revalia', fill: '#8a0662'});
        textButton.anchor.setTo(0.5);
        textButton.fixedToCamera = true;
        textButton.cameraOffset.setTo(400, 250);
        textButton.inputEnabled = true;
        textButton.input.useHandCursor = true;
        textButton.setShadow(2, 2, 'rgba(0,0,0,0.5)', 1);
        textButton.events.onInputDown.add(function () {
            restartGame();
        }, this, 2);

        //  Our controls.
        cursors = game.input.keyboard.createCursorKeys();
        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        // Set session stats to zero
        var startingPlayed = sessionStats.getgamesPlayed();
        var startingWon = sessionStats.getgamesWon();
        var startingLost = sessionStats.getgamesLost();
        var startingHigh = sessionStats.gethighScore();
        var user = sessionStats.getuserName();

        $('#lost').html('Lost:' + " " + startingLost);
        $('#won').html('Won:' + " " + startingWon);
        $('#played').html('Played:' + " " + startingPlayed);
        $('#high').html('High Score:' + " " + startingHigh);
        $('#greeting').html('Hey' + " " + user + ", lets play!");

        // Set player stats in modal to current Firebase stats
        var $player = $firebaseObject(playerRef);
            $player.$loaded(function() {
                $scope.played = $player.gamesPlayed;
                $scope.high = $player.highScore;
                $scope.won = $player.gamesWon;
                $scope.lost = $player.gamesLost;
                $scope.Name = $player.username;
              });
    }

    function update() {

        textButton.visible = false;

        if (player.alive === false) {
            textButton.visible = true;
        }

        music.play('', 0, 2, false, false);

        // Move enemy back and forth
        if (enemy.body.position.x < 1700) {
            game.add.tween(enemy).to({x: 2300}, 5000, Phaser.Easing.Out, true);
        }
        if (enemy.body.position.x > 2250) {
            game.add.tween(enemy).to({x: 1650}, 5000, Phaser.Easing.Out, true);
        }

        game.physics.arcade.collide(player, grass);
        game.physics.arcade.collide(player, cabinet);
        game.physics.arcade.collide(player, fixedCab);
        game.physics.arcade.collide(player, fixedCab2);
        game.physics.arcade.collide(player, fixedCab3);
        game.physics.arcade.collide(player, fixedCab4);
        game.physics.arcade.collide(player, fixedCab5);
        game.physics.arcade.collide(player, bear3, hitBigBear);
        game.physics.arcade.collide(player, bear4, hitBigBear);
        game.physics.arcade.collide(beets, grass);
        game.physics.arcade.collide(beets, cabinet);
        game.physics.arcade.collide(beets, fixedCab3);
        game.physics.arcade.collide(enemyBullets, fixedCab, killBullet);
        game.physics.arcade.collide(enemyBullets, fixedCab2, killBullet);
        game.physics.arcade.collide(enemyBullets, fixedCab3, killBullet);
        game.physics.arcade.collide(enemyBullets, fixedCab4, killBullet);
        game.physics.arcade.collide(enemyBullets, fixedCab5, killBullet);

        game.physics.arcade.overlap(player, beets, collectBeet, null, this);
        game.physics.arcade.overlap(player, bears, hitBear, null, this);
        game.physics.arcade.overlap(player, bears2, hitBear, null, this);

        game.physics.arcade.overlap(bullets, enemy, enemyHit, null, this);
        game.physics.arcade.overlap(enemyBullets, player, playerHit, null, this);
       
        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;
        if (cursors.left.isDown)
        {
            started = true;
            //  Move to the left
            player.body.velocity.x = -150;
            player.animations.play('left');
        }
        else if (cursors.right.isDown)
        {
            started = true;
            //  Move to the right
            player.body.velocity.x = 150;
            player.animations.play('right');
        }
        else
        {
            //  Stand still
            player.animations.stop();
            player.frame = 4;
        }
        
        //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown && player.body.touching.down)
        {
            started = true;
            player.body.velocity.y = -350;
        }

        //  player firing
        if (fireButton.isDown)
        {
            started = true;
            fireBullet();

        }
        // && started prevents enemy from firing until game starts
        if (game.time.now > firingTimer && started)
        {
            enemyFires();
        }
    }

    function restartGame () {
        score = 0;
        enemyHealth = 100;
        playerHealth = 100;
        enemy.alive = true;
        player.alive = true;
        started = false;
        game.state.start('level1');
        music.stop();
    }

    function playerHit (player, bullet) {
        bullet.kill();
        score -= 50;
        scoreText.text = 'Score: ' + score;
        playerHealth -= 20;
        if (playerHealth < 0) {
            playerHealth = 0;
        }

        playerText.text = 'Health: ' + playerHealth + '%';

        var explosion = this.add.sprite(player.x, player.y, 'explosion1');
        explosion.anchor.setTo(0.5, 0.5);
        explosion.animations.add('boom');
        explosion.play('boom', 15, false, true);

        if (playerHealth === 0) {
            endGame();
            gameStats();

            // Because session stats and cumulative Firebase stats are kept seperately
            // have to update both Firebase stats and session stats after each game
            sessionLost = sessionStats.getgamesLost();
            var newSessionLost = sessionLost + 1;
            sessionStats.setgamesLost(newSessionLost);
            $('#lost').html('Lost:' + " " + newSessionLost);
            endText.setText("Bummer!\nYou Got 'Beet' Down!");

            // Post stats to Firebase
            lost = stats.getgamesLost();
            var newLost = lost + 1;
            stats.setgamesLost(newLost);
        }
    }

    function enemyHit (enemy, bullet) {
        bullet.kill();
        hit.play('', 0, 0.5, false, false);
        score += 50;
        scoreText.text = 'Score: ' + score;
        enemyHealth -= 5;
        enemyText.text = 'Enemy Health: ' + enemyHealth + '%';

        if (enemyHealth === 0) {
            die.play('', 0, 1, false, false);
            endGame();
            gameStats();

            // Because session stats and cumulative Firebase stats are kept seperately
            // have to update both Firebase stats and session stats after each game
            sessionWon = sessionStats.getgamesWon();
            var newSessionWon = sessionWon + 1;
            sessionStats.setgamesWon(newSessionWon);
            $('#won').html('Won:' + " " + newSessionWon);
            endText.setText("Congratulations!\nYou Saved Schrute's Beet Farm!");

            // Set Firebase stats
            won = stats.getgamesWon();
            var newWon = won + 1;
            stats.setgamesWon(newWon);
        }

        // explosion animation
        var explosion = this.add.sprite(enemy.x, enemy.y, 'explosion2');
        explosion.anchor.setTo(0.5, 0.5);
        explosion.animations.add('boom');
        explosion.play('boom', 15, false, true);
    }

    function fireBullet () {
        if (player.alive === true) {
            //  To avoid them being allowed to fire too fast we set a time limit
            if (game.time.now > bulletTime)
            {
                //  Grab the first bullet we can from the pool
                bullet = bullets.getFirstExists(false);

                if (bullet)
                {
                    //  And fire it
                    bullet.reset(player.x, player.y + 8);
                    bullet.body.velocity.y = -400;
                    bulletTime = game.time.now + 200;
                    blaster.play('', 0, 0.2, false, false);
                }
            }
        }
    }

    function enemyFires () {

        if (enemy.alive === true) {

        //  Grab the first bullet we can from the pool
        enemyBullet = enemyBullets.getFirstExists(false);

        var shooter = enemy;
        // And fire the bullet from this enemy
        enemyBullet.reset(enemy.body.x, enemy.body.y);
        enemyFireSound.play('', 0, 0.2, false, false);

        game.physics.arcade.moveToObject(enemyBullet,player,200);
        firingTimer = game.time.now + 1500;

        }
    }

    function killBullet(cab, bullet) {
        bullet.kill();
    }

    function collectBeet (player, beet) {
        // Removes the beet from the screen
        beet.kill();
        //  Add and update the score
        score += 100;
        scoreText.text = 'Score: ' + score;
        if (playerHealth <= 95) {
        playerHealth += 5;
        }
        playerText.text = 'Health: ' + playerHealth + '%';
    }

    //  Lose points for running into the bear
    function hitBear () {
        score -= 1;
        if (score < 0) {
            score = 0;
        }
        scoreText.text = 'Score: ' + score;
    }

    function hitBigBear () {
        score -= 10;
        if (score < 0) {
            score = 0;
        }
        scoreText.text = 'Score: ' + score;
        playerHealth -= 1;
        playerText.text = 'Health: ' + playerHealth + '%';
        if (playerHealth === 0) {
            endGame();
            gameStats();

            // Because session stats and cumulative Firebase stats are kept seperately
            // have to update both Firebase stats and session stats after each game
            sessionLost = sessionStats.getgamesLost();
            var newSessionLost = sessionLost + 1;
            sessionStats.setgamesLost(newSessionLost);
            $('#lost').html('Lost:' + " " + newLost);
            endText.setText("Bummer!\nGuess You Couldn't 'Bear' It!");

            // Set Firebase stats
            lost = stats.getgamesLost();
            var newLost = lost + 1;
            stats.setgamesLost(newLost);
        }
    }

    function endGame () {
        player.kill();
        enemy.kill();
        bears.callAll('kill');
        bears2.callAll('kill');
        bear3.kill();
        player.alive = false;
        enemy.alive = false;
        bullets.callAll('kill');
        enemyBullets.callAll('kill');
    }

    function bonusPoints () {
        if (playerHealth >= 50) {
            score += 2000;
        }  else {
            score = score;
        }
            scoreText.text = 'Score: ' + score;
            return score;
        
    }

    function gameStats () {

        // Because session stats and cumulative Firebase stats are kept seperately
        // have to update both Firebase stats and session stats after each game

        finalScore = bonusPoints();

        sessionHighScore = sessionStats.gethighScore();
        if (finalScore > sessionHighScore) {
            sessionStats.sethighScore(finalScore);
        }

        highScore = stats.gethighScore();
        if (finalScore > highScore) {
            stats.sethighScore(finalScore);
        }

        sessionPlayed = sessionStats.getgamesPlayed();
        newSessionPlayed = sessionPlayed + 1;
        sessionStats.setgamesPlayed(newSessionPlayed);        

        played = stats.getgamesPlayed();
        newPlayed = played + 1;
        stats.setgamesPlayed(newPlayed);

        var newHighScore = sessionStats.gethighScore();
        $('#played').html('Played:' + " " + newPlayed);
        $('#high').html('High Score:' + " " + newHighScore);
    }

    $scope.logout = function() {
      ref.unauth();
      window.location = '/';
    };

    function render() {
        // game.debug.body(fixedCab);
        // cabinet.forEach(function(cab) {
        //     game.debug.body(cab);
        // })
    }
}]);

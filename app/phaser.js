
app.controller("gameCtrl", ["$scope", "stats", function($scope, stats) {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

        //  The Google WebFont Loader will look for this object, so create it before loading the script.
        WebFontConfig = {

        //  'active' means all requested fonts have finished loading
        //  We set a 1 second delay before calling 'createText'.
        //  For some reason if we don't the browser cannot render the text the first time it's created.
        active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },

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
    var cloud;
    var cabinet;
    var bear;
    var bear2;
    var enemy;
    var grounds;
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
    var office;
    var button;

    function preload() {
        game.load.image('sky', 'assets/sky3.png');
        game.load.image('cloud', 'assets/cloud.png');
        game.load.image('ground', 'assets/platform.png');
        game.load.image('beet', 'assets/beet.png');
        game.load.image('cabinet', 'assets/file-cabinet.png');
        game.load.image('enemy', 'assets/battlestar.png');
        game.load.image('grounds', 'assets/ground-tile.png');
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

        blaster = game.add.audio('blaster');
        hit = game.add.audio('enemyHit');
        die = game.add.audio('enemyDie');
        enemyFireSound = game.add.audio('enemyFire');
        office = game.add.audio('office');

        sky = game.add.sprite(0, 0, 'sky');
        cloud = game.add.sprite(30, 30, 'cloud');
        cloud = game.add.sprite(100, 50, 'cloud');
        cloud = game.add.sprite(210, 20, 'cloud');
        cloud = game.add.sprite(500, 90, 'cloud');
        cloud = game.add.sprite(550, 60, 'cloud');

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

        enemy = game.add.sprite(100, 90, 'enemy');
        enemy.scale.setTo(4);
        enemy.enableBody = true;
        game.physics.arcade.enable(enemy);
        enemy.anchor.setTo(0.5, 0.5);
        enemy.body.setSize(20, 10, 0, 20);

        //  The platforms group contains the ground
        platforms = game.add.group();
        //  We will enable physics for any object that is created in this group
        platforms.enableBody = true;
        // Here we create the ground.
        var ground = platforms.create(0, game.world.height - 64, 'ground');
        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        ground.scale.setTo(2, 2);
        //  This stops it from falling away when you jump on it
        ground.body.immovable = true;
        //  Adds row at bottom of screen that looks like dirt
        grounds = game.add.tileSprite(0, 570, 800, 50, 'grounds');

        //  Small cabinets for depth randomly placed
        game.add.sprite(Math.random() * 700, 505, 'cabinet');
        game.add.sprite(Math.random() * 700, 505, 'cabinet');

        //  Large cabinets randomly placed
        cabinet = game.add.group();
        cabinet.enableBody = true;
        for (i = 0; i < 4; i++) {
            var cab = cabinet.create(Math.random() * (700 - 100) + 100, 510, 'cabinet');
            cab.scale.setTo(2);
            cab.anchor.setTo(0.5);
            game.physics.arcade.enable(cab);
            cab.body.immovable = true;
            cab.body.setSize(15, 22, 0, -3);
        }

        bear = game.add.sprite(Math.floor(Math.random() * (400 - 120)) + 120, 503, 'bear');
        bear.anchor.setTo(0.5);
        bear.scale.setTo(4);
        bear.enableBody = true;
        game.physics.arcade.enable(bear);
        bear.body.setSize(23, 15, -15, 0);
        bear.animations.add('move', [0, 0, 0, 0, 0, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2], 5, true);
        bear.animations.play('move', 4, true);

        bear2 = game.add.sprite(Math.floor(Math.random() * (800 - 400)) + 400, 503, 'bear');
        bear2.anchor.setTo(0.5);
        bear2.scale.setTo(4);
        bear2.enableBody = true;
        game.physics.arcade.enable(bear2);
        bear2.body.setSize(23, 15, -15, 0);
        bear2.animations.add('move', [0, 0, 0, 1, 1, 2, 3, 3, 3, 2], 3, true);
        bear2.animations.play('move', 4, true);

        // The player and its settings
        player = game.add.sprite(32, game.world.height - 150, 'dude');
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

        //  Finally some beets to collect
        beets = game.add.group();
        //  We will enable physics for any beet that is created in this group
        beets.enableBody = true;
        //  Here we'll create 12 of them evenly spaced apart
        for (var i = 0; i < 12; i++)
        {
            //  Create a beet inside of the 'beets' group
            var beet = beets.create(i * 70, 400, 'beet');
            //  Let gravity do its thing
            beet.body.gravity.y = 300;
            //  This just gives each beet a slightly random bounce value
            beet.body.bounce.y = 0.3 + Math.random() * 0.2;
        }

        //  The score
        scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '28px', fill: '#000' });
        enemyText = game.add.text(game.world.centerX, 35, 'Enemy Health: 100%', { fontSize: '28px', fill: '#000' });
        enemyText.anchor.setTo(0.5, 0.5);
        playerText = game.add.text(590, 16, 'Health: 100%', { fontSize: '28px', fill: '#000' });

        scoreText.font = 'Orbitron';
        enemyText.font = 'Orbitron';
        playerText.font = 'Orbitron';

        endText = game.add.text(game.world.centerX, game.world.height/4, "", {fontSize: '32px', fill: '#000', align: 'center'});
        endText.anchor.setTo(0.5, 0.5);
        startText = game.add.text(game.world.centerX, game.world.height/4, "", {fontSize: '20px', fill: '#000', align: 'center'});
        startText.anchor.setTo(0.5, 0.5);

        button = game.add.button(game.world.centerX - 95, 250, 'button', actionOnClick, this, 2, 2);

        //  Our controls.
        cursors = game.input.keyboard.createCursorKeys();
        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    }

    function update() {

        button.visible = false;

        if (player.alive === false) {
            button.visible = true;
        }

        office.play('', 0, 4, false, false);

        // Move enemy back and forth
        if (enemy.body.position.x < 70) {
            game.add.tween(enemy).to({x: 561}, 5000, Phaser.Easing.Out, true);
        }
        
        if (enemy.body.position.x > 520) {
            game.add.tween(enemy).to({x: 69}, 5000, Phaser.Easing.Out, true);
        }

        //  Collide the player and the beets with the platforms and cabinets
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(player, cabinet);
        game.physics.arcade.collide(beets, platforms);
        game.physics.arcade.collide(beets, cabinet);
        //  Checks to see if the player overlaps with any of the beets or bears
        game.physics.arcade.overlap(player, beets, collectBeet, null, this);
        game.physics.arcade.overlap(player, bear, hitBear, null, this);
        game.physics.arcade.overlap(player, bear2, hitBear, null, this);

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

        if (game.time.now > firingTimer && started)
        {
            enemyFires();
        }
    }

    function actionOnClick () {
        score = 0;
        enemyHealth = 100;
        playerHealth = 100;
        enemy.alive = true;
        player.alive = true;
        started = false;
        game.state.start('level1');
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

        if (playerHealth <= 0) {
            player.kill();
            bullets.callAll('kill');
            player.alive = false;
            enemy.alive = false;
            endText.setText("Bummer!\nYou Got 'Beet' Down!\nClick to play again");
        }
    }

    function enemyHit (enemy, bullet) {
        bullet.kill();
        hit.play('', 0, 0.5, false, false);
        score += 50;
        scoreText.text = 'Score: ' + score;
        enemyHealth -= 50;
        enemyText.text = 'Enemy Health: ' + enemyHealth + '%';
        if (enemyHealth === 0) {
            
            finalScore = bonusPoints();
            console.log("final score", finalScore);
            
            var highScore = stats.gethighScore();
            console.log("high score", highScore);
            if (finalScore > highScore) {
                stats.sethighScore(finalScore);
            }

            enemy.kill();
            bear.kill();
            bear2.kill();
            player.kill();
            die.play('', 0, 1, false, false);
            enemyBullets.callAll('kill');
            enemy.alive = false;
            endText.setText("Congratulations!\nYou Saved Schrute's Beet Farm!\nClick to play again");
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

    function bonusPoints () {
        if (playerHealth >= 50) {
            score += 1000;
            scoreText.text = 'Score: ' + score;
            return score;
        }
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
        scoreText.text = 'Score: ' + score;
        // playerHealth = playerHealth - 10;
        // playerText.text = 'Health: ' + playerHealth + '%';
    }

    function render() {
        // game.debug.body(enemy);
        // cabinet.forEach(function(cab) {
        //     game.debug.body(cab);
        // })
    }
}]);

// var game = new Phaser.Game(800, 600, Phaser.AUTO);

// var player;
// var score = 0;
// var scoreText;
// var grass;
// var ground;
// var cursors;
// var cabinet;


// var GameState = {
//   preload: function() {
//     game.load.image('sky', 'assets/sky3.png');
//     game.load.image('grass', 'assets/light_grass.png');
//     game.load.image('ground', 'assets/ground-tile.png');
//     game.load.image('cabinet', 'assets/file-cabinet.png');
//     game.load.image('beet', 'assets/beet.png');
//     game.load.image('cloud', 'assets/cloud.png');
//     game.load.spritesheet('bear', 'assets/bear.png', 32, 32);
//     game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
//   },

//   create: function() {

//     game.physics.startSystem(Phaser.Physics.ARCADE);

//     game.sky = game.add.tileSprite(0, 0, 800, 600, 'sky');
//     grass = game.add.tileSprite(0, 550, 800, 50, 'grass');
//     // grass.enableBody(true);
//     // grass.body.immovable = true;

//     ground = game.add.tileSprite(0, 550, 800, 50, 'ground');
//     // ground.enableBody(true);
//     // ground.body.immovable = true;

//     game.cloud = game.add.sprite(20, 20, 'cloud');

//     cabinet = game.add.sprite(200, 475, 'cabinet');
//     cabinet.scale.setTo(2.5);

//     game.beet = game.add.sprite(300, 510, 'beet');
//     game.beet.scale.setTo(1.5);

//     game.bear = game.add.sprite(600, 520, 'bear');
//     game.bear.anchor.setTo(0.5);
//     game.bear.scale.setTo(4);

//     game.physics.arcade.enable(game.bear);

//     game.bear.animations.add('move', [0, 0, 0, 0, 1, 2, 2, 2, 2, 3], 4, true);

//     game.bear.animations.play('move', 4, true);

//     player = game.add.sprite(700, 400, 'dude');




//     // The player and its settings
//     // player = game.add.sprite(32, game.world.height - 150, 'dude');
//     //  We need to enable physics on the player
//     game.physics.arcade.enable(player);
//     //  Player physics properties. Give the little guy a slight bounce.
//     player.body.bounce.y = 0.2;
//     player.body.gravity.y = 300;
//     player.body.collideWorldBounds = true;
//     //  Our two animations, walking left and right.
//     player.animations.add('left', [0, 1, 2, 3], 10, true);
//     player.animations.add('right', [5, 6, 7, 8], 10, true);

//     cursors = game.input.keyboard.createCursorKeys();

//   },

//   update: function() {

//     game.physics.arcade.collide(player, grass);
//     game.physics.arcade.collide(player, cabinet);


//     player.body.velocity.x = 0;
//     if (cursors.left.isDown)
//     {
//         //  Move to the left
//         player.body.velocity.x = -150;
//         player.animations.play('left');
//     }
//     else if (cursors.right.isDown)
//     {
//         //  Move to the right
//         player.body.velocity.x = 150;
//         player.animations.play('right');
//     }
//     else
//     {
//         //  Stand still
//         player.animations.stop();
//         player.frame = 4;
//     }
    
//     //  Allow the player to jump if they are touching the ground.
//     if (cursors.up.isDown)
//     {
//         player.body.velocity.y = -350;
//     }
//   }
// };

// game.state.add("GameState", GameState);
// game.state.start("GameState");



var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('sky', 'assets/sky3.png');
    game.load.image('cloud', 'assets/cloud.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('beet', 'assets/beet.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.image('cabinet', 'assets/file-cabinet.png');
    game.load.spritesheet('bear', 'assets/bear.png', 32, 32);
    game.load.image('ship', 'assets/battlestar.png');
    game.load.image('grounds', 'assets/ground-tile.png');
}

var player;
var platforms;
var cursors;
var beets;
var score = 0;
var scoreText;
var sky;
var cloud;
var cabinet;
var bear;
var ship;
var grounds;

function create() {
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    sky = game.add.sprite(0, 0, 'sky');
    cloud = game.add.sprite(30, 30, 'cloud');
    cloud = game.add.sprite(100, 50, 'cloud');
    cloud = game.add.sprite(210, 20, 'cloud');
    cloud = game.add.sprite(500, 90, 'cloud');
    cloud = game.add.sprite(550, 60, 'cloud');

    ship = game.add.sprite(29, 70, 'ship');
    ship.scale.setTo(4);
    ship.enableBody = true;
    game.physics.arcade.enable(ship);


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

    game.add.sprite(Math.random() * 700, 505, 'cabinet');
    game.add.sprite(Math.random() * 700, 505, 'cabinet');

    cabinet = game.add.group();
    cabinet.enableBody = true;

    for (i = 0; i < 4; i++) {
        var cab = cabinet.create(Math.random() * 700, 510, 'cabinet');
        cab.scale.setTo(2);
        cab.anchor.setTo(0.5);
        game.physics.arcade.enable(cab);
        cab.body.immovable = true;
    }

    game.bear = game.add.sprite(Math.random() * 700, 503, 'bear');
    game.bear.anchor.setTo(0.5);
    game.bear.scale.setTo(4);
    game.bear.enableBody = true;

    game.physics.arcade.enable(game.bear);

    game.bear.animations.add('move', [0, 0, 0, 0, 0, 1, 1, 2, 3, 3, 3, 3, 2], 5, true);

    game.bear.animations.play('move', 4, true);


    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');
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
        //  Create a star inside of the 'stars' group
        var beet = beets.create(i * 70, 400, 'beet');
        //  Let gravity do its thing
        beet.body.gravity.y = 300;
        //  This just gives each star a slightly random bounce value
        beet.body.bounce.y = 0.3 + Math.random() * 0.2;
    }
    //  The score
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    
}

function update() {

    if (game.bear.position.x < 50) {
        game.bear.position.x = 200;
    }

    // Move ship back and forth
    if (ship.body.position.x < 30) {
        game.add.tween(ship).to({x: 661}, 5000, Phaser.Easing.Out, true);
    }
    
    if (ship.body.position.x > 660) {
        game.add.tween(ship).to({x: 29}, 5000, Phaser.Easing.Out, true);
    }

    //  Collide the player and the beets with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(player, cabinet);
    game.physics.arcade.collide(beets, platforms);
    game.physics.arcade.collide(beets, cabinet);
    //  Checks to see if the player overlaps with any of the beets, if he does call the collectBeet function
    game.physics.arcade.overlap(player, beets, collectBeet, null, this);
    game.physics.arcade.overlap(player, game.bear, hitBear, null, this);
    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;
        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
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
        player.body.velocity.y = -350;
    }
}
function collectBeet (player, beet) {
    // Removes the beet from the screen
    beet.kill();
    //  Add and update the score
    score += 100;
    scoreText.text = 'Score: ' + score;
}

//  Lose points for running into the bear
function hitBear () {
    score -= 1;
    scoreText.text = 'Score: ' + score;
}
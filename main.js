// Whole stage
var stage;
// Container the map and characters go into
var gameWorld;

// Current phase tracker, just in case
var currentPhase;

// Tracks whether movement is currently occurring
var movementOccuring = false;

// Map
var map;
var mapSize = 17;
var spawn;

//Side Menu
var g1;
var sideMenu;


function load(){
    init();
}

function init(){
    gameWorld = new createjs.Container();
    stage = new createjs.Stage("canvas");
    gameWorld.x = 0;
    gameWorld.y = 0;
    
    currentPhase = "menu";
    
    generateMap();
    
    // Side menu
    g1 = new createjs.Graphics().beginFill("#d3d3d3").drawRect(0, 0, 256, window.innerHeight);
    sideMenu = new createjs.Shape(g1);
    
    // Map movement by mouse added
    gameWorld.addEventListener('mousedown', mouseDnD);
    
    stage.addChild(gameWorld);
    stage.addChild(sideMenu);
    
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", tick);
        
    this.document.onkeydown = keyDown;
}

// Keyboard input
function keyDown(event){
    if (!movementOccuring){
        var key = event.keyCode;
        
        if (key === 65){
            // A
            if (gameWorld.x + 64 <= mapSize * 32 - 960){
                createjs.Tween.get(gameWorld, {override:false}).to({x:gameWorld.x + 64}, 1);
            }
        } else if (key === 68){
            // D
            if (gameWorld.x - 64 >= 0 - mapSize * 32 - 64){
                createjs.Tween.get(gameWorld, {override:false}).to({x:gameWorld.x - 64}, 1);
            }
        }
        if (key === 87){
            // W
            if (gameWorld.y + 64 <= mapSize * 32 - 960){
                createjs.Tween.get(gameWorld, {override:false}).to({y:gameWorld.y + 64}, 1);
            }
        } else if (key === 83){
            // S
            if (gameWorld.y - 64 >= 0 - mapSize * 32 - 64){
                createjs.Tween.get(gameWorld, {override:false}).to({y:gameWorld.y - 64}, 1);
            }
        }
    }
}

function handleComplete(){
    movementOccuring = false;
}

// Mouse map drag and drop
function mouseDnD(e){
    gameWorld.posX = e.stageX;
    gameWorld.posY = e.stageY;
    gameWorld.addEventListener('pressmove', function (e) {
        gameWorld.x = -gameWorld.posX + e.stageX + gameWorld.x; 
        gameWorld.y = -gameWorld.posY + e.stageY + gameWorld.y; 
        
        gameWorld.posX = e.stageX;
        gameWorld.posY = e.stageY;
    });
    gameWorld.addEventListener('pressup', function (e) {
        e.target.removeAllEventListeners();
    });
}

// This method is essentially what should happen every frame regardless of events
function tick(event){
    // Window resizing
    if (window.innerHeight < 960 + 256)
    {
        var cnv = document.getElementById("canvas");
        cnv.height = window.innerHeight - 10;
        cnv.width = window.innerHeight - 10 + 256;
        
    }
    
    // Side menu resizing
    g1 = new createjs.Graphics().beginFill("#d3d3d3").drawRect(0, 0, 256, window.innerHeight);
    sideMenu = new createjs.Shape(g1);
    
    stage.update(event);
}

// Generates the map, complete with events and stuff
function generateMap(){
    // Create the map
    map = new Array(mapSize);
    for (var i = 0; i < map.length; i++){
        map[i] = new Array(mapSize);
    }
    
    // Water tile
    var img = new Image();
    img.crossOrigin="Anonymous";
    img.src = "./Images/Water.png";
    var waterData = {
        images: [img],
        frames: {width:64, height:64},
        framerate: 10,
        animations: {
            exist:[0,15]
        }
    };
    var waterSheet = new createjs.SpriteSheet(waterData);
    
    // Grass tile
    img = new Image();
    img.crossOrigin="Anonymous";
    img.src = "./Images/Grass.png";
    var grassData = {
        images: [img],
        frames: {width:64, height:64},
        framerate: 4,
        animations: {
            exist:[0,3]
        }
    };
    var grassSheet = new createjs.SpriteSheet(grassData);
    
    // Sand tile
    img = new Image();
    img.crossOrigin="Anonymous";
    img.src = "./Images/Sand.png";
    var sandData = {
        images: [img],
        frames: {width:64, height:64},
        animations: {
            exist:[0]
        }
    };
    var sandSheet = new createjs.SpriteSheet(sandData);
    
    // Tree tile
    img = new Image();
    img.crossOrigin="Anonymous";
    img.src = "./Images/Tree.png";
    var treeData = {
        images: [img],
        frames: {width: 64, height:64},
        framerate: 4,
        animations: {
            exist:[0,7]
        }
    };
    var treeSheet = new createjs.SpriteSheet(treeData);
    
    // Rock tile
    img = new Image();
    img.crossOrigin="Anonymous";
    img.src = "./Images/Rock.png";
    var rockData = {
        images: [img],
        frames: {width: 64, height: 64},
        animations: {
            exist:[0]
        }
    }
    var rockSheet = new createjs.SpriteSheet(rockData);
    
    // Bush tile
    img = new Image();
    img.crossOrigin="Anonymous";
    img.src = "./Images/Bush.png";
    var bushData = {
        images: [img],
        frames: {width: 64, height: 64},
        framerate: 4,
        animations: {
            exist:[0,3]
        }
    }
    var bushSheet = new createjs.SpriteSheet(bushData);
    
    // Action item
    img = new Image();
    img.crossOrigin="Anonymous";
    img.src = "./Images/Action.png";
    var actionData = {
        images: [img],
        frames: {width: 64, height: 64},
        framerate: 12,
        animations: {
            exist:[0,13]
        }
    }
    var actionSheet = new createjs.SpriteSheet(actionData);
    
    // Initial map placement of either grass or water types
    for (var i = 0; i < map.length; i++){
        for (var j = 0; j < map.length; j++){
            var type;
            
            if (i === 0 || i === map.length - 1 || j === 0 || j === map.length - 1){ 
                // If the tile is on the edge of the map, make it water
                type = "water";
            } else if (i === 1 || i === map.length - 2 || j === 1 || j === map.length - 2){ 
                // If the tile is the next layer in from the edge, make it 75% chance it is water
                if (randomNumber(1,4) === randomNumber(1,4)){
                    type = "grass";
                } else {
                    type = "water";
                }
            } else if (i === 2 || i === map.length - 3 || j === 2 || j === map.length - 3){ 
                // If the tile is 2 layers in, make it 25% chance it is water
                if (randomNumber(1,4) !== randomNumber(1,4)){
                    type = "grass";
                } else {
                    type = "water";
                }
            } else { 
                // All inner tiles have 4% chance of being water
                if (randomNumber(1,25) === randomNumber(1,25)){
                    type = "water";
                } else {
                    type = "grass";
                }
            }
            
            // Add the selected block to the map
            map[i][j] = {type:type, action:"nothing", rock:false, bush:false, spawn:false};
        }
    }
    
    // All inner water tiles have 25% chance of being next to other water tiles
    for (var i = 1; i < map.length - 1; i++){
        for (var j = 1; j < map.length - 1; j++){
            if (map[i-1][j].type === "water" || map[i+1][j].type === "water" || map[i][j-1].type === "water" || map[i][j+1].type === "water"){
                if (randomNumber(1,5) === randomNumber(1,5)){
                    map[i][j].type = "water";
                }
            }
        }
    }
    
    // Replace the tiles next to water with sand
    for (var i = 0; i < map.length; i++){
        for (var j = 0; j < map.length; j++){
            if (map[i][j].type === "water"){
                if (i + 1 < map.length - 1){
                    if (map[i+1][j].type === "grass"){
                        map[i+1][j].type = "sand";
                    }
                }
                if (i - 1 > 0){
                    if (map[i-1][j].type === "grass"){
                        map[i-1][j].type = "sand";
                    }
                }
                if (j + 1 < map.length - 1){
                    if (map[i][j+1].type === "grass"){
                        map[i][j+1].type = "sand";
                    }
                }
                if (j - 1 > 0){
                    if (map[i][j-1].type === "grass"){
                        map[i][j-1].type = "sand";
                    }
                }
            }
        }
    }
    
    // Populate island with trees, can't be next to another tree
    var treeCount = 3;
    while (treeCount > 0){
        for (var i = 0; i < map.length; i++){
            for (var j = 0; j < map.length; j++){
                if (map[i][j].type === "grass"){
                    if (randomNumber(1,100) === randomNumber(1,100) && map[i-1][j].type !== "tree" && map[i+1][j].type !== "tree" && map[i][j-1].type !== "tree" && map[i][j+1].type !== "tree" && map[i-1][j + 1].type !== "tree" && map[i+1][j-1].type !== "tree" && map[i+1][j+1].type !== "tree" && map[i-1][j-1].type !== "tree"){
                        map[i][j].type = "tree";
                        treeCount--;
                    }
                }
            }
        }
    }
    
    // Populate island with rocks, should probably be next to other rocks
    var first = true;
    var rockCount = mapSize / 5;
    while (rockCount > 0){
        for (var i = 0; i < map.length; i++){
            for (var j = 0; j < map.length; j++){
                if (map[i][j].type === "grass" || map[i][j].type === "sand"){
                    if (first){
                        if (randomNumber(1,50) === randomNumber(1,50)){
                            first = false;
                            map[i][j].rock = true;
                            rockCount--;
                        }
                    } else {
                        if (map[i-1][j].rock === true || map[i+1][j].rock === true || map[i][j-1].rock === true || map[i][j+1].rock === true){
                            if (randomNumber(1,4) === randomNumber(1,4)){
                                map[i][j].rock = true;
                                rockCount--;
                            }
                        } else {
                            if (randomNumber(1,50) === randomNumber(1,50)){
                                map[i][j].rock = true;
                                rockCount--;
                            }
                        }
                    }
                }
            }
        }
    }
    
    // Populate island with bushes, biased towards spawning with other bushes
    for (var i = 0; i < map.length; i++){
        for (var j = 0; j < map.length; j++){
            if (map[i][j].type === "grass" && map[i][j].rock !== true){
                if (map[i-1][j].bush === true || map[i+1][j].bush === true || map[i][j-1].bush === true || map[i][j+1].bush === true){
                    if (randomNumber(1,2) === randomNumber(1,2)){
                        map[i][j].bush = true;
                    }
                } else {
                    if (randomNumber(1,4) === randomNumber(1,4)){
                        map[i][j].bush = true;
                    }
                }
            }
        }
    }
    
    // Add events to the tiles
    for (var i = 0; i < map.length; i++){
        for (var j = 0; j < map.length; j++){
            if (map[i][j].type !== "water" || map[i][j].rock === true){
                if (map[i][j].bush === true){
                    map[i][j].action = "something";
                } else if (map[i][j].type === "tree"){
                    map[i][j].action = "tree";
                }
            }
        }
    }
    
    // Draw the map
    for (var i = 0; i < map.length; i++){
        for (var j = 0; j < map.length; j++){
            var block;
            if (map[i][j].type === "water"){
                block = new createjs.Sprite(waterSheet, "exist");
            } else if (map[i][j].type === "grass"){
                block = new createjs.Sprite(grassSheet, "exist");
            } else if (map[i][j].type === "sand"){
                block = new createjs.Sprite(sandSheet, "exist");
            } else if (map[i][j].type === "tree"){
                block = new createjs.Sprite(treeSheet, "exist");
            }
            block.x = i * 64;
            block.y = j * 64;
            gameWorld.addChild(block);
            
            if (map[i][j].rock === true){
                block = new createjs.Sprite(rockSheet, "exist");
                block.x = i * 64;
                block.y = j * 64;
                gameWorld.addChild(block);
            } else if (map[i][j].bush === true){
                block = new createjs.Sprite(bushSheet, "exist");
                block.x = i * 64;
                block.y = j * 64;
                gameWorld.addChild(block);
            }
            
            if (map[i][j].action !== "nothing"){
                block = new createjs.Sprite(actionSheet, "exist");
                block.x = i * 64;
                block.y = j * 64;
                gameWorld.addChild(block);
            }
        }
    }
}

function randomNumber(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//TODOs
//1. set up the game so the user is always index 0. DONE
//2. assign the 4 pc players names, x and y cords, etc are stored in their perspective array.
//3. per josh: deal out 1 cards to each player until they're gone. ((possibly in a randomized order for the player array)
var audioEngine = cc.AudioEngine.getInstance();

var BidClass = cc.LayerColor.extend({
	_isFivePlayer: true,
	FirstTurnIsHuman: false,
	Cards: [],
	GameStatus: 'Bidding',
	BidOptions: [0, 4, 5, 6, 7, 8],
	HighestCurrentBid: 0,
	IndexOfBidWinner: 0,
	Players:[], //contains the following::::
	 		//{ Bid(num), isDealer(bool), Cards(arr), PlayerId(num), OrderNumber(num), isHuman: true
			//	isDealer(bool), TeammemberIds(arr)}
	CurrentCardIndexForDealing: 0, //dumb thing used for dealering 2 /3 / 2 to players...needs refactor, not an important var
	CurrentDealerIndex: 0,
	CurrentPlayersTurnIndex: 0,
	IndicatorToRemove: 0,
	OriginalTurnIndex: 0,
	initialCall: true,
	StartVal: 0,
	EndVal: 4,
	FirstBid: true,
	HumanPlayerIndex: 0,
	GameTitle: "Bid Euchre",
	ctor: function () {
		this._super();
		cc.associateWithNative(this, cc.LayerColor);
	},
	onEnter: function () {
		this._super();
		if('touches' in sys.capabilities){
			this.setTouchEnabled(true);
		}
		if('mouse' in sys.capabilities){
			this.setMouseEnabled(true);
		}
		this.setupGame();
		//this.scheduleUpdate(); not sure we need this to fire all the time for a simple euchre game.  must investigate
	},
	setupGame: function () {

		this.createCards();
		this.createPlayers();

		this.createHumanPlayerCardSpots(); //create the spots for the players cards
		this.createOpponentNamesPositions(); //creates labels for the AI player names

		this.dealCards();
		this.displayHumanPlayersCards();

		this.displayDealerChip();
		this.displayCurrentPlayersTurnIndicator();

		//figure out original start index
		//loop through players from orgin start index
		//		have code aware that we don't go past 4, we go back to 0 at that point
		//check if human player
		//    break out and wait for human to provide input
		//start back into the loop until all players have bid....
		if(this.OriginalTurnIndex === 0){
			this.StartVal = this.OriginalTurnIndex;
			this.EndVal = 4;
		}else{
			this.StartVal = this.OriginalTurnIndex;
			this.EndVal = this.OriginalTurnIndex -1;
		}
		this.setupBidLogic();
				
		
	},
	setupBidLogic: function () {

	},
	setupAiBidLogic: function (){
		cc.log("called");
	},
	determineTrump: function () {
		//call that trump SONNNN...
	},
	displayHumanPlayerBidOptions: function(){
		cc.log('human');
	},
	doComputerPlayersBid: function () {
		if(this.HighestCurrentBid < 4){
			this.updateBid(4);
			cc.log('ai bid 4');
		}else{
			this.updateBid(0);
			cc.log('ai bid pass');
		}
	},
	updateBid: function (bidValue) {
		if(bidValue > this.HighestCurrentBid){

			var i = this.CurrentPlayersTurnIndex;
			this.Players[i].Bid = bidValue;
			//find a way to grey out or change the bid value color
			/*for(var k = 0; k < this.BidOptions.length; k++){
				var bidItem = this.BidOptions[k];
				if(bidItem !== 0 && bidItem < bidValue){
					this.BidOptions.splice(k, 1);
				}
			}*/
			this.HighestCurrentBid = bidValue;
		}
	},
	displayHumanPlayerBidOptions: function () {

		var xCords = winSize.width/3;
		var yCords = 345;
		var spacing = 125;

		this.GameStatus = "HumanBidding";

		for(var i = 0; i < this.BidOptions.length; i++){
			var bidTxt = this.BidOptions[i];
			if(i === 0){
				xCords = xCords - 85;
				bidTxt = "Pass";
			}
			if(i === 1){
				xCords = xCords + 45;
			}
			var bidOpt = cc.LabelTTF.create(bidTxt, "Arial", 55);;
        	
        	bidOpt.setColor(cc.c3b(0,0,0));
        	bidOpt.setPosition(new cc.Point(xCords, yCords));
        	this.addChild(bidOpt);
			xCords = spacing + xCords;
		}
	},
	createCards: function () {
		var cache = cc.SpriteFrameCache.getInstance();
        cache.addSpriteFrames(spritePlist, cardSprite);

        var temporaryCardArr = createCards(cache);
        
        this.Cards = shuffleArray(temporaryCardArr);

        //code to set the ID's for the Cards
        for(var i = 0; i < this.Cards.length; i++){
        	var currentCard = this.Cards[i];
        	currentCard.CardId = i + 1;
        }
	},
	createPlayers: function () {
		
		var tempPlayersArr = createPlayers();
		this.Players = tempPlayersArr;

		this.CurrentDealerIndex = chooseRandomDealerFunc(5) - 1;

		//if the dealer isn't the last player in the loop
		//then we want to make the currentPersonSTurn currDealrIdnx + 1;
		//otherwise the dealer is the last player so we make
		//the dealer 0
		if(this.CurrentDealerIndex !== 4){
			this.CurrentPlayersTurnIndex = this.CurrentDealerIndex + 1;
		}else{
			this.CurrentPlayersTurnIndex = 0;
		}
		this.OriginalTurnIndex = this.CurrentPlayersTurnIndex;
		//set the dealer
		this.Players[this.CurrentDealerIndex].isDealer = true;

  		for(var i = 0; i < this.Players.length; i++){
        	this.Players[i].PlayerId = i + 1;
        	cc.log("playerId: " + this.Players[i].PlayerId + "/////   isHuman: " + this.Players[i].isHuman + "////  index:" + i );
        }
	},
	createHumanPlayerCardSpots: function() {
		var spotNum = 8;
		var x = 180;
		var y = 200;
		for(var i = 0; i < spotNum; i++){
			//only add x value if we aren't on the first one
			if(i !== 0){
				x = x + 150;
			}
			var spot = cc.Sprite.create(cardSpotHolder);
			spot.setPosition(new cc.Point(x, y));
			this.addChild(spot);
		}
		var markerX = winSize.width/2;
		var markerY = 0;
		var playerMarker = cc.Sprite.create(aiSpotMarker);
		playerMarker.setPosition(new cc.Point(markerX, markerY));
		this.addChild(playerMarker);
	},
	createAiTopSpots: function (spotsToCreate){
		var spaceBetween = winSize.width/spotsToCreate;
		var padding = spaceBetween/2;
		var y = winSize.height;
		var x = padding;
		for(var i = 0; i < spotsToCreate; i++){
			var msg = "Dr. Doom";
			if(i === 1){
				msg = "Lord Business";
			}else if(i === 2){
				msg = "Guy Richie";
			}
			var aiSpot = createPlayerMarker(x, y);
			this.addChild(aiSpot);

			var playerLabel = creatAiLabel(msg, x, y-30)
			this.addChild(playerLabel);

			x = x + spaceBetween;
		}
	},
	createOpponentNamesPositions: function () {
		var x = 0;
		var y = winSize.height/1.5;

		//ai player to the left of human
		var leftSpot = createPlayerMarker(x, y)
		this.addChild(leftSpot);
		var leftAiLabel = creatAiLabel("Darth Vader", x+40, y);
		this.addChild(leftAiLabel);

		//all the players across the top spot.
		if(this._isFivePlayer){
			this.createAiTopSpots(2);
		}else{
			this.createAiTopSpots(3);
		}

		//ai on the right side and his marker;
		var rightSpot = createPlayerMarker(winSize.width, y);	
		this.addChild(rightSpot);	
		var rightAiLabel = creatAiLabel("Lex Luther", winSize.width - 40, y);
        this.addChild(rightAiLabel);
	},
	displayDealerChip: function () {
		var dealerChip = createDealerChip(this.CurrentDealerIndex);
		this.addChild(dealerChip);
	},
	displayCurrentPlayersTurnIndicator: function () {
		var currentTurnIndicator = displayCurrentTurn(this.CurrentPlayersTurnIndex)
		this.removeChild(this.IndicatorToRemove); //remove the old indicator before adding a new idicator
		this.IndicatorToRemove = currentTurnIndicator;
		this.addChild(currentTurnIndicator);
	},
	displayHumanPlayersCards: function () {

		var humanPlayer = this.Players[0];
		var x = 180;
		var y = 200;
		for(var k = 0; k < humanPlayer.Cards.length; k++){
			//only add x value if we aren't on the first one
			if(k !== 0){
				x = x + 150;
			}
			var spriteToShow = humanPlayer.Cards[k].SpriteRef;
			spriteToShow.setPosition(new cc.Point(x, y));
			this.addChild(spriteToShow);
		}


	},
	dealCards: function(){
		//regardless of 5 or 6 man, in both games everyone is dealt 8 hards.
		//so I think we can just loop through and make sure 

		for(var k = 0; k < this.Players.length; k++){
			var pIndex = k;
			this.dealNextCards(3, pIndex);
		}

		for(var i = 0; i < this.Players.length; i++){
			var playerIndex = i;
			this.dealNextCards(2, playerIndex);
		}

		for(var j = 0; j < this.Players.length; j++){
			var plyrIndex = j;
			this.dealNextCards(3, plyrIndex);
		}

		for(var m =0; m < this.Players.length; m++){
			var ply = this.Players[m];
			cc.log("player " + m);
			for(var x = 0; x < ply.Cards.length; x++){
				cc.log(ply.Cards[x]);
			}
		}
		
	},
	dealNextCards: function(numCardsToDeal, playerIndex){
		var playersCards = this.Players[playerIndex].Cards;
		for(var i = 0; i < numCardsToDeal; i++){
			playersCards.push(this.Cards[this.CurrentCardIndexForDealing]);
			this.CurrentCardIndexForDealing = this.CurrentCardIndexForDealing+1;
		}
	},
	checkHumanPlayersBid: function (loc){
		var xCords = loc.x;
        var yCords = loc.y;
        if(yCords < 370 && yCords > 325){
        	if(xCords > 335 && xCords < 455){
        		//player is passing
        		this.updateBid(0);
        		this.GameStatus = "Bidding";
        	}else if(xCords > 550 && xCords < 580){
        		//bid 4
        		this.updateBid(4);
        		this.GameStatus = "Bidding";
        	}else if(xCords > 675 && xCords < 705){
        		//bid 5
        		this.updateBid(5);
        		this.GameStatus = "Bidding";
        	}else if(xCords > 800 && xCords < 830){
        		//bid 6
        		this.updateBid(6);
        		this.GameStatus = "Bidding";
        	}else if(xCords > 925 && xCords < 955){
        		//bid 7
        		this.updateBid(7);
        		this.GameStatus = "Bidding";
        	}else if(xCords > 1050 && xCords < 1080){
        		//bid 8
        		this.updateBid(8);
        		this.GameStatus = "Bidding";
        	}
        }
        
	},
	locationTapped: function(location){ 
		/*audioEngine.playEffect(s_shootEffect);*/
		if(this.CurrentPlayersTurnIndex === 0 && this.GameStatus === "HumanBidding"){
			this.checkHumanPlayersBid(location);
		}
	},
	onMouseUp: function (event){
		var location = event.getLocation();
		this.locationTapped(location);
	},
	onTouchesEnded: function(touches, event){
		if(touches.length <= 0){
			return;
		}
		var touch = touches[0];
		var location = touch.getLocation();
		this.locationTapped(location);
	},
	update: function(dt){
		cc.log("update called");
	}
});

BidClass.create = function (isFivePlayer) {
	var sg = new BidClass();
	if(sg && sg.init(cc.c4b(0,75,35,255))) {
		return sg;
	}
	return null;
};

BidClass.scene = function (isFivePlayer) {
	var scene = cc.Scene.create(isFivePlayer);
	var layer = BidClass.create(isFivePlayer);
	scene._isFivePlayer = isFivePlayer;
	scene.addChild(layer);

	return scene;
};
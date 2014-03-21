//TODOs
//1. set up the game so the user is always index 0. DONE
//2. assign the 4 pc players names, x and y cords, etc are stored in their perspective array.
//3. per josh: deal out 1 cards to each player until they're gone. ((possibly in a randomized order for the player array)

var shuffleArrayHelperFunc = function(shuffleArr) {
    for (var i = shuffleArr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = shuffleArr[i];
        shuffleArr[i] = shuffleArr[j];
        shuffleArr[j] = temp;
    }
    return shuffleArr;
};

var chooseRandomDealerFunc = function(maxValue){
		var randNumber = Math.floor(Math.random() * maxValue) + 1;
		return randNumber;
};

var audioEngine = cc.AudioEngine.getInstance();

var BidClass = cc.LayerColor.extend({
	_isFivePlayer: true,
	FirstTurnIsHuman: false,
	Cards: [],
	GameStatus: 'Bidding',
	BidOptions: [0, 4, 5, 6, 7, 8],
	HighestCurrentBid: 0,
	IndexOfBidWinner: 0,
	Players:[],
	CurrentCardIndexForDealing: 0, //dumb thing used for dealering 2 /3 / 2 to players...needs refactor, not an important var
	CurrentDealerIndex: 0,
	CurrentPlayersTurnIndex: 0,
	IndicatorToRemove: 0,
	OriginalTurnIndex: 0,
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
		this.displayHumanPlayersCards();//future Kyle: here you can see randy's infulence in the naming conventions of your code

		this.displayDealerChip();
		this.displayCurrentPlayersTurnIndicator();

		this.setupBidLogic();		
		
	},
	setupBidLogic: function () {

		if(this.OriginalTurnIndex === 0){
			this.displayHumanPlayerBidOptions();
		}else{
			this.setupAiBidLogic();
		}
	}
	setupAiBidLogic: function (isFirstCall){
		cc.log(this.CurrentPlayersTurnIndex);
		if(isFirstCall){
			this.doComputerPlayersBid();
			this.CurrentPlayersTurnIndex = (this.CurrentPlayersTurnIndex !== 4) ? this.CurrentPlayersTurnIndex + 1 : 0;
			cc.log('new index for turn ===' + this.CurrentPlayersTurnIndex);	
		}else{
			if(this.CurrentPlayersTurnIndex !== this.OriginalTurnIndex){
				this.doComputerPlayersBid();
				this.CurrentPlayersTurnIndex = (this.CurrentPlayersTurnIndex !== 4) ? this.CurrentPlayersTurnIndex + 1 : 0;
				cc.log('new index for turn ===' + this.CurrentPlayersTurnIndex);
			}
		}
		
	},
	determineTrump: function () {
		//call that trump SONNNN...
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
			for(var k = 0; k < this.BidOptions.length; k++){
				var bidItem = this.BidOptions[k];
				if(bidItem !== 0 && bidItem < bidValue){
					this.BidOptions.splice(k, 1);
				}
			}
			this.HighestCurrentBid = bidValue;
		}
	},
	displayHumanPlayerBidOptions: function () {
		var xCords = winSize.width/3;
		var yCords = 345;
		var spacing = 125

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

        var tempArr = [];

        var AceClubs = { CardName: "Ace", CardSuit: "Clubs", SpriteRef: cc.Sprite.createWithSpriteFrameName("Ace_Clubs.png"), CardId: 0};
        var KingClubs = { CardName: "King", CardSuit: "Clubs", SpriteRef: cc.Sprite.createWithSpriteFrameName("King_Clubs.png"), CardId: 0};
        var QueenClubs = { CardName: "Queen", CardSuit: "Clubs", SpriteRef: cc.Sprite.createWithSpriteFrameName("Queen_Clubs.png"), CardId: 0};
        var JackClubs = { CardName: "Jack", CardSuit: "Clubs", SpriteRef: cc.Sprite.createWithSpriteFrameName("Jack_Clubs.png"), CardId: 0};
        var TenClubs = { CardName: "Ten", CardSuit: "Clubs", SpriteRef: cc.Sprite.createWithSpriteFrameName("Ten_Clubs.png"), CardId: 0};
        var NineClubs = { CardName: "Nine", CardSuit: "Clubs", SpriteRef: cc.Sprite.createWithSpriteFrameName("Nine_Clubs.png"), CardId: 0};

        var AceClubs2 = { CardName: "Ace", CardSuit: "Clubs", SpriteRef: cc.Sprite.createWithSpriteFrameName("Ace_Clubs.png"), CardId: 0};
        var KingClubs2 = { CardName: "King", CardSuit: "Clubs", SpriteRef: cc.Sprite.createWithSpriteFrameName("King_Clubs.png"), CardId: 0};
        var QueenClubs2 = { CardName: "Queen", CardSuit: "Clubs", SpriteRef: cc.Sprite.createWithSpriteFrameName("Queen_Clubs.png"), CardId: 0};
        var JackClubs2 = { CardName: "Jack", CardSuit: "Clubs", SpriteRef: cc.Sprite.createWithSpriteFrameName("Jack_Clubs.png"), CardId: 0};
        var TenClubs2 = { CardName: "Ten", CardSuit: "Clubs", SpriteRef: cc.Sprite.createWithSpriteFrameName("Ten_Clubs.png"), CardId: 0};
        var NineClubs2 = { CardName: "Nine", CardSuit: "Clubs", SpriteRef: cc.Sprite.createWithSpriteFrameName("Nine_Clubs.png"), CardId: 0};

        var AceSpades = { CardName: "Ace", CardSuit: "Spades", SpriteRef: cc.Sprite.createWithSpriteFrameName("Ace_Spades.png"), CardId: 0};
        var KingSpades = { CardName: "King", CardSuit: "Spades", SpriteRef: cc.Sprite.createWithSpriteFrameName("King_Spades.png"), CardId: 0};
        var QueenSpades = { CardName: "Queen", CardSuit: "Spades", SpriteRef: cc.Sprite.createWithSpriteFrameName("Queen_Spades.png"), CardId: 0};
        var JackSpades = { CardName: "Jack", CardSuit: "Spades", SpriteRef: cc.Sprite.createWithSpriteFrameName("Jack_Spades.png"), CardId: 0};
        var TenSpades = { CardName: "Ten", CardSuit: "Spades", SpriteRef: cc.Sprite.createWithSpriteFrameName("Ten_Spades.png"), CardId: 0};
        var NineSpades = { CardName: "Nine", CardSuit: "Spades", SpriteRef: cc.Sprite.createWithSpriteFrameName("Nine_Spades.png"), CardId: 0};

        var AceSpades2 = { CardName: "Ace", CardSuit: "Spades", SpriteRef: cc.Sprite.createWithSpriteFrameName("Ace_Spades.png"), CardId: 0};
        var KingSpades2 = { CardName: "King", CardSuit: "Spades", SpriteRef: cc.Sprite.createWithSpriteFrameName("King_Spades.png"), CardId: 0};
        var QueenSpades2 = { CardName: "Queen", CardSuit: "Spades", SpriteRef: cc.Sprite.createWithSpriteFrameName("Queen_Spades.png"), CardId: 0};
        var JackSpades2 = { CardName: "Jack", CardSuit: "Spades", SpriteRef: cc.Sprite.createWithSpriteFrameName("Jack_Spades.png"), CardId: 0};
        var TenSpades2 = { CardName: "Ten", CardSuit: "Spades", SpriteRef: cc.Sprite.createWithSpriteFrameName("Ten_Spades.png"), CardId: 0};
        var NineSpades2 = { CardName: "Nine", CardSuit: "Spades", SpriteRef: cc.Sprite.createWithSpriteFrameName("Nine_Spades.png"), CardId: 0};

        var AceHearts = { CardName: "Ace", CardSuit: "Hearts", SpriteRef: cc.Sprite.createWithSpriteFrameName("Ace_Hearts.png"), CardId: 0};
        var KingHearts = { CardName: "King", CardSuit: "Hearts", SpriteRef: cc.Sprite.createWithSpriteFrameName("King_Hearts.png"), CardId: 0};
        var QueenHearts = { CardName: "Queen", CardSuit: "Hearts", SpriteRef: cc.Sprite.createWithSpriteFrameName("Queen_Hearts.png"), CardId: 0};
        var JackHearts = { CardName: "Jack", CardSuit: "Hearts", SpriteRef: cc.Sprite.createWithSpriteFrameName("Jack_Hearts.png"), CardId: 0};
        var TenHearts = { CardName: "Ten", CardSuit: "Hearts", SpriteRef: cc.Sprite.createWithSpriteFrameName("Ten_Hearts.png"), CardId: 0};
        var NineHearts = { CardName: "Nine", CardSuit: "Hearts", SpriteRef: cc.Sprite.createWithSpriteFrameName("Nine_Hearts.png"), CardId: 0};

        var AceHearts2 = { CardName: "Ace", CardSuit: "Hearts", SpriteRef: cc.Sprite.createWithSpriteFrameName("Ace_Hearts.png"), CardId: 0};
        var KingHearts2 = { CardName: "King", CardSuit: "Hearts", SpriteRef: cc.Sprite.createWithSpriteFrameName("King_Hearts.png"), CardId: 0};
        var QueenHearts2 = { CardName: "Queen", CardSuit: "Hearts", SpriteRef: cc.Sprite.createWithSpriteFrameName("Queen_Hearts.png"), CardId: 0};
        var JackHearts2 = { CardName: "Jack", CardSuit: "Hearts", SpriteRef: cc.Sprite.createWithSpriteFrameName("Jack_Hearts.png"), CardId: 0};
        var TenHearts2 = { CardName: "Ten", CardSuit: "Hearts", SpriteRef: cc.Sprite.createWithSpriteFrameName("Ten_Hearts.png"), CardId: 0};
        var NineHearts2 = { CardName: "Nine", CardSuit: "Hearts", SpriteRef: cc.Sprite.createWithSpriteFrameName("Nine_Hearts.png"), CardId: 0};

        var AceDiamonds = { CardName: "Ace", CardSuit: "Diamonds", SpriteRef: cc.Sprite.createWithSpriteFrameName("Ace_Diamonds.png"), CardId: 0};
        var KingDiamonds = { CardName: "King", CardSuit: "Diamonds", SpriteRef: cc.Sprite.createWithSpriteFrameName("King_Diamonds.png"), CardId: 0};
        var QueenDiamonds = { CardName: "Queen", CardSuit: "Diamonds", SpriteRef: cc.Sprite.createWithSpriteFrameName("Queen_Diamonds.png"), CardId: 0};
        var JackDiamonds = { CardName: "Jack", CardSuit: "Diamonds", SpriteRef: cc.Sprite.createWithSpriteFrameName("Jack_Diamonds.png"), CardId: 0};
        var TenDiamonds = { CardName: "Ten", CardSuit: "Diamonds", SpriteRef: cc.Sprite.createWithSpriteFrameName("Ten_Diamonds.png"), CardId: 0};
        var NineDiamonds = { CardName: "Nine", CardSuit: "Diamonds", SpriteRef: cc.Sprite.createWithSpriteFrameName("Nine_Diamonds.png"), CardId: 0};

        var AceDiamonds2 = { CardName: "Ace", CardSuit: "Diamonds", SpriteRef: cc.Sprite.createWithSpriteFrameName("Ace_Diamonds.png"), CardId: 0};
        var KingDiamonds2 = { CardName: "King", CardSuit: "Diamonds", SpriteRef: cc.Sprite.createWithSpriteFrameName("King_Diamonds.png"), CardId: 0};
        var QueenDiamonds2 = { CardName: "Queen", CardSuit: "Diamonds", SpriteRef: cc.Sprite.createWithSpriteFrameName("Queen_Diamonds.png"), CardId: 0};
        var JackDiamonds2 = { CardName: "Jack", CardSuit: "Diamonds", SpriteRef: cc.Sprite.createWithSpriteFrameName("Jack_Diamonds.png"), CardId: 0};
        var TenDiamonds2 = { CardName: "Ten", CardSuit: "Diamonds", SpriteRef: cc.Sprite.createWithSpriteFrameName("Ten_Diamonds.png"), CardId: 0};
        var NineDiamonds2 = { CardName: "Nine", CardSuit: "Diamonds", SpriteRef: cc.Sprite.createWithSpriteFrameName("Nine_Diamonds.png"), CardId: 0};
        
        tempArr.push(AceClubs, KingClubs, QueenClubs, JackClubs, TenClubs, 
        		AceSpades, KingSpades, QueenSpades, JackSpades, TenSpades, 
        		AceHearts, KingHearts, QueenHearts, JackHearts, TenHearts, 
        		AceDiamonds, KingDiamonds, QueenDiamonds, JackDiamonds, TenDiamonds,
        		AceClubs2, KingClubs2, QueenClubs2, JackClubs2, TenClubs2, 
        		AceSpades2, KingSpades2, QueenSpades2, JackSpades2, TenSpades2, 
        		AceHearts2, KingHearts2, QueenHearts2, JackHearts2, TenHearts2, 
        		AceDiamonds2, KingDiamonds2, QueenDiamonds2, JackDiamonds2, TenDiamonds2);

        this.Cards = shuffleArrayHelperFunc(tempArr);

        //code to log the cars and make sure they got set
        for(var i = 0; i < this.Cards.length; i++){
        	var currentCard = this.Cards[i];
        	currentCard.CardId = i + 1;
        }
	},
	createPlayers: function () {
		var tempPlayersArr = [];
		var humanPlayer = { OrderNumber: 0,
        						Cards: [],
        						isHuman: true,
        						PlayerId: 0,
        						isDealer: false,
        						TeammemberIds: []
    						 };

		tempPlayersArr.push(humanPlayer,
    	 		{ OrderNumber: 0,
					Cards: [],
					isHuman: false,
					PlayerId: 0,
					isDealer: false,
					TeammemberIds: []
				 }, { OrderNumber: 0,
					Cards: [],
					isHuman: false,
					PlayerId: 0,
					isDealer: false,
					TeammemberIds: []
				 }, { OrderNumber: 0,
					Cards: [],
					isHuman: false,
					PlayerId: 0,
					isDealer: false,
					TeammemberIds: []
				 }, { OrderNumber: 0,
					Cards: [],
					isHuman: false,
					PlayerId: 0,
					isDealer: false,
					TeammemberIds: []
				 });

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
	createOpponentNamesPositions: function () {
		var x = 0;
		var y = winSize.height/1.5;
		var playerArr = this.Players;
		var aiIndex = 0;
		this.HumanPlayerIndex = 0;
		if(this.HumanPlayerIndex === playerArr.length -1){
			aiIndex = 0;
		}else{
			aiIndex = this.HumanPlayerIndex + 1;
		}
		var leftOfSpot = cc.Sprite.create(aiSpotMarker);
		var leftlabel = cc.LabelTTF.create("Darth Vader", "Arial", 14);
        
		leftOfSpot.setPosition(new cc.Point(x, y));
		this.addChild(leftOfSpot);

		leftlabel.setColor(cc.c3b(0,0,0));
        leftlabel.setPosition(new cc.Point(x+40, y));
        this.addChild(leftlabel);


		//creat first spot next to player based off his index.
		if(this._isFivePlayer){
			this.createAiTopSpots(2, aiIndex);
		}else{
			this.createAiTopSpots(3, aiIndex);
		}
		var rightOfSpot = cc.Sprite.create(aiSpotMarker);
		rightOfSpot.setPosition(new cc.Point(winSize.width, y));	
		this.addChild(rightOfSpot);	

		var rightLabel = cc.LabelTTF.create("Lex Luther", "Arial", 14);
		rightLabel.setColor(cc.c3b(0,0,0));
        rightLabel.setPosition(new cc.Point(winSize.width -40, y));
        this.addChild(rightLabel);
		//create last spot
	},
	displayDealerChip: function () {
		var dealerChip = cc.Sprite.create(dealerChipRes);
		var markerX = winSize.width/2 + 50;
		var markerY = 100;
		switch(this.CurrentDealerIndex)
		{
		case 0:
		   //0 is always human, even though that might be bad for adding mutliplayer (makes it easyier for me to program so fuckit?)
			markerX = (winSize.width/2) + 125;
			markerY = 40;
	  		break;
  		case 1:
  			markerX = 40;
			markerY = (winSize.height/1.5) - 125;
  			break;
		case 2:
			markerX = winSize.width/3;
			markerY = winSize.height - 40;
			break;
		case 3:
			markerX = (winSize.width/3)*2;
			markerY = winSize.height - 40;
			break;
		case 4:
			markerX = winSize.width - 40;
			markerY = (winSize.height/1.5) - 125;
			break;
		default: 
			//do nothing
			cc.log('captain, we have a serious problem...somehow the dealer managed to go unassigned. func: displayDealerChip of BidClass.js');
			break;
		}
		dealerChip.setPosition(new cc.Point(markerX, markerY));
		this.addChild(dealerChip);
	},
	displayCurrentPlayersTurnIndicator: function () {
		var currentTurnIndicator = cc.Sprite.create(currentTurnImg);
		var markerX = 0;
		var markerY = 0;
		this.removeChild(this.IndicatorToRemove); //remove the old indicator before adding a new idicator
		switch(this.CurrentPlayersTurnIndex){
			case 0: //human is up
				markerX = winSize.width/2;
				markerY = 0;
				break;
			case 1:
				markerX = 0;
				markerY = winSize.height/1.5;
				break;
			case 2:
				var spaceBetween = winSize.width/2;
				var padding = spaceBetween/2;
				var x = padding;
				markerX = x;
				markerY = winSize.height;
				break;
			case 3:
				var spaceBetween = winSize.width/2;
				var padding = spaceBetween/2;
				var x = padding + spaceBetween
				markerX = x
				markerY = winSize.height;
				break;
			case 4:
				markerX = winSize.width;
				markerY = winSize.height/1.5;
				break;
			default:
				//do nothing
				cc.log("problem dude...no current turn logged.");
				break;

		}
		currentTurnIndicator.setPosition(new cc.Point(markerX, markerY));
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
	createAiTopSpots: function (spotsToCreate,lastPlaceAiIndex){
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
			var aiSpot = cc.Sprite.create(aiSpotMarker);
			var nameLabel = cc.LabelTTF.create(msg, "Arial", 14);
			nameLabel.setColor(cc.c3b(0,0,0));
        	nameLabel.setPosition(new cc.Point(x, y-30));
        	
			aiSpot.setPosition(new cc.Point(x, y));
			this.addChild(aiSpot);
			this.addChild(nameLabel);
			x = x + spaceBetween;
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
        	}else if(xCords > 550 && xCords < 580){
        		//bid 4
        		this.updateBid(4);
        	}else if(xCords > 675 && xCords < 705){
        		//bid 5
        		this.updateBid(5);
        	}else if(xCords > 800 && xCords < 830){
        		//bid 6
        		this.updateBid(6);
        	}else if(xCords > 925 && xCords < 955){
        		//bid 7
        		this.updateBid(7);
        	}else if(xCords > 1050 && xCords < 1080){
        		//bid 8
        		this.updateBid(8);
        	}
        }
        
	},
	locationTapped: function(location){ 
		/*audioEngine.playEffect(s_shootEffect);*/
		if(this.CurrentPlayersTurnIndex === 0){
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
var shuffleArray = function(shuffleArr) {
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


var createPlayerMarker = function(x, y){
    var tempSpot = cc.Sprite.create(aiSpotMarker);
    tempSpot.setPosition(new cc.Point(x, y));
    return tempSpot;
};

var creatAiLabel = function(aiDudesName, x, y){
        var tempAi = cc.LabelTTF.create(aiDudesName, "Arial", 14);
        tempAi.setColor(cc.c3b(0,0,0));
        tempAi.setPosition(new cc.Point(x, y));
        return tempAi;
};

var checkHumanBid = function(xCords, yCords){
    var bid;
    var status;
    if(yCords < 370 && yCords > 325){
        if(xCords > 335 && xCords < 455){
            //player is passing
            bid=0;
            status = "Bidding";
        }else if(xCords > 550 && xCords < 580){
            //bid 4
            bid=4;
            status = "Bidding";
        }else if(xCords > 675 && xCords < 705){
            //bid 5
            bid=5;
            status = "Bidding";
        }else if(xCords > 800 && xCords < 830){
            //bid 6
            bid=6;
            status = "Bidding";
        }else if(xCords > 925 && xCords < 955){
            //bid 7
            bid=7;
            status = "Bidding";
        }else if(xCords > 1050 && xCords < 1080){
            //bid 8
            bid=8;
            status = "Bidding";
        }
    }
    return [status, bid];
};

var displayCurrentTurn = function(currentTurnIndex) {
    var currentTurnIndicator = cc.Sprite.create(currentTurnImg);
    var markerX = 0;
    var markerY = 0;
    switch(currentTurnIndex){
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
    return currentTurnIndicator;
};

var createDealerChip = function(currentDealerIndex){
    var dealerChip = cc.Sprite.create(dealerChipRes);
    var markerX = winSize.width/2 + 50;
    var markerY = 100;
    switch(currentDealerIndex)
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
            cc.log('captain, we have a serious problem...somehow the dealer managed to go unassigned. func: createDealerChip of helperFunctions.js');
            break;
    }
    dealerChip.setPosition(new cc.Point(markerX, markerY));
    return dealerChip;
}



var createPlayers = function(){
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

    return tempPlayersArr;
};

//SUPER UGLY SO WE PLACE IT AT THE BOTTOM SO KYLE DOESN'T 
//HAVE TO LOOK AT THIS GARBAGE =D
var createCards = function (cache) {
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

    return tempArr;
};
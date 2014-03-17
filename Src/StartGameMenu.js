var StartGameMenu = cc.LayerColor.extend({
    GameTitle: "Bid Euchre",
    FiveManButtonCords: [],
    ctor:function() {
        this._super();
        cc.associateWithNative(this, cc.LayerColor);
    },
    onEnter: function(){
        this._super();

        cc.log("onEnter called");
        if('touches' in sys.capabilities){
            this.setTouchEnabled(true);
        }
        if('mouse' in sys.capabilities){
            this.setMouseEnabled(true);
        }

        var director = cc.Director.getInstance();
        var winSize = director.getWinSize();
        var centerPos = cc.p(winSize.width/2, winSize.height/2);

        var fiveY = winSize.height/2;
        var sixY = winSize.height/2 - 125;

        this.GameTitle = cc.LabelTTF.create(this.GameTitle, "Arial", 120);
        this.GameTitle.setColor(cc.c3b(0,0,0));
        this.GameTitle.setPosition(new cc.Point(winSize.width/2, winSize.height - 175));
        this.addChild(this.GameTitle);


        var FiveManButton = cc.LabelTTF.create("Start", "Arial", 55);
        FiveManButton.setColor(cc.c3b(0,0,0));
        FiveManButton.setPosition(new cc.Point(winSize.width/2, fiveY));
        this.addChild(FiveManButton);


        this.FiveManButtonCords.x = FiveManButton._position.x;
        this.FiveManButtonCords.width = FiveManButton._contentSize.width;
        this.FiveManButtonCords.y = FiveManButton._position.y;
        this.FiveManButtonCords.height = FiveManButton._contentSize.height;

        /*var SixManButton = cc.LabelTTF.create("Start 6 Players", "Arial", 55);
        SixManButton.setColor(cc.c3b(0,0,0));
        SixManButton.setPosition(new cc.Point(winSize.width/2, sixY));
        this.addChild(SixManButton);*/

        //this.scheduleUpdate()
        
    },
    locationTapped: function(location){ 
        var xCords = location.x;
        var yCords = location.y;

        var fiveManBtnStartPointWidth = this.FiveManButtonCords.x - (this.FiveManButtonCords.width/2);
        var fiveManBtnEndPointWidth = this.FiveManButtonCords.x + (this.FiveManButtonCords.width/2);

        var fiveManBtnStartPointHeight = this.FiveManButtonCords.y - (this.FiveManButtonCords.height/2);
        var fiveManBtnEndPointHeight = this.FiveManButtonCords.y + (this.FiveManButtonCords.height/2);

        if(xCords > fiveManBtnStartPointWidth && xCords < fiveManBtnEndPointWidth){
            if(yCords > fiveManBtnStartPointHeight && yCords < fiveManBtnEndPointHeight){
                this.runAction(cc.Sequence.create(
                    cc.DelayTime.create(0.1),
                    cc.CallFunc.create(function(node) {
                        var scene = BidClass.scene(true);
                        cc.Director.getInstance().replaceScene(scene);
                    }, this)
                ));
            }           
        }
        //ADD 6 MAN HERE!!!!
        //when we add 6 man make sure to pass false in when creating the scene.
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
    }
});

StartGameMenu.create = function () {
    var sg = new StartGameMenu();
    
     if (sg && sg.init(cc.c4b(0,75,35,255))) {
        return sg;
    }
    return null;
};
 
StartGameMenu.scene = function () {
    var scene = cc.Scene.create();
    var layer = StartGameMenu.create();
    scene.addChild(layer);
    return scene;
};
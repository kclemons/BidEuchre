var shuffleArrayHelperFunc = function(shuffleArr) {
    for (var i = shuffleArr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = shuffleArr[i];
        shuffleArr[i] = shuffleArr[j];
        shuffleArr[j] = temp;
    }
    return shuffleArr;
};

var zachFunc = function(trumpSuit){
	var cards = {};

	return cards;
};
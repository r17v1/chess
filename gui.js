function clearBoard() {
	for (var i = rank.rank_8; i <= rank.rank_1; i++) {
		for (var j = file.file_a; j <= file.file_h; j++) {
			$('#' + fileChar[j] + rankChar[i]).remove();
		}
	}
}
function printPieces() {
	for (var i = file.file_a; i <= file.file_h; i++) {
		for (var j = rank.rank_8; j <= rank.rank_1; j++) {
			if (getCell(i, j) != state.empty) {
				var imgStr = '<img src="img/' + pieceStr[getCell(i, j)] + '.png" alt="pce" class="piece">';
				//	console.log(imgStr);
				var id = '#' + fileChar[i] + rankChar[j];
				$(id).html(imgStr);
			}
		}
	}
}
function printBoard() {
	clearBoard();
	var clr = 1;
	var clrstr = '';

	for (var i = rank.rank_8; i <= rank.rank_1; i++) {
		clr ^= 1;
		for (var j = file.file_a; j <= file.file_h; j++) {
			if (clr === 1) clrstr = 'dark';
			else clrstr = 'light';
			var divstr =
				'<div class="cell ' +
				clrstr +
				' ' +
				fileStr[j] +
				' ' +
				rankStr[i] +
				'" id="' +
				fileChar[j] +
				rankChar[i] +
				'" />';
			$('#board').append(divstr);
			clr ^= 1;
		}
	}
	printPieces();
	eventListen();
	let fw = getFile(PCSLocation[state.wKing * 10]),
		rw = getRank(PCSLocation[state.wKing * 10]);
	if (checkCheck(fw, rw)) {
		$('#' + fileChar[fw] + rankChar[rw]).css('background-color', 'red');
	}

	let fb = getFile(PCSLocation[state.bKing * 10]),
		rb = getRank(PCSLocation[state.bKing * 10]);
	if (checkCheck(fb, rb)) {
		$('#' + fileChar[fb] + rankChar[rb]).css('background-color', 'green');
	}
}

$('#restart').click(function() {
	initialize();
	printBoard();
});

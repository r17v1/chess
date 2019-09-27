var dimention = 12 * 10;
var state = {
	empty: 0,
	wPawn: 1,
	wRook: 2,
	wKnight: 3,
	wBishop: 4,
	wKing: 5,
	wQueen: 6,
	bPawn: 7,
	bRook: 8,
	bKnight: 9,
	bBishop: 10,
	bKing: 11,
	bQueen: 12,
	boundary: 13
};
var cells = new Array(dimention).fill(state.empty);
var rank = {
	rank_8: 0,
	rank_7: 1,
	rank_6: 2,
	rank_5: 3,
	rank_4: 4,
	rank_3: 5,
	rank_2: 6,
	rank_1: 7,
	rank_none: 8
};
var file = {
	file_a: 0,
	file_b: 1,
	file_c: 2,
	file_d: 3,
	file_e: 4,
	file_f: 5,
	file_g: 6,
	file_h: 7,
	file_none: 8
};
var orientation = 0;

var fileStr = [ 'file_a', 'file_b', 'file_c', 'file_d', 'file_e', 'file_f', 'file_g', 'file_h' ];
var fileChar = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h' ];
var rankStr = [ 'rank_8', 'rank_7', 'rank_6', 'rank_5', 'rank_4', 'rank_3', 'rank_2', 'rank_1' ];
var rankChar = [ '8', '7', '6', '5', '4', '3', '2', '1' ];
var pieceStr = [
	'empty',
	'wPawn',
	'wRook',
	'wKnight',
	'wBishop',
	'wKing',
	'wQueen',
	'bPawn',
	'bRook',
	'bKnight',
	'bBishop',
	'bKing',
	'bQueen'
];
var pieceVal = [ 0, 100, 500, 300, 300, 400, 1000, -100, -500, -300, -300, -400, -1000 ];
var noOfPCS = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
var PCSLocation = new Array(130).fill(0);

var clicked = {
	p1: null,
	p2: null
};

var difficulty = 4;

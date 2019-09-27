function getCellByNo(n) {
	return cells[Math.floor(n / 8) * 10 + n % 8 + 21];
}
function getCell(f, r) {
	return cells[r * 10 + f + 21];
}
function getCellInd(f, r) {
	return r * 10 + f + 21;
}
function addPC(pc, f, r) {
	cells[getCellInd(f, r)] = pc;
	PCSLocation[pc * 10 + noOfPCS[pc]] = getCellInd(f, r);
	noOfPCS[pc]++;
}
function removePC(f, r) {
	for (let i = getCell(f, r) * 10; i < getCell(f, r) * 10 + noOfPCS[getCell(f, r)]; i++) {
		//console.log(PCSLocation[i] + ' ' + getCellInd(f, r));
		if (getCellInd(f, r) === PCSLocation[i]) {
			//	console.log('yo');
			[ PCSLocation[i], PCSLocation[getCell(f, r) * 10 + noOfPCS[getCell(f, r)] - 1] ] = [
				PCSLocation[getCell(f, r) * 10 + noOfPCS[getCell(f, r)] - 1],
				PCSLocation[i]
			];
			PCSLocation[getCell(f, r) * 10 + noOfPCS[getCell(f, r)] - 1] = 0;
		}
	}
	noOfPCS[getCell(f, r)]--;
	cells[getCellInd(f, r)] = state.empty;
}
function getFile(n) {
	n = n % 10;
	if (n === 0 || n === 9) return file.file_none;
	else return n - 1;
}
function getRank(n) {
	n = Math.ceil((n + 1) / 10.0);
	if (n < 3 || n > 10) return rank.rank_none;
	else return n - 3;
}
function getRankFromId(id) {
	var r = parseInt(id.charAt(1), 10);
	return 8 - r;
}
function getFileFromId(id) {
	var f = id.charAt(0);
	switch (f) {
		case 'a':
			return file.file_a;
		case 'b':
			return file.file_b;

		case 'c':
			return file.file_c;

		case 'd':
			return file.file_d;

		case 'e':
			return file.file_e;

		case 'f':
			return file.file_f;

		case 'g':
			return file.file_g;

		case 'h':
			return file.file_h;
	}
}
function clear() {
	for (let i = file.file_a; i <= file.file_h; i++) {
		for (j = rank.rank_8; j <= rank.rank_1; j++) {
			removePC(i, j);
		}
	}
}

function initialize() {
	clear();
	for (var i = file.file_a; i <= file.file_h; i++) {
		addPC(state.wPawn, i, rank.rank_2);
	}
	for (var i = file.file_a; i <= file.file_h; i++) {
		addPC(state.bPawn, i, rank.rank_7);
	}
	addPC(state.wRook, file.file_a, rank.rank_1);
	addPC(state.wRook, file.file_h, rank.rank_1);
	addPC(state.wKnight, file.file_b, rank.rank_1);
	addPC(state.wKnight, file.file_g, rank.rank_1);
	addPC(state.wBishop, file.file_c, rank.rank_1);
	addPC(state.wBishop, file.file_f, rank.rank_1);
	addPC(state.wQueen, file.file_d, rank.rank_1);
	addPC(state.wKing, file.file_e, rank.rank_1);

	addPC(state.bRook, file.file_a, rank.rank_8);
	addPC(state.bRook, file.file_h, rank.rank_8);
	addPC(state.bKnight, file.file_b, rank.rank_8);
	addPC(state.bKnight, file.file_g, rank.rank_8);
	addPC(state.bBishop, file.file_c, rank.rank_8);
	addPC(state.bBishop, file.file_f, rank.rank_8);
	addPC(state.bQueen, file.file_d, rank.rank_8);
	addPC(state.bKing, file.file_e, rank.rank_8);
}
function eventListen() {
	$('.cell').click(function(e) {
		e.preventDefault();
		if (clicked.p1) {
			clicked.p2 = this;
			turnWhite(clicked);
		} else {
			var f = getFileFromId(this.id);
			var r = getRankFromId(this.id);
			if (getCell(f, r) <= state.wQueen && getCell(f, r) >= state.wPawn) {
				clicked.p1 = this;
				$(this).css('opacity', '0.5');
			}
		}
	});
}
function moveWithoutRestriction(f, r, ff, rr) {
	removePC(ff, rr);
	addPC(getCell(f, r), ff, rr);
	removePC(f, r);
}
function turnWhite() {
	var f = getFileFromId(clicked.p1.id);
	var r = getRankFromId(clicked.p1.id);
	var ff = getFileFromId(clicked.p2.id);
	var rr = getRankFromId(clicked.p2.id);
	$(clicked.p1).css('opacity', '1');
	if (move(f, r, ff, rr)) {
		printBoard();
		setTimeout(moveAI, 10, 0, -999999999, 999999999);
		//moveAI(0);
	}
}

function move(f, r, ff, rr) {
	if (checkValidity(f, r, ff, rr) === false || checkDanger(f, r, ff, rr)) {
		clicked.p1 = null;
		clicked.p2 = null;
		return false;
	}
	removePC(ff, rr);
	addPC(getCell(f, r), ff, rr);
	removePC(f, r);
	clicked.p1 = null;
	clicked.p2 = null;
	return true;
}

function checkValidity(f, r, ff, rr) {
	if (f === ff && r === rr) return false;

	var cellToMove = getCell(ff, rr);
	if (
		getCell(f, r) <= state.wQueen &&
		getCell(f, r) >= state.wPawn &&
		cellToMove <= state.wQueen &&
		cellToMove >= state.wPawn
	) {
		return false;
	}
	if (
		getCell(f, r) <= state.bQueen &&
		getCell(f, r) >= state.bPawn &&
		cellToMove <= state.bQueen &&
		cellToMove >= state.bPawn
	) {
		return false;
	}

	switch (getCell(f, r)) {
		case state.boundary:
			return false;
		case state.wPawn:
			if (rr === r - 1 && f === ff) {
				if (cellToMove === state.empty) return true;
				else return false;
			} else if (rr === r - 2) {
				if (r === rank.rank_2 && cellToMove === state.empty) return true;
				else return false;
			} else if (rr === r - 1 && (ff === f - 1 || ff === f + 1)) {
				if (cellToMove >= state.bPawn && cellToMove <= state.bQueen) return true;
				else return false;
			} else return false;
		case state.bPawn:
			if (rr === r + 1 && f === ff) {
				if (cellToMove === state.empty) return true;
				else return false;
			} else if (rr === r + 2) {
				if (r === rank.rank_7 && cellToMove === state.empty) return true;
				else return false;
			} else if (rr === r + 1 && (ff === f - 1 || ff === f + 1)) {
				if (cellToMove >= state.wPawn && cellToMove <= state.wQueen) return true;
				else return false;
			} else return false;
		case state.wKnight:
		case state.bKnight:
			if (Math.abs(ff - f) + Math.abs(rr - r) != 3 || Math.abs(ff - f) === 3 || Math.abs(rr - r) === 3)
				return false;
			else return true;
		case state.wRook:
		case state.bRook:
			if (rr != r && ff != f) return false;
			for (let i = Math.min(r, rr) + 1; i < Math.max(r, rr); i++) {
				if (getCell(f, i) != state.empty) return false;
			}
			for (let i = Math.min(f, ff) + 1; i < Math.max(f, ff); i++) {
				if (getCell(i, r) != state.empty) return false;
			}
			return true;
		case state.wBishop:
		case state.bBishop:
			if (Math.abs(rr - r) != Math.abs(ff - f)) return false;
			if ((rr < r && ff < f) || (rr > r && ff > f)) {
				for (let i = Math.min(ff, f) + 1, j = Math.min(rr, r) + 1; i < Math.max(ff, f); i++, j++) {
					if (getCell(i, j) != state.empty) return false;
				}
			} else {
				for (let i = Math.min(ff, f) + 1, j = Math.max(rr, r) - 1; i < Math.max(ff, f); i++, j--) {
					if (getCell(i, j) != state.empty) return false;
				}
			}
			return true;
		case state.wQueen:
		case state.bQueen:
			if (rr === r || ff === f) {
				//console.log('a');
				for (let i = Math.min(r, rr) + 1; i < Math.max(r, rr); i++) {
					if (getCell(f, i) != state.empty) return false;
				}
				for (let i = Math.min(f, ff) + 1; i < Math.max(f, ff); i++) {
					if (getCell(i, r) != state.empty) return false;
				}
				return true;
			}

			if (Math.abs(rr - r) === Math.abs(ff - f)) {
				if ((rr < r && ff < f) || (rr > r && ff > f)) {
					for (let i = Math.min(ff, f) + 1, j = Math.min(rr, r) + 1; i < Math.max(ff, f); i++, j++) {
						if (getCell(i, j) != state.empty) return false;
					}
				} else {
					for (let i = Math.min(ff, f) + 1, j = Math.max(rr, r) - 1; i < Math.max(ff, f); i++, j--) {
						if (getCell(i, j) != state.empty) return false;
					}
				}
				//console.log('b');
				return true;
			}
			return false;

		case state.wKing:
		case state.bKing:
			if (Math.abs(ff - f) > 1 || Math.abs(rr - r) > 1) return false;
			break;
	}

	return true;
}
function checkDanger(f, r, ff, rr) {
	var kf = null,
		kr = null;
	//console.log(getCell(f, r));
	if (getCell(f, r) < state.bPawn) {
		kf = getFile(PCSLocation[state.wKing * 10]);
		kr = getRank(PCSLocation[state.wKing * 10]);
		//console.log('if');
	} else {
		//console.log('else');
		kf = getFile(PCSLocation[state.bKing * 10]);
		kr = getRank(PCSLocation[state.bKing * 10]);
	}
	//console.log('kf:' + kf + 'kr:' + kr + PCSLocation[state.wKing * 10]);
	return checkCheckIf(f, r, ff, rr, kf, kr);
}

function checkCheck(f, r) {
	for (let j = state.wPawn; j <= state.bQueen; j++) {
		for (let i = j * 10; i < j * 10 + noOfPCS[j]; i++) {
			let ff = getFile(PCSLocation[i]);
			let rr = getRank(PCSLocation[i]);

			if (checkValidity(ff, rr, f, r)) {
				return true;
			}
		}
	}
	return false;
}

function checkCheckIf(f, r, ff, rr, kf, kr) {
	//console.log(ff + ' ' + kf + ' ' + rr + ' ' + kr);
	if (f === ff && r === rr) return false;
	if (f === kf && r === kr) {
		var temp1 = getCell(ff, rr);
		moveWithoutRestriction(f, r, ff, rr);
		let ccc = checkCheck(ff, rr);
		//console.log(ccc);
		moveWithoutRestriction(ff, rr, f, r);
		addPC(temp1, ff, rr);
		return ccc;
	}
	var temp1 = getCell(ff, rr);
	moveWithoutRestriction(f, r, ff, rr);
	let ccc = checkCheck(kf, kr);
	//console.log(ccc);
	moveWithoutRestriction(ff, rr, f, r);
	addPC(temp1, ff, rr);
	return ccc;
}
function checkCheckMate(bw) {
	if (bw) {
		for (let i = state.wPawn; i < state.bPawn; i++) {
			for (j = i * 10; j < i * 10 + noOfPCS[i]; j++) {
				if (checkCanMove(getFile(PCSLocation[j]), getRank(PCSLocation[j]))) return false;
			}
		}
	} else {
		for (let i = state.bPawn; i < state.boundary; i++) {
			for (j = i * 10; j < i * 10 + noOfPCS[i]; j++) {
				//console.log(j);
				if (checkCanMove(getFile(PCSLocation[j]), getRank(PCSLocation[j]))) return false;
			}
		}
	}
	return true;
}
function checkCanMoveUtil(f, r, ff, rr) {
	if (ff > 7 || rr > 7 || ff < 0 || rr < 0) return false;
	return checkValidity(f, r, ff, rr) && !checkDanger(f, r, ff, rr);
}

function checkCanMove(f, r) {
	//console.log(fileChar[f] + rankChar[r]);
	switch (getCell(f, r)) {
		case state.wPawn:
			if (checkCanMoveUtil(f, r, f, r - 1)) return true;
			if (checkCanMoveUtil(f, r, f, r - 2)) return true;
			if (checkCanMoveUtil(f, r, f - 1, r - 1)) return true;
			if (checkCanMoveUtil(f, r, f + 1, r - 1)) return true;
			break;
		case state.bPawn:
			if (checkCanMoveUtil(f, r, f, r + 1)) return true;
			if (checkCanMoveUtil(f, r, f, r + 2)) return true;
			if (checkCanMoveUtil(f, r, f - 1, r + 1)) return true;
			if (checkCanMoveUtil(f, r, f + 1, r + 1)) return true;
			break;
		case state.wKnight:
		case state.bKnight:
			if (checkCanMoveUtil(f, r, f - 1, r + 2)) return true;
			if (checkCanMoveUtil(f, r, f + 1, r + 2)) return true;
			if (checkCanMoveUtil(f, r, f - 1, r - 2)) return true;
			if (checkCanMoveUtil(f, r, f + 1, r - 2)) return true;
			if (checkCanMoveUtil(f, r, f - 2, r + 1)) return true;
			if (checkCanMoveUtil(f, r, f - 2, r - 1)) return true;
			if (checkCanMoveUtil(f, r, f + 2, r + 1)) return true;
			if (checkCanMoveUtil(f, r, f - 1, r - 1)) return true;
			break;
		case state.wKing:
		case state.bKing:
		case state.wRook:
		case state.bRook:
		case state.wBishop:
		case state.bBishop:
		case state.wQueen:
		case state.bQueen:
			if (checkCanMoveUtil(f, r, f - 1, r - 1)) return true;
			if (checkCanMoveUtil(f, r, f, r - 1)) return true;
			if (checkCanMoveUtil(f, r, f - 1, r)) return true;
			if (checkCanMoveUtil(f, r, f + 1, r - 1)) return true;
			if (checkCanMoveUtil(f, r, f - 1, r + 1)) return true;
			if (checkCanMoveUtil(f, r, f + 1, r + 1)) return true;
			if (checkCanMoveUtil(f, r, f + 1, r)) return true;
			if (checkCanMoveUtil(f, r, f, r + 1)) return true;
			break;
	}
	return false;
}
function getScore() {
	var score = 0;
	if (checkCheckMate(true)) {
		score -= 10000;
	} else if (checkCheckMate(false)) {
		score += 10000;
	}
	for (let i = state.wPawn; i < state.boundary; i++) {
		score += noOfPCS[i] * pieceVal[i];
	}
	return score;
}
function isValid(a) {
	return checkCanMoveUtil(a.f, a.r, a.ff, a.rr);
}

function getMoveSet(wb) {
	moveSet = [];
	if (wb) {
		for (let i = state.wPawn; i < state.bPawn; i++) {
			for (let j = i * 10; j < i * 10 + noOfPCS[i]; j++) {
				//	console.log(PCSLocation[j]);
				var fi = getFile(PCSLocation[j]),
					ri = getRank(PCSLocation[j]);
				switch (i) {
					case state.wPawn:
						var a = {
							f: fi,
							r: ri,
							ff: fi,
							rr: ri - 1
						};
						if (isValid(a)) moveSet.push(a);
						var b = {
							f: fi,
							r: ri,
							ff: fi,
							rr: ri - 2
						};
						if (isValid(b)) moveSet.push(b);
						var c = {
							f: fi,
							r: ri,
							ff: fi + 1,
							rr: ri - 1
						};
						if (isValid(c)) moveSet.push(c);
						var d = {
							f: fi,
							r: ri,
							ff: fi - 1,
							rr: ri - 1
						};
						if (isValid(d)) moveSet.push(d);
						break;
					case state.wKnight:
						var a = {
							f: fi,
							r: ri,
							ff: fi + 1,
							rr: ri + 2
						};
						if (isValid(a)) moveSet.push(a);
						var b = {
							f: fi,
							r: ri,
							ff: fi + 1,
							rr: ri - 2
						};
						if (isValid(b)) moveSet.push(b);
						var c = {
							f: fi,
							r: ri,
							ff: fi - 1,
							rr: ri + 2
						};
						if (isValid(c)) moveSet.push(c);
						var d = {
							f: fi,
							r: ri,
							ff: fi - 1,
							rr: ri - 2
						};
						if (isValid(d)) moveSet.push(d);
						var e = {
							f: fi,
							r: ri,
							ff: fi + 2,
							rr: ri + 1
						};
						if (isValid(e)) moveSet.push(e);
						var f = {
							f: fi,
							r: ri,
							ff: fi - 2,
							rr: ri + 1
						};
						if (isValid(f)) moveSet.push(f);
						var g = {
							f: fi,
							r: ri,
							ff: fi + 2,
							rr: ri - 1
						};
						if (isValid(g)) moveSet.push(g);
						var h = {
							f: fi,
							r: ri,
							ff: fi - 2,
							rr: ri - 1
						};
						if (isValid(h)) moveSet.push(h);
						break;
					case state.wKing:
						var a = {
							f: fi,
							r: ri,
							ff: fi + 1,
							rr: ri
						};
						if (isValid(a)) moveSet.push(a);

						var b = {
							f: fi,
							r: ri,
							ff: fi + 1,
							rr: ri + 1
						};
						if (isValid(b)) moveSet.push(b);

						var c = {
							f: fi,
							r: ri,
							ff: fi + 1,
							rr: ri - 1
						};
						if (isValid(c)) moveSet.push(c);

						var d = {
							f: fi,
							r: ri,
							ff: fi - 1,
							rr: ri
						};
						if (isValid(d)) moveSet.push(d);

						var e = {
							f: fi,
							r: ri,
							ff: fi - 1,
							rr: ri - 1
						};
						if (isValid(e)) moveSet.push(e);

						var f = {
							f: fi,
							r: ri,
							ff: fi - 1,
							rr: ri + 1
						};
						if (isValid(f)) moveSet.push(f);
						var g = {
							f: fi,
							r: ri,
							ff: fi,
							rr: ri - 1
						};
						if (isValid(g)) moveSet.push(g);
						var h = {
							f: fi,
							r: ri,
							ff: fi,
							rr: ri - 1
						};
						if (isValid(h)) moveSet.push(h);
						break;
					case state.wRook:
						if (checkCanMove(fi, ri)) {
							for (let ffi = file.file_a; ffi <= file.file_h; ffi++) {
								var a = {
									f: fi,
									r: ri,
									ff: ffi,
									rr: ri
								};
								if (isValid(a)) moveSet.push(a);
							}
							for (let rri = rank.rank_8; rri <= rank.rank_1; rri++) {
								var a = {
									f: fi,
									r: ri,
									ff: fi,
									rr: rri
								};
								if (isValid(a)) moveSet.push(a);
							}
						}
						break;
					case state.wBishop:
						if (checkCanMove(fi, ri)) {
							for (
								let ffi = fi - Math.min(fi, ri), rri = ri - Math.min(fi, ri);
								ffi <= file.file_h && rri <= rank.rank_1;
								ffi++, rri++
							) {
								//	console.log(ffi + ' ' + rri + ' ' + getCell(ffi, rri));
								var a = {
									f: fi,
									r: ri,
									ff: ffi,
									rr: rri
								};
								if (isValid(a)) moveSet.push(a);
							}
							let ffi = fi - Math.min(fi, ri),
								rri = ri + Math.min(fi, ri);
							if (rri > 7) {
								let extra = rri - 7;
								rri -= extra;
								ffi += extra;
							}
							//console.log('b');
							for (; ffi <= file.file_h && rri >= rank.rank_8; ffi++, rri--) {
								//console.log(ffi + ' ' + rri + ' ' + getCell(ffi, rri));
								var a = {
									f: fi,
									r: ri,
									ff: ffi,
									rr: rri
								};
								if (isValid(a)) moveSet.push(a);
							}
						}
						break;
					case state.wQueen:
						if (checkCanMove(fi, ri)) {
							for (let ffi = file.file_a; ffi <= file.file_h; ffi++) {
								var a = {
									f: fi,
									r: ri,
									ff: ffi,
									rr: ri
								};
								if (isValid(a)) moveSet.push(a);
							}
							for (let rri = rank.rank_8; rri <= rank.rank_1; rri++) {
								var a = {
									f: fi,
									r: ri,
									ff: fi,
									rr: rri
								};
								if (isValid(a)) moveSet.push(a);
							}
							for (
								let ffi = fi - Math.min(fi, ri), rri = ri - Math.min(fi, ri);
								ffi <= file.file_h && rri <= rank.rank_1;
								ffi++, rri++
							) {
								//	console.log(ffi + ' ' + rri + ' ' + getCell(ffi, rri));
								var a = {
									f: fi,
									r: ri,
									ff: ffi,
									rr: rri
								};
								if (isValid(a)) moveSet.push(a);
							}
							let ffi = fi - Math.min(fi, ri),
								rri = ri + Math.min(fi, ri);
							if (rri > 7) {
								let extra = rri - 7;
								rri -= extra;
								ffi += extra;
							}
							//console.log('b');
							for (; ffi <= file.file_h && rri >= rank.rank_8; ffi++, rri--) {
								//console.log(ffi + ' ' + rri + ' ' + getCell(ffi, rri));
								var a = {
									f: fi,
									r: ri,
									ff: ffi,
									rr: rri
								};
								if (isValid(a)) moveSet.push(a);
							}
							break;
						}
				}
			}
		}
	} else {
		for (let i = state.bPawn; i < state.boundary; i++) {
			for (let j = i * 10; j < i * 10 + noOfPCS[i]; j++) {
				//console.log(PCSLocation[j]);
				var fi = getFile(PCSLocation[j]),
					ri = getRank(PCSLocation[j]);
				switch (i) {
					case state.bPawn:
						var a = {
							f: fi,
							r: ri,
							ff: fi,
							rr: ri + 1
						};
						if (isValid(a)) moveSet.push(a);
						var b = {
							f: fi,
							r: ri,
							ff: fi,
							rr: ri + 2
						};
						if (isValid(b)) moveSet.push(b);
						var c = {
							f: fi,
							r: ri,
							ff: fi + 1,
							rr: ri + 1
						};
						if (isValid(c)) moveSet.push(c);
						var d = {
							f: fi,
							r: ri,
							ff: fi - 1,
							rr: ri + 1
						};
						if (isValid(d)) moveSet.push(d);
						break;
					case state.bKnight:
						var a = {
							f: fi,
							r: ri,
							ff: fi + 1,
							rr: ri + 2
						};
						if (isValid(a)) moveSet.push(a);
						var b = {
							f: fi,
							r: ri,
							ff: fi + 1,
							rr: ri - 2
						};
						if (isValid(b)) moveSet.push(b);
						var c = {
							f: fi,
							r: ri,
							ff: fi - 1,
							rr: ri + 2
						};
						if (isValid(c)) moveSet.push(c);
						var d = {
							f: fi,
							r: ri,
							ff: fi - 1,
							rr: ri - 2
						};
						if (isValid(d)) moveSet.push(d);
						var e = {
							f: fi,
							r: ri,
							ff: fi + 2,
							rr: ri + 1
						};
						if (isValid(e)) moveSet.push(e);
						var f = {
							f: fi,
							r: ri,
							ff: fi - 2,
							rr: ri + 1
						};
						if (isValid(f)) moveSet.push(f);
						var g = {
							f: fi,
							r: ri,
							ff: fi + 2,
							rr: ri - 1
						};
						if (isValid(g)) moveSet.push(g);
						var h = {
							f: fi,
							r: ri,
							ff: fi - 2,
							rr: ri - 1
						};
						if (isValid(h)) moveSet.push(h);
						break;
					case state.bKing:
					case state.bRook:
					case state.bBishop:
					case state.bQueen:
						if (checkCanMove(fi, ri)) {
							for (let ffi = file.file_a; ffi <= file.file_h; ffi++) {
								var a = {
									f: fi,
									r: ri,
									ff: ffi,
									rr: ri
								};
								if (isValid(a)) moveSet.push(a);
							}
							for (let rri = rank.rank_8; rri <= rank.rank_1; rri++) {
								var a = {
									f: fi,
									r: ri,
									ff: fi,
									rr: rri
								};
								if (isValid(a)) moveSet.push(a);
							}
							for (
								let ffi = fi - Math.min(fi, ri), rri = ri - Math.min(fi, ri);
								ffi <= file.file_h && rri <= rank.rank_1;
								ffi++, rri++
							) {
								var a = {
									f: fi,
									r: ri,
									ff: ffi,
									rr: rri
								};
								if (isValid(a)) moveSet.push(a);
							}
							let ffi = fi - Math.min(fi, ri),
								rri = ri + Math.min(fi, ri);
							if (rri > 7) {
								let extra = rri - 7;
								rri -= extra;
								ffi += extra;
							}
							for (; ffi <= file.file_h && rri >= rank.rank_8; ffi++, rri--) {
								var a = {
									f: fi,
									r: ri,
									ff: ffi,
									rr: rri
								};
								if (isValid(a)) moveSet.push(a);
							}
							break;
						}
				}
			}
		}
	}
	return moveSet;
}

function moveAI(depth, alpha, beta) {
	if (depth === difficulty) {
		return getScore();
	}
	var mv = {};
	var score = 0;
	var moveSet = [];
	if (depth % 2 === 0) {
		//minimize
		moveSet = getMoveSet(false);
		score = 999999999;
		for (let i = 0; i < moveSet.length; i++) {
			var f = moveSet[i].f,
				r = moveSet[i].r,
				ff = moveSet[i].ff,
				rr = moveSet[i].rr;
			var temp = getCell(ff, rr);

			move(f, r, ff, rr);
			var value = moveAI(depth + 1, alpha, beta);
			//console.log(score + ' ' + value);
			if (value < score) {
				score = value;
				mv = moveSet[i];
			}
			beta = Math.min(score, beta);
			moveWithoutRestriction(ff, rr, f, r);
			addPC(temp, ff, rr);
			if (beta <= alpha) break;
		}
	} else {
		//maximize
		moveSet = getMoveSet(true);
		score = -999999999;
		for (let i = 0; i < moveSet.length; i++) {
			var f = moveSet[i].f,
				r = moveSet[i].r,
				ff = moveSet[i].ff,
				rr = moveSet[i].rr;
			var temp = getCell(ff, rr);
			move(f, r, ff, rr);
			var value = moveAI(depth + 1, alpha, beta);
			if (value > score) {
				score = value;
				mv = moveSet[i];
			}
			alpha = Math.max(score, alpha);
			moveWithoutRestriction(ff, rr, f, r);
			addPC(temp, ff, rr);
			if (beta <= alpha) break;
		}
	}
	if (depth === 0) {
		//console.log(mv);
		move(mv.f, mv.r, mv.ff, mv.rr);
		printBoard();
		$('#' + fileChar[mv.f] + rankChar[mv.r]).css('opacity', '0.5');
		$('#' + fileChar[mv.ff] + rankChar[mv.rr]).css('opacity', '0.5');
	}
	return score;
}

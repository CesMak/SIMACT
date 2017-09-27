var simact = require("../simact");

describe("Test: getColumnsM(matrix)", function() {

	it("@return columns of Matrix, [[12,87]]->2", function() {
		expect(simact.getColumnsM("[[12,87]]")).toBe(2);
	});

	it("@return columns of Matrix, [[12,87],[1,2]]->2", function() {
		expect(simact.getColumnsM("[[12,87],[1,2]]")).toBe(2);
	});

});

describe("Test: getRowsM(matrix)", function() {

	it("@return rows of Matrix, [[12,87]]->1", function() {
		expect(simact.getRowsM("[[12,87]]")).toBe(1);
	});

	it("@return columns of Matrix, [[12,87],[1,2]]->2", function() {
		expect(simact.getRowsM("[[12,87],[1,2]]")).toBe(2);
	});

});


describe("Test: check_stability(eigenvalues,system)", function() {

	it("@return stable or unstable of System, [1,1],'s'->unstable", function() {
		var a = [1,1];
		expect(simact.check_stability(a,'s')).toBe("unstable");
	});
	
	it("@return stable or unstable of System [-1,-1],'s'->stable", function() {
		var a = [-1,-1];
		expect(simact.check_stability(a,'s')).toBe("stable");
	});
	
	it("@return stable or unstable of System, [-1,1]-,'z'->unstable", function() {
		var a = [-1,1];
		expect(simact.check_stability(a,'z')).toBe("unstable");
	});
	
	//TODO
//	it("@return stable or unstable of System [-1,1]-,'z'->unstable", function() {
//		var a = [-1,1];
//		expect(simact.check_stability(a,'p')).toBe("unstable");
//	})     

});


describe("Test: getColumnVectorOfMatrix(matrix)", function() {

	it("@return{string} standing vector, [[1,23],[12,34]];2;1->[[23],[34]]", function() {
		expect(simact.getColumnVectorOfMatrix("[[1,23],[12,34]]",2,1)).toBe("[[23],[34]]");
	});
	
	it("@return{string} standing vector, [[1,23],[12,34]];2;0->[[1],[12]]", function() {
		expect(simact.getColumnVectorOfMatrix("[[1,23],[12,34]]",2,0)).toBe("[[1],[12]]");
	});
	
	//non symmetrical matrices also work!
	it("@return{string} standing vector, [[1,23],[12,34],[1,2],[1.3,1.6]];2;0->[[23],[34],[2],[1.6]]", function() {
		expect(simact.getColumnVectorOfMatrix("[[1,23],[12,34],[1,2],[1.3,1.6]]",2,1)).toBe("[[23],[34],[2],[1.6]]");
	});

});


describe("Test: getRowVectorOfMatrix(matrix)", function() {
	
	//non symmetrical matrices also work!
	it("@return{string} lying vector, [[1,23],[12,34],[1,2],[1.3,1.6]];4;1->[[12,34]]", function() {
		expect(simact.getRowVectorOfMatrix("[[1,23],[12,34],[1,2],[1.3,1.6]]",4,1)).toBe("[[12,34]]");
	});

});


//TODO: what about not square matrices?
describe("Test:  getQ_S(A,B,nA,nA_fest,speicher)", function() {

	it("@return Q_S=, [[1,2],[4,5]]; [[0],[1]] ->[[0,2],[1,5]]", function() {
		var AA = "[[1,2],[4,5]]";
		var BB = "[[0],[1]]";
		expect(simact.getQ_S(AA,BB)).toBe("[[0,2],[1,5]]");
	});
	
	it("@return Q_S=, [[1,2],[4,5]]; [[0],[1]] ->[[0,2],[1,5]]", function() {
		var AA = "[[1,1],[1,1]]";
		var BB = "[[0],[1]]";
		expect(simact.getQ_S(AA,BB)).toBe("[[0,1],[1,1]]");
	});
	
	it("@return Q_S=, [[1,1,1],[1,1,1],[1,2,1]]; [[0],[1],[0]] ->[[0,1,4],[1,1,4],[0,2,5]]", function() {
		var AA = "[[1,1,1],[1,1,1],[1,2,1]]";
		var BB = "[[0],[1],[0]]";
		expect(simact.getQ_S(AA,BB)).toBe("[[0,1,4],[1,1,4],[0,2,5]]");
	});
	
});


describe("Test:  getQ_B(A,C,nA,nA_fest,speicher)", function() {

	it("@return Q_B=, [[1,2],[4,5]]; [[0],[1]] ->[[0,2],[1,5]]", function() {
		var AA = "[[1,2],[4,5]]";
		var CC = "[[0,1]]";
		expect(simact.getQ_B(AA,CC)).toBe("[[0,1],[4,5]]");
	});
	
	it("@return Q_B=, [[1,1],[1,1]]; [[0],[1]] ->[[0,1],[1,1]]", function() {
		var AA = "[[1,1],[1,1]]";
		var CC = "[[0,1]]";
		expect(simact.getQ_S(AA,CC)).toBe("[[0,1],[1,1]]");
	});
	
	//TODO ist das wirklich richtig? von HAND nachrechnen
	// zweite 4 und 5 müssen vertauscht sein?
	it("@return Q_B=, [[1,2],[4,5]]; [[0],[1]] ->[[0,1,4],[1,1,4],[0,2,5]]", function() {
		var AA = "[[1,1,1],[1,1,1],[1,2,1]]";
		var CC = "[[0,1,0]]";
		expect(simact.getQ_B(AA,CC)).toBe("[[0,1,0],[1,1,1],[3,4,3]]");
	});
	
	it("@return", function() {
		var AA = "[[1,2],[4,5]]";
		var CC = "[[1/2,0]]";
		expect(simact.getQ_B(AA,CC)).toBe("[[0.5,0],[0.5,1]]");
	});
	
});

describe("Test:  getMatValue(matrix,i,j)", function() {

	it("@return 4, [[1,2],[4,5]]; 1;0->4", function() {
		var AA = "[[1,2],[4,5]]";
		expect(simact.getMatValue(AA,1,0)).toBe(4);
	});
	
	it("@return 5.12, [[1.12,2.12],[4.12,5.12]]; 1;1->4", function() {
		var AA = "[[1.12,2.12],[4.12,5.12]]";
		expect(simact.getMatValue(AA,1,1)).toBe(5.12);
	});
	
});


describe("Test:  setMatValue(matrix,i,j,value)", function() {

	it("@return [[1,2],[0.12398,4]]", function() {
		var AA = "[[1,2],[3,4]]";
		expect(simact.setMatValue(AA,1,0,0.12398)).toBe("[[1,2],[0.12398,4]]");
	});
	
});

describe("Test:  setMatValuesym(matrix,i,j,value)", function() {
	
	//matrix contains symbols!
	it("@return ", function() {
		var AA = "[[1+s,2],[3,4+s]]";
		expect(simact.setMatValuesym(AA,0,0,"0.12")).toBe("[[0.12,2],[3,4+s]]");
	});
	
	it("@return ", function() {
		var AA = "[[1+s,2],[3,4+s]]";
		expect(simact.setMatValuesym(AA,0,1,"0.12")).toBe("[[1+s,0.12],[3,4+s]]");
	});
	
	it("@return ", function() {
		var AA = "[[1+s,2],[3,4+s]]";
		expect(simact.setMatValuesym(AA,1,0,"0.12")).toBe("[[1+s,2],[0.12,4+s]]");
	});
	
	it("@return ", function() {
		var AA = "[[1+s,2],[3,4+s]]";
		expect(simact.setMatValuesym(AA,1,1,"0.12")).toBe("[[1+s,2],[3,0.12]]");
	});

	//3x3
	it("@return ", function() {
		var AA = "[[1,1,1],[2,2,2],[3,3,3]]";
		expect(simact.setMatValuesym(AA,1,1,"s+6")).toBe("[[1,1,1],[2,s+6,2],[3,3,3]]");
	});
	
	it("@return ", function() {
		var AA = "[[1,1,1],[2,2,2],[3,3,3]]";
		expect(simact.setMatValuesym(AA,2,2,"s+6")).toBe("[[1,1,1],[2,2,2],[3,3,s+6]]");
	});
	
	it("@return ", function() {
		var AA = "[[1,1,1],[2,2,2],[3,3,3]]";
		expect(simact.setMatValuesym(AA,0,0,"s+6")).toBe("[[s+6,1,1],[2,2,2],[3,3,3]]");
	});
	
	it("@return ", function() {
		var AA = "[[1,1,1],[2,2,2],[3,3,3]]";
		expect(simact.setMatValuesym(AA,0,2,"s+6")).toBe("[[1,1,s+6],[2,2,2],[3,3,3]]");
	});
	
	it("@return ", function() {
		var AA = "[[1,1,1],[2,2,2],[3,3,3]]";
		expect(simact.setMatValuesym(AA,2,0,"s+6")).toBe("[[1,1,1],[2,2,2],[s+6,3,3]]");
	});


	//non square matrices!
	it("@return ", function() {
		var AA = "[[-1 + s,-2,0],[-3,-4 + s,0]]";
		expect(simact.setMatValuesym(AA,0,2,"s+6")).toBe("[[-1 + s,-2,s+6],[-3,-4 + s,0]]");
	});
	
	it("@return ", function() {
		var AA = "[[-1 + s,-2,0],[-3,-4 + s,0]]";
		expect(simact.setMatValuesym(AA,1,2,"25")).toBe("[[-1 + s,-2,0],[-3,-4 + s,25]]");
	});

});




describe("Test:  arrayToMatrixString(stringarray,maxrows)", function() {

	//not square matrices: works!
	it("@return", function() {
		var AA = "-1 + s,-2,0,-3,-4 + s,0";
		expect(simact.arrayToMatrixString(AA,3,2)).toBe("[[-1 + s,-2,0],[-3,-4 + s,0]]");
	});
	
});

describe("Test:  setColumnVectorOfMatrix(matrix,column,columnvalue)", function() {

	it("@return [[2,0],[1,1]]", function() {
		var AA = "[[1,0],[0,1]]";
		expect(simact.setColumnVectorOfMatrix(AA,0,"[2,1]")).toBe("[[2,0],[1,1]]");
	});
	
	it("@return [[2,0],[1,1]]", function() {
		var AA = "[[1,0],[0,1]]";
		expect(simact.setColumnVectorOfMatrix(AA,0,"[[2,1]]")).toBe("[[2,0],[1,1]]");
	});
	
	it("@return [[2,0],[1,1]]", function() {
		var AA = "[[1,0],[0,1]]";
		expect(simact.setColumnVectorOfMatrix(AA,0,"[[2],[1]]")).toBe("[[2,0],[1,1]]");
	});
	
	
});

describe("Test:  setRowVectorOfMatrix(matrix,row,rowvalue)", function() {

	it("@return [[2,1],[0,1]]", function() {
		var AA = "[[1,0],[0,1]]";
		expect(simact.setRowVectorOfMatrix(AA,0,"[2,1]")).toBe("[[2,1],[0,1]]");
	});
	
	it("@return [[2,0],[1,1]]", function() {
		var AA = "[[1,0],[0,1]]";
		expect(simact.setRowVectorOfMatrix(AA,0,"[[2,1]]")).toBe("[[2,1],[0,1]]");
	});
	
	//TODO - fails!
//	it("@return [[2,0],[1,1]]", function() {
//		var AA = "[[1,0],[0,1]]";
//		expect(simact.setRowVectorOfMatrix(AA,0,"[[2],[1]]")).toBe("[[2,1],[0,1]]");
//	});
	
	
});


describe("Test:  arrayToString(array)", function() {

	it("@return [[2,1],[0,1]]", function() {
		var array = [[2,1],[0,1]];
		expect(simact.arrayToString(array)).toBe("[[2,1],[0,1]]");
	});
	it("@return", function() {
		var array = [[1],[0]];
		expect(simact.arrayToString(array)).toBe("[[1],[0]]");
	});
	
});

describe("Test:  checkzeroColumn(matrix)", function() {

	it("@return [2]", function() {
		var A = "[[1,0,0],[2,0,0],[3,0,1]]";
		expect(simact.checkzeroColumn(A).toString()).toBe("2"); // 2 is string repr for [2]
	});
	
	it("@return [2,", function() {
		var A = "[[1,0,0,0],[2,0,0,0],[3,0,1,0],[1,0,3,0]]";
		expect(simact.checkzeroColumn(A).toString()).toBe("2,4"); 
	});
	
});


describe("Test:  checkzeroRow(matrix)", function() {

	it("@return [1]", function() {
		var A = "[[0,0,0],[2,0,0],[3,0,1]]";
		expect(simact.checkzeroRow(A).toString()).toBe("1"); // 2 is string repr for [2]
	});
	
	it("@return [1,4]", function() {
		var A = "[[0,0,0,0],[2,0,0,0],[3,0,1,0],[0,0,0,0]]";
		expect(simact.checkzeroRow(A).toString()).toBe("1,4"); 
	});
	
});

describe("Test:  roundMatrix(matrix,factor)", function() {

	it("@return  [[0.34,-0.81],[0.94,0.59]]", function() {
		var A = "[[0.34372376933344034,-0.8068982213550735],[0.9390708015880442,0.5906904945688723]]";
		expect(simact.roundMatrix(A,2)).toBe("[[0.34,-0.81],[0.94,0.59]]");
	});
	
	it("@return", function() {
		var A = "[[1],[0]]";
		expect(simact.roundMatrix(A,2)).toBe("[[1],[0]]");
	});

});

describe("Test:  roundArray(array,factor)", function() {

	it("@return  Array [-1,1]", function() {
		var A = [ -0.9999999999999998, 0.9999999999999998 ];
		expect(simact.roundArray(A,2).toString()).toBe("-1,1"); //string rep
	});
	
});

describe("Test:  matrixpow(matrix,factor)", function() {

	it("@return  [[1,2],[1,2]]", function() {
		var A = "[[1,4],[1,2]]";
		expect(simact.matrixpow(A,3).toString()).toBe("[[61,156],[39,100]]"); //string rep
	});
	
	it("@return  [[1,2],[1,2]]", function() {
		var A = "[[1,2],[1,2]]";
		expect(simact.matrixpow(A,3).toString()).toBe("[[27,54],[27,54]]"); //string rep
	});
	
});

describe("Test:   eigenvalues(matrix)", function() {

	it("@return  1.789,5.0,1.0", function() {
		var A = "[[1.789,0,0],[0,5,0],[0,0,1]]";
		expect(simact.eigenvalue(A).toString()).toBe("1.789,5.0,1.0"); //string rep
	});
	
	//Eigenvalues in zero are at the end!
	it("@return 1.789,1.0,0", function() {
		var A = "[[1.789,0,0],[0,0,0],[0,0,1]]";
		expect(simact.eigenvalue(A).toString()).toBe("1.789,1.0,0"); //string rep
	});
	
	it("@return 1.789,1.0,0", function() {
			var A = "[[0,0,0],[0,0,0],[0,0,0]]";
			expect(simact.eigenvalue(A).toString()).toBe("0,0,0"); //string rep
	});

	//TODO - new Algebrite version solves this error?
//	it("@return  1", function() {
//		var A = "[[1,2],[1,2]]";
//		expect(simact.eigenvalue(A)).toBe(1); //string rep
//	});
	
	
});



describe("Test:  rankofMatrix(matrix)", function() {

	it("@return  3", function() {
		var A = "[[1.789,0,0],[0,5,0],[0,0,1]]";
		expect(simact.rankofMatrix(A)).toBe(3); //string rep
	});
	
	it("@return  2", function() {
		var A = "[[1.3,-2],[-3,1.3],[1,0]]";
		expect(simact.rankofMatrix(A)).toBe(2); //string rep
	});

	// rTODO - other reason! eason is eigenvalue function failes! for singulär matrices.
//	it("@return  1", function() {
//		var A = "[[1,2],[1,2]]";
//		expect(simact.rankofMatrix(A)).toBe(1); //string rep
//	});
	
});

describe("Test:  scaleVec(matrix)", function() {

	it("@return  [0.894427,-0.447214] -> 1,-0.5", function() {
		var A = [0.894427,-0.447214];
		expect(simact.scaleVec(A).toString()).toBe('1,-0.5'); //string rep
	});
	
});


describe("Test:  kerofMatrix(matrix)", function() {

	it("@return  1,-0.5", function() {
		var A = "[[1,2],[1,2]]";
		expect(simact.kerofMatrix(A).toString()).toBe("1,-0.5"); 
	});
	
	it("@return  ''", function() {
		var A = "[[1,2],[1,5]]";
		expect(simact.kerofMatrix(A).toString()).toBe(''); //has no kernel
	});
	
	it("@return  1,-0.5,0", function() {
		var A = "[[1,2,1],[1,2,1],[1,2,4]]";
		expect(simact.kerofMatrix(A).toString()).toBe('1,-0.5,0'); //basis
	});
	
	//wolfram alpha: -88 -133 354
	it("@return  1,1.51136,-4.02273", function() {
		var A = "[[178,2,45],[1,2,1],[1,2,1]]";
		expect(simact.kerofMatrix(A).toString()).toBe('1,1.51136,-4.02273'); //basis
	});
	
	
	//TODO: Wolfram alpha sol: basis: -2,1,0; -1,0,1
	it("@return  1,-0.4,-0.2,0,1,-2", function() {
		var A = "[[1,2,1],[1,2,1],[1,2,1]]";
		expect(simact.kerofMatrix(A).toString()).toBe('1,-0.4,-0.2,0,1,-2'); //basis
	});
	
});


describe("Test:  generalvector(matrix,eigenvalue,stufe)", function() {

	it("@return  error not square", function() {
		var A = "[[1],[1]]";
		expect( function(){ simact.generalvector(A,1,0).parse(raw); } ).toThrow(new Error("Input matrix must be square: n=2, m=1"));
		//expect(simact.generalvector(A,1,0).parse(raw)).toThrow(new Error("Parsing is not possible"));
	});
	
	it("@return  error wrong eigenvalue", function() {
		var A = "[[1,0],[0,1]]";
		expect( function(){ simact.generalvector(A,-1,0).parse(raw); } ).toThrow(new Error("Eigenval is not in matrix! eigenval: -1 matrix:[[1,0],[0,1]]")); 
	});
	
	it("@return  [ [ 1, 0 ], [ 0, 1 ] ]", function() {
		var A = "[[1,0],[0,1]]";
		expect(simact.generalvector(A,1,0).toString()).toBe('1,0,0,1'); //basis
	});
	
	it("@return  [ [ 1, 0 ], [ 0, 1 ] ]", function() {
		var A = "[[1,0],[0,1]]";
		expect(simact.generalvector(A,1,1).toString()).toBe('1,0,0,1'); //basis
	});
	
	it("@return  [ [ 1, 0 ], [ 0, 1 ] ]", function() {
		var A = "[[1,0],[0,1]]";
		expect(simact.generalvector(A,1,2).toString()).toBe('1,0,0,1'); //basis
	});

	
	it("@return  [ [ 1, 0 ], [ 0, 1 ] ]", function() {
		var A = "[[0,1000],[-1000,-2000]]";
		expect(simact.generalvector(A,-1000,0).toString()).toBe('1,-1'); //basis
	});
	
	it("@return  [ [ 1, 0 ], [ 0, 1 ] ]", function() {
		var A = "[[0,1000],[-1000,-2000]]";
		expect(simact.generalvector(A,-1000,1).toString()).toBe('1,-1'); //basis
	});
	
	//tODO -special case!
//	it("@return  [ [ 1, 0 ], [ 0, 1 ] ]", function() {
//		var A = "[[0,1000],[-1000,-2000]]";
//		var T = "[[1,0],[-1,1]]";
//		//expect(simact.Algebrite.dot(simact.Algebrite.inv(T).toString(),A,T).toString()).toBe('1,b0,1'); //basis
//		expect(simact.generalvector(A,-1000,1).toString()).toBe('haupt'); //basis
//	});
	
	it("@return 1,0,2,0,1,0", function() {
		var A = "[[-10,1,7],[-7,2,3],[-16,2,12]]";
		expect(simact.generalvector(A,3,4).toString()).toBe('1,0,2,0,1,0'); //basis
	});
	
	
});


describe("Test:  jordantransform(matrix)", function() {

	//multiple eigenvalues example:
	it("@return  ", function() {
		var A = "[[-10,1,7],[-7,2,3],[-16,2,12]]";
		expect(simact.jordantransform(A).toString()).toBe('1,1,1,1,-1,2,1,0,2'); //string rep
	});
	//TODO test for more and berücksichtige den fall dass vij =! 0 seite 9 Übungsskript 
	
	it("@return  [[-0.3517,-0.6454,0.0613],[-0.0811,-0.4774,-0.9586],[-0.9326,-0.5963,0.2781]]", function() {
		var A = "[[-10,1,6],[-7,2,3],[-16,2,12]]";
		expect(simact.jordantransform(A).toString()).toBe('[[-0.3517,-0.6454,0.0613],[-0.0811,-0.4774,-0.9586],[-0.9326,-0.5963,0.2781]]'); //string rep
	});
	
	
});


describe("Test:  checkHautusS(AasString,BasString)", function() {

	
	it("@return  all eigenvalues controllable!", function() {
		var A = "[[1,2],[3,4]]";
		var B = "[[1],[0]]";
		expect(simact.checkHautusS(A,B).toString()).toBe('[[-1 + s,-2,1],[-3,-4 + s,0]]'); //string rep
	});
	
	it("@return  no eigenvalue is controllable", function() {
		var A = "[[1,0],[0,1]]";
		var B="[[1],[0]]";
		expect(simact.checkHautusS(A,B).toString()).toBe('[[-1 + s,0,1],[0,-1 + s,0]],1,1'); //string rep
	});
	
	it("@return  only one eigenvalue is controllable", function() {
		var A = "[[1,0],[0,4]]";
		var B="[[1],[0]]";
		expect(simact.checkHautusS(A,B).toString()).toBe('[[-1 + s,0,1],[0,-4 + s,0]],4'); //string rep
	});
	
	//TODO test for MIMO!	 -> different B
	
});

describe("Test:  checkHautusB(AasString,CasString)", function() {

	it("@return  all eigenvalues controllable!", function() {
		var A = "[[1,2],[3,4]]";
		var C = "[[1,0]]";
		expect(simact.checkHautusB(A,C).toString()).toBe('[[-1 + s,-2],[-3,-4 + s],[1,0]]'); //string rep
	});
	
	//TODO test for MIMO
});	

describe("Test:  calcSSys(A,B,C,D)", function() {

	it("@return  all eigenvalues controllable!", function() {
		var A = "[[1,2],[4,5]]";
		var B ="[[0],[1]]"
		var C = "[[1,0]]";
		var result = simact.calcSSys(A,B,C);
		expect(result['nA']).toBe(2);
		
		//Other results:
//		[[1,2],[4,5]]: 2x2[[0],[1]]: 2x1[[1,0]]: 1x2
//		Q_SK: [[0,2],[1,5]] Q_BK: [[1,0],[1,2]] rQ_SK:2 rQ_BK:2
//		isKS: System is Kalman controllable. iQ_SK: [[-5/2,1],[1/2,0]] q_SK:[[1/2,0]]
//		isBS: System is Kalman observable. iQ_BK: [[1,0],[-1/2,1/2]] q_BK:[[-1/2,1/2]]
//		M_SH: [[-1 + s,-2,0],[-4,-5 + s,1]] hnc: none
//		M_BH: [[-1 + s,-2],[-4,-5 + s],[1,0]] hno: none
//		q_SK: [[1/2,0]] iT_SNF: [[0.5,0],[0.5,1]] T_SNF: [[2,0],[-1,1]]
//		A_SNF: [[0,1],[3,6]] B_SNF: [[0],[1]] C_SNF: [[2,0]]
//		q_BK: [[-1/2,1/2]] iT_BNF: [[-0.5,0.5],[0.5,0.5]] T_BNF: [[-1,1],[1,1]]
//		A_BNF: [[0,3],[1,6]] B_BNF: [[0.5],[0.5]] C_BNF: [[-1,1]]
//		T_JNF: [[0.3437,-0.8069],[0.9391,0.5907]] iT_JNF: [[0.6148,0.8398],[-0.9774,0.3577]]
//		A_JNF: [[6.4639,0.0001],[-0.0003,-0.4641]] B_JNF: [[0.8398],[0.3577]] C_JNF: [[0.3437,-0.8069]]
//		gnc: none gno: none
//		charPoly: s^2 - 6 s - 3 inv_sIA: [[(-5 + s) / (-3 - 6 s + s^2),2 / (-3 - 6 s + s^2)],[4 / (-3 - 6 s + s^2),(-1 + s) / (-3 - 6 s + s^2)]] transo: [[2 / (-3 - 6 s + s^2)]]
//		transoex: 0.2886/(s-(6.4639))-0.2886/(s-(-0.4641))
	});
	
	//TODO test for MIMO
});	


 	
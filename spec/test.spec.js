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
	
});



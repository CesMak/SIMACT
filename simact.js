/**
 * Control Theory Library of Markus Lamprecht
 * 
 * Depens on: Algebrite http://algebrite.org/ (which depends on Big-Integer)
 * numeric (used to compute the SVD - kernel of a Matrix)
 * 
 * Rules: 1. Use this Documentation style: http://usejsdoc.org/ 2. no
 * console.log arguments! 3. Tests Jasmine 4. Remember to exports new function
 * at the end of this document!
 * 
 * Algebrite: Algebrite.dot(firstarg is not allowed to be a singular matrix!!!,
 * ...)
 */

// TODO: check number of input arguments in each function!
// TODO: global rounding factor see round array etc.
var Algebrite = require('./algebrite');
var numeric = require('./numeric');

/**
 * plot function: for subplots see: https://plot.ly/javascript/subplots/
 * for animations see: https://plot.ly/javascript/animations/#animating-with-a-slider (see Frames!)
 * @param {string} expression - "sin(x)"
 * @param {string} div_name  - name to be ploted in
 */
function plot(expression, x1=linspace(-5, 5, 0.1), div_name="plot1", title_=expression, xname_="x", yname_="y"){
	x1=convertString_TO_Vector(x1);
	y1=eval_expression(expression, x1);
			var trace1 = {
			  x: x1, 
			  y: y1, 
			  type: 'scatter',
			  name: expression
			};
			var data = [trace1];
			var layout = {
//					  autosize: false,
//					  width: 500,
//					  height: 250,
					  title: title_,
					  xaxis: {
						  title: xname_
					  },
					  yaxis: {
						  title: yname_
					  }
			}
	Plotly.newPlot(div_name, data, layout);
	return 0;
}

// e.g. [-5,-4.9,-4.800000000000001,-4.700000000000001] -> array of numbers.
function convertString_TO_Vector(input_str){
	input_str = input_str.substring(1,input_str.length -1);
	input_arr = input_str.split(",");
	result = [];
	for (var i=0,l=input_arr.length;i<l;i++) result.push(+input_arr[i]);
	return result;
}

function linspace(start, end, stepsize){
	res =""
	for (i=start;i<=end+stepsize; i=i+stepsize){
		res=res+i.toString()+","
	}
	res = res.substring(0, res.length - 1);
	res="["+res+"]"
	return res;
}

// as variable x
function eval_expression(expression, x_vector, variable="x", rounding_factor = 2){
	var res = [];
	for(var i=0;i<x_vector.length;i++){
	tmp = expression.replaceAll(variable, "("+x_vector[i]+")");
	tmp = Algebrite.run(tmp).toString();
	res.push(Algebrite.float(tmp).toString());
	}
	return roundArray(res, rounding_factor);
}

/**
 * Open help page in new page
 */
function getOpenWebpageHashMap(){
	var map = {};
	map["help"]="file:///home/markus/eclipse_web/SIMACT-web/sub_pages/Engine/engine_help.html";
	return map;
}

/**
 * Get the Columns of a Matrix
 * 
 * @param {string}
 *            Matrix - [[12,87]]
 * @return{int} columns of Matrix - 2
 */
function getColumnsM(matrix) {
	var size = (new Function("return " + Algebrite.shape(matrix).toString()
			+ ";")());
	return size[1];
}

/**
 * Get the Rows of a Matrix
 * 
 * @param {string}
 *            Matrix - [[12,87]]
 * @return{int} rows of Matrix - 1
 */
function getRowsM(matrix) {
	var size = (new Function("return " + Algebrite.shape(matrix).toString()
			+ ";")());
	return size[0];
}

/**
 * Set a value of a Matrix (matrix is only allowed to contain numbers)
 * 
 * @param {string}
 *            Matrix A - [[1,2],[3,4]] (is not allowed to contain symbols!)
 * @param {int}
 *            i row - 1 (second value!)
 * @param {int}
 *            j column- 0
 * @param {double/int}
 *            value to set - 0.12398
 * @return {string} matrix - resulting Matrix "[[1,2],[0.12398,4]]"
 */
function setMatValue(matrix, i, j, value) {
	var matrixasarray = (new Function("return " + matrix + ";")());
	matrixasarray[i][j] = value;
	return arrayToString(matrixasarray);
}

/**
 * Set a value of a Matrix (Symbolic values in matrix are allowed!)
 * 
 * @param {string}
 *            Matrix A - "[[1,1,1],[2,2,2],[3,3,3]]"
 * @param {int}
 *            i row - 0 (first value!)
 * @param {int}
 *            j column- 2 (third value)
 * @param {string}
 *            value to set - "s+6"
 * @return {string} matrix - resulting Matrix "[[1,1,s+6],[2,2,2],[3,3,3]]"
 */
function setMatValuesym(matrix, i, j, value) {
	var mA = getColumnsM(matrix);
	var nA = getRowsM(matrix);
	matrix = matrix.replace(/\[/g, '');
	matrix = matrix.replace(/\]/g, '');
	var array = matrix.split(",");
	var x = (mA - 1) * i;
	var sumval = i + j + x;
	// console.log(matrix)
	// console.log(sumval);

	array[sumval] = value;
	// console.log(array);

	var output = arrayToMatrixStringR(array.toString(), mA, nA);
	// console.log(output);
	return output;
}

/**
 * Converts a single Arry to a Matrix String column by column
 * 
 * @param {String}
 *            String repr of a single Array - "1,1,1,1,−1,2,1,0,2"
 * @param {int}
 *            columns of the input matrix - 3
 * @param {int}
 *            rows of the input matrix - 3
 * @return {string} matrix -"[[1,1,1],[1,-1,0],[1,2,2]]"
 */
function arrayToMatrixStringC(stringarray, maxColumns, maxRows) {
	var res = arrayToMatrixStringR(stringarray, maxColumns, maxRows);
	return Algebrite.transpose(res).toString();
}

/**
 * Converts a single Arry to a Matrix String row by row!
 * 
 * @param {String}
 *            String repr of a single Array - "1,1,2,2"
 * @param {int}
 *            columns of the input matrix - 2
 * @param {int}
 *            rows of the input matrix - 2
 * @return {string} matrix -"[[1,1],[2,2]]"
 */
function arrayToMatrixStringR(stringarray, maxColumns, maxRows) {
	var tmp = stringarray;
	tmp = tmp.replace(/−/g, '-'); // minus haben irwie nicht richtig geklappt!
	var res = "";
	for (var p = maxColumns; p < (maxColumns * maxRows); p = p + maxColumns) {
		res = customReplace(tmp, ',', '],[', p);
		tmp = res;
	}
	tmp = "[[" + tmp + "]]"
	return tmp;
}

/**
 * Replaces
 * 
 * @param {string}
 *            str input data - "1,1,2,2"
 * @param {string}
 *            strTextToReplace - ","
 * @param {string}
 *            strReplaceWith - "],["
 * @param {int}
 *            replaceAt -2
 * @return {string} replaced string -"1,1],[2,2"
 */
function customReplace(strData, strTextToReplace, strReplaceWith, replaceAt) {
	var index = strData.indexOf(strTextToReplace);
	for (var i = 1; i < replaceAt; i++)
		index = strData.indexOf(strTextToReplace, index + 1);
	if (index >= 0)
		return strData.substr(0, index)
				+ strReplaceWith
				+ strData.substr(index + strTextToReplace.length,
						strData.length);
	return strData;
}

/**
 * Get a value of a Matrix Caution does not work if matrix contains variables!
 * 
 * @param {string}
 *            Matrix A - [[1,2],[3,4]]
 * @param {int}
 *            i row - 1 (second value!)
 * @param {int}
 *            j column- 0
 * @return {int} value of Matrix at i,j - 3
 */
function getMatValue(matrix, i, j) {
	var matrixasarray = (new Function("return " + matrix + ";")());
	return matrixasarray[i][j];
}

// TODO: get matvaluesym
function getMatValuesym(matrix, i, j) {
	var mA = getColumnsM(matrix);
	var nA = getRowsM(matrix);
	matrix = matrix.replace(/\[/g, '');
	matrix = matrix.replace(/\]/g, '');
	var array = matrix.split(",");
	var x = (mA - 1) * i;
	var sumval = i + j + x;
	// console.log(matrix)
	// console.log(sumval);

	return array[sumval];
}

/**
 * Get a Column Vector of a Matrix
 * 
 * @param {string}
 *            matrixasString - [[1,23],[12,34],[1,2],[1.3,1.6]]
 * @param {int}
 *            columnsofMatrix? - 2
 * @param {int}
 *            pos - 1 (get second column!)
 * @return{string} standing vector - [[23],[34],[2],[1.6]]
 */
function getColumnVectorOfMatrix(matrixasString, columnsofMatrix, pos) {
	var a = "["; // ligender Vektor!
	for (var i = 0; i < columnsofMatrix; i++) {
		if (i != columnsofMatrix - 1) {
			if (i != pos) {
				a = a + "0,";
			}
			if (i == pos) {
				a = a + "1,";
			}
		} else {
			if (i != pos) {
				a = a + "0";
			}
			if (i == pos) {
				a = a + "1";
			}
		}
	}
	a = a + "]"
	// console.log(a); // immer liegend!
	var liegend = "["
			+ Algebrite.dot(a, Algebrite.transpose(matrixasString)).toString()
			+ "]"; // <- ist ein liegender vektor!
	return Algebrite.transpose(liegend).toString();
}

/**
 * Get a Row Vector of a Matrix
 * 
 * @param {string}
 *            matrixasString - [[1,23],[12,34],[1,2],[1.3,1.6]]
 * @param {int}
 *            rows - 4
 * @param {int}
 *            pos - 1 (get second row!)
 * @return{string} lying vector - [[12,34]]
 */
function getRowVectorOfMatrix(matrixasString, rowsofMatrix, pos) {
	var a = "["; // ligender Vektor!
	for (var i = 0; i < rowsofMatrix; i++) {
		if (i != rowsofMatrix - 1) {
			if (i != pos) {
				a = a + "0,";
			}
			if (i == pos) {
				a = a + "1,";
			}
		} else {
			if (i != pos) {
				a = a + "0";
			}
			if (i == pos) {
				a = a + "1";
			}
		}
	}
	a = a + "]"
	// console.log(a); // immer liegend!
	return "[" + Algebrite.dot(a, matrixasString).toString() + "]";
}

/**
 * Set a column vector of matrix! TODO fails if input matrix contains symbols!
 * 
 * @param {string}
 *            Matrix A - [[1,0],[0,1]]
 * @param {int}
 *            column - 0
 * @param {string}
 *            new column value - [2,1] or [[2],[1]] or [[2,1]]
 * @return {string} new Matrix - [[2,0],[1,1]]
 */
function setColumnVectorOfMatrix(matrix, column, columnvalue) {
	// handle column inputs like: [[2,1]]
	// or [[2],[1]]
	var columnvaluesize = (new Function("return "
			+ Algebrite.shape(columnvalue) + ";")()); // dimension
	var ncolumnvaluesize = (columnvaluesize[0]);
	if (ncolumnvaluesize != 1) { // e.g: [[2],[1]] ncolumnvaluesize=2
		columnvalue = Algebrite.transpose(columnvalue).toString();
		// console.log(columnvalue);
	}
	if (columnvalue[0] = "[" && columnvalue[1] == "[") {
		columnvalue = columnvalue.substring(1);
		columnvalue = columnvalue.substring(0, columnvalue.length - 1);
	}
	// console.log(columnvalue);

	// eigentliche logik:
	var columnvaluesasarray = (new Function("return " + columnvalue + ";")());
	// console.log(columnvaluesasarray);
	var tmp = "";
	for (var i = 0; i < columnvaluesasarray.length; i = i + 1) {
		// console.log("matrix: "+matrix+" i"+i+" column"+column+"
		// "+columnvaluesasarray[i].toString())
		tmp = setMatValuesym(matrix, i, column, columnvaluesasarray[i]
				.toString());
		// console.log(tmp);
		matrix = tmp;
	}
	return matrix;
}

/**
 * Set a Row vector of matrix!
 * 
 * @param {string}
 *            Matrix A - [[1,0],[0,1]]
 * @param {int}
 *            row - 0
 * @param {string}
 *            new row value - [2,1] or [[2],[1]] or [[2,1]]
 * @return {string} new Matrix - [[2,0],[1,1]]
 */
function setRowVectorOfMatrix(matrix, row, rowvalue) {
	if (rowvalue[0] = "[" && rowvalue[1] == "[") {
		rowvalue = rowvalue.substring(1);
		rowvalue = rowvalue.substring(0, rowvalue.length - 1);
	}

	var rowvaluesasarray = (new Function("return " + rowvalue + ";")());
	// console.log(rowvaluesasarray);
	var tmp = "";
	for (var i = 0; i < rowvaluesasarray.length; i = i + 1) {
		tmp = setMatValuesym(matrix, row, i, rowvaluesasarray[i].toString());
		matrix = tmp;
	}
	return matrix;
}

/**
 * Check zero Rows of a Matrix
 * 
 * @param {string}
 *            Matrix A - [[1,0,0],[2,0,0],[3,0,1]]
 * @return {array} list which contains columns that contain only zero's - [2]
 *         (second column is a zero column!)
 */
function checkzeroColumn(matrix) {
	var list = [];
	var n = getRowsM(matrix);
	var m = getColumnsM(matrix);
	for (var j = 0; j < m; j++) {
		var columnsum = 0;
		for (var i = 0; i < n; i++) {
			columnsum = columnsum + getMatValue(matrix, i, j);
		}
		// console.log(columnsum);
		if (columnsum == 0) {
			var tmp = j + 1
			list.push(tmp);
		}
	}
	return list;
}

/**
 * Check zero Rows of a Matrix
 * 
 * @param {string}
 *            Matrix A - [[0,0,0],[2,0,0],[3,0,1]]
 * @return {array} list which contains rows that contain only zero's - [1]
 *         (first row is a zero row!)
 */
function checkzeroRow(matrix) {
	var list = [];
	var n = getRowsM(matrix);
	var m = getColumnsM(matrix);
	for (var j = 0; j < m; j++) {
		var columnsum = 0;
		for (var i = 0; i < n; i++) {
			columnsum = columnsum + getMatValue(matrix, j, i);
		}
		// console.log(columnsum);
		if (columnsum == 0) {
			var tmp = j + 1;
			list.push(tmp);
		}
	}
	return list;
}

/**
 * TODO: add imaginary and stop! Prints out if the System is stable or not.
 * 
 * @param {array}
 *            Eigenvalues - [-0.464102,6.4641]
 * @param {string}
 *            system - 's' or 'z' s for continuous z for discrete
 * @return {string} stable or unstable
 */
function check_stability(eigenvalues, system) {
	if (system.toString() == 's') {
		for (var i = 0; i < eigenvalues.length; i++) {
			// console.log(eigenvalues[i]);
			if (eigenvalues[i] > 0) {
				return "unstable";
			}
		}
		return "stable";
	} else if (system.toString() == 'z') {
		for (var i = 0; i < eigenvalues.length; i++) {
			if (Math.abs(eigenvalues[i]) >= 1) {
				return "unstable";
			}
		}
		return "stable";
	} else {
		// stop("System must be 's' or 'z'! ");
	}
}

/**
 * Calculates the controllability matrix: Q_S=[B,AB,A^n-1B]
 * 
 * @param {string}
 *            Matrix A - [[1,2],[1,2]]
 * @param {string}
 *            Matrix B - [[1],[2]]
 * @param {int}
 *            nA_fest - let empty
 * @param {??}
 *            speicher - let empty
 * @return {string} Matrix - Q_S
 */
function getQ_S(A, B, nA, nA_fest, speicher) {
	// console.log(Algebrite.run('Q_S=unit('+2+','+2+')'));
	if (typeof nA == 'undefined') {
		var cols = getColumnsM(A);
		var speicher = Algebrite.run('Q_S=unit(' + cols + ',' + cols + ')');
		speicher = Algebrite.eval('Q_S').toString();
		// console.log(Algebrite.eval('Q_S').toString());
		return getQ_S(A, B, cols, cols, speicher);
	} else {
		var pos = nA_fest - nA;
		if (nA > 0) {
			// console.log(pos);
			if (pos == 0) {
				speicher = setColumnVectorOfMatrix(speicher, 0, B);
				// console.log(speicher);
				return getQ_S(A, B, nA - 1, nA_fest, speicher);
			} else {
				var bb = getColumnVectorOfMatrix(speicher, nA_fest, pos - 1)
						.toString();
				// console.log(Algebrite.transpose(bb).toString());
				// console.log(Algebrite.transpose(A).toString());
				var newcolumn = Algebrite.dot(
						Algebrite.transpose(bb).toString(),
						Algebrite.transpose(A).toString()).toString();
				// console.log(newcolumn);
				speicher = setColumnVectorOfMatrix(speicher, pos, newcolumn);
				// console.log(speicher);
				return getQ_S(A, B, nA - 1, nA_fest, speicher);
			}
		}
	}
	return speicher;
}

/**
 * Calculates the observability matrix: Q_B=[C CA CA^n-1]
 * 
 * @param {string}
 *            Matrix A - [[1,2],[1,2]]
 * @param {string}
 *            Matrix C - [[1,2]]
 * @param {int}
 *            nA_fest - let empty
 * @param {??}
 *            speicher - let empty
 * @return {string} Matrix - Q_B
 */
function getQ_B(A, C, nA, nA_fest, speicher) {
	if (typeof nA == 'undefined') {
		var cols = getColumnsM(A);
		var speicher = Algebrite.run('Q_B=unit(' + cols + ',' + cols + ')');
		speicher = Algebrite.eval('Q_B').toString();
		return getQ_B(A, C, cols, cols, speicher);
	} else {
		var pos = nA_fest - nA;
		if (nA > 0) {
			// console.log(pos);
			if (pos == 0) {
				// console.log(speicher);
				speicher = setRowVectorOfMatrix(speicher, 0, C);
				// console.log(speicher);
				return getQ_B(A, C, nA - 1, nA_fest, speicher);
			} else {
				// speicher[pos]=A*speicher[pos-1];
				var newcolumn = Algebrite.dot(
						getRowVectorOfMatrix(speicher, nA_fest, pos - 1), A)
						.toString();
				// console.log(newcolumn);
				speicher = setRowVectorOfMatrix(speicher, pos, newcolumn);
				// console.log(speicher);
				return getQ_B(A, C, nA - 1, nA_fest, speicher);
			}
		}
	}
	return speicher;
}

/**
 * Converts an Array to an array as string
 * 
 * @param {array}
 *            array(multiarray) - [[1,2],[1,2]] (as array)
 * @return {string} Matrix - [[1,2],[1,2]] (as string)
 */
function arrayToString(array) {
	var arrasString = "";
	// console.log(array.toString());
	for (var j = 0; j < array.length; j++) {
		for (var i = 0; i < array[j].length; i = i + 1) {
			if (i == 0 && i == array[j].length - 1) {
				arrasString = arrasString + "[" + array[j][i].toString() + "]";
				break;
			} else if (i == 0 && i != array[j].length - 1) {
				arrasString = arrasString + "[" + array[j][i].toString();
				// console.log(arrasString);
			} else if (i == array[j].length - 1 && i != 0) {
				arrasString = arrasString + "," + array[j][i].toString() + "]";
				// console.log(arrasString);
			} else {
				arrasString = arrasString + "," + array[j][i].toString();
				// console.log(arrasString);
			}
		}
		if (j != array.length - 1) {
			arrasString = arrasString + ",";
		}
	}
	// console.log("["+arrasString+"]");
	return "[" + arrasString + "]";
}

/**
 * rounds each entry of a matrix
 * 
 * @param {string}
 *            matrix -
 *            [[0.34372376933344034,-0.8068982213550735],[0.9390708015880442,0.5906904945688723]]
 * @param {int}
 *            factor - 2
 * @return {string}rounded matrix - [[0.34,-0.81],[0.94,0.59]]
 */
function roundMatrix(matrix, factor) {
	var matrixasarray = (new Function("return " + matrix + ";")());
	var n = getRowsM(matrix);
	var m = getColumnsM(matrix);
	for (var i = 0; i < n; i++) {
		for (var j = 0; j < m; j++) {
			matrixasarray[i][j] = Math.round(Math.pow(10, factor)
					* matrixasarray[i][j])
					/ (Math.pow(10, factor));
		}
	}
	// console.log(matrixasarray);
	return arrayToString(matrixasarray);
}

/**
 * round each Entry of a single Array
 * 
 * @param {array}
 *            array - Array [ -0.9999999999999998, 0.9999999999999998 ]
 * @param {int}
 *            factor - 2
 * @return {array} rounded array - [[0.34,-0.81],[0.94,0.59]]
 */
function roundArray(array, factor) {
	for (var p = 0; p < array.length; p++) {
		array[p] = Math.round(array[p] * Math.pow(10, factor))
				/ (Math.pow(10, factor))
	}
	return array;
}

/**
 * calculates matrix^factor
 * 
 * @param {string}
 *            matrix - [[1,2],[1,2]]
 * @param {int}
 *            factor - 3
 * @return {string} matrix*matrix*matrix - [[61,156],[39,100]]
 */
function matrixpow(matrix, factor) {
	if (factor > 1) {
		return matrixpow(Algebrite.dot(matrix, matrix).toString(), factor - 1);
	} else {
		return matrix;
	}
}

/**
 * calculate eigenvalues of a matrix Algebrite.eigenval is working kind of
 * strange that is why this method is necessary.
 * 
 * @param {string}
 *            matrix(square!) - [[1.789,0,0],[0,0,0],[0,0,1]]"
 * @return {array} eigenvalues - 1.789,1.0,0
 */
function eigenvalue(matrix) {
	var n = getRowsM(matrix);
	var m = getColumnsM(matrix);
	var eigenvalues = [];
	var eigenval = Algebrite.eigenval(matrix).tensor.elem;
	if (n != m) {
		// TODO: stop!
		console.log("cannot eigenvalues of non square matirx!");
	} else {
		// 1. push non zero values:
		for (var i = 0; i < eigenval.length; i++) {
			if (eigenval[i] != 0) {
				eigenvalues.push(eigenval[i]);
			}
		}
		var tmp = (n - eigenvalues.length);
		// rest values are zeros:
		for (var j = 0; j < tmp; j++) {
			eigenvalues.push(0);
		}
	}
	return eigenvalues;
}

/**
 * calculates Rank of a Matrix if matrix is square: rank = n -
 * eigenvalues_in_zero if matrix is not square calculate matrix*matrix^T=H rank =
 * eigenvalues_in_zero of H
 * 
 * @param {string}
 *            matrix - [[1,2],[1,2]]
 * @return {int} rank - 1
 */
function rankofMatrix(matrix) {
	var matrixarray = (new Function("return " + matrix + ";")());
	var nA = getRowsM(matrix);
	var mA = getColumnsM(matrix);

	if (nA == mA) {
		var matrixarray = (new Function("return " + matrix + ";")());
		var eigenvalues = roundArray(numeric.eig(matrixarray).lambda.x, 4);
		var eigenvalues_inzero = 0;
		for (var l = 0; l < eigenvalues.length; l++) {
			if (eigenvalues[l] == 0) {
				eigenvalues_inzero = eigenvalues_inzero + 1;
			}
		}
		return nA - eigenvalues_inzero; // this is the rank!
	} else {
		// console.log("calc. rank of not square matrix");
		return rankofMatrix(Algebrite.dot(matrix, Algebrite.transpose(matrix))
				.toString());
	}
}

/**
 * scalces a vector from [0.894427,-0.447214] -> [ 1, -0.5 ]
 * 
 * @param {array}
 *            array - [0.894427,-0.447214]
 * @return {array} array - [ 1, -0.5 ]
 */
function scaleVec(vec) {
	var factor = 1;// 1=factor*0.89

	if (vec.length >= 1 && vec[0] != 0) {
		factor = 1 / vec[0];
	} else if (vec.length >= 2 && !vec[1] == 0) {
		factor = 1 / vec[1];
	}
	// TODO make above in for loop with brack!
	for (var j = 0; j < vec.length; j++) {
		vec[j] = factor * vec[j];
		// console.log(vec[j]);
	}

	// round vec:
	vec = roundArray(vec, 5);
	return vec;
}

/**
 * Computes the kernel of a Matrix Ax =0 -> k*x=? if kern does not exist veclist
 * is empty. TODO: works only for not symbolic matrices?!
 * 
 * @param {string}
 *            matrix - [[1,2],[1,2]]
 * @return {array} list of kernel vectors - [ 1, -0.5 ]
 */
function kerofMatrix(matrix) {
	// console.log(matrix);
	var matrixarray = (new Function("return " + matrix + ";")());
	var svd = numeric.svd(matrixarray);
	var Uarray = svd.U;
	var Sarray = svd.S; // diagonal matrix
	var Varray = svd.V;
	// console.log(svd);
	var veclist = [];
	for (var p = 0; p < Sarray.length; p++) {
		if (Sarray[p] == 0) {
			var vec = getColumnVectorOfMatrix(arrayToString(Varray),
					Varray.length, p).toString();
			// console.log(vec);
			veclist.push(vec);
		}
	}

	// make the veclist nice!
	var resultarray = [];
	// console.log(veclist);
	for (var p = 0; p < veclist.length; p++) {
		var vecarray = (new Function("return " + veclist[p] + ";")());
		vecarray = scaleVec(vecarray);
		// console.log(vecarray);
		resultarray.push(vecarray);
	}

	return resultarray; // basis vectors!
}

/**
 * Compute the generalized vector:(A-lambda I)^k x = 0 if k = 0 it is simply the
 * normal eigenvector of A of a particular eigenvalue
 * 
 * @param {string}
 *            matrix - [ [ 1, 0 ], [ 0, 1 ] ]
 * @param {double}
 *            eigenval - 1
 * @param {k}
 *            generalized vector number - 0....10
 * @return {array} list of generalized vectors - [ [ 1, 0 ], [ 0, 1 ] ]
 */
function generalvector(matrix, eigenval, stufe) {
	var rows = getRowsM(matrix);
	var cols = getColumnsM(matrix)
	if (rows != cols) { // Test square
		throw new Error("Input matrix must be square: n=" + rows + ", m="
				+ cols);
	}
	var matrixarray = (new Function("return " + matrix + ";")());
	if (roundArray(numeric.eig(matrixarray).lambda.x, 4).indexOf(eigenval) < 0) { // test
																					// eigenvalue
																					// in
																					// matrix!
		throw new Error("Eigenval is not in matrix! eigenval: " + eigenval
				+ " matrix:" + matrix);
	}
	var lambdaI = Algebrite.dot(Algebrite.unit(rows).toString(), eigenval)
			.toString();
	var AlambdaI = Algebrite.run(matrix + "-" + lambdaI).toString();
	var tmp = matrixpow(AlambdaI, stufe).toString();
	// console.log(AlambdaI);
	// console.log(tmp);
	// console.log(kerofMatrix(tmp)); //stores eigenvectors!
	return kerofMatrix(tmp);
}

/**
 * Compute the transformation Matrix T of a matrix M Example: M =
 * [[-10,1,7],[-7,2,3],[-16,2,12]] (input) T = [[1,1,1],[1,-1,0],[1,0,2]]
 * (output) JNF= T^-1 M T = [[-2,0,0],[0,3,1],[0,0,3]] TODO: Caution this method
 * currently does not check for multiple eigenvalues if the condition
 * (A-lambdaI)^(stufe-1) v^stufe != 0 is correct! THIS feature should be added!
 * 
 * @param {string}
 *            matrix - [[-10,1,7],[-7,2,3],[-16,2,12]]
 * @return {array} jordan transform matrix T- T= [[1,1,1],[1,-1,0],[1,0,2]] =
 *         1,1,1,1,−1,2,1,0,2
 */
function jordantransform(matrix) {
	// calculate eigenvalues:
	var matrixarray = (new Function("return " + matrix + ";")());
	var eigenvalues = roundArray(numeric.eig(matrixarray).lambda.x, 4);
	eigenvalues = eigenvalues.sort();
	var result = [];

	var singleeigenvalues = [];
	var multipleeigenvalues = []; // if an eigenvalue is double this list
									// contains it also only once!
	// console.log(eigenvalues);
	for (var i = 0; i < eigenvalues.length - 1; i++) {
		if (eigenvalues[i] != eigenvalues[i + 1]) {
			singleeigenvalues.push(eigenvalues[i]);
		} else if (multipleeigenvalues.indexOf(eigenvalues[i]) == -1) {
			multipleeigenvalues.push(eigenvalues[i]);
		}
	}
	// console.log(singleeigenvalues);
	// console.log(multipleeigenvalues);

	// only single eigenvalues do it directly:
	if (multipleeigenvalues.length == 0) {
		var res = (arrayToString(numeric.eig(matrixarray).E.x));
		// console.log(roundMatrix(res,4));
		return (roundMatrix(res, 4));
	}

	// eigenvectors for single eigenvalues:
	for (var p = 0; p < singleeigenvalues.length; p++) {
		result.push(generalvector(matrix, singleeigenvalues[p], 1));
	}

	// eigenvectors for multiple eigenvalues:
	for (var p = 0; p < multipleeigenvalues.length; p++) {
		var vielfachheit = eigenvalues.indexOf(multipleeigenvalues[p]) + 1;
		var tmp = 1;
		var doublelist = [];
		while (doublelist.length != vielfachheit) {
			var generalveclist = generalvector(matrix, multipleeigenvalues[p],
					tmp);
			for (var z = 0; z < generalveclist.length; z++) {
				if (doublelist.length == vielfachheit) {
					break;
				}
				doublelist.push(generalveclist[z]);
				// console.log(vielfachheit)
			}
			tmp++;
			// console.log(doublelist);
		}
		result.push(doublelist);
	}
	// console.log("result:");
	// console.log(result);
	return result;
}

/**
 * Hautus Controllability Matrix: M_SH=(sI_n-A B) rank(sI_n-A B) = n for all s
 * in C ?
 * 
 * @param {string}
 *            A matrix - [[1,2],[3,4]]
 * @param {string}
 *            B matrix - [[1],[0]]
 * @return {array} list of M_SH and not controllable eigenvalues - [[-1 +
 *         s,-2,0,0],[-3,-4 + s,0,0]] (just M_SH cause all eigenvalues are H.
 *         controllable!)
 */
function checkHautusS(AasString, BasString) {
	var nA = getRowsM(AasString);
	var mB = getColumnsM(BasString)
	var matrixarray = (new Function("return " + AasString + ";")());
	var eigArray = roundArray(numeric.eig(matrixarray).lambda.x, 4)

	var list = [];

	var sIN_A = Algebrite.run('s*' + 'unit(' + nA + ')' + '-' + AasString)
			.toString();

	var nAmB = nA + mB;
	var resultSH = "";
	Algebrite.run('M_SH=zero(' + nA + ',' + nAmB + ')');
	var tmpSH = Algebrite.eval('M_SH').toString();
	// place ones at the diagonal
	for (var p = 0; p < nA; p++) {
		resultSH = setMatValue(tmpSH, p, p, 1);
		tmpSH = resultSH;
	}
	Algebrite.run('M_SH=' + resultSH);
	// U = sI-A e.g: M_SH = ([[1,0,0],[0,1,0]])
	var M_SH = Algebrite.dot(sIN_A, 'M_SH').toString();
	// console.log(M_SH);
	M_SH = setColumnVectorOfMatrix(M_SH, nAmB - 1, BasString);
	// console.log(M_SH);
	list.push(M_SH);

	var result = M_SH;
	for (var z = 0; z < eigArray.length; z++) {
		M_SH = result.replace(/s/g, "(" + eigArray[z] + ")");
		// console.log(M_SH);
		// M_SH="det("+matrix2Latex(M_SH)+")="+Algebrite.det(M_SH);
		if (rankofMatrix(M_SH) != nA) {
			list.push(eigArray[z]);
		}
	}

	return list;
}

/**
 * Hautus Observability Matrix: M_BH=(sI_n-A; C) rank(sI_n-A B) = n for all s in
 * C ?
 * 
 * @param {string}
 *            A matrix - [[1,2],[3,4]]
 * @param {string}
 *            B matrix - [[1,0]]
 * @return {array} list of M_BH and not observable eigenvalues - [[-1 +
 *         s,-2,0,0],[-3,-4 + s,0,0]] (just M_SH cause all eigenvalues are H.
 *         controllable!)
 */
function checkHautusB(AasString, CasString) {
	var nA = getRowsM(AasString);
	var nC = getRowsM(CasString)
	var matrixarray = (new Function("return " + AasString + ";")());
	var eigArray = roundArray(numeric.eig(matrixarray).lambda.x, 4)

	var list = [];

	var sIN_A = Algebrite.run('s*' + 'unit(' + nA + ')' + '-' + AasString)
			.toString();

	var nAnC = nA + nC;
	var resultBH = "";
	Algebrite.run('M_BH=zero(' + nAnC + ',' + nA + ')');
	var tmpBH = Algebrite.eval('M_BH').toString();
	for (var p = 0; p < nA; p++) {
		resultBH = setMatValue(tmpBH, p, p, 1);
		tmpBH = resultBH;
	}

	Algebrite.run('M_BH=' + resultBH);
	var M_BH = Algebrite.dot('M_BH', sIN_A).toString();
	M_BH = setRowVectorOfMatrix(M_BH, nAnC - 1, CasString);
	list.push(M_BH);

	var result = M_BH;
	for (var z = 0; z < eigArray.length; z++) {
		M_BH = result.replace(/s/g, "(" + eigArray[z] + ")");
		if (rankofMatrix(M_BH) != nA) {
			list.push(eigArray[z]);
		}
	}
	return list;
}

/**
 * Calculate system-parameters of a continuous s-System.
 * 
 * @param {string}
 *            A matrix - [[1,2],[3,4]] (required)
 * @param {string}
 *            B matrix - [[1],[0]] (required)
 * @param {string}
 *            C matrix - [[1,0]] (required)
 * @param {string}
 *            D matrix - 0 (optional)
 * @param {string}
 *            x_0 start values - [[1],[0]] (required for time response)
 * @return {hashmap} results: key: Description: nA rows of Matrix A mA columns
 *         of Matrix A nB,mB,nC,mC,nD,mD
 * 
 * A,B,C,D matrix A,B,C,D
 * 
 * som {string} SISO or MIMO System? soz {string} continuous(s) or discrete(z)
 * System? eigA {array} eigenvalues of A Matrix stability {string} stable or
 * unstable
 * 
 * Q_SK {string} controllability Matrix Kalman Q_BK {string} observability
 * Matrix Kalman
 * 
 * rQ_SK {int} rank of Q_S matrix iQ_SK {string} Q_S^-1 matrix if not existant:
 * iQ_SK="undefined" isKS {string} System is (not) Kalman controllable q_SK
 * {string} q_tilde vector last column of Q_S^-1 (required for SNF
 * transformation) (same for observability matrices Q_B)
 * 
 * M_SH {string} Hautus Controllability Matrix hnc {array} Hautus not
 * controllable Eigenvalues M_BH {string} Hautus Observability Matrix hno
 * {array} Hautus not observable Eigenvalues gnc {array} Gilbert not
 * controllable Eigenvalues gno {array} Gilbert not observable eigenvalues
 * 
 * T_SNF {string} Transformation Matrix to the Controllability normal form
 * (undefined if q_SK = undefined) iT_SNF {string} inverse of T_SNF (undefined
 * if q_SK = undefined) A_SNF {string} A_SNF=iT_SNF*A*T_SNF transforemd A Matrix
 * (undefined if q_SK = undefined) B_SNF {string} B_SNF=... (undefined if q_SK =
 * undefined) C_SNF {string} C_SNF=... (undefined if q_SK = undefined) TODO:
 * D_SNF: ... T_BNF,iT_BNF, A_BNF,B_BNF,C_BNF analoge for Observability normal
 * form T_JNF,iT_JNF, A_JNF,B_JNF,C_JNF analoge for jordan normal form
 * 
 * charPoly {string} inv_sIA {string} transo {string} transoex {string}
 * 
 * 
 * transitionA{string} states{Array} inoutsol{string} eigensol{string}
 */
function calcSSys(A, B, C, D,x_0) {
	// TODO: check string repres of matrices! see algebrite!
	if (D = 'undefined') {
		D = "[[0]]";
	}

	var result = {};

	// 0. Store Matrices:
	result['A'] = A;
	result['B'] = B;
	result['C'] = C;
	result['D'] = D;
	result['x_0']=x_0;

	// 1. Dimensions:
	result['nA'] = getRowsM(A);
	result['nB'] = getRowsM(B);
	result['nC'] = getRowsM(C);
	result['nD'] = getRowsM(D);
	result['mA'] = getColumnsM(A);
	result['mB'] = getColumnsM(B);
	result['mC'] = getColumnsM(C);
	result['mD'] = getColumnsM(D);

	// 2. System:
	// SISO or MIMO
	if (result['mB'] == result['nC'] && result['mB'] == 1) {
		result['som'] = "SISO";
	} else {
		result['som'] = "MIMO";
	}
	// s or z?
	result['soz'] = 's';
	// console.log(result['A']+": "+result['nA']+"x"+result['mA']+result['B']+":
	// "+result['nB']+"x"+result['mB']+result['C']+":
	// "+result['nC']+"x"+result['mC']);

	// 3. Stability
	// TODO caution rounding factor
	result['eigA'] = roundArray(numeric.eig((new Function("return " + A + ";")
			())).lambda.x, 4);
	;
	result['stability'] = check_stability(result['eigA'], result['soz']);

	// 4. Controllability, Observability
	// Kalman:
	result['Q_SK'] = getQ_S(A, B);
	result['Q_BK'] = getQ_B(A, C);

	result['rQ_SK'] = rankofMatrix(result['Q_SK']);
	result['rQ_BK'] = rankofMatrix(result['Q_BK']);

	if (result['rQ_SK'] == result['nA']) {
		result['isKS'] = "controllable.";
		result['iQ_SK'] = Algebrite.inv(result['Q_SK']).toString();
		result['q_SK'] = getRowVectorOfMatrix(result['iQ_SK'], result['nA'],
				result['nA'] - 1).toString();
	} else {
		result['isKS'] = "not controllable.";
		result['iQ_SK'] = "undefined";
		result['q_SK'] = "undefined";
	}
	// console.log('Q_SK: '+result['Q_SK']+" Q_BK: "+result["Q_BK"]+"
	// rQ_SK:"+result['rQ_SK']+" rQ_BK:"+result['rQ_BK']);
	// console.log('isKS: '+result['isKS']+" iQ_SK: "+result["iQ_SK"]+"
	// q_SK:"+result['q_SK']);

	if (result['rQ_BK'] == result['nA']) {
		result['isBS'] = "observable.";
		result['iQ_BK'] = Algebrite.inv(result['Q_BK']).toString();
		result['q_BK'] = getRowVectorOfMatrix(result['iQ_BK'], result['nA'],
				result['nA'] - 1).toString();
	} else {
		result['isBS'] = "not observable.";
		result['iQ_BK'] = "undefined";
		result['q_BK'] = "undefined";
	}
	// console.log('isBS: '+result['isBS']+" iQ_BK: "+result["iQ_BK"]+"
	// q_BK:"+result['q_BK']);

	// Hautus:
	var hautusS = checkHautusS(A, B);
	var hautusnCE = []; // hautus not controllable eigenvalues!
	result['M_SH'] = hautusS[0].toString();
	for (var p = 1; p < hautusS.length; p++) {
		hautusnCE.push(hautusS[p]);
	}
	result['hnc'] = hautusnCE;
	if (hautusnCE.length == 0) {
		result['hnc'] = "none";
	}
	// console.log('M_SH: '+result['M_SH']+" hnc: "+result["hnc"]);

	var hautusB = checkHautusB(A, C);
	var hautusnOE = []; // hautus not controllable eigenvalues!
	result['M_BH'] = hautusB[0].toString();
	for (var p = 1; p < hautusB.length; p++) {
		hautusnOE.push(hautusB[p]);
	}
	result['hno'] = hautusnOE;
	if (hautusnOE.length == 0) {
		result['hno'] = "none";
	}
	// console.log('M_BH: '+result['M_BH']+" hno: "+result["hno"]);

	// Gilbert requires JNF! (-> see under JNF)

	// 4. Transformations:
	// SNF
	if (result['q_SK'] != "undefined") {
		result['iT_SNF'] = getQ_B(A, result['q_SK'].toString()).toString();
		if (rankofMatrix(result['iT_SNF']) == result['nA']) {
			result['T_SNF'] = roundMatrix(Algebrite.inv(result['iT_SNF'])
					.toString(), 4);
			result['A_SNF'] = roundMatrix(Algebrite.dot(result['iT_SNF'], A,
					result['T_SNF']).toString(), 4);
			result['B_SNF'] = roundMatrix(Algebrite.dot(result['iT_SNF'], B)
					.toString(), 4);
			result['C_SNF'] = roundMatrix(Algebrite.dot(C, result['T_SNF'])
					.toString(), 4);
		}
	} else {
		result['iT_SNF'] = "undefined";
		result['T_SNF'] = "undefined";
		result['A_SNF'] = "undefined";
		result['B_SNF'] = "undefined";
		result['C_SNF'] = "undefined";
	}
	// console.log('q_SK: '+result['q_SK']+" iT_SNF: "+result["iT_SNF"]+" T_SNF:
	// "+result['T_SNF']);
	// console.log('A_SNF: '+result['A_SNF']+" B_SNF: "+result["B_SNF"]+" C_SNF:
	// "+result['C_SNF']);

	// BNF
	if (result['q_BK'] != "undefined") {
		result['iT_BNF'] = getQ_S(A, result['q_BK']).toString();
		if (rankofMatrix(result['iT_BNF']) == result['nA']) {
			result['T_BNF'] = roundMatrix(Algebrite.inv(result['iT_BNF'])
					.toString(), 4);
			result['A_BNF'] = roundMatrix(Algebrite.dot(result['iT_BNF'], A,
					result['T_BNF']).toString(), 4);
			result['B_BNF'] = roundMatrix(Algebrite.dot(result['iT_BNF'], B)
					.toString(), 4);
			result['C_BNF'] = roundMatrix(Algebrite.dot(C, result['T_BNF'])
					.toString(), 4);
		}
	} else {
		result['iT_BNF'] = "undefined";
		result['T_BNF'] = "undefined";
		result['A_BNF'] = "undefined";
		result['B_BNF'] = "undefined";
		result['C_BNF'] = "undefined";
	}
	// console.log('q_BK: '+result['q_BK']+" iT_BNF: "+result["iT_BNF"]+" T_BNF:
	// "+result['T_BNF']);
	// console.log('A_BNF: '+result['A_BNF']+" B_BNF: "+result["B_BNF"]+" C_BNF:
	// "+result['C_BNF']);

	// JNF
	result['T_JNF'] = jordantransform(A).toString();
	if (rankofMatrix(result['T_JNF']) == result['nA']) {
		result['iT_JNF'] = roundMatrix(Algebrite.inv(result['T_JNF'])
				.toString(), 4);
		result['A_JNF'] = roundMatrix(Algebrite.dot(result['iT_JNF'], A,
				result['T_JNF']).toString(), 4);
		result['B_JNF'] = roundMatrix(Algebrite.dot(result['iT_JNF'], B)
				.toString(), 4);
		result['C_JNF'] = roundMatrix(Algebrite.dot(C, result['T_JNF'])
				.toString(), 4);
	} else {
		result['T_JNF'] = "undefined";
		result['A_JNF'] = "undefined";
		result['B_JNF'] = "undefined";
		result['C_JNF'] = "undefined";
	}
	// console.log('T_JNF: '+result['T_JNF']+" iT_JNF: "+result["iT_JNF"]);
	// console.log('A_JNF: '+result['A_JNF']+" B_JNF: "+result["B_JNF"]+" C_JNF:
	// "+result['C_JNF']);

	// Gilbert: requires JNF!
	if (result['T_JNF'] != "undefined") {
		var gnctmp = checkzeroRow(result['B_JNF']);
		var gnotmp = checkzeroColumn(result['C_JNF']);
		result['gnc'] = (gnctmp.length == 0) ? "none" : gnctmp.toString();
		result['gno'] = (gnotmp.length == 0) ? "none" : gnotmp.toString();
	} else {
		result['gnc'] = "undefined";
		result['gno'] = "undefined";
	}
	// console.log('gnc: '+result['gnc']+" gno: "+result["gno"]);

	// 6. Transfere Function:
	// TODO: test mit simplyfiy ob besser aussieht.
	result['charPoly'] = Algebrite.run(
			'det(s*unit(' + result["nA"] + ')-' + A + ")").toString();
	result['inv_sIA'] = Algebrite.run(
			'simplify(inv(s*unit(' + result["nA"] + ')-' + A + "))").toString();
	result['transo'] = Algebrite.dot(C, result['inv_sIA'], B).toString();// Caution
																			// this
																			// is a
																			// matrix!

	// console.log('charPoly: '+result['charPoly']+" inv_sIA:
	// "+result["inv_sIA"]+" transo: "+result["transo"]);

	// Partialbruchzerlegung Go(s)
	var transfere_expanded2 = "";
	result['transoex'] = "undefined"
	if (result['B_JNF'] != "undefined") {
		for (var p = 0; p < result['eigA'].length; p++) {
			var residuum = Math.round(getMatValue(result['B_JNF'], p, 0)
					* getMatValue(result['C_JNF'], 0, p) * Math.pow(10, 4))
					/ (Math.pow(10, 4));
			if (residuum != 0) {
				transfere_expanded2 = transfere_expanded2 + residuum.toString();
				transfere_expanded2 = transfere_expanded2 + "/(s-("
						+ getMatValue(result['A_JNF'], p, p) + "))";
			}
		}
		result['transoex'] = transfere_expanded2;
	}
	// console.log('transoex: '+result['transoex']);
	// Pole Placement:

	// Ortskurve:

	// PZM - root locus:
	
	//
	// Drawing stuff:
	//
	
	// time solution:
	if(x_0!=null){
		var restime = timesolstates(A,B,x_0);
		result['transitionA']=restime['phiAt'];
		result['states']=vec2array(restime['states'],"t");  // <- give it back
															// as arry of
															// functions!
		result['eigensol']=restime['eigensol'];
		result['inoutsol']=restime['inoutsol'];
	}

	return result;
}

// matrix as string a phi = e^(At)
// numerisch aufwändige methode!
// nur so machen wenn eigenwerte nicht alle einfach?!
function calctransitionm(matrix) {
	if (checksingleeig) {// all eigenvalues are single!
		// e^At = T^-1 A_neu T
		// e^At=T e^(T^-1 A T) T^-1
		// console.log("eigenvalues all single");
		var T_JNF = jordantransform(matrix).toString();
		var iT_JNF = Algebrite.inv(T_JNF).toString();
		var A_JNF = roundMatrix(Algebrite.dot(iT_JNF, matrix, T_JNF).toString(), 3);
		var A_neu = A_JNF;
		for (var p = 0; p < 2; p++) {
			A_neu = setMatValuesym(A_neu, p, p, "e^("+ getMatValuesym(A_neu, p, p) + "*t)");
		}
		A_neu = (Algebrite.run(A_neu).toString());
		return Algebrite.dot(T_JNF,A_neu,iT_JNF).toString();

	} else {
		// TODO!!!!
		console.log("ERROR this does not work yet eigenvalues are not single ");
		var tmp = "[[1,0],[0,1]]";
		// console.log(Algebrite.run("[[1,0],[1,0]]+[[t,0],[0,2
		// t]]").toString());
		for (var i = 1; i < 20; i++) {
			var res = Algebrite.run("([[1,0],[0,2]]*t)^" + i + "/(" + i + "!)")
					.toString();
			tmp = tmp + "+" + res;
			tmp = Algebrite.run(tmp);
		}
		console.log(tmp);
	}
	// console.log(Algebrite.run("e^([[1,0],[0,2]])").toString());
}


// func: -1 + 2 exp(t) + exp(4 t)
// start: 0
// end: 3
// step:0.1
// variable: 't'
// return:'0,2.0,0.5,9.6865,1,59.0347,1.5,411.392,2,2994.74,2.5,22049.8,3,162794.0
// (multiple array!)
function calcvaluesoffunction(func,start,end,step,variable){
	var res = [];
	var tmp ="";
	var point=[];
	for(var p=start;p<=end;p=p+step){
	tmp = func.replaceAll(variable,p);
	tmp = Algebrite.run(tmp).toString();
	// point.push(p);point.push()
	res.push([p,Algebrite.float(tmp).toString()]);
	}
	return res;
	// console.log(res);
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

// check single eigenvalues:
// function checks if a matrix contains only single eigenvalues:
function checksingleeig(matrix) {
	var matrixarray = (new Function("return " + matrix + ";")());
	var eigenvalues = roundArray(numeric.eig(matrixarray).lambda.x, 4);
	eigenvalues = eigenvalues.sort();

	var singleeigenvalues = [];
	for (var i = 0; i < eigenvalues.length - 1; i++) {
		if (eigenvalues[i] == eigenvalues[i + 1]) {
			return false;
		}
	}
	return true;
}

// matrix as strings!
// x_start = x_0 as matrix: [[0],[1]]
// für einheitssprung: u(t) = 1 für t>0
// just for SISO! working!
// y = Cx
function timesol(A,B,C,x_start){
	var res =  Algebrite.dot(C,timesolstates(A,B,x_start)['states']).toString();
	res=res.replace(/\[/g, '');
	res=res.replace(/\]/g, '');
return res;
}

// convert vector to single array:
// [[-1 + 2 exp(t)],[exp(4 t)]] ->-1 + 2 exp(t),exp(4 t) (as Array)
// replace variables! t->x
function vec2array(vec,variable){
	var tmp = vec.toString();
	tmp=tmp.replace(/\[/g, '');
	tmp=tmp.replace(/\]/g, '');
	
	if(variable!=null){
		tmp=tmp.replaceAll(variable,"x");
	}
	
	return tmp.split(",");
}

// für sprung und SISO x(t)
// return hashmap of results:
function timesolstates(A,B,x_start){
	var results = {};
	var phiAt = calctransitionm(A);
    var phiAttau = phiAt.replace(/t/g, '(t-tau)');
	// console.log(phiAttau);
	var eigensol=Algebrite.dot(phiAt,x_start).toString();
	// eigensol=eigensol.replace(/\[/g, '');
	// eigensol=eigensol.replace(/\]/g, '');
	// console.log(eigensol);
	
	// inoutsol = int_0^t C e^(A(t-tau)) B u(tau) dtau
	var inoutsol=Algebrite.dot(phiAttau,B).toString(); // -> [[exp(t - tau)]]
	inoutsol=inoutsol.replace(/\[/g, '');
	inoutsol=inoutsol.replace(/\]/g, '');
	// console.log("inout: "+inoutsol);
	inoutsol = inoutsol.split(",");
	// console.log(inoutsol);
	var inoutarr = [];
	for(var p = 0;p<inoutsol.length;p++){
		inoutarr.push(Algebrite.defint(inoutsol[p],"tau",0,"t").toString());
	}
	// console.log(inoutarr);
	// arrayToMatrixStringC(stringarray, maxColumns, maxRows)
	inoutsol=arrayToMatrixStringC(inoutarr.toString(),inoutsol.length-1,0);
	var tmp = eigensol+"+"+inoutsol+"";
	// console.log("tmp: "+tmp);
	tmp=(Algebrite.run(tmp).toString());
	results['states']=tmp;
	results['phiAt']=phiAt;
	results['eigensol']=eigensol;
	results['inoutsol']=inoutsol;
	return results;
}

/**
 * getfnclist of simact functions!
 * 
 * @return {array} a list of all functions of the simact library
 */
function getfnclist() {
	return [ "getColumnsM", "getRowsM", "getMatValue", "setMatValue",
			"getColumnVectorOfMatrix", "getRowVectorOfMatrix",
			"setColumnVectorOfMatrix", "setRowVectorOfMatrix",
			"checkzeroColumn", "checkzeroRow", "arrayToString", "roundMatrix",
			"roundArray", "matrixpow", "rankofMatrix", "eigenvalue",
			"kerofMatrix", "scaleVec", "generalvector", "jordantransform",
			"checkHautusB", "checkHautusS", "setMatValuesym",
			"arrayToMatrixStringR", "arrayToMatrixStringC", "customReplace",
			"getfnclist", "getQ_S", "getQ_B", "check_stability", "calcSSys",
			"plot", "linspace", "get_algebrite_functionlist"];
}

/**
 * get_algebrite_functionlist
 * see here: http://algebrite.org/docs/latest-stable/reference.html
 * @return {array} a list of all functions of the algebrite library
 */
function get_algebrite_functionlist(){
	return [ "abs", "adj", "and", "arccos",
		"arccosh", "arcsin",
		"arcsinh", "arctan",
		"arctanh", "arg", "besselj", "bessely",
		"ceiling", "check", "choose", "circexp",
		"clear", "clearall", "coeff", "cofactor",
		"conj", "contract", "cos",
		"cosh", "cross", "curl",
		"d", "defint", "deg", "det", "dim",
		"do", "dot","eigen", "eigenval", "eigenvec", "erf", "erfc",
		"eval", "exp", "expand", "expcos", "expsin",
		"factor", "factorial", "filter", "float", "floor",
		"for", "gcd", "hermite", "hilbert", "imag",
		"inner", "integral", "inv", "isprime", "laguerre",
		"lcm", "leading", "legendre", "log", "lookup",
		"mod", "not", "nroots", "numerator", "or",
		"outer", "polar", "prime", "print", "print2dascii",
		"printfull", "printlatex", "printlist", "printplain", "product",
		"quote", "quotient", "rank", "rationalize", "real",
		"rect", "roots", "shape", "simplify", "sin",
		"sinh", "sqrt", "stop", "subst", "sum",
		"symbolsinfo", "tan", "tanh", "taylor", "test",
		"transpose", "unit", "version", "zero"
		];
}

module.exports = {
	Algebrite : Algebrite,
	numeric : numeric,

	getColumnsM : getColumnsM,
	getRowsM : getRowsM,
	getMatValue : getMatValue,
	setMatValue : setMatValue,
	getColumnVectorOfMatrix : getColumnVectorOfMatrix,
	getRowVectorOfMatrix : getRowVectorOfMatrix,
	setColumnVectorOfMatrix : setColumnVectorOfMatrix,
	setRowVectorOfMatrix : setRowVectorOfMatrix,
	checkzeroColumn : checkzeroColumn,
	checkzeroRow : checkzeroRow,
	arrayToString : arrayToString,
	roundMatrix : roundMatrix,
	roundArray : roundArray,
	matrixpow : matrixpow,
	rankofMatrix : rankofMatrix,
	eigenvalue : eigenvalue,
	kerofMatrix : kerofMatrix,
	scaleVec : scaleVec,
	generalvector : generalvector,
	jordantransform : jordantransform,
	checkHautusS : checkHautusS,
	checkHautusB : checkHautusB,
	setMatValuesym : setMatValuesym,
	arrayToMatrixStringR : arrayToMatrixStringR,
	arrayToMatrixStringC : arrayToMatrixStringC,
	customReplace : customReplace,
	getfnclist : getfnclist,
	get_algebrite_functionlist,

	check_stability : check_stability,
	getQ_S : getQ_S,
	getQ_B : getQ_B,

	calcSSys : calcSSys,
	calctransitionm : calctransitionm,
	checksingleeig : checksingleeig,
	getMatValuesym : getMatValuesym,
	timesol:timesol,
	timesolstates:timesolstates,
	calcvaluesoffunction:calcvaluesoffunction,
	vec2array:vec2array,
	
	getOpenWebpageHashMap:getOpenWebpageHashMap,
	plot:plot,
	linspace:linspace,
}

/**
 * Control Theory Library of Markus Lamprecht
 * 
 * Depens on: Algebrite http://algebrite.org/ (which depends on Big-Integer)
 * 			  numeric (used to compute the SVD - kernel of a Matrix)
 * 
 * Rules:
 * 1. Use this Documentation style: http://usejsdoc.org/
 * 2. no console.log arguments!
 * 3. Tests Jasmine
 * 4. Remember to exports new function at the end of this document!
 * 
 * Algebrite:
 * Algebrite.dot(firstarg is not allowed to be a singular matrix!!!, ...) 
 */

//TODO: check number of input arguments in each function!
  
var Algebrite = require('./algebrite');
var numeric = require('./numeric');


/**
 * Get the Columns of a Matrix
 * @param {string} Matrix - [[12,87]]
 * @return{int} columns of Matrix - 2
 */
function getColumnsM(matrix){
	var size = (new Function("return " + Algebrite.shape(matrix).toString()+ ";")());
	return size[1];
}

/**
 * Get the Rows of a Matrix
 * @param {string} Matrix - [[12,87]]
 * @return{int} rows of Matrix - 1
 */
function getRowsM(matrix){
	var size = (new Function("return " + Algebrite.shape(matrix).toString()+ ";")());
	return size[0];
}

/**
* Set a value of a Matrix (matrix is only allowed to contain numbers)
* @param {string} Matrix A - [[1,2],[3,4]] (is not allowed to contain symbols!)
* @param {int} i row  - 1 (second value!)
* @param {int} j column- 0
* @param {double/int} value to set - 0.12398
* @return {string} matrix - resulting Matrix "[[1,2],[0.12398,4]]"
*/
function setMatValue(matrix,i,j,value){
 var matrixasarray = (new Function("return " +matrix+ ";")());
 matrixasarray[i][j]=value;
return arrayToString(matrixasarray);
}

/**
* Set a value of a Matrix (Symbolic values in matrix are allowed!)
* @param {string} Matrix A - "[[1,1,1],[2,2,2],[3,3,3]]"
* @param {int} i row  - 0 (first value!)
* @param {int} j column- 2 (third value)
* @param {string} value to set - "s+6"
* @return {string} matrix - resulting Matrix "[[1,1,s+6],[2,2,2],[3,3,3]]"
*/
function setMatValuesym(matrix,i,j,value){
	var mA = getColumnsM(matrix);
	var nA = getRowsM(matrix);
	matrix = matrix.replace(/\[/g, '');
	matrix = matrix.replace(/\]/g, '');
	var array = matrix.split(",");
	var x =(mA-1)*i;
	var sumval = i+j+x;
	//console.log(matrix)
	//console.log(sumval);
	
	array[sumval]=value;
	//console.log(array);
	
	var output = arrayToMatrixString(array.toString(),mA,nA);
	//console.log(output);
	return output;
}

/**
* Converts a single Arry to a Matrix String
* @param {String} String repr of a single Array - "1,1,2,2"
* @param {int}  columns of the input matrix - 2
* @param {int}  rows of the input matrix - 2
* @return {string} matrix -"[[1,1],[2,2]]"
*/
function arrayToMatrixString(stringarray,maxColumns,maxRows){
	var tmp = stringarray;
	var res ="";
	for(var p = maxColumns;p<(maxColumns*maxRows);p=p+maxColumns){
		res = customReplace(tmp,',','],[',p);
		tmp = res;
	}
	tmp = "[["+tmp+"]]"
	return tmp;
}

/**
* Replaces 
* @param {string} str input data - "1,1,2,2"
* @param {string} strTextToReplace - ","
* @param {string} strReplaceWith - "],["
* @param {int}    replaceAt -2
* @return {string} replaced string -"1,1],[2,2"
*/
function customReplace(strData, strTextToReplace, strReplaceWith, replaceAt) {
    var index = strData.indexOf(strTextToReplace);
    for (var i = 1; i < replaceAt; i++)
        index = strData.indexOf(strTextToReplace, index + 1);
    if (index >= 0)
        return strData.substr(0, index) + strReplaceWith + strData.substr(index + strTextToReplace.length, strData.length);
    return strData;
}


/**
* Get a value of a Matrix
* @param {string} Matrix A - [[1,2],[3,4]]
* @param {int} i row  - 1 (second value!)
* @param {int} j column- 0
* @return {int} value of Matrix at i,j - 3
*/
function getMatValue(matrix,i,j){
 var matrixasarray = (new Function("return " +matrix+ ";")());
return matrixasarray[i][j];
}


/**
 * Get a Column Vector of a Matrix
 * @param {string} matrixasString - [[1,23],[12,34],[1,2],[1.3,1.6]]
 * @param {int} columnsofMatrix? - 2 
 * @param {int} pos - 1 (get second column!)
 * @return{string} standing vector - [[23],[34],[2],[1.6]]
 */
function getColumnVectorOfMatrix(matrixasString,columnsofMatrix,pos){
	var a = "["; // ligender Vektor!
    for(var i=0;i<columnsofMatrix;i++){
        if(i!=columnsofMatrix-1){
        if(i!=pos){
              a=a+"0,";
          }
          if(i==pos){
              a=a+"1,";
          }
        }
        else{
            if(i!=pos){
                  a=a+"0";
              }
              if(i==pos){
                  a=a+"1";
              }
        }
    }
    a=a+"]"
     //console.log(a); // immer liegend! 
    var liegend ="["+ Algebrite.dot(a,Algebrite.transpose(matrixasString)).toString() +"]";  // <- ist ein liegender vektor!
    return Algebrite.transpose(liegend).toString();
}

/**
 * Get a Row Vector of a Matrix
 * @param {string} matrixasString - [[1,23],[12,34],[1,2],[1.3,1.6]]
 * @param {int} rows - 4 
 * @param {int} pos - 1 (get second row!)
 * @return{string} lying vector - [[12,34]]
 */ 
function getRowVectorOfMatrix(matrixasString,rowsofMatrix,pos){
    var a = "["; // ligender Vektor!
    for(var i=0;i<rowsofMatrix;i++){
        if(i!=rowsofMatrix-1){
        if(i!=pos){
              a=a+"0,";
          }
          if(i==pos){
              a=a+"1,";
          }
        }
        else{
            if(i!=pos){
                  a=a+"0";
              }
              if(i==pos){
                  a=a+"1";
              }
        }
    }
    a=a+"]"
   //console.log(a); // immer liegend!
   return "["+Algebrite.dot(a,matrixasString).toString()+"]";
}

/**
 * Set a column vector of matrix!
 * TODO fails if input matrix contains symbols!
 * @param {string} Matrix A - [[1,0],[0,1]]
 * @param {int} column - 0
 * @param {string} new column value - [2,1] or [[2],[1]] or [[2,1]]
 * @return {string} new Matrix  - [[2,0],[1,1]]
 */
function setColumnVectorOfMatrix(matrix,column,columnvalue){
  // handle column inputs like: [[2,1]]
   // or [[2],[1]]
    var columnvaluesize = (new Function("return " + Algebrite.shape(columnvalue)+ ";")()); // dimension
    var ncolumnvaluesize= (columnvaluesize[0]);
    if(ncolumnvaluesize!=1){ // e.g: [[2],[1]] ncolumnvaluesize=2
        columnvalue=Algebrite.transpose(columnvalue).toString();
       // console.log(columnvalue);
    }
    if(columnvalue[0]="["&&columnvalue[1]=="["){
        columnvalue=columnvalue.substring(1);
        columnvalue=columnvalue.substring(0,columnvalue.length-1);
    }
    // console.log(columnvalue);

  // eigentliche logik:
  var columnvaluesasarray =  (new Function("return " +columnvalue+ ";")());
  // console.log(columnvaluesasarray);
    var tmp = "";
   for(var i=0;i<columnvaluesasarray.length;i=i+1){
	//console.log("matrix: "+matrix+" i"+i+" column"+column+" "+columnvaluesasarray[i].toString())
     tmp=setMatValuesym(matrix,i,column,columnvaluesasarray[i].toString());
    // console.log(tmp);
       matrix=tmp;
    }
   return matrix;
}

/**
 * Set a Row vector of matrix!
 * @param {string} Matrix A - [[1,0],[0,1]]
 * @param {int} row - 0
 * @param {string} new row value - [2,1] or [[2],[1]] or [[2,1]]
 * @return {string} new Matrix  - [[2,0],[1,1]]
 */
function setRowVectorOfMatrix(matrix,row,rowvalue){
    if(rowvalue[0]="["&&rowvalue[1]=="["){
        rowvalue=rowvalue.substring(1);
        rowvalue=rowvalue.substring(0,rowvalue.length-1);
    }

    var rowvaluesasarray =  (new Function("return " +rowvalue+ ";")());
     // console.log(rowvaluesasarray);
    var tmp = "";
   for(var i=0;i<rowvaluesasarray.length;i=i+1){
     tmp=setMatValuesym(matrix,row,i,rowvaluesasarray[i].toString());
       matrix=tmp;
    }
   return matrix;
}


/**
 * Check zero Rows of a Matrix
 * @param {string} Matrix A - [[1,0,0],[2,0,0],[3,0,1]]
 * @return {array} list which contains columns that contain only zero's  - [2] (second column is a zero column!)
 */
function checkzeroColumn(matrix){
 var list=[];
 var n = getRowsM(matrix);
 var m = getColumnsM(matrix);
 for(var j=0;j<m;j++){
     var columnsum=0;
     for(var i=0;i<n;i++){
         columnsum=columnsum+getMatValue(matrix,i,j);
     }
    // console.log(columnsum);
     if(columnsum==0){
         var tmp=j+1
         list.push(tmp);
     }
 }
 return list;
}

/**
 * Check zero Rows of a Matrix
 * @param {string} Matrix A - [[0,0,0],[2,0,0],[3,0,1]]
 * @return {array} list which contains rows that contain only zero's  - [1] (first row is a zero row!)
 */
function checkzeroRow(matrix,n,m){
 var list=[];
 var n = getRowsM(matrix);
 var m = getColumnsM(matrix);
 for(var j=0;j<m;j++){
     var columnsum=0;
     for(var i=0;i<n;i++){
         columnsum=columnsum+getMatValue(matrix,j,i);
     }
    // console.log(columnsum);
     if(columnsum==0){
         var tmp=j+1;
         list.push(tmp);
     }
 }
 return list;
}


/**
 * TODO: add imaginary and stop!
 * Prints out if the System is stable or not.
 * @param {array} Eigenvalues - [-0.464102,6.4641]
 * @param {string} system - 's' or 'z' s for continuous z for discrete
 * @return {string} stable or unstable
 */
function check_stability(eigenvalues,system){
    if(system.toString()=='s'){
    for(var i=0;i<eigenvalues.length;i++){
        //console.log(eigenvalues[i]);
        if(eigenvalues[i]>0){
            return "unstable";
        }
    }
    return "stable";
    }
    else if(system.toString()=='z'){
        for(var i=0;i<eigenvalues.length;i++){
            if(Math.abs(eigenvalues[i])>=1){
                return "unstable";
            }
        }
    	return "stable";
    }
    else{
    	//stop("System must be 's' or 'z'! ");
    }
}

/**
 * Calculates the controllability matrix: Q_S=[B,AB,A^n-1B] 
 * @param {string} Matrix A - [[1,2],[1,2]]
 * @param {string} Matrix B - [[1],[2]]
 * @param {int} nA_fest - let empty
 * @param {??} speicher - let empty
 * @return {string} Matrix  - Q_S 
 */
function getQ_S(A,B,nA,nA_fest,speicher){
	//console.log(Algebrite.run('Q_S=unit('+2+','+2+')'));
	if(typeof nA=='undefined'){
        var cols = getColumnsM(A);
        var speicher=Algebrite.run('Q_S=unit('+cols+','+cols+')');
        speicher=Algebrite.eval('Q_S').toString();
       //console.log(Algebrite.eval('Q_S').toString());
      return  getQ_S(A,B,cols,cols,speicher);
    }
    else{
    var pos = nA_fest-nA;
    if(nA>0){
      // console.log(pos);
        if(pos==0){
            speicher=setColumnVectorOfMatrix(speicher,0,B);
            //console.log(speicher);
            return getQ_S(A,B,nA-1,nA_fest,speicher);
        }
        else{
        	var bb = getColumnVectorOfMatrix(speicher,nA_fest,pos-1).toString();
        	//console.log(Algebrite.transpose(bb).toString());
        	//console.log(Algebrite.transpose(A).toString());
            var newcolumn = Algebrite.dot(Algebrite.transpose(bb).toString(),Algebrite.transpose(A).toString()).toString();
           // console.log(newcolumn);
            speicher=setColumnVectorOfMatrix(speicher,pos,newcolumn);
           // console.log(speicher);
            return getQ_S(A,B,nA-1,nA_fest,speicher);
        }
    }
    }
        return speicher;
}


/**
 * Calculates the observability matrix: Q_B=[C CA CA^n-1] 
 * @param {string} Matrix A - [[1,2],[1,2]]
 * @param {string} Matrix C - [[1,2]]
 * @param {int} nA_fest - let empty
 * @param {??} speicher - let empty
 * @return {string} Matrix  - Q_B
 */
function getQ_B(A,C,nA,nA_fest,speicher){
    if(typeof nA=='undefined'){
        var cols = getColumnsM(A);
        var speicher=Algebrite.run('Q_B=unit('+cols+','+cols+')');
        speicher=Algebrite.eval('Q_B').toString();
      return  getQ_B(A,C,cols,cols,speicher);
    }
    else{
    var pos = nA_fest-nA;
    if(nA>0){
        //console.log(pos);
        if(pos==0){
            //console.log(speicher);
            speicher=setRowVectorOfMatrix(speicher,0,C);
            //console.log(speicher);
            return getQ_B(A,C,nA-1,nA_fest,speicher);
        }
        else{
            // speicher[pos]=A*speicher[pos-1];
            var newcolumn = Algebrite.dot(getRowVectorOfMatrix(speicher,nA_fest,pos-1),A).toString();
            //console.log(newcolumn);
            speicher=setRowVectorOfMatrix(speicher,pos,newcolumn);
          // console.log(speicher);
            return getQ_B(A,C,nA-1,nA_fest,speicher);
        }
    }
    }
        return speicher;
}


/**
 * Converts an Array to an array as string
 * @param {array} array(multiarray) - [[1,2],[1,2]] (as array)
 * @return {string} Matrix  - [[1,2],[1,2]] (as string)
 */
function arrayToString(array){
    var arrasString ="";
    for(var j=0;j<array.length;j++){
        for(var i=0;i<array[j].length;i=i+1){
            if(i==0){
                arrasString =arrasString+"["+array[j][i].toString();
            }
            else if(i==array[j].length-1){
                arrasString=arrasString+","+array[j][i].toString()+"]";

            }
            else{
                arrasString=arrasString+","+array[j][i].toString();

            }
        }
        if(j!=array.length -1){
        arrasString=arrasString+",";
        }
    }
    // console.log("["+arrasString+"]");
   return "["+arrasString+"]";
}

/**
 * rounds each entry of a matrix
 * @param {string} matrix - [[0.34372376933344034,-0.8068982213550735],[0.9390708015880442,0.5906904945688723]]
 * @param {int} factor - 2
 * @return {string}rounded matrix  - [[0.34,-0.81],[0.94,0.59]]
 */
function roundMatrix(matrix,factor){
    var matrixasarray = (new Function("return " +matrix+ ";")());
    var n = getRowsM(matrix);
    var m = getColumnsM(matrix);
    for(var i=0;i<n;i++){
        for(var j=0;j<m;j++){
            matrixasarray[i][j]=Math.round(Math.pow(10,factor)*matrixasarray[i][j])/(Math.pow(10,factor));
        }
    }
    return arrayToString(matrixasarray);
}

/**
 * round each Entry of a single Array
 * @param {array} array - Array [ -0.9999999999999998, 0.9999999999999998 ]
 * @param {int} factor - 2
 * @return {array} rounded array  - [[0.34,-0.81],[0.94,0.59]]
 */
function roundArray(array,factor){
    for(var p=0;p<array.length;p++){
    array[p]=Math.round(array[p]*Math.pow(10,factor))/(Math.pow(10,factor))
    }
return array;
}

/**
 * calculates matrix^factor
 * @param {string} matrix - [[1,2],[1,2]]
 * @param {int} factor - 3
 * @return {string} matrix*matrix*matrix  - [[61,156],[39,100]]
 */
function matrixpow(matrix,factor){
 if(factor>1){
     return matrixpow(Algebrite.dot(matrix,matrix).toString(),factor-1);
 }
 else{
     return matrix;
 }
}

/**
 * calculate eigenvalues of a matrix
 * Algebrite.eigenval is working kind of strange that is why this method is necessary.
 * @param  {string} matrix(square!) - [[1.789,0,0],[0,0,0],[0,0,1]]"
 * @return {array} eigenvalues - 1.789,1.0,0
 */
function eigenvalue(matrix){
	 var n = getRowsM(matrix);
	 var m = getColumnsM(matrix);
	 var eigenvalues = [];
	 var eigenval = Algebrite.eigenval(matrix).tensor.elem;
	 if(n!=m){
		 //TODO: stop!
		 console.log("cannot eigenvalues of non square matirx!");
	 }
	 else{
		 //1. push non zero values:
		 for(var i = 0;i<eigenval.length;i++){
			 if(eigenval[i]!=0){
				 eigenvalues.push(eigenval[i]);
			 }
		 }
		var tmp = (n-eigenvalues.length);
		 //rest values are zeros:
		 for(var j = 0;j<tmp;j++){
			 eigenvalues.push(0);
		 }
	 }
	 return eigenvalues;
}

/**
 * calculates Rank of a Matrix
 * if matrix is square: rank = n - eigenvalues_in_zero
 * if matrix is not square calculate matrix*matrix^T=H rank = eigenvalues_in_zero of H
 * @param  {string} matrix - [[1,2],[1,2]]
 * @return {int} rank - 1
 */
function rankofMatrix(matrix){
 var matrixarray = (new Function("return " + matrix+ ";")());
 var nA = getRowsM(matrix);
 var mA = getColumnsM(matrix);

 if(nA==mA){
	 var matrixarray = (new Function("return " + matrix+ ";")());
	 var eigenvalues = roundArray(numeric.eig(matrixarray).lambda.x,4);
    var eigenvalues_inzero=0;
    for(var l=0;l<eigenvalues.length;l++){
         if(eigenvalues[l]==0){
             eigenvalues_inzero=eigenvalues_inzero+1;
         }
     }
    return nA-eigenvalues_inzero; // this is the rank!
 }
 else{
	// console.log("calc. rank of not square matrix");
     return rankofMatrix(Algebrite.dot(matrix,Algebrite.transpose(matrix)).toString());
 }
}

/**
 * scalces a vector from [0.894427,-0.447214] -> [ 1, -0.5 ] 
 * @param  {array} array - [0.894427,-0.447214]
 * @return {array} array - [ 1, -0.5 ] 
 */
function scaleVec(vec){
	var factor = 1;//1=factor*0.89

    if(vec.length>=1 && vec[0] != 0){
    	factor = 1/vec[0];
    }
    else if(vec.length>=2 &&! vec[1] == 0){
    	factor = 1/vec[1];
    }
    //TODO make above in for loop with brack!
    for(var j = 0;j<vec.length;j++){
    	vec[j]=factor*vec[j];
    	//console.log(vec[j]);
    }
    
    //round vec:
    vec = roundArray(vec,5);
    return vec;
}

/**
 * Computes the kernel of a Matrix Ax =0 -> k*x=?
 * if kern does not exist veclist is empty.
 * TODO: works only for not symbolic matrices?!
 * @param  {string} matrix - [[1,2],[1,2]]
 * @return {array} list of kernel vectors - [ 1, -0.5 ]
 */
function kerofMatrix(matrix){
// console.log(matrix);
 var matrixarray = (new Function("return " + matrix+ ";")());
 var svd=numeric.svd(matrixarray);
 var Uarray=svd.U;
 var Sarray=svd.S; // diagonal matrix
 var Varray=svd.V;
// console.log(svd);
 var veclist=[];
for(var p=0;p<Sarray.length;p++){
   if(Sarray[p]==0){
       var vec = getColumnVectorOfMatrix(arrayToString(Varray),Varray.length,p).toString();
       // console.log(vec);
     veclist.push(vec);
   }
}

//make the veclist nice!
var resultarray = [];
//console.log(veclist);
for(var p = 0;p<veclist.length;p++){
	var vecarray = (new Function("return " + veclist[p]+ ";")());
	vecarray=scaleVec(vecarray);
	//console.log(vecarray);
	resultarray.push(vecarray);
}

return resultarray; //basis vectors!
}


/**
 * Compute the generalized vector:(A-lambda I)^k x = 0
 * if k = 0 it is simply the normal eigenvector of A of a particular eigenvalue
 * @param  {string} matrix -  [ [ 1, 0 ], [ 0, 1 ] ]
 * @param  {double} eigenval - 1
 * @param  {k} generalized vector number - 0....10
 * @return {array} list of generalized vectors -  [ [ 1, 0 ], [ 0, 1 ] ]
 */
function generalvector(matrix,eigenval,stufe){
 var rows = getRowsM(matrix);
 var cols = getColumnsM(matrix)
 if(rows!=cols){ //Test square
	 throw new Error("Input matrix must be square: n="+rows+", m="+cols);
 }
 var matrixarray = (new Function("return " + matrix+ ";")());
 if(roundArray(numeric.eig(matrixarray).lambda.x,4).indexOf(eigenval)<0){ //test eigenvalue in matrix!
	 throw new Error("Eigenval is not in matrix! eigenval: "+eigenval+" matrix:"+matrix);
 }
 var lambdaI=Algebrite.dot(Algebrite.unit(rows).toString(),eigenval).toString();
 var AlambdaI = Algebrite.run(matrix+"-"+lambdaI).toString();
 var tmp = matrixpow(AlambdaI,stufe).toString();
// console.log(AlambdaI);
// console.log(tmp);
// console.log(kerofMatrix(tmp)); //stores eigenvectors!
 return kerofMatrix(tmp);
}

/**
 * Compute the transformation Matrix T of a matrix M
 * Example: M = [[-10,1,7],[-7,2,3],[-16,2,12]] (input)
 * T =   [[1,1,1],[1,-1,0],[1,0,2]]         (output)
 * JNF= T^-1 M T = [[-2,0,0],[0,3,1],[0,0,3]]
 * TODO: Caution this method currently does not check for multiple
 * eigenvalues if the condition (A-lambdaI)^(stufe-1) v^stufe != 0 is correct!
 * THIS feature should be added!
 * @param  {string} matrix -  [[-10,1,7],[-7,2,3],[-16,2,12]]
 * @return {array} jordan transform matrix -   [[1,1,1],[1,-1,0],[1,0,2]] 
 */
function jordantransform(matrix){
	//calculate eigenvalues:
	var matrixarray = (new Function("return " + matrix+ ";")());
	var eigenvalues = roundArray(numeric.eig(matrixarray).lambda.x,4);
	eigenvalues = eigenvalues.sort();
	var result=[];
	
	var singleeigenvalues = [];
	var multipleeigenvalues=[]; // if an eigenvalue is double this list contains it also only once!
	//console.log(eigenvalues);
	for(var i=0;i<eigenvalues.length-1;i++){
		if(eigenvalues[i]!=eigenvalues[i+1]){
			singleeigenvalues.push(eigenvalues[i]);
		}
		else if(multipleeigenvalues.indexOf(eigenvalues[i])==-1){
			multipleeigenvalues.push(eigenvalues[i]);
		}
	}
	//console.log(singleeigenvalues);
	//console.log(multipleeigenvalues);
	
	//only single eigenvalues do it directly:
	if(multipleeigenvalues.length==0){
		var res = (arrayToString(numeric.eig(matrixarray).E.x));
		//console.log(roundMatrix(res,4));
		return (roundMatrix(res,4));
	}
	
	//eigenvectors for single eigenvalues:
	for(var p = 0;p<singleeigenvalues.length;p++){
		result.push(generalvector(matrix,singleeigenvalues[p],1));
	}
	
	//eigenvectors for multiple eigenvalues:
	for(var p = 0;p<multipleeigenvalues.length;p++){
		var vielfachheit = eigenvalues.indexOf(multipleeigenvalues[p])+1;
		var tmp=1;
		var doublelist = [];
		while(doublelist.length!=vielfachheit){
			var generalveclist=generalvector(matrix,multipleeigenvalues[p],tmp);
			for(var z=0;z<generalveclist.length;z++){
				if(doublelist.length==vielfachheit){
					break;
				}
				doublelist.push(generalveclist[z]);
				//console.log(vielfachheit)
			}
			tmp++;
			//console.log(doublelist);
		}
		result.push(doublelist);
	}
	//console.log("result:");
	//console.log(result);
	return result;
}


/**
 * Hautus Controllability Matrix: M_SH=(sI_n-A  B) 
 * rank(sI_n-A  B) = n for all s in C ? 
 * @param  {string} A matrix -  [[1,2],[3,4]]
 * @param  {string} B matrix -  [[1],[0]]
 * @return {array}  list of M_SH and not controllable eigenvalues -  [[-1 + s,-2,0,0],[-3,-4 + s,0,0]] (just M_SH cause all eigenvalues are H. controllable!)
 */
function checkHautusS(AasString,BasString){
	var nA = getRowsM(AasString);
	var mB = getColumnsM(BasString)
	var matrixarray = (new Function("return " + AasString+ ";")());
	var eigArray = roundArray(numeric.eig(matrixarray).lambda.x,4)
	
    var list=[];
	
	var sIN_A=Algebrite.run('s*'+'unit('+nA+')'+'-'+AasString).toString();


	var nAmB=nA+mB;
    var resultSH ="";
    Algebrite.run('M_SH=zero('+nA+','+nAmB+')');
    var tmpSH=Algebrite.eval('M_SH').toString();
    //place ones at the diagonal
    for(var p=0;p<nA;p++){
      resultSH= setMatValue(tmpSH,p,p,1);
        tmpSH=resultSH;
    }
    Algebrite.run('M_SH='+resultSH);
    // U = sI-A   e.g: M_SH = ([[1,0,0],[0,1,0]]) 
    var M_SH=Algebrite.dot(sIN_A,'M_SH').toString();
   // console.log(M_SH);
    M_SH=setColumnVectorOfMatrix(M_SH,nAmB-1,BasString);
    //console.log(M_SH);
    list.push(M_SH);
    

    var result=M_SH;
    for(var z=0;z<eigArray.length;z++){
      M_SH=result.replace(/s/g,"("+eigArray[z]+")");
    //  console.log(M_SH);
      // M_SH="det("+matrix2Latex(M_SH)+")="+Algebrite.det(M_SH);
        if(rankofMatrix(M_SH)!=nA){
            list.push(eigArray[z]);
        }
    }
    
    return list;
}

/**
 * Hautus Observability Matrix: M_BH=(sI_n-A;  C) 
 * rank(sI_n-A  B) = n for all s in C ? 
 * @param  {string} A matrix -  [[1,2],[3,4]]
 * @param  {string} B matrix -  [[1,0]]
 * @return {array}  list of M_BH and not observable eigenvalues -  [[-1 + s,-2,0,0],[-3,-4 + s,0,0]] (just M_SH cause all eigenvalues are H. controllable!)
 */
function checkHautusB(AasString,CasString){
	var nA = getRowsM(AasString);
	var nC = getRowsM(CasString)
	var matrixarray = (new Function("return " + AasString+ ";")());
	var eigArray = roundArray(numeric.eig(matrixarray).lambda.x,4)
	
    var list=[];
	
	var sIN_A=Algebrite.run('s*'+'unit('+nA+')'+'-'+AasString).toString();

	
	var nAnC=nA+nC;
    var resultBH ="";
    Algebrite.run('M_BH=zero('+nAnC+','+nA+')');
    var tmpBH=Algebrite.eval('M_BH').toString();
    for(var p=0;p<nA;p++){
    	resultBH= setMatValue(tmpBH,p,p,1);
    	tmpBH=resultBH;
    }

    Algebrite.run('M_BH='+resultBH);
    var M_BH=Algebrite.dot('M_BH',sIN_A).toString();
	M_BH=setRowVectorOfMatrix(M_BH,nAnC-1,CasString);
	list.push(M_BH);

    var result=M_BH;
    for(var z=0;z<eigArray.length;z++){
    	M_BH=result.replace(/s/g,"("+eigArray[z]+")");
        if(rankofMatrix(M_BH)!=nA){
            list.push(eigArray[z]);
        }
    }
    return list;
}

/**
 * Calculate system-parameters of a continuous s-System.
 * @param  {string} A matrix - [[1,2],[3,4]] (required)
 * @param  {string} B matrix - [[1],[0]]     (required)
 * @param  {string} C matrix - [[1,0]]       (required)
 * @param  {string} D matrix - 0 (optional)
 * @return {hashmap} results: 
 * key: Description:
 * nA	rows of Matrix A
 * mA   columns of Matrix A
 * nB,mB,nC,mC,nD,mD
 * 
 * A,B,C,D    matrix A,B,C,D
 * 
 */
function calcSSys(A,B,C,D){
	if(D=="undefined"){
		D=0;
	}
	
	var result = {};
	
	//0. Store Matrices:
	result['A'] = A;
	result['B'] = B;
	result['C'] = C;
	result['D'] = D;

	//1. Dimensions:
	result['nA'] = getRowsM(A);
	result['nB'] = getRowsM(B);
	result['nC'] = getRowsM(C);
	result['nD'] = getRowsM(D);
	result['mA'] = getColumnsM(A);
	result['mB'] = getColumnsM(B);
	result['mC'] = getColumnsM(C);
	result['mD'] = getColumnsM(D);
	
	//2. Transformations:
	
	
	//3. Transfere Function:
	
}

// A = Algebrite.run('A='+speicher[0]);
function fill_matrices_latex(A,B,C,nA,mA,nB,mB,nC,mC,isSISO,charPolyString,eigArray,isStable,
                             transfereOpenString,Q_S_Kalman,isControllable,Q_B_Kalman,isObservable,
                             invQ_S_Kalman,invQ_B_Kalman,q_thilde_S,q_thilde_B,T_JNFasString,
                             inv_TJNFasString,A_JNF,B_JNF,C_JNF,inv_TSNFasString,T_SNFasString,
                             A_SNF,B_SNF,C_SNF,A_BNF,B_BNF,C_BNF,inv_TBNFasString,T_BNFasString,
                             notcontrollableEigenvalues,notobservableEigenvalues,tranfere_expanded,
                             transfere_expanded2,listHautusS,listHautusB){
    var systemgleichung_werte1 = "{   \\underbrace{\\dot{{x}}(t)}_{"+nA+" \\times 1}=\\underbrace{{"+matrix2Latex(A)+"}}_{"+nA+" \\times "+nB+"} {x}(t) +\\underbrace{{"+matrix2Latex(B)+"}}_{"+nB+" \\times "+mB+"}  {u}(t) }";
    document.getElementById("systemgleichung_werte1").setAttribute("data-expr", String.raw`${systemgleichung_werte1}`);

    var systemgleichung_werte2 =" {   \\underbrace{{y}(t)}_{"+nC+" \\times 1}=\\underbrace{{"+matrix2Latex(C)+"}}_{"+nC+" \\times "+nA+"} {x}(t) \\textbf{ "+isSISO+" SYSTEM} }";
    document.getElementById("systemgleichung_werte2").setAttribute("data-expr", String.raw`${systemgleichung_werte2}`);

    var stablility1 ="\\text{char. Poly.:}\\; \\; P(s)="+math.parse(charPolyString).toTex()+"";
    document.getElementById("stablility1").setAttribute("data-expr", String.raw`${stablility1}`);
    console.log(stablility1);

    var stablility2 ="\\text{Eigenvalues:}\\; \\; \\lambda_i="+eigArray+"";
    document.getElementById("stablility2").setAttribute("data-expr", String.raw`${stablility2}`);
    console.log(stablility2);

    var stablility3 ="\\text{s-Sys is:}\\; \\; \\;"+isStable+"";
    document.getElementById("stablility3").setAttribute("data-expr", String.raw`${stablility3}`);
    console.log(stablility3);

    var controlability ="\\text{Controllability:}\\; \\; \\text{Sys is} \\;"+isControllable+"";
    document.getElementById("controlability").setAttribute("data-expr", String.raw`${controlability}`);
    console.log(controlability);

    var observability ="\\text{Observability:}\\; \\; \\; \\text{Sys is} \\;"+isObservable+"";
    document.getElementById("observability").setAttribute("data-expr", String.raw`${observability}`);
    console.log(observability);

    var transfereopen1 ="G_O(s)="+math.parse(transfereOpenString).toTex();
    document.getElementById("transfereopen1").setAttribute("data-expr", String.raw`${transfereopen1}`);
    console.log(transfereopen1);

    var transfereopen2 ="G_O(s)="+math.parse(tranfere_expanded).toTex()+"="+math.parse(transfere_expanded2).toTex();
    document.getElementById("transfereopen2").setAttribute("data-expr", String.raw`${transfereopen2}`);
    console.log(transfereopen2);

    var controlability_tilde ="Q_S="+matrix2Latex(Q_S_Kalman)+"\\; Q_S^{-1}="+matrix2Latex(invQ_S_Kalman)+"\\; \\mathbf{\\tilde{q}}_S="+matrix2Latex(q_thilde_S);
    document.getElementById("controlability_tilde").setAttribute("data-expr", String.raw`${controlability_tilde}`);
    console.log(controlability_tilde);

   var observability_tilde ="Q_B="+matrix2Latex(Q_B_Kalman)+"\\; Q_B^{-1}="+matrix2Latex(invQ_B_Kalman)+"\\; \\mathbf{\\tilde{q}}_B="+matrix2Latex(q_thilde_B);
   document.getElementById("observability_tilde").setAttribute("data-expr", String.raw`${observability_tilde}`);
    console.log(observability_tilde);

    var trans3 ="T_{JNF}="+matrix2Latex(T_JNFasString)+"\\; \\; \\; T_{JNF}^{-1}="+matrix2Latex(inv_TJNFasString);
    document.getElementById("trans3").setAttribute("data-expr", String.raw`${trans3}`);
    console.log(trans3);

    var trans4 ="\\dot{\\tilde{\\mathbf{x}}}_{JNF}(t)="+matrix2Latex(A_JNF)+"\\mathbf{\\tilde{x}}_{JNF}(t) +"+matrix2Latex(B_JNF)+"\\mathbf{u}(t)";
    document.getElementById("trans4").setAttribute("data-expr", String.raw`${trans4}`);
    console.log(trans4);

    var trans5 ="\\mathbf{y}(t)="+matrix2Latex(C_JNF)+"\\mathbf{\\tilde{x}}_{JNF}(t)";
    document.getElementById("trans5").setAttribute("data-expr", String.raw`${trans5}`);
    console.log(trans5);

    var trans6 ="T_{SNF}="+matrix2Latex(T_SNFasString)+"\\; \\; \\; T_{SNF}^{-1}="+matrix2Latex(inv_TSNFasString);
    document.getElementById("trans6").setAttribute("data-expr", String.raw`${trans6}`);
    console.log(trans6);

    var trans7 ="\\dot{\\tilde{\\mathbf{x}}}_{SNF}(t)="+matrix2Latex(A_SNF)+"\\mathbf{\\tilde{x}}_{SNF}(t) +"+matrix2Latex(B_SNF)+"\\mathbf{u}(t)";
    document.getElementById("trans7").setAttribute("data-expr", String.raw`${trans7}`);
    console.log(trans7);

    var trans8 ="\\mathbf{y}(t)="+matrix2Latex(C_SNF)+"\\mathbf{\\tilde{x}}_{SNF}(t)";
    document.getElementById("trans8").setAttribute("data-expr", String.raw`${trans8}`);
    console.log(trans8);

    var trans9 ="T_{BNF}="+matrix2Latex(T_BNFasString)+"\\; \\; \\; T_{BNF}^{-1}="+matrix2Latex(inv_TBNFasString);
    document.getElementById("trans9").setAttribute("data-expr", String.raw`${trans9}`);
    console.log(trans9);

    var trans10 ="\\dot{\\tilde{\\mathbf{x}}}_{BNF}(t)="+matrix2Latex(A_BNF)+"\\mathbf{\\tilde{x}}_{BNF}(t) +"+matrix2Latex(B_BNF)+"\\mathbf{u}(t)";
    document.getElementById("trans10").setAttribute("data-expr", String.raw`${trans10}`);
    console.log(trans10);

    var trans11 ="\\mathbf{y}(t)="+matrix2Latex(C_BNF)+"\\mathbf{\\tilde{x}}_{BNF}(t)";
    document.getElementById("trans11").setAttribute("data-expr", String.raw`${trans11}`);
    console.log(trans11);

    // Gilbert:
    var cont_gilbert1 ="\\mathbf{\\tilde{b}_{JNF}}="+matrix2Latex(B_JNF);
    document.getElementById("cont_gilbert1").setAttribute("data-expr", String.raw`${cont_gilbert1}`);
    console.log(cont_gilbert1);

    var cont_gilbert2 ="\\rightarrow \\text{not controllable eigenvalues:} \\; \\;"+notcontrollableEigenvalues;
    document.getElementById("cont_gilbert2").setAttribute("data-expr", String.raw`${cont_gilbert2}`);
    console.log(cont_gilbert2);

    var observ_gilbert1 ="\\mathbf{\\tilde{C}_{JNF}}="+matrix2Latex(C_JNF);
    document.getElementById("observ_gilbert1").setAttribute("data-expr", String.raw`${observ_gilbert1}`);
    console.log(observ_gilbert1);

    var observ_gilbert2 ="\\rightarrow \\text{not observable eigenvalues:} \\; \\;"+notobservableEigenvalues;
    document.getElementById("observ_gilbert2").setAttribute("data-expr", String.raw`${observ_gilbert2}`);
    console.log(observ_gilbert2);

    // Hautus:
    var cont_hautus1 ="\\text{not controllable eigenvalues:} \\; \\;"+listHautusS;
    document.getElementById("cont_hautus1").setAttribute("data-expr", String.raw`${cont_hautus1}`);
    console.log(cont_hautus1);

    var observ_hautus1 ="\\text{not observable eigenvalues:} \\; \\;"+listHautusB;
    document.getElementById("observ_hautus1").setAttribute("data-expr", String.raw`${observ_hautus1}`);
    console.log(observ_hautus1);
}

function main(){
    read_textarea();
    var isSISO="SISO";
    var isStable="unstable";
    var isControllable="not\\text{ }contrllable";
    var isObservable="not\\text{ }observable";
    console.log(speicher[0]);
    console.log(speicher[1]);

    var A =  Algebrite.run('A='+speicher[0]);
    var AasString = Algebrite.eval('A').toString();
    var AasArray=(new Function("return " +speicher[0]+ ";")())
    var B =  Algebrite.run('B='+speicher[1]);
    var BasString = Algebrite.eval('B').toString();
    var C =  Algebrite.run('C='+speicher[2]);
    var CasString = Algebrite.eval('C').toString();

    var sizeA = (new Function("return [" + Algebrite.shape('A')+ "];")()); // dimension
    var nA= (sizeA[0][0]);
    var mA= (sizeA[0][1]);

    var sizeB = (new Function("return [" + Algebrite.shape('B')+ "];")());
    var nB = (sizeB[0][0]);
    var mB = (sizeB[0][1]);

    var sizeC = (new Function("return [" + Algebrite.shape('C')+ "];")());
    var nC = (sizeC[0][0]);
    var mC = (sizeC[0][1]);

    // check if A is square:
    if(nA.toString()!=nB.toString()){
        console.log("Make sure A is a square Matrix! A:="+nA+"x"+mA);
        return;
    }

    // Systemordnung:
    console.log("Systemordnung n="+nA);

    // Stellgrößen q:
    console.log("Stellgrößen p="+mB);

    // Ausgänge (Messgrößen) q:
    console.log("Ausgänge q="+nC);

    // check SISO:
    if(mB==nC && mB==1){
        isSISO="SISO";
        console.log("This is a Single Input Single Output System!");
    }
    else{
        isSISO="MIMO";
        console.log("This is a Multiple Input Multiple Output System");
    }

    var IN = Algebrite.run('IN=unit('+nA+')');

    // sIN-A:
    var sIN_A = Algebrite.run('U=(s*IN-A)');

    // Polynom:
    var charPoly=Algebrite.run('P=det(U)');
    var charPolyString = Algebrite.eval('P').toString();
    console.log("charact. Polynom: "+charPolyString);

    // eigenvalues of A
    var eigA = Algebrite.nroots('P','s');
    var eigArray =  (new Function("return " + eigA.toString()+ ";")());
    console.log("Eigenvalues of A: "+eigA.toString());

    // check stability:
    isStable=check_stability(eigArray,'s');

    // invSIN-A
    var invSIN_A = Algebrite.run('Q=inv(U)');
    invSIN_A = Algebrite.simplify('(Q)');
    console.log("inv(sI-A): "+invSIN_A.toString());

    var transfereOpen = Algebrite.dot('C','Q','B');
    var transfereOpenString = transfereOpen.toString().substring(2,transfereOpen.toString().length-2);
    console.log("Transfere function: "+transfereOpenString);

    // Kalman Steuerbar beobachtbar:
    // Steuerbar: Q_S = [b Ab A^n-1b]:
    // someTests(A,B,nA);
    // getQ_S(A,B,nA,nA_fest,speicher)
    var Q_S_Kalman=getQ_S(AasString,BasString);
    var invQ_S_Kalman=Algebrite.inv(Q_S_Kalman).toString();
    var q_thilde_S= "["+getRowVectorOfMatrix(invQ_S_Kalman,nA,nA-1).toString()+"]";// []
																					// for
																					// matrix
																					// representation.
    console.log("(Kalman) Q_S: "+Q_S_Kalman);
    var rankQ_S_Kalman = Algebrite.rank(Q_S_Kalman);
    if(rankQ_S_Kalman==nA){
        isControllable="controllable";
        console.log("System is (Kalman) controllable");
    }
    else{
        isControllable=" not\\text{ }controllable";
        console.log("System is not (Kalman) controllable");
    }

    var Q_B_Kalman=getQ_B(AasString,CasString);
    var detQ_B_Kalman = Algebrite.det(Q_B_Kalman).toString();
    if(detQ_B_Kalman=="0"){
        var invQ_B_Kalman="none";
        var q_thilde_B="none";
        isObservable=" not\\text{ }observalbe";
        console.log("System is not (Kalman) observable");
    }
    else{
        var invQ_B_Kalman=Algebrite.inv(Q_B_Kalman).toString();
        var q_thilde_B=getColumnVectorOfMatrix(invQ_B_Kalman,nA,nA-1).toString();
        isObservable="observable";
        console.log("System is (Kalman) observable");
    }

    // Hautus Steuerbar beobachtbar:
    // TODO:
    var listHautusS = checkHautusS(eigArray,AasString,BasString,nA,mB);
    if(listHautusS.length==0){
        listHautusS=" none ";
    }
    console.log("Check Hautus S worked!");

    var listHautusB = checkHautusB(eigArray,AasString,(CasString),nA,nC);
    if(listHautusB.length==0){
        listHautusB=" none ";
    }
    console.log("Check Hautus B worked!");

    // calculating a rank seems to work:
// console.log(rankofMatrix("[[0,1],[1,0]]"));
// console.log( rankofMatrix("[[4,0],[0,0],[1,0]]"));
// console.log( rankofMatrix("[[1,0],[0,1],[0,0]]"));

    // Transformation auf Jordan Normalform: T_JNF
    var eigenvectors_single_A=numeric.eig(AasArray).E.x; // this are
															// eigenvectors!
    var eigenvalues_A=roundArray(numeric.eig(AasArray).lambda.x,4);

    // algebraische Vielfachheit of Eigenvalues:
    // your_array=[1000,1000,500,10,500,20,500,12,500,20];
   var algebraischeVielfachheitofEigenvalues_A = {}; // this is an object.
														// //keys: eigenvalues,
														// values: anzahl
   eigenvalues_A.forEach(function(x) { algebraischeVielfachheitofEigenvalues_A[x] = (algebraischeVielfachheitofEigenvalues_A[x] || 0)+1; });
  console.log("Algebraische Vielfachheit of Eigenvalues:");
    console.log(algebraischeVielfachheitofEigenvalues_A);
    // console.log(algebraischeVielfachheitofEigenvalues_A[1000]); // a specific
	// value of a specific key!

    console.log("Eigenvectors: "+eigenvectors_single_A);
    var T_JNFasString = roundMatrix(arrayToString(eigenvectors_single_A),nA,nA,4);
    console.log("T_JNF: "+T_JNFasString);

    // testing kernel:
// console.log(kerofMatrix("[[0.7071,-0.7071],[0.7071,-0.7071]]"));
// console.log(kerofMatrix("[[1,2],[1,2]]"));

    // testing matrix pow:
   // console.log(matrixpow("[[5,0],[0,5]]",4).toString());
    // matrixpow("[[-1000,1000],[-1000,1000]]",2); -> TODO Does not work is
	// actually 0

   // calculate hauptvectoren:
   // matrix, size, eigenvalue, stufe
   // console.log(numeric.eig([[0,1000],[-1000,2000]])); -> EV1
   // console.log(generalvector("[[0,1000],[-1000,2000]]",2,1000,1)); -> EV2


    if(Algebrite.det(T_JNFasString)!=0){ // if eigenvalues are not mehrfach:
    console.log("all eigenvalues are single (einfach)");
    var inv_TJNFasString=roundMatrix(Algebrite.inv(arrayToString(eigenvectors_single_A)).toString(),nA,nA,4);
    var A_JNF=roundMatrix(Algebrite.dot(inv_TJNFasString,AasString,T_JNFasString),nA,nA,2);
    var B_JNF=Algebrite.dot(inv_TJNFasString,BasString).toString();
    }
    else{ // eigenvalues mehrfach und nicht komplex? (komplex muss geprüft
			// werden!)
        console.log("at least one eigenvalue is not single!");
        computeEigenvectorsofEigenvalue(matrix,eigenvalue,algebraischeVielfachheit);
         var inv_TJNFasString="none";
         var A_JNF="none";
         var B_JNF="none";
    }

    var C_JNF=Algebrite.dot(CasString,T_JNFasString).toString();
    console.log("Transformation to JNF worked");

    // Transformation auf SNF:
    var inv_TSNFasString=getQ_B(AasString,q_thilde_S).toString();
    var T_SNFasString=Algebrite.inv(inv_TSNFasString).toString();
    var A_SNF=(Algebrite.dot(inv_TSNFasString,AasString,T_SNFasString).toString());
    var B_SNF=Algebrite.dot(inv_TSNFasString,BasString).toString();
    var C_SNF=Algebrite.dot(CasString,T_SNFasString).toString();
    console.log("Transformation to SNF worked");

    // Transformation auf BNF:
    if(q_thilde_B=="none"){
    var T_BNFasString="none";
    var inv_TBNFasString="none";
    var A_BNF="none";
    var B_BNF="none";
    var C_BNF="none";
    }
    else{
        var T_BNFasString=getQ_S(AasString,q_thilde_B).toString();
        var inv_TBNFasString=Algebrite.inv(T_BNFasString).toString();
        var A_BNF=(Algebrite.dot(inv_TBNFasString,AasString,T_BNFasString).toString());
        var B_BNF=Algebrite.dot(inv_TBNFasString,BasString).toString();
        var C_BNF=Algebrite.dot(CasString,T_BNFasString).toString();
    }

    // Gilbert Steuerbar beobachtbar:
    var notcontrollableEigenvalues="\\lambda_i, i="+checkzeroRow(B_JNF,nB,mB).toString();
    var notobservableEigenvalues="\\lambda_i, i="+checkzeroColumn(C_JNF,nC,mC).toString();
    if(checkzeroRow(B_JNF,nB,mB).length==0){
        console.log("all eigenvalues are gilbert controllable");
        notcontrollableEigenvalues="none";
    }
    if(checkzeroColumn(C_JNF,nC,mC).length==0){
        console.log("all eigenvalues are gilbert obervable");
        notobservableEigenvalues="none";
    }

    // Partialbruchzerlegung Go(s)
    console.log(transfereOpenString);
    var tranfere_expanded=Algebrite.expand(transfereOpenString,'s').toString();
    var transfere_expanded2="";
    for(var p=0;p<eigArray.length;p++){
        var residuum=Math.round(getMatValue(B_JNF,p,0)*getMatValue(C_JNF,0,p)*Math.pow(10,4))/(Math.pow(10,4));
        if(residuum!=0){
        transfere_expanded2=transfere_expanded2+residuum.toString();
        transfere_expanded2=transfere_expanded2+"/(s-("+getMatValue(A_JNF,p,p)+"))";
        }
    }
    transfere_expanded2=Algebrite.simplify(transfere_expanded2).toString();
    console.log(transfere_expanded2);

    // Pole Placement:

    // Ortskurve:

    // PZM - root locus:

    // teests();




    fill_matrices_latex(AasString,BasString,CasString,nA,mA,nB,mB,nC,mC,isSISO,
                        charPolyString,eigArray,isStable,transfereOpenString,Q_S_Kalman,isControllable,Q_B_Kalman,isObservable,
                        invQ_S_Kalman,invQ_B_Kalman,q_thilde_S,q_thilde_B,T_JNFasString,inv_TJNFasString,
                        A_JNF,B_JNF,C_JNF,inv_TSNFasString,T_SNFasString,A_SNF,B_SNF,C_SNF,
                        A_BNF,B_BNF,C_BNF,inv_TBNFasString,T_BNFasString,notcontrollableEigenvalues,
                        notobservableEigenvalues,tranfere_expanded,transfere_expanded2,
                        listHautusS,listHautusB);

    myRenderer();
}


//TODO: delete following functions?
function matrix2Latex(matrix){
    if(matrix=="none"){
        return matrix;
    }

    var matrixwithbackslash = math.parse(matrix).toTex();
    // gives: //\begin{bmatrix}1&2\\4&5\\\end{bmatrix}
  return matrixwithbackslash.replace("\\\\end{bmatrix}","\end{bmatrix}");
}

function myRenderer() {
    var x = document.getElementsByClassName('equation');

    // go through each of them in turn
    for (var i = 0; i < x.length; i++) {
        try {
            var aa = x[i].getAttribute("data-expr");
            if (x[i].tagName == "DIV") {
                t = katex.render(String.raw `${aa}`, x[i], {
                                     displayMode: false
                                 });
            }
            /*
			 * else { t= katex.render(x[i].textContent,x[i]); }
			 */
        } catch (err) {
            x[i].style.color = 'red';
            x[i].textContent = err;
        }
    }

    var y = document.getElementsByClassName('equation_small');

    // go through each of them in turn
    for (var i = 0; i < y.length; i++) {
        try {
            var aa = y[i].getAttribute("data-expr");
            if (y[i].tagName == "DIV") {
                t = katex.render(String.raw `${aa}`, y[i], {
                                     displayMode: false
                                 });
            }
            /*
			 * else { t= katex.render(x[i].textContent,x[i]); }
			 */
        } catch (err) {
            y[i].style.color = 'red';
            y[i].textContent = err;
        }
    }
}



module.exports = {
Algebrite: Algebrite,
numeric: numeric,

getColumnsM: getColumnsM,
getRowsM: getRowsM,
getMatValue: getMatValue,
setMatValue: setMatValue,
getColumnVectorOfMatrix: getColumnVectorOfMatrix,
getRowVectorOfMatrix: getRowVectorOfMatrix,
setColumnVectorOfMatrix:setColumnVectorOfMatrix,
setRowVectorOfMatrix:setRowVectorOfMatrix,
checkzeroColumn:checkzeroColumn,
checkzeroRow:checkzeroRow,
arrayToString:arrayToString,
roundMatrix:roundMatrix,
roundArray: roundArray,
matrixpow: matrixpow,
rankofMatrix: rankofMatrix,
eigenvalue: eigenvalue,
kerofMatrix:kerofMatrix,
scaleVec:scaleVec,
generalvector:generalvector,
jordantransform:jordantransform,
checkHautusS:checkHautusS,
checkHautusB:checkHautusB,
setMatValuesym:setMatValuesym,
arrayToMatrixString:arrayToMatrixString,
customReplace:customReplace,

check_stability: check_stability,
getQ_S:getQ_S,
getQ_B:getQ_B,
}


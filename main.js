/*
To convert a user's input, a special function will be dedicated to converting it into the appropriate data type. Since the user will be inputting a string, a match functionality will be deployed. In JavaScript, the "match" function of the String class find a smaller string inside a larger string [1]. Alternatively, the smaller string can be a Regular Expression (RegExp). "coefficient" is the result of finding the initial number of the term. The RegExp used will match a number that precedes a letter. For instance, "22*x^3" would return a "coefficient" variable of "22" if the match was successful. "variable" is the letter variable that is found, that is "x", "y", or some other variable. The RegExp used will simply match a letter. For separable equations, only "x" and "y" is needed and if any other variables are present the user will be prompted to remove those variables. Some terms might not have variables as these tend to be constants. For these, the variable will default to the input variable, that is "x", with an exponent of 0. "exponent" is the result of finding the number after the caret ^ symbol. The RegExp used will match a number encased or not encased in a parenthesis. All that is then inputted into a new Term object, which is then returned.
The function also wields another capability. Since it takes in a string stream and attempts to convert it into a Term, it litters some pertinent information with regards to whether the stream was successful in converting that stream. This additional functionality will also be used to determine whether or not conversion was success and whether to convert in the first place.
 
[1] https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
*/

function streamToTerm(stream){ // stream is in form of string
  var failed = "";
  var coefficient = stream.match(/\-*\d+/) ? new Fraction(parseInt(stream.match(/\-*\d+/)[0]), 1) : (failed += "coefficient", new Fraction(0, 1));
  var variable = stream.match(/[a-zA-Z]/) ? stream.match(/[a-zA-Z]/)[0] : (failed += "variable", "x");
  if (failed.match("coefficient") && !failed.match("variable"))
    coefficient = new Fraction(1, 1);
  var exponent = stream.match(/\^\(*\-*\d+/) ? parseInt(stream.match(/\^\(*\-*\d+/)[0].match(/\-*\d+/)) : (failed += "exponent", 1);
  if (stream[0] == "-")
    coefficient.multiply(new Fraction(-1, 1));
  var term = new Term(coefficient, variable, exponent);
  return term;
}
 
/*
The concept of integration is very easy on paper, and should be easy on the computer. It simply reshuffles variables or alters functions (for instance, cos[x] changes to sin[x]). The abstraction of integration is something of it's own, which due to the short nature of this project, won't be discussed.
Integration requires the mutation of polynomials and their terms. To recap, integration simply mutates the variables by adding the exponent and then multiply the inverted exponent. To do this in the function, the coefficient is the inverted exponent. Of course, before that the exponent is incremented by one. The coefficient, being a Fraction type, will be specially multiplied by the Fraction class' multiplication operator. For the variables themselves, an additional variable will be appended to the array of like variables. For instance, an array of "x" variables that is being integrated will append another "x" variable. The amount of "x" variables in the array is then taken into account and multiplied to the constant. Note, the new variable that is being appended simply has a coefficient of 1. The "x" variable that has a coefficient is the one that is on the left side of the array, that is the first one with an index of 0.
*/
 
function integrate(term){
  term.exponent++;
  term.coefficient.multiply(new Fraction(1, term.exponent)); 
  return term;
}
 
/*
Crucial to any math course is fractions. Fractions can be found anywhere and can materialize as constants. For the latter case, a Fraction class exists to represent all coefficients, numbers, and constants. The Fraction class simply has two public variables, the numerator and the denominator, and several functions to perform operations. A numerator and denominator is initialized from the parameters, which feeds the two variables directly without alteration. For fallback, if the numerator and the denominator are missing in the parameter, then they will be automatically assigned.
Fraction operation is specialized in that there are only two necessary functions: shifting and scaling. Shifting can be logically done with fractions by taking their common denominator (not lowest though) as the final denominator, and adding or subtracting their numerators, modified to fit the common denominator, together. Note, in order to subtract, the other fraction's numerator must be negative. Scaling is straightforward-- the numerator is multiplied by the other numerator and the denominator is multiplied by the other denominator. Note, in order to divide the reciprocal of the other fraction must taken to serve as division since there is only a multiply function. 
Reducing the fraction can be done with Euclid's GCD algorithm. About 2,300 years ago, Euclid of Alexandria was credited for deriving the algorithm for computing the GCD. He wrote about it Book VII of the Elements, a very popular math book [1]. Given a function GCD(a, b), the goal is to replace that function with GCD(b, r) repeatedly. As r will always be smaller than b, eventually, b will go down to 0 since b is being replaced with a smaller number. The result ends with a, which is the GCD. To top it all off, that GCD is then used to simplify the fraction by dividing the numerator and denominator with itself.
 
[1] https://people.eecs.berkeley.edu/~jrs/4/lec/15
In code:
*/

function Fraction(numerator, denominator){
  this.numerator = numerator || 0;
  this.denominator = denominator || 1;
  this.reduce = function(){
    if (this.denominator < 0)
      this.multiply(new Fraction(-1, -1));
    var a = this.numerator;
    var b = this.denominator;
    while (b > 0){
      var remainder = a % b;
      a = b;
      b = remainder;
    }
    this.numerator /= a;
    this.denominator /= a;
    if (this.denominator < 0){
      this.numerator *= -1;
      this.denominator *= -1;
    }
    return this; // chaining
  }
  this.add = function(frac){
    this.numerator = (this.numerator * frac.denominator) + (frac.numerator * this.denominator);
    this.denominator *= frac.denominator;
    return this;
  }
  this.multiply = function(frac){
    this.numerator *= frac.numerator;
    this.denominator *= frac.denominator;
    return this;
  }
}
 
/*
A Term class will be the boilerplate for generating a term object. Akin to a mathematical term, this Term class will feature a coefficient, a variable, and an exponent. The parameters for the constructor of the Term Class will be in order a Fraction coefficient, a string variable, and a signed integer exponent. There is very little to be done for the attributes as this class will just clone the parameters into public members.
There is a specially designed "print" function that will return a custom format of the term. This member function takes account of the numerator and the denominator to give it a final "printed" result. If the denominator is one, then the denominator is eliminated from the final print. For instance, (3/1)x simplifies into 3x. If the numerator and denominator is one, then it eliminates the coefficient. For instance, (1/1)x simplifies to just x.
*/
 
function Term(co, va, ex){ // v1 // 3x^2
  this.coefficient = co || new Fraction(); // coefficient is Fraction type
  this.variable = va || "x";
  this.exponent = ex || 0; // terms can just be constants
  this.print = function(){return (this.coefficient.denominator == 1 ? (this.coefficient.numerator == 1 ? "" : this.coefficient.numerator)+"" : "("+this.coefficient.numerator+"/"+this.coefficient.denominator+")")+this.variable+"^"+this.exponent};
}
 
/*
Perhaps the most important part of solving a differential equation is to decipher the input. A test equation like "dy/dx = (-2x+2x^2-x^2+) / (2y + 4y^-2)" to the untrained computer's eye will be quite difficult. The equation will need to be parsed, split, analysed, and done a myriad of computational elements. Looking at the test equation, it appears that everything has been simplified to the best that it can be. Since a Term class is defined and "streamToTerm" is ready, the first task is to find all the terms in the equation. The end result needs to be an array of terms. While in JavaScript, a string can be split with the "split" function [1], this function isn't enough to retain information from the string when converting into the array. As a result, one of the most stablest procedure is to split with a loop to include the delimiter. Another procedure is to use the power of RegExp.
The loop of streamSplit goes through all the individual characters of the string stream. If the character is a delimiter, such as a parenthesis, an addition sign, a subtraction sign, a division sign, a white space, and anything that isn't a number, a variable, or a caret, then it will split the array with its presence. The reason why "split" isn't used is that it doesn't retain the delimiter itself, which is necessary to retain to analyse later down the line. So, the loop includes the delimiter in the string that was split. For example, a stream of "-2x+2x^2" will be split into "-2x" and "+2x^2". From there, the array of new string terms is returned.
RegExp can be used to individually isolate the terms. This method, unlike the previous however, will lack granularity. The first step is to strip away all white space since there are no use for empty spaces in any mathematics.
 
[1] https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split
*/

function streamSplit(stream){
  stream.replace(/\s/g, ""); // remove whitepace
  var terms = stream.match(/\-*\d*[a-zA-Z=]\^*\(*\-*\d*\)*/g); // 
  var temp = "";
  for (var i of stream){
    if (i.match(/\=|\+|\-|\s|\(|\)/)){ // if (i.match(/\=|\+|\-|\s|\(|\)/gi)){
      // terms.push(temp);
      temp = "";
    }
    temp += i;
  }
  // terms.push(temp);
  console.log(terms);
  return terms;
}

function formatEquation(stream){
  var modified = stream;
  var exponentTemp = "";
  return modified.replace(/\^\(*\-*\d+\)*/g, "<sup>$&</sup>").replace(/\^/g, "");
}

/*
Considerably the most easiest of the differential equations is separable equations. Separable equations require little analysis as they are straightforward to solve assuming the variables and other parameters are correct. That is, the x-variables are at the numerator and the y-variables are at the denominator. Granted, the equations can look differently with the x variables at the left of the equation, but for a quick resolution they will be in fraction form.
The main procedure of solving a separable equation will be housed in a Separable class. A string stream of the input will be the parameter. Next two array of terms of the left side and right side of the equation will be defined. Using the special streamSplit function from before, an array of string terms is created and then analysed for terms. If the terms have an "x" in them then they're independent terms and if the terms have a "y" in them then they're dependent terms. Once the string terms are appropriately found, they are converted to a Term object, integrated, and then pushed into the end of their respected arrays. Be mindful that this constructor automatically assumes that the string stream is written in separable equation form. Checking if it's a separable equation is done before a new Separable object is created. Otherwise, the constructor will perform invalid operations.
Tagging along the Separable class is a print function. This function gathers all the terms and adds the operators, equal signs, and the constants. Then, it returns the formatted solution to the separable equation. The formatting includes HTML tags. This function does not return nor attempts to solve the solution explicitly as all it does it regurgitate the implicit form.
Separable equations are easy to solve in that they're basically regular integration problems. "dy/dx = 3x^2" is both a "beginner" integration and a separable equation since it can also be "dy/dx = (3x^2)/(y^0)". As such, the Separable class also can solve regular integration problems. The only thing that needs to be done is to designate the left side of the equation as "y".
To print a solution to the separable equation, the call with the following format: new Separable("3x^2").print(), where the "3x^2" is the input. Take the demo case: "(-2x+22x^2-x^2+x) / (2y + 4y^(-2))". When inputted, the solution yields out "y^2 + -4y^(-1) + c = x^2 + (22/3)x^3 + -(2/3)x^3 + (1/2)x^2 + C".
*/

function Separable(stream){ // (-2x+22x^2-x^2+x) / (2y + 4y^(-2))
  this.left = [];
  this.right = [];
  this.solution = "";
  var terms = streamSplit(stream);
  for (var i of terms){
    if (i.match("x") && !i.match("d")){
      var result = streamToTerm(i);
      this.right.push(integrate(result));
    }
    else if (i.match("y") && !i.match("d")){
      var result = streamToTerm(i);
      this.left.push(integrate(result));
    }
  }
  this.print = function(){
    var result = "";
    for (var i of this.left){
      i.coefficient.reduce();
      result = result+i.print()+" + ";
    }
    result += !stream.match("y") ? "y" : "c";
    result += " = ";
    for (var i of this.right){
      i.coefficient.reduce();
      result = result+i.print()+" + ";
    }
    result += "C";
    this.solution = result;
    return formatEquation(result);
  }
}

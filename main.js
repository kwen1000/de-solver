/*
Use the exclamation point for negative exponents. For instance, 3x^!3.
Do no use fractions as coefficients.
*/

/*
To convert a user's input, a special function will be dedicated to converting it into the appropriate data types. "coefficient" is the result of finding the initial number of the term. For instance, "22*x^3" would return a "coefficient" variable of "22" if the match was successful. "variable" is the letter variable that is found, that is "x", "y", or some other variable. For separable equations, only "x" and "y" is needed and if any other variables are present the user will be prompted to remove those variables. Some terms might now have variables as these tend to be constants. For these, the variable will default to the input variable, that is "x", with an exponent of 0. "exponent" is the result of finding the number after the caret ^ symbol. All that is then inputted into a new Term object, which is then returned.
The function also wields another capability. Since it takes in a string stream and attempts to convert it into a Term, it litters some pertinent information with regards to whether the stream was successful in converting that stream. This additional functionality will also be used to determine whether or not conversion was success and whether to convert in the first place.
*/

function streamToTerm(stream){ // stream is in form of string
  var failed = "";
  var coefficient = stream.match(/\d+(?=\S)/i) ? new Fraction(parseInt(stream.match(/\d+(?=\S)/i)[0]), 1) : (failed += "coefficient", new Fraction(0, 1));
  var variable = stream.match(/[a-z]|[A-Z]/) ? stream.match(/[a-z]|[A-Z]/) : (failed += "variable", "x");
  if (failed.match("coefficient") && !failed.match("variable")){ // is a 1
    coefficient = new Fraction(1, 1);
  }
  var exponent = stream.match(/\^\d+/) ? parseInt(stream.match(/\^\d+/)[0].substr(1)) : (failed += "exponent", 1); // might not exist
  var term = new Term(coefficient, variable, exponent);
  return term;
}

/*
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

function Term(coe, vari, expo){ // v1 // 3x^2
  this.coefficient = coe || new Fraction(); // coefficient is Fraction type
  this.variable = vari || "x";
  this.exponent = expo || 0; // terms can just be constants
  this.print = function(){return (this.coefficient.denominator == 1 ? (this.coefficient.numerator == 1 ? "" : this.coefficient.numerator)+"" : "("+this.coefficient.numerator+"/"+this.coefficient.denominator+")")+this.variable+"^"+this.exponent};
}

/*

*/

function streamSplit(stream){
  var terms = [];
  var temp = "";
  for (var i of stream){
    if (i.match(/\=|\+|\-|\s|\(|\)/gi)){
      terms.push(temp);
      temp = "";
    }
    temp += i;
  }
  terms.push(temp);
  console.log(terms);
  return terms;
}

function Separable(stream){ // dy/dx = (2x+2x^2+3x^2+) / (2y + 4y)
  this.left = [];
  this.right = [];
  var terms = streamSplit(stream); // stream.split(/\=|\+|\-|\s|\(|\)/gi);
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
    result += "c";
    result += " = ";
    for (var i of this.right){
      i.coefficient.reduce();
      result = result+i.print()+" + ";
    }
    result += "C";
    return result;
  }
}

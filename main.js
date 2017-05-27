
function integrate(term){
  terms.push(new Term
}

function streamToData(stream){
  return [];
}

function Fraction(numerator, denominator){
  this.numerator = numerator || 0;
  this.denominator = denominator || 1;
  this.add = function(frac){
    this.numerator = (this.numerator * frac.denominator) + (frac.numerator * this.denominator);
    this.denominator = this.denominator * frac.denominator;
  }
  this.multiply = function(frac){
    this.numerator = this.numerator * frac.numerator;
  }
}

function Term(coefficient, variable){ // v1 // 3x^2
  this.coefficient = coefficient || new Fraction(); // coefficient is Fraction type
  this.variable = variables;
  this.changeCoefficient = function(fraction){this.coefficient = fraction};
}

function Term(variables){ // v2 // [3x, x]
  this.coefficient = coefficient || new Fraction(); // coefficient is Fraction type
  this.variables = variables;
  this.changeCoefficient = function(fraction){this.coefficient = fraction};
}

function Variable(mutations){
// [["+", 1], ["*", 4], ["/", 2], ["-", 7]]; mutations are performed sequentially; so example result would be (((x + 1) * 4)/2) - 7)
this.mutations = mutations;

}

function Variable(mutations){
// [["+", 1], ["*", 4], ["/", 2], ["-", 7]]; mutations are performed sequentially; so example result would be (((x + 1) * 4)/2) - 7)
this.mutations = mutations;

}

function Separable(stream){ // dy/dx = (c*x*x) / (2*y + 4*y)
  this.stream = stream;
  this.data = []; 
}

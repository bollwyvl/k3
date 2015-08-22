;(function(tsu, kiwi){
"use strict";

var _ops = {
  le: kiwi.Operator.Ge,
  ge: kiwi.Operator.Le,
  eq: kiwi.Operator.Eq
};

this.K3 = function(){
  // a simple wrapper around kiwi.js constrains
  var _solver = new kiwi.Solver(),
    _vars = {},
    _constraints = {},
    _groups = {};

  function _makeVar(name){
    // make various constraint handlers
    var _variable = new kiwi.Variable(name),
      _edit = true;

    function variable(){
      return _variable.value();
    }

    variable.variable = function(){
      return _variable;
    };

    variable.mul = function(coef){
      return [coef, _variable];
    };

    variable.free = function(){
      if(_solver.hasEditVariable(_variable)){
        _solver.removeEditVariable(_variable);
      }
      return variable;
    };

    variable.named = function(){
      return name;
    };

    return variable;
  }

  function _makeGroup(name){
    function group(){
      // don't know what this does yet
    }

    var _vars = {};

    group.variable = function(varName){
      return _vars[name + ":" + varName] || _makeVar(name + ":" + varName);
    };

    group.remove = function(){
      // finally, remove it
      delete _groups[name];
    };

    return group;
  }

  function _makeOp(op){
    return function(){
      var name, lhs, rhs, constraint, expr,
        arg = Array.prototype.slice.apply(arguments);

      if(typeof arg[0] === "string"){
        name = arg[0];
        arg = arg.slice(1);
      }

      lhs = arg[0];
      rhs = arg[1];

      if(typeof rhs === "number"){
        lhs = lhs.variable();
        if(!_solver.hasEditVariable(lhs)){
          _solver.addEditVariable(lhs, kiwi.Strength.strong);
        }
        _solver.suggestValue(lhs, rhs);
      }else if(rhs instanceof Array){
        if(name && _constraints[name]){
          _solver.removeConstraint(_constraints[name]);
        }

        if(!(lhs instanceof Array)){
          lhs = [1, lhs.variable()];
        }

        lhs[0] = -lhs[0];

        var expArgs = [null, lhs].concat(rhs.map(function(d){
          return (d instanceof Array) || (typeof d === "number") ?
            d : d.variable();
        }));

        expr = new (Function.prototype.bind.apply(
          kiwi.Expression,
          expArgs
        ));

        console.log(op, expArgs)

        constraint = new kiwi.Constraint(expr, _ops[op]);

        if(name){
          _constraints[name] = constraint;
        }

        _solver.addConstraint(constraint);
      }else{
        console.warn("didn't understand", rhs);
      }

      return k3;
    };
  }

  function k3(){
    // namespace, but runs the constraints
    _solver.updateVariables();
    return k3;
  }

  k3.variable = function(name){
    // generate/return a wrapper around a kiwi.Variable
    return _vars[name] || (_vars[name] = _makeVar(name));
  };

  k3.group = function(name){
    // a named group of variables (and their constraints)
    return _groups[name] || (_groups[name] = _makeGroup(name));
  };


  // add the ops
  for(var op in _ops){
    k3[op] = _makeOp(op);
  }

  return k3;
};
}).call(this, tsu, kiwi);

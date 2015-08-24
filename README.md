# k3: a fluent API for [kiwi][] constraints

[kiwi][] solves systems of linear constraints. k3 adds a bit of
syntactic sugar to make working with them easier.

```javascript
var k3 = K3(),
  v = k3.variable,
  a = v("a"),
  b = v("b"),
  c = v("c"),
  d = v("d");

// make some constraints
k3.ge(b, [a]) // b > a
  .le(b, [c]) // b < c
  .eq(d, [a, c.mul(2)]); // d = a + 2*c

// suggest some values
k3.eq(a, 2)
  .eq(d, 11);

// solve!
k3();

// get the values back out
console.log(a(), b(), c(), d());
```

## API

### `k3 = K3()`
Create a system of constraints.

### `k3()`
Optimize a system of constraints.

### `variable = k3.variable("name")`
Get/create a named variable.

#### `variable()`
Get the value of a variable.

#### `variable.variable()`
Get the kiwi variable.

#### `variable.named()`
Get the name of the variable.

#### `variable.mul(coefficient)`
Return `[coefficient, variable]`, suitable for passing to kiwi.


### `k3.eq([name], leftHand, rightHand)`
Constrain `leftHand` to be equal to `rightHand`.

`rightHand` can be a number, or an array of variables (or multiples of variables). If a number, this value will be suggested to the solver,
rather than constrained.

If `name` is provided, and constraints previously created with that
`name` will be removed before adding this constraint.

### `k3.ge([name], leftHand, rightHand)`
Constrain `leftHand` to be greater than or equal to `rightHand`.

`rightHand` must be an array of variables (or multiples of variables).

If `name` is provided, and constraints previously created with that
`name` will be removed before adding this constraint.

### `k3.le([name], leftHand, rightHand)`
Constrain `leftHand` to be greater than or equal to `rightHand`.

`rightHand` must be an array of variables (or multiples of variables).


[kiwi]: https://github.com/nucleic/kiwi/tree/feature-js

// "return - summation to n" it not a clear description because n is int and can < 0
// so I will assume it means "return the summation from 0 to n"

var sum_to_n_a = function (n) {
  let sum = 0;
  let isNegative = n < 0;
  if (isNegative) {
    n = -n; 
  }
  for (let i = 0; i <= n; i++) {
    sum += i;
  }
  return isNegative ? -sum : sum;
};

var sum_to_n_b = function (n) {
  const absSum = (Math.abs(n) * (Math.abs(n) + 1)) / 2;
  return n < 0 ? -absSum : absSum;
};

var sum_to_n_c = function (n) {
  if (n < 0) {
    return -sum_to_n_c(-n);
  }
  if (n === 0) {
    return 0;
  }
  return n + sum_to_n_c(n - 1);
};

function generate_random_test_cases() {
  const test_cases = [];
  for (let i = -100; i <= 100; i++) {
    const n = Math.floor(Math.random() * 201) - 100;
    const expected = sum_to_n_a(n);
    test_cases.push({
      input: n,
      expected: expected,
    });
  }
  return test_cases;
}

const test_cases = generate_random_test_cases();

test_cases.forEach(({ input, expected }) => { 
    const result = sum_to_n_b(input);
    console.assert(result === expected, `Test failed for input ${input}: expected ${expected}, got ${result}`);

    const resultC = sum_to_n_c(input);
    console.assert(resultC === expected, `Test failed for input ${input} in sum_to_n_c: expected ${expected}, got ${resultC}`);
})

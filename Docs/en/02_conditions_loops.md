# Conditions and Loops

## Learning Goals

- Make decisions with `if`, `elif`, and `else`.
- Combine conditions with `and`, `or`, and `not`.
- Repeat work with `for` and `while`.
- Use `break` and `continue` carefully.

## Conditions

```python
score = int(input())

if score >= 90:
    print("excellent")
elif score >= 60:
    print("pass")
else:
    print("try again")
```

## For Loops

Use `for` when you know what sequence to loop over.

```python
for i in range(5):
    print(i)
```

## While Loops

Use `while` when the loop depends on a changing condition.

```python
count = 3
while count > 0:
    print(count)
    count -= 1
```

## Practice

1. Print all even numbers from 1 to 20.
2. Keep asking for a password until the user enters the correct one.
3. Compute the sum of numbers from 1 to `n`.

## Summary

Conditions choose what happens next. Loops repeat actions. Together they let programs respond to real situations.

# Exception Handling

## Learning Goals

- Understand runtime errors.
- Catch errors with `try` and `except`.
- Use `else`, `finally`, and `raise`.
- Create simple custom exceptions.

## Try and Except

```python
try:
    n = int(input())
    print(10 / n)
except ValueError:
    print("Please enter a number.")
except ZeroDivisionError:
    print("Cannot divide by zero.")
```

## Finally

`finally` runs whether an error happens or not.

```python
try:
    file = open("data.txt")
finally:
    print("cleanup")
```

## Practice

1. Safely convert user input to an integer.
2. Handle division by zero.
3. Raise an error when a score is outside 0-100.

## Summary

Exception handling keeps programs from crashing and gives users clearer feedback.

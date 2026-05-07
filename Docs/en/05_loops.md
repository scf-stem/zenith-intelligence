# Loops in C

## Learning Goals

- Repeat work with `for`, `while`, and `do while`.
- Use `break` and `continue`.
- Avoid infinite loops.

## For Loop

```c
for (int i = 1; i <= 5; i++) {
    printf("%d\n", i);
}
```

## While Loop

```c
int n = 3;
while (n > 0) {
    printf("%d\n", n);
    n--;
}
```

## Practice

1. Print numbers from 1 to 100.
2. Sum all even numbers from 1 to `n`.
3. Print a multiplication table.

## Summary

Loops are used when a task must be repeated with predictable changes each time.

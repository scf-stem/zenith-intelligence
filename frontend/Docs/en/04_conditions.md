# Conditional Statements

## Learning Goals

- Use `if`, `else if`, and `else`.
- Use `switch` for multi-branch choices.
- Choose the right condition for a problem.

## If Else

```c
int score;
scanf("%d", &score);

if (score >= 90) {
    printf("A\n");
} else if (score >= 60) {
    printf("pass\n");
} else {
    printf("fail\n");
}
```

## Switch

```c
switch (grade) {
    case 'A':
        printf("Excellent\n");
        break;
    default:
        printf("Keep going\n");
}
```

## Practice

1. Check whether a number is positive, negative, or zero.
2. Build a simple menu with `switch`.
3. Convert a numeric score to a letter grade.

## Summary

Conditional statements let a C program choose different paths.

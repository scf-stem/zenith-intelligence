# Pointer Basics

## Learning Goals

- Understand addresses and pointers.
- Use `&` to get an address and `*` to dereference.
- See how pointers relate to arrays and functions.

## Basic Pointer Use

```c
int num = 10;
int *ptr = &num;

printf("%p\n", ptr);
printf("%d\n", *ptr);
```

## Changing a Value Through a Pointer

```c
*ptr = 20;
printf("%d\n", num);
```

## Practice

1. Swap two integers using pointers.
2. Traverse an array with a pointer.
3. Write a function that returns both quotient and remainder through pointer parameters.

## Summary

Pointers store addresses. They are powerful, but they must be initialized and checked carefully.

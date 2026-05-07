# Object-Oriented Programming

## Learning Goals

- Understand encapsulation, inheritance, and polymorphism.
- Use `super()` to reuse parent-class logic.
- Override methods in child classes.
- Recognize common magic methods.

## Inheritance

```python
class Animal:
    def speak(self):
        print("sound")

class Cat(Animal):
    def speak(self):
        print("meow")
```

## Encapsulation

Use clear methods to protect how data is changed.

```python
class BankAccount:
    def __init__(self, balance=0):
        self._balance = balance

    def deposit(self, amount):
        if amount > 0:
            self._balance += amount
```

## Practice

1. Create an `Animal` parent class and two child classes.
2. Override a method in each child class.
3. Add `__str__` to print useful object information.

## Summary

OOP helps organize larger programs around concepts from the problem domain.

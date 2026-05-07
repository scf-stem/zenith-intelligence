# Classes and Objects

## Learning Goals

- Understand the relationship between classes and objects.
- Define simple classes with `class`.
- Write constructors and instance methods.
- Distinguish instance attributes from class attributes.

## What Are Classes and Objects?

A class is a blueprint. An object is a real instance created from that blueprint.

```python
class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def introduce(self):
        print(f"I am {self.name}, age {self.age}")

student = Student("Alex", 12)
student.introduce()
```

## Instance vs Class Attributes

```python
class Dog:
    species = "dog"

    def __init__(self, name):
        self.name = name
```

`species` is shared by all dogs. `name` belongs to one dog.

## Practice

1. Create a `Book` class with title and author.
2. Add a `show_info()` method.
3. Create two book objects and print their information.

## Summary

Object-oriented programming groups related data and behavior together.

"""Course localization helpers."""

from __future__ import annotations

from pathlib import Path

from flask import Request


SUPPORTED_LOCALES = {"en", "zh-CN"}
DEFAULT_LOCALE = "en"
REPO_ROOT = Path(__file__).resolve().parents[3]
EN_LESSON_DIR = REPO_ROOT / "Docs" / "en"


COURSE_TRANSLATIONS = {
    1: {
        "name": "Python Programming Basics",
        "description": (
            "Learn Python from scratch, including variables, data types, control flow, "
            "functions, object-oriented programming, and exception handling."
        ),
        "instructor": "AI Tutor",
        "chapters": {
            1: ("Python Basics", "Variables, data types, input/output, operators, and type conversion."),
            2: ("Conditions and Loops", "if/elif/else, comparisons, logical operators, for loops, while loops, break, and continue."),
            3: ("Functions and Methods", "Function definitions, parameters, return values, scope, built-ins, and lambda expressions."),
            4: ("Lists and Dictionaries", "List operations, dictionary operations, slicing, comprehensions, and common methods."),
            5: ("Classes and Objects", "Class definitions, constructors, instance attributes, class attributes, and methods."),
            6: ("Object-Oriented Programming", "Encapsulation, inheritance, polymorphism, super(), and magic methods."),
            7: ("Exception Handling", "try/except/finally, raise, custom exceptions, and assertions."),
        },
    },
    2: {
        "name": "C Programming Basics",
        "description": (
            "Learn core C concepts, including data types, control structures, functions, "
            "arrays, and pointers for systems and embedded programming."
        ),
        "instructor": "AI Tutor",
        "chapters": {
            1: ("Getting Started with C", "C history, language features, your first Hello World program, and the compile-run workflow."),
            2: ("Data Types and Variables", "Basic C data types, declarations, initialization, scanf, and printf."),
            3: ("Operators and Expressions", "Arithmetic, relational, logical, assignment, and bitwise operators."),
            4: ("Conditional Statements", "if/else decisions and switch/case multi-branch control flow."),
            5: ("Loops", "for, while, do-while, break, and continue."),
            6: ("Arrays", "One-dimensional arrays, two-dimensional arrays, character arrays, and strings."),
            7: ("Functions", "Function definition, calls, arguments, return values, recursion, and scope."),
            8: ("Pointer Basics", "Addresses, pointer declarations, dereferencing, pointer arithmetic, arrays, and functions."),
        },
    },
    3: {
        "name": "Vibe Coding for Beginners",
        "description": (
            "A beginner-friendly course for building games, tools, and websites with AI. "
            "The core skill is learning how to describe what you want clearly."
        ),
        "instructor": "AI Tutor",
        "chapters": {
            1: ("AI Is Your Super Teammate", "Understand AI, Vibe Coding, and the strengths and limits of AI tools."),
            2: ("Learn to Talk to AI", "Use prompt techniques to express needs clearly and get better results."),
            3: ("Build a Snake Game", "Generate your first playable game with AI and learn basic web code structure."),
            4: ("Build Your Own Small Tool", "Create practical tools such as a Pomodoro timer, flashcards, or a random picker."),
            5: ("Publish Your Work", "Deploy your project online with GitHub Pages and share it with others."),
            6: ("When AI Gets It Wrong", "Learn debugging tactics and how to ask AI for targeted fixes."),
            7: ("Free Creation Time", "Plan and build a creative project using everything you have learned."),
            8: ("Showcase and Wrap-up", "Present your work, review what you learned, and plan your next steps."),
        },
    },
}


LESSON_FILES = {
    1: [
        "01_python_basics.md",
        "02_conditions_loops.md",
        "03_functions_methods.md",
        "04_list_dict.md",
        "05_class_object.md",
        "06_oop.md",
        "07_exception.md",
    ],
    2: [
        "01_c_intro.md",
        "02_data_types.md",
        "03_operators.md",
        "04_conditions.md",
        "05_loops.md",
        "06_arrays.md",
        "07_functions.md",
        "08_pointers.md",
    ],
    3: [
        "01_vibe_intro.md",
        "02_vibe_prompt.md",
        "03_vibe_snake.md",
        "04_vibe_tools.md",
        "05_vibe_website.md",
        "06_vibe_debug.md",
        "07_vibe_final.md",
        "08_vibe_showcase.md",
    ],
}


LESSON_MARKDOWN_EN = {
    "01_python_basics.md": """# Python Basics

## Learning Goals

- Understand what Python is used for.
- Use variables to store values.
- Work with strings, integers, floats, and booleans.
- Read input, print output, and convert between types.

## What Is Python?

Python is a beginner-friendly programming language used for automation, data analysis, websites, AI, and education. It emphasizes readable code.

```python
print("Hello, Python!")
```

## Variables

A variable gives a name to a value.

```python
name = "Alex"
age = 12
score = 98.5
is_student = True
```

## Input and Output

Use `input()` to read text from the user and `print()` to display results.

```python
name = input("Your name: ")
print("Hello,", name)
```

## Type Conversion

`input()` always returns text, so convert it before doing math.

```python
length = int(input())
width = int(input())
print(length * width)
```

## Practice

1. Ask for a name and print a greeting.
2. Read two numbers and print their sum.
3. Convert Celsius to Fahrenheit.

## Summary

Python programs are built from values, variables, expressions, and clear output. Master these basics before moving to conditions and loops.
""",
    "02_conditions_loops.md": """# Conditions and Loops

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
""",
    "03_functions_methods.md": """# Functions and Methods

## Learning Goals

- Define and call functions.
- Pass arguments and return values.
- Understand local variables and scope.
- Use built-in functions and simple lambda expressions.

## Defining a Function

```python
def square(n):
    return n * n

print(square(5))
```

## Parameters and Return Values

Parameters are inputs. `return` sends a result back to the caller.

```python
def greet(name, message="Hello"):
    return f"{message}, {name}!"
```

## Scope

Variables created inside a function are local to that function.

```python
def add(a, b):
    total = a + b
    return total
```

## Practice

1. Write `area(width, height)`.
2. Write `is_even(n)`.
3. Write a function that returns the largest number in a list.

## Summary

Functions make code reusable, easier to test, and easier to read.
""",
    "04_list_dict.md": """# Lists and Dictionaries

## Learning Goals

- Store ordered data with lists.
- Store key-value data with dictionaries.
- Use indexing, slicing, loops, and common methods.
- Build simple comprehensions.

## Lists

```python
scores = [90, 85, 100]
scores.append(88)
print(scores[0])
print(scores[-1])
```

## Slicing

```python
numbers = [0, 1, 2, 3, 4, 5]
print(numbers[1:4])
```

## Dictionaries

```python
student = {"name": "Alex", "age": 12}
student["score"] = 95
print(student["name"])
```

## Practice

1. Find the average of a list of scores.
2. Count how many times each word appears in a sentence.
3. Create a list of squares from 1 to 10.

## Summary

Lists are best for ordered collections. Dictionaries are best when each value needs a meaningful key.
""",
    "05_class_object.md": """# Classes and Objects

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
""",
    "06_oop.md": """# Object-Oriented Programming

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
""",
    "07_exception.md": """# Exception Handling

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
""",
    "01_c_intro.md": """# Getting Started with C

## Learning Goals

- Understand what C is used for.
- Write and run a Hello World program.
- Learn the compile-run workflow.

## Hello World

```c
#include <stdio.h>

int main() {
    printf("Hello, C Language!\\n");
    return 0;
}
```

## Program Structure

- `#include <stdio.h>` imports standard input/output functions.
- `main()` is where the program starts.
- `printf()` prints text.
- `return 0` means the program ended successfully.

## Practice

1. Print your name.
2. Print two lines of text.
3. Change the message and run the program again.

## Summary

C is small, fast, and close to the computer. It is widely used in systems, embedded devices, and performance-critical software.
""",
    "02_data_types.md": """# Data Types and Variables in C

## Learning Goals

- Use `int`, `float`, `double`, and `char`.
- Declare and initialize variables.
- Read input with `scanf`.
- Print formatted output with `printf`.

## Variables

```c
int age = 12;
float score = 98.5;
char grade = 'A';
```

## Input and Output

```c
int n;
scanf("%d", &n);
printf("n = %d\\n", n);
```

## Practice

1. Read two integers and print their sum.
2. Read a float and print it with two decimal places.
3. Read a character and print its ASCII value.

## Summary

C requires you to choose data types explicitly and use the correct format specifiers.
""",
    "03_operators.md": """# Operators and Expressions

## Learning Goals

- Use arithmetic, relational, logical, and assignment operators.
- Understand integer division and remainder.
- Read expressions with operator precedence.

## Arithmetic

```c
int a = 7;
int b = 3;
printf("%d\\n", a + b);
printf("%d\\n", a / b);
printf("%d\\n", a % b);
```

## Comparisons and Logic

```c
if (a > b && b > 0) {
    printf("valid\\n");
}
```

## Practice

1. Decide whether a number is even.
2. Convert minutes into hours and minutes.
3. Write a condition for a valid score between 0 and 100.

## Summary

Operators build expressions. Correct expressions are the foundation of conditions, loops, and algorithms.
""",
    "04_conditions.md": """# Conditional Statements

## Learning Goals

- Use `if`, `else if`, and `else`.
- Use `switch` for multi-branch choices.
- Choose the right condition for a problem.

## If Else

```c
int score;
scanf("%d", &score);

if (score >= 90) {
    printf("A\\n");
} else if (score >= 60) {
    printf("pass\\n");
} else {
    printf("fail\\n");
}
```

## Switch

```c
switch (grade) {
    case 'A':
        printf("Excellent\\n");
        break;
    default:
        printf("Keep going\\n");
}
```

## Practice

1. Check whether a number is positive, negative, or zero.
2. Build a simple menu with `switch`.
3. Convert a numeric score to a letter grade.

## Summary

Conditional statements let a C program choose different paths.
""",
    "05_loops.md": """# Loops in C

## Learning Goals

- Repeat work with `for`, `while`, and `do while`.
- Use `break` and `continue`.
- Avoid infinite loops.

## For Loop

```c
for (int i = 1; i <= 5; i++) {
    printf("%d\\n", i);
}
```

## While Loop

```c
int n = 3;
while (n > 0) {
    printf("%d\\n", n);
    n--;
}
```

## Practice

1. Print numbers from 1 to 100.
2. Sum all even numbers from 1 to `n`.
3. Print a multiplication table.

## Summary

Loops are used when a task must be repeated with predictable changes each time.
""",
    "06_arrays.md": """# Arrays

## Learning Goals

- Declare and initialize arrays.
- Access elements by index.
- Traverse arrays with loops.
- Understand strings as character arrays.

## One-Dimensional Arrays

```c
int scores[3] = {90, 85, 100};
for (int i = 0; i < 3; i++) {
    printf("%d\\n", scores[i]);
}
```

## Strings

```c
char name[] = "Alex";
printf("%s\\n", name);
```

## Practice

1. Find the maximum value in an array.
2. Compute an average score.
3. Count how many characters are in a string.

## Summary

Arrays store multiple values of the same type in contiguous memory.
""",
    "07_functions.md": """# Functions in C

## Learning Goals

- Define and call functions.
- Pass parameters by value.
- Return results.
- Understand recursion and variable scope.

## Function Definition

```c
int square(int n) {
    return n * n;
}

int main() {
    printf("%d\\n", square(5));
    return 0;
}
```

## Practice

1. Write `max(a, b)`.
2. Write a function that computes factorial.
3. Split a calculator program into functions.

## Summary

Functions make C programs modular and easier to test.
""",
    "08_pointers.md": """# Pointer Basics

## Learning Goals

- Understand addresses and pointers.
- Use `&` to get an address and `*` to dereference.
- See how pointers relate to arrays and functions.

## Basic Pointer Use

```c
int num = 10;
int *ptr = &num;

printf("%p\\n", ptr);
printf("%d\\n", *ptr);
```

## Changing a Value Through a Pointer

```c
*ptr = 20;
printf("%d\\n", num);
```

## Practice

1. Swap two integers using pointers.
2. Traverse an array with a pointer.
3. Write a function that returns both quotient and remainder through pointer parameters.

## Summary

Pointers store addresses. They are powerful, but they must be initialized and checked carefully.
""",
    "01_vibe_intro.md": """# AI Is Your Super Teammate

## Learning Goals

- Understand what AI can and cannot do.
- Learn the idea of Vibe Coding.
- Try small creative tasks with AI.

## What Is Vibe Coding?

Vibe Coding means describing the result you want, letting AI draft the code, then testing, adjusting, and improving it.

You do not need to memorize every syntax detail at the beginning. You do need to communicate clearly and check the result.

## Try It

Ask AI to:

1. Explain a game idea.
2. Generate a tiny webpage.
3. Change the style or behavior of that webpage.

## Summary

AI is a teammate, not a magic button. You guide it, test its work, and improve the result.
""",
    "02_vibe_prompt.md": """# Learn to Talk to AI

## Learning Goals

- Understand what a prompt is.
- Write clear requests with role, task, constraints, and examples.
- Improve vague prompts step by step.

## Vague vs Clear

Vague:

```text
Write code for me.
```

Clear:

```text
Create a single HTML file for a Pomodoro timer. It should have Start, Pause, and Reset buttons, use a clean blue style, and work without any external library.
```

## Prompt Formula

1. Role: who should AI act as?
2. Task: what should it build?
3. Constraints: what rules must it follow?
4. Example: what should the result look like?

## Practice

Rewrite a vague prompt into a clear prompt for a small game, a study tool, or a personal website.
""",
    "03_vibe_snake.md": """# Build a Snake Game

## Learning Goals

- Ask AI to generate a playable browser game.
- Identify the HTML, CSS, and JavaScript parts.
- Modify color, speed, and scoring.

## Starter Prompt

```text
Build a simple Snake game in one HTML file. Use arrow keys, show the score, restart after game over, and keep the code easy for a beginner to read.
```

## Improve the Game

Ask AI to add:

- A high-score display.
- A pause button.
- Mobile touch controls.
- Different colors for the snake and food.

## Summary

The fastest way to learn is to run the game, change one thing, and test again.
""",
    "04_vibe_tools.md": """# Build Your Own Small Tool

## Learning Goals

- Pick a useful tool idea.
- Describe the required features clearly.
- Iterate on the tool after testing it.

## Tool Ideas

- Pomodoro timer.
- Vocabulary flashcards.
- Random name picker.
- Homework checklist.

## Workflow

1. Write the first prompt.
2. Run the generated page.
3. List what works and what needs improvement.
4. Ask AI for one focused change at a time.

## Summary

Good tools solve a real problem. Keep the first version small and useful.
""",
    "05_vibe_website.md": """# Publish Your Work

## Learning Goals

- Understand what hosting means.
- Prepare files for a small website.
- Publish a project with GitHub Pages.

## What Is Hosting?

Hosting means putting your files on a server so other people can visit them with a URL.

## Basic Steps

1. Create a GitHub repository.
2. Upload your `index.html` and related files.
3. Enable GitHub Pages in repository settings.
4. Open the generated URL and test it.

## Summary

Publishing makes your project real. Always test the public link after deployment.
""",
    "06_vibe_debug.md": """# When AI Gets It Wrong

## Learning Goals

- Recognize common AI-generated code problems.
- Use error messages as clues.
- Ask AI for targeted fixes.

## The Debugging Routine

1. Copy the exact error message.
2. Describe what you expected to happen.
3. Show the smallest relevant code snippet.
4. Ask for a fix and an explanation.

## Better Debug Prompt

```text
This HTML game should restart when I click Reset, but the button does nothing. Here is the error message and the related JavaScript. Please explain the cause and provide a minimal fix.
```

## Summary

Debugging is not guessing. It is collecting evidence and making one change at a time.
""",
    "07_vibe_final.md": """# Free Creation Time

## Learning Goals

- Plan an original project.
- Break the project into small features.
- Use AI to build, test, and improve each part.

## Project Plan

Write down:

1. What are you building?
2. Who will use it?
3. What are the three most important features?
4. What should the first version include?

## Build Strategy

Start with the smallest playable or usable version. Add one feature only after the previous version works.

## Summary

Creative projects succeed when the goal is clear and the steps are small.
""",
    "08_vibe_showcase.md": """# Showcase and Wrap-up

## Learning Goals

- Present your project clearly.
- Give and receive useful feedback.
- Reflect on what you learned.

## Presentation Checklist

- What problem does your project solve?
- What did AI help with?
- What did you change yourself?
- What would you improve next?

## Feedback Format

Use three short points:

1. One thing that works well.
2. One thing that is confusing.
3. One suggestion for the next version.

## Summary

Showing your work is part of learning. Clear feedback helps every project improve.
""",
}


def resolve_locale(request: Request) -> str:
    """Resolve locale for course API responses."""
    query_locale = request.args.get("locale")
    header_locale = request.headers.get("X-Zenith-Locale")
    value = query_locale or header_locale
    if value in SUPPORTED_LOCALES:
        return value
    accept_language = request.headers.get("Accept-Language", "")
    if accept_language.lower().startswith("zh"):
        return "zh-CN"
    return DEFAULT_LOCALE


def is_english(locale: str) -> bool:
    return locale == "en"


def lesson_filename(course_order: int | None, chapter_order: int | None) -> str | None:
    if not course_order or not chapter_order:
        return None
    files = LESSON_FILES.get(course_order)
    if not files or chapter_order < 1 or chapter_order > len(files):
        return None
    return files[chapter_order - 1]


def english_lesson_markdown(filename: str) -> str | None:
    md_path = EN_LESSON_DIR / filename
    if md_path.exists():
        return md_path.read_text(encoding="utf-8")
    return LESSON_MARKDOWN_EN.get(filename)


def localize_course_dict(course_dict: dict, course_order: int | None, locale: str) -> dict:
    if not is_english(locale):
        return course_dict
    data = dict(course_dict)
    translation = COURSE_TRANSLATIONS.get(course_order or 0)
    if not translation:
        return data
    data["name"] = translation["name"]
    data["description"] = translation["description"]
    data["instructor"] = translation["instructor"]
    chapters = data.get("chapters")
    if isinstance(chapters, list):
        data["chapters"] = [
            localize_chapter_dict(chapter, course_order, locale)
            for chapter in chapters
        ]
    return data


def localize_chapter_dict(chapter_dict: dict, course_order: int | None, locale: str) -> dict:
    if not is_english(locale):
        return chapter_dict
    data = dict(chapter_dict)
    order = data.get("orderIndex")
    translation = COURSE_TRANSLATIONS.get(course_order or 0, {}).get("chapters", {}).get(order)
    if translation:
        data["name"], data["description"] = translation
    lessons = data.get("lessons")
    if isinstance(lessons, list):
        data["lessons"] = [
            localize_lesson_dict(lesson, course_order, order, locale)
            for lesson in lessons
        ]
    return data


def localize_lesson_dict(lesson_dict: dict, course_order: int | None, chapter_order: int | None, locale: str) -> dict:
    if not is_english(locale):
        return lesson_dict
    data = dict(lesson_dict)
    translation = COURSE_TRANSLATIONS.get(course_order or 0, {}).get("chapters", {}).get(chapter_order)
    if translation:
        data["name"] = translation[0]
        data["description"] = translation[1]
    filename = lesson_filename(course_order, chapter_order)
    if filename and "content" in data:
        localized_content = english_lesson_markdown(filename)
        if localized_content:
            data["content"] = localized_content
    return data

---
title: Reverse Engineering 101
description: An introduction to reverse engineering - the art of taking a binary and reversing it to figure out what it does. Learn about pre-disassembler commands, assembly instructions, register conventions, and practical tools.
publishDate: 2025-01-15
tags:
  - reverse-engineering
  - cybersecurity
  - assembly
author: Daniel Buckman
---

## Introduction

Reverse engineering is the art of taking a binary and reversing it to figure out what it does. While programming is typically human-readable, reverse engineering involves analyzing compiled code to understand its functionality at a low level.

## Pre-Disassembler Commands

Before diving into disassembly, several command-line tools can provide valuable information about a binary:

### `file`
Identifies what type of file you're working with.

```bash
file hello_world.py
# Output: hello_world.py: Python script, ASCII text executable
```

### `strings`
Extracts printable ASCII/UTF-8 strings from the binary.

```bash
strings hello_world.py
# Output:
# This program is a test to see how to read disassembler.
# print("Hello World!")
```

### `objdump`
Disassembles code and shows the low-level structure.

```bash
objdump -d -Mintel ./hello
```

### `ldd`
Shows which shared libraries the binary will load at runtime (dynamic linker view).

```bash
ldd <bin>
```

### `readelf`
Dumps detailed ELF headers, sections, dynamic segment, and symbols.

```bash
readelf -a <bin>  # Full dump
readelf -h <bin>  # Just the ELF header
readelf -S <bin>  # Section headers
readelf -s <bin>  # Symbol table
```

### `nm`
Lists symbols (functions/variables) from the binary or object file; super useful if it isn't stripped.

```bash
nm <bin>
```

### `checksec`
Checks security features of the binary (from pwntools/checksec script).

```bash
checksec --file=<bin>
```

## Understanding Object Dump Structure

The top of an object dump reads:

- **File name**: File type and format, endianness, architecture, OS/ABI flags
  - **Big-endian**: Stores the most significant byte first at the lowest memory address
  - **Little-endian**: Stores the least significant byte first at the lowest memory address
- **Disassembled section**: Specific section of programming
- **Address format**: `0000000000001139 <_start>:` - Starting address of the binary line (code line address)

Under each section heading:

- **Col 1 (address)**: Memory address
- **Col 2 (raw hex data)**: Raw hexadecimal representation
- **Col 3 (decoded instruction)**: Human-readable assembly instruction

## Assembly Instructions Explained

### `call`
Pushes the return address (the address of the next instruction) onto the stack and then transfers control to the target address, where execution continues with the instructions at that address. Think of this like dialing someone's phone number.

### `lea` (Load Effective Address)
Calculates an exact address from its operands and stores that computed address value in a CPU register for later use. Think of this as performing a mathematical calculation on a calculator and storing it in memory.

### `mov`
Copies data from source to destination.

- `mov dst, src` copies the value from `src` into `dst`, without changing the value in `src`.
- Used to load registers from memory, store registers to memory, or load immediates.

### `xor`
Performs bitwise XOR operation; often used to zero a register.

- `xor dst, src` does a bitwise exclusive-or between `dst` and `src` and stores the result in `dst`.

### `test`
Performs a bitwise AND of the two operands, throws away the result, and only updates flags (especially Zero Flag, ZF, and Sign Flag, SF).

- Common idiom: `test eax, eax` checks whether `eax` is zero or negative, without changing `eax` itself; if `eax` is 0, ZF is set to 1.

### `jz` (Jump if Zero)
"Jump if zero flag (ZF) is set"

- After a `test`, `jz` will branch if the AND result was zero, e.g., after `test eax, eax; jz label`, execution jumps to `label` only when `eax == 0`.

### `push`
Decrements the stack pointer and stores the operand on the stack.

- Used to pass arguments, save registers, or push return addresses (done automatically by `call`).

### `movzx` (Move with Zero-Extend)
Copies a smaller integer (byte/word) into a larger register and fills high bits with zeros.

- Example: `movzx eax, byte ptr [rbp-4]` loads an 8-bit value and turns it into a 32-bit unsigned value in `eax`.

### `cmp`
Subtracts B from A internally and sets flags (ZF, SF, CF, OF, etc.) but does not store the result.

- A following conditional jump (`je`, `jne`, `jg`, `jl`, etc.) reads those flags to decide control flow.

## Application Binary Interface (ABI)

The ABI is the set of low-level rules and conventions (calling convention, register use, data type sizes and layout, binary format, system call interface) that compiled code must follow so that separately compiled modules, libraries, and the OS can interoperate at the binary level. Think of this as the constraints that guide conversations in the spoken language, whether formal or informal.

## System V AMD64 Calling Convention

For the System V AMD64 calling convention (Linux, macOS, BSD):

### Register Usage for Arguments

For normal C/C++ functions, integer/pointer arguments 1–6 go in:

- **RDI**: Holds the value of the 1st integer/pointer argument passed to a function at call time
- **RSI**: Holds the value of the 2nd integer/pointer argument passed to a function at call time
- **RDX**: Holds the value of the 3rd integer/pointer passed to a function at call time; "data" used for arithmetic (high half of multiply/divide) or I/O port operations
- **RCX**: Holds the value of the 4th integer/pointer passed to a function at call time; "count" used as loop/count register and by string instructions
- **R8**: Holds the value of the 5th integer/pointer passed to a function at call time
- **R9**: Holds the value of the 6th integer/pointer passed to a function at call time

The 7th and later integer/pointer arguments are passed on the stack, not in extra pointer registers.

### Other Important Registers

- **RAX**: The full 64-bit general-purpose accumulator register on x86-64; think of it as the first round draft pick of the other registers
- **EAX**: The lower 32 bits of RAX; think of it as the left eye of the eyes
- **RBP**: In many compiled C/C++ functions, RBP is used to mark the base of the current stack frame, so locals are at negative offsets (e.g., `[rbp-0x10]`) and saved things/args at positive offsets; think of it as the ground floor of a given stack
- **RSP**: 64-bit stack pointer, referencing the top of the stack; think of it as a pinnacle of a given stack

## Tools for Reverse Engineering

### Python Disassembler

Python has a built-in disassembler module:

```bash
python3 -m dis hello_world.py
```

**Example Output:**

```
  0           0 RESUME                   0

  1           2 LOAD_CONST               0 ('\n    This program is a test to see how to read disassembler.\n')
              4 STORE_NAME               0 (__doc__)

  5           6 PUSH_NULL
              8 LOAD_NAME                1 (print)
             10 LOAD_CONST               1 ('Hello World!')
             12 CALL                     1
             20 POP_TOP
             22 RETURN_CONST             2 (None)
```

### C Disassembler

For C binaries, use `objdump`:

```bash
objdump -d -Mintel ./hello
```

### GDB (GNU Debugger)

GDB is a powerful debugger for analyzing binaries:

```bash
gdb --args python3 hello_world.py
```

**Example Session:**

```
GNU gdb (Ubuntu 15.0.50.20240403-0ubuntu1) 15.0.50.20240403-git
Copyright (C) 2024 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.
Type "show copying" and "show warranty" for details.
This GDB was configured as "x86_64-linux-gnu".
Type "show configuration" for configuration details.
For bug reporting instructions, please see:
<https://www.gnu.org/software/gdb/bugs/>.
Find the GDB manual and other documentation resources online at:
    <http://www.gnu.org/software/gdb/documentation/>.

For help, type "help".
Type "apropos word" to search for commands related to "word"...
Reading symbols from python3...
(No debugging symbols found in python3)
(gdb) run
Starting program: /usr/bin/python3 hello_world.py
[Thread debugging using libthread_db enabled]
Using host libthread_db library "/lib/x86_64-linux-gnu/libthread_db.so.1".
Hello World!
[Inferior 1 (process 430960) exited normally]
(gdb) quit
```

### IDA (Interactive DisAssembler)

[IDA Free](https://hex-rays.com/ida-free) is a powerful interactive disassembler.

**Key Features:**
- Able to rename values as they are figured out helps to solve the problem
- **Important**: Always backup a copy of the original file before completing any work
- Python, C, and other languages will look different in the disassembled section
- Follow the logic and natural flow of the program

**Start Point**: The start point is the first instruction to be run.

### radare2

radare2 is a free and open-source reverse engineering framework:

```bash
r2 hello_world.py
```

**Example Commands:**
- `cc` - Show hexdump
- `pi` - Show pseudo-instructions
- `pd` - Show disassembly

**Note**: When analyzing text files like Python scripts, radare2 may show invalid instructions since it's designed for binary analysis.

## Practical Example: hello_world.py

Let's walk through analyzing a simple Python script:

### File Analysis

```bash
file hello_world.py
```

**Output:**
```
hello_world.py: Python script, ASCII text executable
```

### Strings Extraction

```bash
strings hello_world.py
```

**Output:**
```
This program is a test to see how to read disassembler.
print("Hello World!")
```

### Hexdump

```bash
xxd hello_world.py
```

**Output:**
```
00000000: 2222 220a 2020 2020 5468 6973 2070 726f  """.    This pro
00000010: 6772 616d 2069 7320 6120 7465 7374 2074  gram is a test t
00000020: 6f20 7365 6520 686f 7720 746f 2072 6561  o see how to rea
00000030: 6420 6469 7361 7373 656d 626c 6572 2e0a  d disassembler..
00000040: 2222 220a 0a70 7269 6e74 2822 4865 6c6c  """..print("Hell
00000050: 6f20 576f 726c 6421 2229                    o World!")
```

### Python Disassembly

```bash
python3 -m dis hello_world.py
```

This shows the bytecode instructions that Python executes, making it easier to understand the program's flow.

## Best Practices

1. **Always backup**: Before starting any reverse engineering work, make a copy of the original file
2. **Use multiple tools**: Different tools provide different perspectives on the same binary
3. **Take notes**: Document your findings as you analyze
4. **Understand the ABI**: Knowing the calling convention helps understand function calls
5. **Follow the flow**: Trace execution from the start point through the program logic
6. **Rename symbols**: In tools like IDA, rename variables and functions as you understand them

## Conclusion

Reverse engineering is a powerful skill that combines knowledge of assembly language, system architecture, and various analysis tools. By understanding the fundamentals of binary analysis, register conventions, and using the right tools, you can uncover the functionality of compiled programs and gain deeper insights into how software works at the lowest level.

Whether you're analyzing malware, debugging applications, or learning about system internals, these techniques form the foundation of effective reverse engineering.

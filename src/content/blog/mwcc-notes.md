---
title: MWCC Notes - Comprehensive Documentation
description: A comprehensive collection of notes, walkthroughs, and documentation from MWCC. Organized for easy reference and learning.
publishDate: 2025-01-15
tags:
  - mwcc
  - notes
  - documentation
  - learning
author: Dan
draft: false
---

## Introduction

Welcome to my MWCC notes collection. This document serves as a centralized location for all MWCC-related notes, walkthroughs, and documentation. As we work through MWCC materials, we'll add content here systematically.

## Table of Contents

<!-- This will be automatically generated from the headings, but here's a manual outline -->
- [Introduction](#introduction)
- [Quick Reference](#quick-reference)
- [Walkthroughs](#walkthroughs)
- [Concepts & Theory](#concepts--theory)
- [Tools & Commands](#tools--commands)
- [Practice Exercises](#practice-exercises)
- [Resources & Links](#resources--links)
- [Notes & Observations](#notes--observations)

---

## Quick Reference

### Common Commands

```bash
# File type identification
file <binary>

# Extract strings from binary
strings <binary>                    # Basic string extraction
strings -a <binary>                 # Scan entire file
strings -n 4 <binary>               # Minimum string length

# Disassemble binary
objdump -d <binary>                 # Disassemble executable sections
objdump -d -Mintel <binary>         # Intel syntax
objdump -s -j .rdata <binary>       # Dump specific section
objdump -s -j .data <binary>        # Dump data section

# Hex dump
xxd <binary>                        # Hex dump with ASCII
xxd -s <offset> -l <length> <binary>  # Specific offset/range
hexdump -C <binary>                 # Canonical hex+ASCII dump

# Search for patterns
grep -iE "pattern" <file>           # Case-insensitive regex
strings <binary> | grep -i "flag"   # Find flag-related strings
```

### Key Concepts

- **PE32 Format**: Windows Portable Executable format for 32-bit executables
- **Virtual Address (VA)**: Memory address used at runtime (e.g., `0x442000`)
- **File Offset**: Physical position in the file on disk (e.g., `0x40800`)
- **XOR Encryption**: Simple symmetric encryption using XOR operation with a key
- **Anti-Debugging**: Techniques used to detect or prevent debugging
- **`.rdata` Section**: Read-only data section in PE files containing constants and strings
- **`.data` Section**: Initialized data section in PE files

---

## Walkthroughs

### Walkthrough 1: Anti-Debug 1 - Finding the Flag in anti_debug1.exe

**Objective:** Reverse engineer `anti_debug1.exe` to find the CTF flag hidden using anti-debugging and XOR encryption techniques.

**Challenge:** 50 points - Anti Debugging 1

**File Location:** `/home/dan/Downloads/mwcc/anti_debug1.exe`

**Prerequisites:**
- Basic knowledge of reverse engineering tools (`strings`, `objdump`, `file`)
- Understanding of XOR encryption
- Familiarity with PE32 executables
- Python for decryption scripts

**Steps:**

1. **Initial File Analysis**
   ```bash
   file anti_debug1.exe
   strings anti_debug1.exe | head -50
   ```
   **Output:**
   ```
   anti_debug1.exe: PE32 executable (console) Intel 80386 (stripped to external PDB), for MS Windows, 5 sections
   ```
   **Notes:** 
   - PE32 executable (Windows)
   - 32-bit x86 architecture
   - Stripped (no debugging symbols)
   - Key strings found: "The flag is: ", "No debugger detected!", "Good!", "IsDebuggerPresent"

2. **Extract Interesting Strings**
   ```bash
   strings -a anti_debug1.exe | grep -iE "(flag|debug|secret|ctf)"
   ```
   **Notes:** 
   - Found "The flag is: " but no actual flag in plaintext
   - "IsDebuggerPresent" indicates anti-debugging technique
   - "Secret:" prompt suggests the flag is related to a secret input

3. **Disassemble the Binary**
   ```bash
   objdump -d anti_debug1.exe > disassembly.txt
   objdump -d anti_debug1.exe | grep -A50 "_WinMain@16" | head -100
   ```
   **Key Findings:**
   - Main function is `_WinMain@16` at address `0x401390`
   - Uses `IsDebuggerPresent()` API to detect debuggers
   - XOR decryption loop visible in the disassembly
   - String comparison after decryption

4. **Locate the Encrypted Data**
   
   Looking at the disassembly, we see:
   ```assembly
   4013e1: movl   $0x442000,0x4(%esp)  # Load address of encrypted string
   ```
   
   At address `0x442000` in the `.rdata` section, we find the encrypted flag.

5. **Identify the XOR Key**
   
   In the disassembly loop:
   ```assembly
   40142e: movl   $0x0,-0x40(%ebp)      # Initialize counter
   40142a: movb   $0x53,-0x39(%ebp)     # XOR key is 0x53
   401464: xor    %al,(%edx)            # XOR each byte
   ```
   
   **Key:** `0x53`

6. **Extract and Decrypt the Flag**
   
   ```python
   with open('anti_debug1.exe', 'rb') as f:
       data = f.read()
   
   # Encrypted data starts at file offset 0x40800 (virtual address 0x442000)
   offset = 0x40800
   encrypted = bytearray()
   while data[offset] != 0:
       encrypted.append(data[offset])
       offset += 1
   
   # XOR decrypt with key 0x53
   key = 0x53
   decrypted = bytes([b ^ key for b in encrypted])
   flag = decrypted.decode('ascii')
   print(f"Flag: {flag}")
   ```
   
   **Encrypted hex:** `173c1d3c271736312634`
   **Decrypted:** `DoNotDebug`

7. **Understand the Program Flow**
   - Program checks for debugger using `IsDebuggerPresent()`
   - If debugger detected → exits with error
   - If no debugger → asks for secret input
   - XOR decrypts the string at `0x442000` with key `0x53`
   - Compares user input with decrypted string ("DoNotDebug")
   - If correct, prints "The flag is: DoNotDebug"

**Expected Result:**
The flag is the decrypted string: **`DoNotDebug`** (or potentially `CTF{DoNotDebug}` depending on the CTF platform format requirements).

**Solution Script:**
```python
#!/usr/bin/env python3
"""
anti_debug1.exe Flag Extractor
Decrypts the XOR-encrypted flag from anti_debug1.exe
"""

with open('anti_debug1.exe', 'rb') as f:
    data = f.read()

# Encrypted string at file offset 0x40800 (VA: 0x442000)
encrypted_hex = "173c1d3c271736312634"
encrypted = bytes.fromhex(encrypted_hex)

# XOR key identified from disassembly
key = 0x53

# Decrypt
decrypted = bytes([b ^ key for b in encrypted])
flag_content = decrypted.decode('ascii')

print(f"Encrypted (hex): {encrypted_hex}")
print(f"XOR Key: 0x{key:02x}")
print(f"Decrypted: {flag_content}")
print(f"\nPossible flag formats:")
print(f"  - {flag_content}")
print(f"  - CTF{{{flag_content}}}")
print(f"  - ctf{{{flag_content}}}")
```

**Troubleshooting:**
- **Issue:** Can't find the encrypted data
  - **Solution:** Verify the virtual address `0x442000` maps to file offset `0x40800` in the `.rdata` section. Use `objdump -s -j .rdata` to examine the section.

- **Issue:** Wrong decryption result
  - **Solution:** Double-check the XOR key. Look for `movb $0x53` instruction in the disassembly to confirm the key.

- **Issue:** Flag format incorrect
  - **Solution:** Try different formats: with/without `CTF{}` wrapper, different casing (`DoNotDebug`, `donotdebug`, `DONOTDEBUG`).

**Key Takeaways:**
- Anti-debugging techniques often check for debugger presence before revealing secrets
- XOR encryption is commonly used for simple obfuscation
- Virtual addresses in PE files need to be mapped to file offsets
- Use static analysis tools (`strings`, `objdump`) to understand program flow before dynamic analysis
- The XOR key can often be found in the disassembly where the encryption loop is located
- Some CTF flags are in plaintext format (just the content), others require `CTF{}` wrapper

**Tools Used:**
- `file` - Identify file type
- `strings` - Extract printable strings
- `objdump` - Disassemble binary
- `xxd`/`hexdump` - View hex dump
- Python - Decryption script

**Anti-Debugging Techniques Observed:**
1. **IsDebuggerPresent() API** - Windows API that detects if a debugger is attached
2. **Exception Handling** - SEH (Structured Exception Handling) can be used for anti-debug
3. **Early Exit** - Program exits immediately if debugger detected

**Relevant Addresses:**
- `0x442000` - Virtual address of encrypted flag in `.rdata` section
- `0x40800` - File offset of encrypted flag
- `0x401390` - `_WinMain@16` entry point
- `0x4013e1` - Where encrypted string address is loaded
- `0x40142a-401464` - XOR decryption loop

**Flag Format Notes:**
- The program outputs: "The flag is: DoNotDebug" (without CTF{} wrapper)
- Different CTF platforms may require different formats:
  - `DoNotDebug` (plain content - what program prints)
  - `CTF{DoNotDebug}` (uppercase wrapper - common format)
  - `ctf{DoNotDebug}` (lowercase wrapper)
  - Case variations: `donotdebug`, `DONOTDEBUG`
- If submission fails, try alternative formats and casing

---

### Walkthrough 2: Behaviour 1 - Finding the Flag in behaviour1.exe

**Objective:** Reverse engineer `behaviour1.exe` to find the CTF flag hidden using XOR encryption. This is a C++ executable with string obfuscation.

**Challenge:** Exercise BE-1 - C++ Executable - Packed

**File Location:** `/home/dan/Downloads/mwcc/behaviour1.exe`

**Prerequisites:**
- Basic knowledge of reverse engineering tools (`strings`, `objdump`, `file`)
- Understanding of XOR encryption
- Familiarity with PE32 executables
- Python for decryption scripts
- Understanding of C++ string objects in assembly

**Steps:**

1. **Initial File Analysis**
   ```bash
   file behaviour1.exe
   strings behaviour1.exe | head -50
   ```
   **Output:**
   ```
   behaviour1.exe: PE32 executable (console) Intel 80386 (stripped to external PDB), for MS Windows, 5 sections
   ```
   **Notes:** 
   - PE32 executable (Windows)
   - 32-bit x86 architecture
   - Stripped (no debugging symbols)
   - C++ executable (uses std::string, std::ofstream)
   - Key strings found: "The flag is:", "c:\windows\svchost.exe", "[*] HackLab Malware Analysis"

2. **Extract Interesting Strings**
   ```bash
   strings -a behaviour1.exe | grep -iE "(flag|ctf|secret|hack|malware)"
   ```
   **Notes:** 
   - Found "The flag is:" but no actual flag in plaintext
   - "[*] HackLab Malware Analysis" suggests this is from a malware analysis exercise
   - "c:\windows\svchost.exe" indicates the program may interact with files
   - No obvious encrypted strings visible in plaintext output

3. **Examine Section Headers**
   ```bash
   objdump -h behaviour1.exe | grep -E "^\s*\d|\.rdata|\.data"
   ```
   **Output:**
   ```
   0 .text         0003fc80  00401000  00401000  00000400  2**2
   1 .data         00000230  00441000  00441000  00040200  2**2
   2 .rdata        00002740  00442000  00442000  00040600  2**2
   ```
   **Notes:**
   - `.rdata` section starts at virtual address `0x442000` and file offset `0x40600`
   - This is where read-only data (including strings) will be located
   - `.data` section at VA `0x441000`, file offset `0x40200`

4. **Disassemble the Binary**
   ```bash
   objdump -d -Mintel behaviour1.exe > disassembly.txt
   objdump -d -Mintel behaviour1.exe | grep -A 200 "<_main>" | head -250
   ```
   **Key Findings:**
   - Main function is `_main` at address `0x401390` (C++ console application, not WinMain)
   - Uses C++ standard library functions (std::string constructors, std::ofstream)
   - XOR decryption loop visible in the disassembly
   - File operations present (opens "c:\windows\svchost.exe")

5. **Locate the Encrypted Data**
   
   Looking at the disassembly, we see:
   ```assembly
   401410: mov    DWORD PTR [esp+0x4],0x442000  # Load address of encrypted string
   401417: mov    DWORD PTR [esp],eax            # C++ string constructor
   401428: call   430580 <__ZNSsC1EPKcRKSaIcE>   # std::string constructor
   ```
   
   At address `0x442000` in the `.rdata` section, we find the encrypted flag.
   
   **Extract the encrypted bytes:**
   ```bash
   xxd -s 0x40600 -l 30 behaviour1.exe
   ```
   **Output:**
   ```
   00040600: 1f3e 333e 3930 1f32 2532 1e39 033f 3e24  .>3>90.2%2.9.?>$
   00040610: 113e 3b32 0063 3a5c 7769 6e64 6f77       .>;2.c:\window
   ```
   
   **Encrypted hex:** `1f3e333e39301f3225321e39033f3e24113e3b32` (20 bytes, null-terminated)

6. **Identify the XOR Key**
   
   In the disassembly, we find the XOR key setting:
   ```assembly
   401475: mov    BYTE PTR [ebp-0x39],0x57      # XOR key is 0x57
   401479: mov    DWORD PTR [ebp-0x40],0x0      # Initialize counter (i = 0)
   401480: lea    eax,[ebp-0x28]                # Load string object address
   ```
   
   Then the decryption loop:
   ```assembly
   401490: call   4140f0 <__ZNKSs4sizeEv>       # Get string size
   401495: cmp    DWORD PTR [ebp-0x40],eax      # Compare counter with size
   401498: jae    4014bb                        # Jump if i >= size (loop end)
   40149a: mov    eax,DWORD PTR [ebp-0x40]      # Load counter
   4014a1: lea    eax,[ebp-0x28]                # Load string address
   4014a7: call   430fc0 <__ZNSsixEj>           # std::string operator[] (get char at index)
   4014ac: mov    edx,eax                       # Store char pointer
   4014ae: movzx  eax,BYTE PTR [ebp-0x39]       # Load XOR key (0x57)
   4014b2: xor    BYTE PTR [edx],al             # XOR the character: *char ^ 0x57
   4014b4: inc    DWORD PTR [ebp-0x40]          # Increment counter (i++)
   4014b9: jmp    401480                        # Loop back
   ```
   
   **Key:** `0x57` (decimal: 87, ASCII character: 'W')

7. **Extract and Decrypt the Flag**
   
   ```python
   with open('behaviour1.exe', 'rb') as f:
       data = f.read()
   
   # Encrypted data starts at file offset 0x40600 (virtual address 0x442000)
   # .rdata section mapping: VA 0x442000 = file offset 0x40600
   offset = 0x40600
   encrypted = bytearray()
   i = 0
   while i < 30:  # Read until null terminator
       byte = data[offset + i]
       if byte == 0:
           break
       encrypted.append(byte)
       i += 1
   
   # XOR decrypt with key 0x57
   key = 0x57
   decrypted = bytes([b ^ key for b in encrypted])
   flag = decrypted.decode('ascii')
   print(f"Flag: {flag}")
   ```
   
   **Encrypted hex:** `1f3e333e39301f3225321e39033f3e24113e3b32`
   **Decrypted:** `HidingHereInThisFile`

8. **Understand the Program Flow**
   - Program loads encrypted string from `0x442000` into a C++ std::string object
   - XOR decrypts the string character by character with key `0x57`
   - After decryption, the program performs file operations (opens "c:\windows\svchost.exe")
   - The decrypted string represents the flag hidden in the binary

**Expected Result:**
The flag is the decrypted string: **`HidingHereInThisFile`**. In CTF format: **`{HidingHereInThisFile}`** or **`ctf{HidingHereInThisFile}`**.

**Solution Script:**
```python
#!/usr/bin/env python3
"""
behaviour1.exe Flag Extractor
Decrypts the XOR-encrypted flag from behaviour1.exe
"""

with open('behaviour1.exe', 'rb') as f:
    data = f.read()

# Encrypted string at file offset 0x40600 (VA: 0x442000)
# This is in the .rdata section
offset = 0x40600
encrypted = []
i = 0
while i < 30:  # Read until null terminator
    byte = data[offset + i]
    if byte == 0:
        break
    encrypted.append(byte)
    i += 1

# XOR key identified from disassembly at 0x401475
key = 0x57

# Decrypt
decrypted = bytes([b ^ key for b in encrypted])
flag_content = decrypted.decode('ascii')

print(f"Encrypted (hex): {bytes(encrypted).hex()}")
print(f"XOR Key: 0x{key:02x} (decimal: {key}, char: '{chr(key)}')")
print(f"Decrypted: {flag_content}")
print(f"\nPossible flag formats:")
print(f"  - {flag_content}")
print(f"  - {{{flag_content}}}")
print(f"  - CTF{{{flag_content}}}")
print(f"  - ctf{{{flag_content}}}")
```

**Troubleshooting:**
- **Issue:** Can't find the encrypted data at 0x40600
  - **Solution:** Verify the `.rdata` section mapping. Use `objdump -s -j .rdata behaviour1.exe` to examine the section and confirm the virtual address to file offset mapping. The formula is: File Offset = VA - Section VA + Section File Offset.

- **Issue:** Wrong decryption result
  - **Solution:** Double-check the XOR key. Look for `mov BYTE PTR [ebp-0x39],0x57` instruction at address `0x401475` in the disassembly to confirm the key is `0x57`.

- **Issue:** Flag format incorrect
  - **Solution:** Try different formats: with/without `{}` wrapper, with `ctf{}` or `CTF{}` prefix, different casing variations.

- **Issue:** C++ string operations confusing
  - **Solution:** Remember that C++ uses std::string objects, which are wrapper classes. The assembly shows calls to `__ZNSsC1EPKcRKSaIcE` (string constructor) and `__ZNSsixEj` (operator[]). Focus on finding where the XOR operation happens on the string data.

**Key Takeaways:**
- C++ executables use mangled function names (e.g., `__ZNSsC1EPKcRKSaIcE`) which can make reverse engineering more challenging
- XOR encryption with a single-byte key is commonly used for simple string obfuscation
- Virtual addresses in PE files need to be mapped to file offsets using section headers
- Use `objdump -h` to understand section mappings (VA vs file offset)
- The `.rdata` section contains read-only data including encrypted strings
- Static analysis with `strings`, `objdump`, and hex dumps can reveal encrypted data even when it's not plaintext
- File operations (like opening "c:\windows\svchost.exe") can be red herrings or indicate the program's malicious behavior simulation

**Tools Used:**
- `file` - Identify file type and architecture
- `strings` - Extract printable strings (may not show encrypted data)
- `objdump` - Disassemble binary and examine sections
- `xxd`/`hexdump` - View raw hex dump of binary sections
- Python - Script decryption and flag extraction

**Observations:**
1. **String Obfuscation**: The flag is XOR-encrypted in the `.rdata` section, making it invisible to simple `strings` command
2. **C++ Complexity**: C++ std::string objects require understanding of C++ runtime and mangled names
3. **File Operations**: The program opens "c:\windows\svchost.exe" which is typical malware behavior (hiding in legitimate system locations)
4. **Exercise Context**: This is labeled as "Exercise BE-1 - C++ Executable - Packed" from "HackLab Malware Analysis", suggesting it's part of a malware analysis training

**Relevant Addresses:**
- `0x401390` - `_main` function entry point
- `0x401410` - Where encrypted string address (`0x442000`) is loaded
- `0x401475` - XOR key (`0x57`) is set to `[ebp-0x39]`
- `0x401480-0x4014b9` - XOR decryption loop
- `0x442000` - Virtual address of encrypted flag in `.rdata` section
- `0x40600` - File offset of encrypted flag (VA 0x442000 - Section VA 0x442000 + File Offset 0x40600)

**Section Mapping:**
- `.text` section: VA `0x401000`, File Offset `0x400`
- `.data` section: VA `0x441000`, File Offset `0x40200`
- `.rdata` section: VA `0x442000`, File Offset `0x40600`

**Flag Format Notes:**
- The decrypted content is: `HidingHereInThisFile`
- Different CTF platforms may require different formats:
  - `HidingHereInThisFile` (plain content)
  - `{HidingHereInThisFile}` (with braces - requested format)
  - `ctf{HidingHereInThisFile}` (lowercase CTF prefix)
  - `CTF{HidingHereInThisFile}` (uppercase CTF prefix)
- Case variations: `hidinghereinthisfile`, `HIDINGHEREINTHISFILE`
- If submission fails, try alternative formats and casing

---

### Walkthrough 3: Behaviour 2 - Finding the Flag in behaviour2.exe

**Objective:** Reverse engineer `behaviour2.exe` to find the CTF flag hidden using XOR encryption. This is a C++ executable with string obfuscation similar to behaviour1.

**Challenge:** Exercise BE-2 - C++ Executable - Packed

**File Location:** `/home/dan/Downloads/mwcc/behaviour2.exe`

**Prerequisites:**
- Basic knowledge of reverse engineering tools (`strings`, `objdump`, `file`)
- Understanding of XOR encryption
- Familiarity with PE32 executables
- Python for decryption scripts
- Understanding of C++ string objects in assembly

**Steps:**

1. **Initial File Analysis**
   ```bash
   file behaviour2.exe
   strings behaviour2.exe | head -50
   ```
   **Output:**
   ```
   behaviour2.exe: PE32 executable (console) Intel 80386 (stripped to external PDB), for MS Windows, 5 sections
   ```
   **Notes:** 
   - PE32 executable (Windows)
   - 32-bit x86 architecture
   - Stripped (no debugging symbols)
   - Key strings found: "Writing something here, but not the flag.", "This is not the flag.", "The secret is:"

2. **Extract Interesting Strings**
   ```bash
   strings -a behaviour2.exe | grep -iE "(flag|debug|secret|ctf|behaviour|behavior)"
   ```
   **Notes:** 
   - Found "Writing something here, but not the flag." - Red herring
   - Found "This is not the flag." - Another red herring
   - Found "The secret is:" - This suggests the flag is printed after this message
   - No actual flag in plaintext, indicating encryption/obfuscation

3. **Disassemble the Binary**
   ```bash
   objdump -d behaviour2.exe -Mintel > disassembly.txt
   objdump -d behaviour2.exe -Mintel | grep -A200 "^00401390 <_main>:" | head -100
   ```
   **Key Findings:**
   - Main function is `_main` at address `0x401390`
   - Loads encrypted string from address `0x442000` (line `401410`)
   - XOR decryption loop visible in the disassembly
   - Similar structure to behaviour1.exe but with different XOR key

4. **Locate the Encrypted Data**
   
   Looking at the disassembly, we see:
   ```assembly
   401410: mov    DWORD PTR [esp+0x4],0x442000  # Load address of encrypted string
   ```
   
   Examining the `.rdata` section:
   ```bash
   objdump -s -j .rdata behaviour2.exe
   ```
   
   At address `0x442000` in the `.rdata` section, we find:
   ```
   442000 020c3e2e 38381224 3e0d243e 252f062e  ..>.88.$>.$>%/..
   ```
   
   **Encrypted hex:** `020c3e2e383812243e0d243e252f062e`

5. **Identify the XOR Key**
   
   In the disassembly, we find the XOR key setting:
   ```assembly
   401475: mov    BYTE PTR [ebp-0x39],0x4b      # XOR key is 0x4B
   401479: mov    DWORD PTR [ebp-0x40],0x0      # Initialize counter (i = 0)
   401480: lea    eax,[ebp-0x28]                # Load string object address
   ```
   
   Then the decryption loop:
   ```assembly
   401490: call   4140f0 <__ZNKSs4sizeEv>       # Get string size
   401495: cmp    DWORD PTR [ebp-0x40],eax      # Compare counter with size
   401498: jae    4014bb                        # Jump if i >= size (loop end)
   40149a: mov    eax,DWORD PTR [ebp-0x40]      # Load counter
   4014a1: lea    eax,[ebp-0x28]                # Load string address
   4014a7: call   430fc0 <__ZNSsixEj>           # std::string operator[] (get char at index)
   4014ac: mov    edx,eax                       # Store char pointer
   4014ae: movzx  eax,BYTE PTR [ebp-0x39]       # Load XOR key (0x4B)
   4014b2: xor    BYTE PTR [edx],al             # XOR the character: *char ^ 0x4B
   4014b4: inc    DWORD PTR [ebp-0x40]          # Increment counter (i++)
   4014b9: jmp    401480                        # Loop back
   ```
   
   **Key:** `0x4B` (decimal: 75, ASCII character: 'K')

6. **Extract and Decrypt the Flag**
   
   ```python
   with open('behaviour2.exe', 'rb') as f:
       data = f.read()
   
   # Encrypted data starts at file offset 0x40800 (virtual address 0x442000)
   # We can search for the encrypted pattern in the file
   encrypted_hex = "020c3e2e383812243e0d243e252f062e"
   encrypted = bytes.fromhex(encrypted_hex)
   
   # XOR decrypt with key 0x4B
   key = 0x4B
   decrypted = bytes([b ^ key for b in encrypted])
   flag = decrypted.decode('ascii')
   print(f"Flag: {flag}")
   ```
   
   **Encrypted hex:** `020c3e2e383812243e0d243e252f062e`
   **Decrypted:** `IGuessYouFoundMe`

7. **Understand the Program Flow**
   - Program loads encrypted string from `0x442000` into a C++ std::string object
   - XOR decrypts the string character by character with key `0x4B`
   - After decryption, the program performs file operations (writes to multiple files like "outputfile.txt", "c:\windows\system32\stream.msc", etc.)
   - These file operations are red herrings - the actual flag is in the decrypted string
   - The program prints "The secret is:" followed by the decrypted flag

**Expected Result:**
The flag is the decrypted string: **`IGuessYouFoundMe`**. In CTF format: **`ctf{IGuessYouFoundMe}`**.

**Solution Script:**
```python
#!/usr/bin/env python3
"""
behaviour2.exe Flag Extractor
Decrypts the XOR-encrypted flag from behaviour2.exe
"""

with open('behaviour2.exe', 'rb') as f:
    data = f.read()

# Encrypted string at file offset 0x40800 (VA: 0x442000)
# From objdump -s -j .rdata output, we found:
# 442000 020c3e2e 38381224 3e0d243e 252f062e  ..>.88.$>.$>%/..
encrypted_hex = "020c3e2e383812243e0d243e252f062e"
encrypted = bytes.fromhex(encrypted_hex)

# XOR key identified from disassembly at 0x401475
key = 0x4B

# Decrypt
decrypted = bytes([b ^ key for b in encrypted])
flag_content = decrypted.decode('ascii')

print(f"Encrypted (hex): {encrypted_hex}")
print(f"XOR Key: 0x{key:02x} (decimal: {key}, char: '{chr(key)}')")
print(f"Decrypted: {flag_content}")
print(f"\nPossible flag formats:")
print(f"  - {flag_content}")
print(f"  - ctf{{{flag_content}}}")
print(f"  - CTF{{{flag_content}}}")
```

**Troubleshooting:**
- **Issue:** Can't find the encrypted data at 0x40800
  - **Solution:** Verify the `.rdata` section mapping. Use `objdump -s -j .rdata behaviour2.exe` to examine the section and confirm the virtual address to file offset mapping. Alternatively, search for the encrypted pattern `020c3e2e383812243e0d243e252f062e` in the file using `xxd` or Python.

- **Issue:** Wrong decryption result
  - **Solution:** Double-check the XOR key. Look for `mov BYTE PTR [ebp-0x39],0x4b` instruction at address `0x401475` in the disassembly to confirm the key is `0x4B`.

- **Issue:** Flag format incorrect
  - **Solution:** Try different formats: with/without `ctf{}` wrapper, with `CTF{}` prefix, different casing variations.

- **Issue:** C++ string operations confusing
  - **Solution:** Remember that C++ uses std::string objects, which are wrapper classes. The assembly shows calls to `__ZNSsC1EPKcRKSaIcE` (string constructor) and `__ZNSsixEj` (operator[]). Focus on finding where the XOR operation happens on the string data.

**Key Takeaways:**
- C++ executables use mangled function names which can make reverse engineering more challenging
- XOR encryption with a single-byte key is commonly used for simple string obfuscation
- Virtual addresses in PE files need to be mapped to file offsets using section headers
- Use `objdump -h` and `objdump -s -j <section>` to understand section mappings (VA vs file offset)
- The `.rdata` section contains read-only data including encrypted strings
- Static analysis with `strings`, `objdump`, and hex dumps can reveal encrypted data even when it's not plaintext
- File operations (like writing to multiple files) can be red herrings designed to distract from the actual flag
- The XOR key can be different between similar challenges (behaviour1 uses 0x57, behaviour2 uses 0x4B)

**Tools Used:**
- `file` - Identify file type and architecture
- `strings` - Extract printable strings (may not show encrypted data)
- `objdump` - Disassemble binary and examine sections
- `xxd`/`hexdump` - View raw hex dump of binary sections
- Python - Script decryption and flag extraction

**Observations:**
1. **String Obfuscation**: The flag is XOR-encrypted in the `.rdata` section, making it invisible to simple `strings` command
2. **C++ Complexity**: C++ std::string objects require understanding of C++ runtime and mangled names
3. **File Operations**: The program writes to multiple files ("outputfile.txt", "c:\windows\system32\stream.msc", etc.) which are red herrings
4. **Exercise Context**: This is labeled as "Exercise BE-2 - C++ Executable - Packed" from "HackLab Malware Analysis", suggesting it's part of a malware analysis training series
5. **Similar to behaviour1**: The structure is very similar to behaviour1.exe, but with a different XOR key (0x4B vs 0x57)

**Relevant Addresses:**
- `0x401390` - `_main` function entry point
- `0x401410` - Where encrypted string address (`0x442000`) is loaded
- `0x401475` - XOR key (`0x4B`) is set to `[ebp-0x39]`
- `0x401480-0x4014b9` - XOR decryption loop
- `0x442000` - Virtual address of encrypted flag in `.rdata` section
- `0x40800` - File offset of encrypted flag (found by searching for the encrypted pattern)

**Section Mapping:**
- `.text` section: VA `0x401000`, File Offset `0x400`
- `.data` section: VA `0x441000`, File Offset `0x40200`
- `.rdata` section: VA `0x442000`, File Offset `0x40800` (approximately, may vary)

**Flag Format Notes:**
- The decrypted content is: `IGuessYouFoundMe`
- Different CTF platforms may require different formats:
  - `IGuessYouFoundMe` (plain content)
  - `ctf{IGuessYouFoundMe}` (lowercase CTF prefix - most common format)
  - `CTF{IGuessYouFoundMe}` (uppercase CTF prefix)
- Case variations: `iguessyoufoundme`, `IGUESSYOUFOUNDME`
- If submission fails, try alternative formats and casing

**Comparison with behaviour1:**
- **Similarities:**
  - Both use XOR encryption with single-byte keys
  - Both use C++ std::string objects
  - Both store encrypted data at virtual address `0x442000`
  - Both use similar decryption loop structure
- **Differences:**
  - behaviour1 uses XOR key `0x57` (W), behaviour2 uses `0x4B` (K)
  - behaviour1 flag: `HidingHereInThisFile`, behaviour2 flag: `IGuessYouFoundMe`
  - behaviour1 writes to fewer files, behaviour2 writes to multiple files as red herrings

---

## Concepts & Theory

### Topic 1: [Name]

**Overview:**
[Explanation of the concept]

**Key Points:**
- Point 1
- Point 2
- Point 3

**Examples:**
```bash
# Example code or command
```

**Related Concepts:**
- Link to related topic
- Link to related topic

---

### Topic 2: [Name]

*(Follow the same structure as Topic 1)*

---

## Tools & Commands

### strings

**Purpose:** Extract printable strings from binary files

**Installation:**
```bash
# Usually pre-installed on Linux
sudo apt-get install binutils  # If needed
```

**Basic Usage:**
```bash
strings binary.exe              # Extract all printable strings
strings -a binary.exe           # Scan entire file (including non-executable sections)
strings -n 4 binary.exe         # Minimum string length (4 characters)
strings binary.exe | grep flag  # Filter for specific patterns
```

**Common Options:**
- `-a`: Scan entire file (default is only executable sections)
- `-n <length>`: Minimum string length to display
- `-t <format>`: Print offset in specified format (x=hex, d=decimal, o=octal)

**Advanced Examples:**
```bash
# Find encrypted/obfuscated strings
strings -a binary.exe | grep -v "^[[:print:]]*$"  # Non-printable characters

# Extract and save to file
strings binary.exe > strings_output.txt
```

**Documentation:** `man strings`

---

### objdump

**Purpose:** Display information from object files and disassemble binaries

**Installation:**
```bash
sudo apt-get install binutils
```

**Basic Usage:**
```bash
objdump -d binary.exe           # Disassemble executable sections
objdump -d -Mintel binary.exe   # Intel syntax (default is AT&T)
objdump -s -j .rdata binary.exe # Dump specific section contents
objdump -h binary.exe           # Show section headers
objdump -x binary.exe           # Display all headers
```

**Common Options:**
- `-d`: Disassemble executable sections
- `-s`: Display full contents of sections
- `-j <section>`: Operate on specific section (e.g., `.rdata`, `.data`)
- `-Mintel`: Use Intel assembly syntax (more readable)
- `-x`: Display all headers
- `-h`: Display section headers

**Advanced Examples:**
```bash
# Disassemble specific function
objdump -d binary.exe | grep -A50 "<_WinMain@16>"

# Dump section and save to file
objdump -s -j .rdata binary.exe > rdata_section.txt

# Find string references
objdump -d binary.exe | grep "0x442000"
```

**Documentation:** `man objdump`

---

### file

**Purpose:** Determine file type and format

**Installation:**
```bash
sudo apt-get install file
```

**Basic Usage:**
```bash
file binary.exe                 # Identify file type
file -b binary.exe              # Brief output (no filename)
file -i binary.exe              # MIME type
```

**Example Output:**
```
binary.exe: PE32 executable (console) Intel 80386 (stripped to external PDB), for MS Windows, 5 sections
```

**Documentation:** `man file`

---

### xxd / hexdump

**Purpose:** Create hex dumps of binary files

**Installation:**
```bash
# xxd comes with vim package
sudo apt-get install vim-common

# hexdump usually pre-installed
```

**Basic Usage:**
```bash
xxd binary.exe                  # Hex dump with ASCII
xxd -s 0x40800 -l 200 binary.exe  # Specific offset and length
hexdump -C binary.exe           # Canonical hex+ASCII dump
```

**Common Options:**
- `-s <offset>`: Start at specified offset (hex or decimal)
- `-l <length>`: Limit output to specified length
- `-C`: Canonical format (hex and ASCII)

**Documentation:** `man xxd`, `man hexdump`

---

### Python for Binary Analysis

**Purpose:** Script binary analysis and decryption

**Basic Usage:**
```python
# Read binary file
with open('binary.exe', 'rb') as f:
    data = f.read()

# Extract specific offset
offset = 0x40800
encrypted = data[offset:offset+20]

# XOR decryption
key = 0x53
decrypted = bytes([b ^ key for b in encrypted])
print(decrypted.decode('ascii'))
```

**Documentation:** [Python Documentation](https://docs.python.org/3/)

---

## Practice Exercises

### Exercise 1: [Title]

**Difficulty:** [Easy/Medium/Hard]

**Task:** [What needs to be done]

**Approach:**
1. Step 1
2. Step 2
3. Step 3

**Solution:**
```bash
# Solution code or commands
```

**Learning Points:**
- What was learned
- What was challenging

---

## Resources & Links

### Official Documentation
- [Resource Name](URL) - Description

### Tutorials & Guides
- [Tutorial Name](URL) - Description

### Tools & Utilities
- [Tool Name](URL) - Description

### Community
- [Community Resource](URL) - Description

---

## Notes & Observations

### Date: [YYYY-MM-DD]

**Topic:** [What was covered]

**Notes:**
- Observation 1
- Observation 2
- Important reminder

**Questions:**
- Question that came up
- Thing to research later

---

### Date: [YYYY-MM-DD]

*(Follow the same structure for additional notes)*

---

## Glossary

- **Term 1**: Definition
- **Term 2**: Definition
- **Term 3**: Definition

---

## Appendices

### Appendix A: [Title]

[Additional reference material]

### Appendix B: [Title]

[Additional reference material]

---

*Last Updated: 2025-01-15*

*This document is a living document and will be updated as we progress through MWCC materials.*

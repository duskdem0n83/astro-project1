#!/usr/bin/env python3
"""
Decrypt episode1.enc using variable Caesar cipher keys from key.txt
Each character was encrypted with a different key from key.txt
"""

def decrypt_character(char, shift):
    """Decrypt a single character using Caesar cipher with given shift"""
    if char.isalpha():
        # Handle letters
        if char.isupper():
            # Decrypt uppercase: shift backwards, wrap around mod 26
            decrypted = chr((ord(char) - ord('A') - shift) % 26 + ord('A'))
        else:
            # Decrypt lowercase: shift backwards, wrap around mod 26
            decrypted = chr((ord(char) - ord('a') - shift) % 26 + ord('a'))
    elif char.isdigit():
        # Handle numbers: shift backwards, wrap around mod 10
        decrypted = chr((ord(char) - ord('0') - shift) % 10 + ord('0'))
    else:
        # Special characters: might also be shifted, or might not
        # Try shifting all printable ASCII characters
        if 32 <= ord(char) <= 126:  # Printable ASCII range
            decrypted = chr((ord(char) - 32 - shift) % 95 + 32)
        else:
            # Non-printable, leave as is
            decrypted = char
    return decrypted

# Read the key file
with open('/home/dan/Downloads/mwcc/key.txt', 'r') as f:
    keys = [int(line.strip()) for line in f if line.strip()]

print(f"Loaded {len(keys)} keys from key.txt")

# Read the encrypted file
with open('/home/dan/Downloads/mwcc/episode1.enc', 'r') as f:
    encrypted_text = f.read()

print(f"Encrypted text length: {len(encrypted_text)} characters")
print(f"Number of printable characters: {sum(1 for c in encrypted_text if c.isprintable())}")

# Decrypt character by character
decrypted_text = []
key_index = 0

for char in encrypted_text:
    if char == '\n':
        # Preserve newlines
        decrypted_text.append(char)
    elif char.isspace():
        # For spaces and other whitespace, check if we should skip key or use it
        # Let's try using the key for spaces too
        if key_index < len(keys):
            shift = keys[key_index]
            decrypted_char = decrypt_character(char, shift)
            decrypted_text.append(decrypted_char)
            key_index += 1
        else:
            decrypted_text.append(char)
    else:
        # Decrypt using the corresponding key
        if key_index < len(keys):
            shift = keys[key_index]
            decrypted_char = decrypt_character(char, shift)
            decrypted_text.append(decrypted_char)
            key_index += 1
        else:
            # Ran out of keys, leave as is
            decrypted_text.append(char)

decrypted_string = ''.join(decrypted_text)

print("\n" + "="*80)
print("DECRYPTED TEXT:")
print("="*80)
print(decrypted_string)
print("="*80)

# Look for CTF flag pattern
import re
flag_pattern = re.compile(r'CTF\{[^}]+\}')
matches = flag_pattern.findall(decrypted_string)

if matches:
    print("\n🎯 FOUND FLAG(S):")
    for flag in matches:
        print(f"   {flag}")
else:
    print("\n⚠️  No flag found in format CTF{...}")
    print("\nSearching for alternative patterns...")
    
    # Try other flag patterns
    alt_patterns = [
        r'ctf\{[^}]+\}',  # lowercase
        r'FLAG\{[^}]+\}',
        r'flag\{[^}]+\}',
        r'\{[A-Z0-9_]+\}',  # Just braces
    ]
    
    for pattern in alt_patterns:
        matches = re.findall(pattern, decrypted_string, re.IGNORECASE)
        if matches:
            print(f"   Pattern {pattern}: {matches}")

# Save decrypted text to file
output_file = '/home/dan/Downloads/mwcc/episode1_decrypted.txt'
with open(output_file, 'w') as f:
    f.write(decrypted_string)
print(f"\n💾 Decrypted text saved to: {output_file}")

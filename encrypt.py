from Crypto.Cipher import DES
import sys

h = open('key.txt','r')
KEY = h.readline().strip()
h.close()

IV = "AAAAAAAA"
cipher = DES.new(KEY, DES.MODE_OFB, IV)

data = IV * 100
with open(sys.argv[1], 'r') as content:
    data += content.read()

while len(data) % 8 != 0:
    data += '\x00'

ciphertext = cipher.encrypt(data)
f = open(sys.argv[2],'wb')
f.write(ciphertext)
f.close()

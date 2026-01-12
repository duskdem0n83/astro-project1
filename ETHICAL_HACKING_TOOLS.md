# Ethical Hacking Tools Inventory

This document lists all ethical hacking and security tools found on your system, organized by category.

## 📡 Network Scanning & Enumeration

- **nmap** - Network mapper and port scanner
- **masscan** - Fast port scanner (if installed)
- **rustscan** - Fast port scanner written in Rust (if installed)

## 🌐 Web Application Security

- **sqlmap** - Automatic SQL injection and database takeover tool
- **OWASP ZAP (Zed Attack Proxy)** - Web application security scanner
  - Location: `/home/dan/.local/bin/zap`
  - Also at: `/home/dan/ZAP_2.17.0/zap.sh`
- **Burp Suite** - Web application security testing platform
  - Location: `~/Documents/`

## 🔐 Password Cracking & Hash Analysis

- **John the Ripper** - Fast password cracker
  - Location: `/usr/local/bin/john`
  - Data files: `john-data` package installed
- **hashcat** - Advanced password recovery utility (GPU-accelerated)
- **hydra** - Network logon cracker
- **medusa** - Parallel, modular login brute-forcer
- **hashid** - Hash identifier tool
- **cewl** - Custom word list generator

## 📶 Wireless Security

- **aircrack-ng** - Wireless WEP/WPA/WPA2 cracking suite

## 📊 Network Traffic Analysis

- **Wireshark** - Network protocol analyzer (GUI)
- **tshark** - Command-line network traffic analyzer
- **tcpdump** - Command-line packet analyzer
- **netcat (nc)** - Network utility for reading/writing network connections
- **smbclient** - SMB/CIFS client for accessing Windows shares

## 🔍 Forensics & Digital Investigation

- **binwalk** - Binary analysis tool for firmware and file analysis
- **foremost** - File recovery tool
- **testdisk** - Partition scanner and disk recovery tool
- **photorec** - File recovery tool (part of testdisk)
- **sleuthkit** - Command-line tools for forensic analysis
- **Volatility3** - Memory forensics framework for analyzing volatile memory (RAM) dumps
  - Location: `~/Downloads/volatility3`

## 🐍 Python Security Libraries

- **scapy** - Packet manipulation library
- **paramiko** - SSH2 protocol library
- **requests** - HTTP library for Python
- **beautifulsoup4** - HTML/XML parser
- **netaddr** - Network address manipulation library

## 🛠️ Development & Programming Tools

- **Python 3** - Programming language
- **Ruby** - Programming language
- **Perl** - Programming language
- **Node.js & npm** - JavaScript runtime and package manager
- **Java & javac** - Java runtime and compiler
- **GCC & G++** - C/C++ compilers
- **make** - Build automation tool
- **git** - Version control system

## 📝 Additional Utilities

- **uncompyle6** - Python bytecode decompiler
  - Location: `/home/dan/.local/share/pipx/venvs/uncompyle6/bin/`

## 📦 Package Information

### System Packages (via apt/dpkg):
- aircrack-ng (1:1.7+git20230807.4bf83f1a-1build2)
- hashcat (6.2.6+ds1-1build2)
- hashcat-data (6.2.6+ds1-1build2)
- hydra (9.5-1build3)
- john-data (1.9.0-2build1)
- nmap (7.94+git20230807.3be01efb1+dfsg-3build2)
- sqlmap (1.8.4-1)
- wireshark (4.2.2-1.1build3)
- medusa (2.2-7build3)
- cewl (6.1-1)
- hashid (3.1.4-4)
- binwalk (2.3.4+dfsg1-5)
- foremost (1.5.7-11)
- testdisk (7.1-5+nmu1build2)
- sleuthkit (4.12.1+dfsg-1.1ubuntu2)
- tcpdump (4.99.4-3ubuntu4.24.04.1)
- tshark (4.2.2-1.1build3)

### Python Packages (via pip):
- beautifulsoup4 (4.12.3)
- netaddr (0.8.0)
- paramiko (2.12.0)
- requests (2.31.0)
- requests-file (1.5.1)
- scapy (2.5.0)

## 📍 Installation Locations

- System binaries: `/usr/bin/`
- Local binaries: `/home/dan/.local/bin/`
- John the Ripper: `/usr/local/bin/john`
- OWASP ZAP: `/home/dan/ZAP_2.17.0/`
- Python packages: Installed via pip
- Node.js: `/home/dan/.nvm/versions/node/v24.12.0/`

## 🔄 Missing Common Tools (Not Found)

The following common ethical hacking tools were not detected on your system:
- Metasploit Framework
- Gobuster
- Dirb/Dirbuster
- Nikto
- WPScan
- Nuclei
- Subfinder
- Amass
- Feroxbuster
- Enum4linux
- SMBMap
- LDAPDomainDump
- Kerbrute
- BloodHound
- CrackMapExec
- Responder
- Bettercap
- Ettercap
- MITMProxy
- Proxychains
- Autopsy (forensics GUI)

---

*Generated on: $(date)*
*System: Linux 6.14.0-35-generic*


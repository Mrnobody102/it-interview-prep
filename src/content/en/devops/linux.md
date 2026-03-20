# DevOps — Linux

## 1. Essential Commands

### 1.1. File Operations

```bash
# List files (detailed)
ls -la

# List with human-readable sizes
ls -lh

# Change directory
cd /path/to/directory

# Go to home directory
cd ~

# Go to previous directory
cd -

# Copy file or directory
cp src.txt dest.txt
cp -r src_dir dest_dir   # Copy directory recursively

# Move or rename
mv old_name new_name
mv file.txt /new/path/

# Remove file
rm file.txt

# Remove directory
rm -r directory/

# Remove without prompt
rm -rf directory/

# Create directory
mkdir directory_name
mkdir -p path/to/nested/directory

# Create file
touch file.txt

# View file content
cat file.txt

# View file with pagination
less file.txt
more file.txt

# View first/last lines
head -n 20 file.txt
tail -n 50 file.txt

# Follow log file in real-time
tail -f /var/log/syslog
```

---

## 2. File Permissions

### 2.1. Permission Model

| Symbol | Meaning |
|--------|---------|
| `r` | Read (4) |
| `w` | Write (2) |
| `x` | Execute (1) |

Permissions are set for **Owner**, **Group**, and **Others**.

```bash
# View permissions
ls -l file.txt
# Output: -rw-r--r--  (Owner: rw-, Group: r--, Others: r--)

# Change permissions (numeric)
chmod 755 script.sh    # rwxr-xr-x

# Change permissions (symbolic)
chmod u+x script.sh    # Add execute for owner
chmod go-w file.txt    # Remove write for group and others

# Change owner
chown user:group file.txt
chown -R user:group directory/
```

---

## 3. Text Processing

```bash
# Search within file
grep "pattern" file.txt
grep -r "pattern" directory/     # Recursive search
grep -i "pattern" file.txt      # Case insensitive
grep -n "pattern" file.txt      # Show line numbers

# Find files
find /path -name "*.txt"
find /path -type f -size +100M  # Files larger than 100MB

# Replace text in file
sed -i 's/old_text/new_text/g' file.txt

# Sort lines
sort file.txt

# Show unique lines
uniq file.txt

# Count lines, words, characters
wc file.txt
```

---

## 4. System & Process Management

```bash
# Show running processes
ps aux

# Show processes filtered
ps aux | grep node

# Real-time process monitor
top
htop     # Enhanced version

# Kill a process
kill <PID>
kill -9 <PID>    # Force kill

# Background and foreground
command &           # Run in background
Ctrl+Z              # Suspend foreground job
bg                  # Resume in background
fg                  # Bring to foreground

# System resources
df -h               # Disk usage
du -sh directory/   # Directory size
free -h             # Memory usage
uname -a            # System information
```

---

## 5. Networking

```bash
# Check IP address
ip addr
ifconfig

# Ping host
ping example.com

# Check open ports
ss -tulpn

# Download file
curl -O https://example.com/file.zip
wget https://example.com/file.zip

# HTTP request
curl https://api.example.com
curl -X POST -d "data=value" https://api.example.com
curl -H "Authorization: Bearer token" https://api.example.com

# SSH connection
ssh user@hostname
ssh -i key.pem user@hostname

# Copy files over SSH
scp file.txt user@host:/path/
scp -r directory/ user@host:/path/

# DNS lookup
nslookup example.com
dig example.com
```

---

## 6. Package Management

### Debian/Ubuntu (APT)

```bash
apt update                    # Update package list
apt upgrade                   # Upgrade all packages
apt install <package>         # Install package
apt remove <package>          # Remove package
apt search <package>          # Search for package
```

### RHEL/CentOS/Fedora (YUM/DNF)

```bash
yum install <package>         # Install package
yum remove <package>          # Remove package
yum update                    # Update all packages
yum search <package>          # Search package
```

---

## 7. User & Group Management

```bash
# Add user
useradd -m username

# Set password
passwd username

# Add to group
usermod -aG sudo username    # Add to sudo group

# Switch user
su - username

# Execute as root
sudo command

# List users
cat /etc/passwd

# List groups
cat /etc/group
```

---

## 8. Disk & Filesystem

```bash
# List mounted filesystems
df -h

# Check disk usage
du -sh *

# Mount filesystem
mount /dev/sdb1 /mnt/usb

# Unmount
umount /mnt/usb

# Create filesystem
mkfs.ext4 /dev/sdb1

# Check filesystem
fsck /dev/sda1
```

---

## 9. Archives & Compression

```bash
# Create tar archive
tar -cvf archive.tar directory/
tar -cvzf archive.tar.gz directory/    # With gzip compression
tar -cvjf archive.tar.bz2 directory/  # With bzip2 compression

# Extract tar archive
tar -xvf archive.tar
tar -xvzf archive.tar.gz
tar -xvjf archive.tar.bz2

# Create zip archive
zip -r archive.zip directory/

# Extract zip
unzip archive.zip
```

---

## 10. Useful One-liners

```bash
# Find largest files in directory
du -ah directory/ | sort -rh | head -20

# Count lines of code in project
find . -name "*.js" | xargs wc -l

# Kill process by name
pkill -f "node server.js"

# Watch command output every 2 seconds
watch -n 2 'command'

# Replace text in multiple files
find . -name "*.txt" -exec sed -i 's/old/new/g' {} +

# Check if port is in use
lsof -i :8080
netstat -tulpn | grep 8080
```

---

## 11. Interview Questions

**Q: What is the difference between a process and a daemon?**

> A **process** is a running instance of a program. A **daemon** is a background process that runs continuously, typically providing system services (e.g., `sshd`, `nginx`).

**Q: How do you troubleshoot high CPU usage on a Linux server?**

1. Use `top` or `htop` to identify the process consuming CPU.
2. Use `ps aux | sort -k3 -rn | head` to find top CPU consumers.
3. Check `/var/log/` for application logs.
4. Analyze with `strace` or `perf` if needed.

**Q: What is the inode limit?**

> Each file on a filesystem has an **inode** entry. The total number of inodes determines the maximum number of files. Running out of inodes can happen even with free disk space.

**Q: Explain the Linux boot sequence.**

> BIOS/UEFI -> MBR/GPT -> GRUB Bootloader -> Kernel Loading -> `systemd` (init) -> Runlevel/Services -> Login Manager.

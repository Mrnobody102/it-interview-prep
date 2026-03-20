# DevOps - Linux

## 1. File Operations

### 1.1. Navigation & Listing

```bash
ls -la              # Liệt kê tất cả file (bao gồm hidden), chi tiết
ls -lh              # Liệt kê với kích thước human-readable
ls -lt              # Sắp xếp theo thời gian sửa đổi (mới nhất trước)
ls -ltr             # Sắp xếp theo thời gian (cũ nhất trước)
ls -la /path        # Liệt kê thư mục cụ thể
ls -R               # Liệt kê đệ quy (subdirectories)
ls -S               # Sắp xếp theo kích thước

cd /path            # Di chuyển vào thư mục
cd ..               # Di chuyển lên thư mục cha
cd ~                # Về home directory
cd -                # Về thư mục trước đó
pwd                 # In ra đường dẫn hiện tại
pwd -P              # Resolve symbolic links
```

### 1.2. File Manipulation

```bash
cp src dest                # Sao chép file
cp -r src/ dest/           # Sao chép thư mục (recursive)
cp -p src dest             # Giữ nguyên permissions, timestamps
cp -a src/ dest/           # Archive mode (recursive, preserve all attributes)
cp -v src dest             # Verbose — hiển thị what đang copy

mv src dest                # Di chuyển / đổi tên
mv file1 file2 dir/        # Di chuyển nhiều file
mv -n src dest             # Không ghi đè nếu dest đã tồn tại
mv -i src dest             # Interactive — hỏi trước khi ghi đè

rm file                    # Xóa file
rm -rf dir/                # Xóa thư mục không rỗng (recursive, force)
rm -i file                 # Interactive — hỏi trước khi xóa
rm -v file                 # Verbose

mkdir dir                  # Tạo thư mục
mkdir -p path/to/dir        # Tạo nested directories
mkdir -m 755 dir           # Tạo với permission cụ thể

touch file                 # Tạo file rỗng / cập nhật timestamp
touch -a file              # Chỉ cập nhật access time
touch -m file              # Chỉ cập nhật modification time
touch file{1..10}          # Tạo file1 đến file10
```

### 1.3. File Viewing & Searching

```bash
# Viewing
cat file                    # In toàn bộ nội dung
cat -n file                # Hiển thị số dòng
tac file                   # In đảo ngược (dòng cuối lên đầu)
less file                   # Xem nội dung từng trang (q để thoát, / để search)
more file                   # Xem từng trang (ít tính năng hơn less)
head -n 20 file             # 20 dòng đầu
tail -n 50 file             # 50 dòng cuối
tail -f /var/log/syslog     # Follow log real-time
tail -f --pid=<PID> file   # Dừng khi process exit
sed -n '10,20p' file       # In dòng 10-20

# Searching in files
grep "pattern" file         # Tìm kiếm trong file
grep -r "pattern" dir/      # Tìm kiếm recursive
grep -i "pattern" file      # Case-insensitive
grep -n "pattern" file      # Hiển thị số dòng
grep -v "pattern" file      # Dòng KHÔNG chứa pattern
grep -E "regex" file        # Extended regex
grep -c "pattern" file      # Đếm số dòng match
grep -l "pattern" *.txt    # Liệt kê files chứa pattern
grep -o "pattern" file     # Chỉ hiển thị phần match

# Finding files
find /path -name "*.log"            # Tìm file theo tên
find /path -type f -size +100M      # File lớn hơn 100MB
find /path -type f -mtime -7        # Sửa đổi trong 7 ngày
find /path -type f -mmin -30       # Sửa đổi trong 30 phút
find /path -perm 755               # Tìm theo permission
find /path -user username           # Tìm theo owner
find /path -empty                   # File/rỗng
find /path -name "*.tmp" -delete   # Tìm và xóa

# Word/line count
wc -l file                  # Đếm số dòng
wc -w file                  # Đếm số từ
wc -c file                  # Đếm số bytes
```

### 1.4. File Permissions

```bash
# Permission structure: [type][owner][group][others]
# r = 4 (read), w = 2 (write), x = 1 (execute)
# Example: -rwxr-xr-- = 750

# Owner permissions
chmod 755 file              # rwxr-xr-x
chmod 644 file              # rw-r--r--
chmod 600 file              # rw-------
chmod 700 dir               # rwx------
chmod +x script.sh          # Thêm execute cho all
chmod u+x file              # Thêm execute cho owner
chmod g+x file              # Thêm execute cho group
chmod o-x file              # Bỏ execute cho others
chmod -R 644 dir/           # Recursive

# Change ownership
chown user:group file       # Đổi owner và group
chown -R user:group dir/    # Recursive
chgrp group file            # Đổi group

# Special permissions
chmod u+s file              # SUID (run as owner)
chmod g+s dir               # SGID (inherit group)
chmod +t dir                # Sticky bit (chỉ owner mới xóa được)
```

### 1.5. File Compression & Archives

```bash
# tar — tape archive
tar -cvf archive.tar dir/       # Tạo archive
tar -xvf archive.tar            # Extract
tar -xvf archive.tar -C /dest/  # Extract vào thư mục
tar -czvf archive.tar.gz dir/  # Tạo .tar.gz (compress)
tar -xzvf archive.tar.gz        # Extract .tar.gz
tar -cjvf archive.tar.bz2 dir/ # Tạo .tar.bz2
tar -cjvf archive.tar.xz dir/   # Tạo .tar.xz (best compression)
tar -tzf archive.tar.gz         # List contents

# zip/unzip
zip -r archive.zip dir/         # Tạo zip
zip -r archive.zip file1 file2  # Zip nhiều files
unzip archive.zip               # Extract zip
unzip archive.zip -d /dest/     # Extract vào thư mục
unzip -l archive.zip             # List contents

# gzip/bzip2/xz
gzip file                      # Nén .gz
gunzip file.gz                 # Giải nén
gzip -k file                  # Giữ original file
pigz file                     # Parallel gzip (nhanh hơn)

# 7z
7z a archive.7z dir/           # Tạo archive
7z x archive.7z               # Extract
```

---

## 2. Process Management

### 2.1. Viewing Processes

```bash
ps aux                        # Tất cả processes (BSD style)
ps -ef                        # Tất cả processes (System V)
ps aux | grep nginx           # Tìm process cụ thể
ps -ef --sort=-%cpu | head    # Sắp xếp theo CPU
ps -ef --sort=-%mem | head    # Sắp xếp theo memory
ps -o pid,ppid,comm,cmd       # Custom output format

top                           # Monitor processes real-time
htop                          # Tương tự nhưng đẹp hơn (cần cài đặt)
btop                          # Modern, GPU-accelerated
top -u user                   # Chỉ processes của user
top -p <PID>                  # Monitor specific process

pidof nginx                   # Lấy PID của process
pgrep -u user nginx           # Tìm process theo name/user
pstree                        # Hiển thị process tree
```

### 2.2. Process Control

```bash
kill <PID>                    # Terminate process (SIGTERM, graceful)
kill -9 <PID>                 # Force kill (SIGKILL, immediate)
kill -15 <PID>                # Graceful shutdown (SIGTERM)
kill -STOP <PID>              # Pause process (SIGSTOP)
kill -CONT <PID>              # Resume process (SIGCONT)
kill -HUP <PID>               # Reload config (hangup)

killall nginx                 # Kill all processes named nginx
pkill nginx                   # Kill bằng pattern
pkill -f "node server.js"    # Kill theo full command line

# Background & Foreground
command &                     # Chạy trong background
Ctrl+Z                         # Suspend foreground job
bg                             # Resume trong background
fg                             # Bring to foreground
jobs                           # Liệt kê background jobs
nohup command &               # Chạy không bị kill khi logout
nohup command > output.log 2>&1 &  # Redirect stdout + stderr
```

### 2.3. System Resources

```bash
# Memory & CPU
free -h                        # Memory usage (human-readable)
free -m                        # Memory in MB
vmstat 1                       # Virtual memory stats (1 giây)
vmstat 1 5                     # 1 giây, 5 lần
cat /proc/meminfo              # Chi tiết memory

uptime                          # Thời gian chạy, load average
nproc                           # Số CPU cores
lscpu                           # Chi tiết CPU
cat /proc/cpuinfo              # CPU info

# Disk
df -h                          # Disk usage (human-readable)
df -i                          # Inode usage
du -sh *                       # Kích thước thư mục con (1 cấp)
du -h --max-depth=1 /          # Chi tiết 1 cấp
du -sh /path/to/dir            # Kích thước cụ thể

# Network & I/O
iostat                          # I/O stats
iotop                           # I/O per process
netstat -tulpn                  # Listening ports
ss -tulpn                       # Socket statistics (thay thế netstat)
lsof -i -P -n                  # Files opened by processes (network)
```

---

## 3. User & Group Management

```bash
# Users
useradd -m -s /bin/bash username    # Tạo user mới (tạo home dir, shell mặc định)
useradd -m -s /bin/bash -G sudo,www-data username  # Tạo user + thêm groups
userdel -r username                 # Xóa user (xóa cả home dir)
usermod -aG sudo username           # Thêm vào group sudo
usermod -l newname oldname          # Đổi tên user
usermod -L username                 # Lock user
passwd username                     # Đổi password
id username                        # Xem user info (UID, GID, groups)

# Groups
groupadd devteam                    # Tạo group
groupdel devteam                     # Xóa group
groupmod -n newname oldname          # Đổi tên group
groups username                     # Liệt kê groups của user
gpasswd -a user group              # Thêm user vào group

# Switch users
su - username                       # Switch user (load environment)
su username                         # Switch user (không load environment)
sudo command                        # Chạy command với quyền root
sudo -u user command               # Chạy với user khác
sudo -i                             # Interactive root shell
sudo -l                            # Xem commands được phép
```

---

## 4. Networking

```bash
# Basic
ip addr                           # Show IP addresses
ip link                           # Show network interfaces
ip route                          # Routing table
ip neigh                         # ARP table (neighbors)
hostname -I                       # IP addresses (all)
hostname                          # Hostname

# Connectivity
ping -c 4 8.8.8.8                 # Ping 4 lần
ping -i 0.5 8.8.8.8               # Ping mỗi 0.5 giây
curl -I https://example.com        # HTTP headers
curl -s https://api.example.com    # Silent GET request
wget https://example.com/file      # Download file
wget -O output.html https://...    # Download với tên file tùy chỉnh
traceroute example.com             # Trace route
mtr example.com                    # Combined traceroute + ping
dig example.com                    # Detailed DNS info
dig +short example.com             # Chỉ IP addresses

# Firewall (iptables/nftables)
iptables -L -n                     # List rules
iptables -L -n --line-numbers     # Với số thứ tự
iptables -A INPUT -p tcp --dport 22 -j ACCEPT   # Allow SSH
iptables -A INPUT -j DROP          # Drop all input
iptables -D INPUT <rule_number>    # Delete rule
iptables -F                        # Flush all rules
iptables-save > /etc/iptables/rules.v4  # Save rules

# nftables (thay thế iptables)
nft list ruleset
nft add rule ip filter input tcp dport 22 accept

# Advanced
tcpdump -i eth0 port 80            # Packet capture
tcpdump -i eth0 -w capture.pcap   # Save to file
tcpdump -i eth0 host 192.168.1.1  # Filter by host
nc -zv host port                   # Check port open
nc -lvp 8080                      # Listen on port
```

---

## 5. Systemd & Services

```bash
# Services
systemctl start nginx               # Start service
systemctl stop nginx                # Stop service
systemctl restart nginx             # Restart service
systemctl reload nginx             # Reload config (không restart)
systemctl status nginx              # Xem trạng thái
systemctl enable nginx              # Enable boot (auto-start)
systemctl disable nginx             # Disable boot
systemctl is-active nginx           # Check active (trả về "active" hoặc "inactive")
systemctl is-enabled nginx          # Check enabled
systemctl daemon-reload             # Reload systemd config (sau khi sửa unit file)
systemctl mask nginx               # Disable hoàn toàn (prevent start)
systemctl unmask nginx             # Unmask

# Journal / Logs
journalctl -u nginx                  # Logs của service cụ thể
journalctl -u nginx -f             # Follow logs
journalctl -xe                       # System logs gần đây (tổng hợp)
journalctl --since "1 hour ago"     # Logs từ thời điểm
journalctl --since "2024-01-01" --until "2024-01-02"
journalctl -p err                   # Chỉ error level trở lên
journalctl --disk-usage            # Xem disk usage của logs

# System
systemctl reboot                     # Reboot
systemctl poweroff                   # Shutdown
systemctl emergency                  # Emergency mode
systemctl rescue                     # Rescue mode
```

### 5.1. Creating a systemd Service

```bash
# Tạo unit file: /etc/systemd/system/myapp.service
[Unit]
Description=My Application
After=network.target
Wants=network-online.target

[Service]
Type=simple
User=myapp
WorkingDirectory=/opt/myapp
ExecStart=/opt/myapp/start.sh
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target

# Enable và start
systemctl daemon-reload
systemctl enable myapp
systemctl start myapp
```

---

## 6. Package Management

### 6.1. APT (Debian/Ubuntu)

```bash
apt update                           # Cập nhật package list
apt upgrade                          # Upgrade all packages
apt full-upgrade                    # Upgrade + handle dependency changes
apt install nginx                    # Cài đặt package
apt install nginx=1.18.0            # Cài đặt version cụ thể
apt remove nginx                     # Gỡ bỏ package
apt purge nginx                      # Gỡ + xóa config
apt autoremove                       # Gỡ packages không cần thiết
apt search nginx                     # Tìm kiếm package
apt show nginx                       # Thông tin package
dpkg -l                              # Liệt kê installed packages
dpkg -l | grep nginx                 # Tìm package cụ thể
dpkg -i package.deb                  # Cài đặt .deb file
apt list --upgradable               # Packages có thể upgrade
```

### 6.2. YUM/DNF (RHEL/CentOS/Fedora)

```bash
yum update                           # Update all
yum install nginx                    # Install
yum remove nginx                     # Remove
yum list installed                   # List installed
yum search nginx                     # Search
yum info nginx                       # Thông tin package
yum localinstall package.rpm        # Install từ local .rpm
yumdownloader --resolve nginx       # Download package
dnf copr owner /usr/bin/htop         # Find package containing file

dnf install epel-release            # Extra Packages for Enterprise Linux
dnf repolist                        # List repositories
```

### 6.3. Others

```bash
# Snap
snap install vlc
snap remove vlc
snap list
snap refresh

# Homebrew (Linux)
brew install nginx
brew uninstall nginx
brew list

# Pacman (Arch Linux)
pacman -S nginx                      # Install
pacman -R nginx                      # Remove
pacman -Syu                          # Update all
pacman -Qs nginx                    # Search
```

---

## 7. Disk & Filesystem

```bash
# Partition & Mount
lsblk                                # Block devices (tree view)
lsblk -f                            # Bao gồm filesystem type
fdisk -l                             # Partition table
parted /dev/sdb print              # Chi tiết partition
mkfs.ext4 /dev/sdb1                  # Format partition (EXT4)
mkfs.xfs /dev/sdb1                  # Format partition (XFS)
mkfs.ntfs /dev/sdb1                 # Format partition (NTFS)
mount /dev/sdb1 /mnt/data            # Mount
mount -o ro /dev/sdb1 /mnt/data     # Mount read-only
umount /mnt/data                     # Unmount
umount -f /mnt/data                 # Force unmount
df -h                                # Disk space
blkid                                # Show UUIDs và filesystem types

# /etc/fstab — auto mount
# UUID=xxxx  /mnt/data  ext4  defaults  0  2

# Logical Volume Manager (LVM)
pvcreate /dev/sdb1                   # Physical volume
pvdisplay                           # Xem physical volumes
vgcreate vg0 /dev/sdb1               # Volume group
vgdisplay                           # Xem volume groups
lvcreate -L 10G -n data vg0          # Logical volume
lvdisplay                           # Xem logical volumes
mkfs.ext4 /dev/vg0/data              # Format
mount /dev/vg0/data /mnt/data        # Mount
lvextend -L +5G /dev/vg0/data        # Extend size
resize2fs /dev/vg0/data              # Resize filesystem
lvreduce -L -2G /dev/vg0/data        # Reduce size
```

---

## 8. Text Editing & Manipulation

```bash
# Editors
nano file.txt                        # Nano editor (beginner-friendly)
vi file.txt                          # Vi/Vim editor
vim file.txt                         # Vim (improved vi)
nano +10 file.txt                   # Mở file ở dòng 10
nano -l file.txt                     # Hiển thị line numbers

# sed — stream editor
sed 's/old/new/g' file               # Replace all (stdout)
sed -i 's/old/new/g' file            # In-place replace
sed -i.bak 's/old/new/g' file       # Backup trước khi replace
sed -n '5,10p' file                 # In dòng 5-10
sed '/pattern/d' file                # Xóa dòng chứa pattern
sed '1i\Header' file                # Insert vào dòng 1

# awk — pattern scanning and processing
awk '{print $1, $3}' file            # Print columns 1 và 3
awk -F: '{print $1}' /etc/passwd    # Dùng : làm delimiter
awk '/pattern/ {print $0}' file     # Print dòng chứa pattern
awk 'NR==5' file                    # Print dòng 5
awk '{sum+=$1} END {print sum}' file  # Tính tổng column 1

# cut — extract columns
cut -d: -f1 /etc/passwd            # Extract field 1 (delimiter :)
cut -c1-10 file                     # Extract ký tự 1-10

# sort & uniq
sort file | uniq                     # Sort và loại bỏ duplicate
sort file | uniq -c                  # Đếm occurrences
sort -u file                        # Sort + unique (viết tắt)
sort -t, -k2 -n file                # Sort theo column 2 (numeric)

# Pipes & Redirects
command > output.txt                  # Redirect stdout to file
command >> output.txt                 # Append to file
command 2> error.txt                  # Redirect stderr
command &> all.txt                    # Redirect both stdout và stderr
command 2>&1 | tee log.txt          # Tee: hiển thị + lưu file
command1 | command2                   # Pipe output sang input
command < input.txt                   # Input from file
command <<< "string"                  # Here string
```

---

## 9. Shell Scripting Basics

```bash
#!/bin/bash
# Comment line

# Variables
NAME="value"
echo $NAME
echo "${NAME}_suffix"
readonly CONST="immutable"
unset NAME

# Special variables
$0         # Script name
$1, $2     # Positional arguments
$#         # Number of arguments
$@         # All arguments
$?         # Exit code của command trước
$$         # Current process ID
$!         # PID của background job cuối

# Arrays
arr=(one two three)
echo ${arr[0]}       # one
echo ${arr[@]}       # all elements
echo ${#arr[@]}      # length
arr+=(four)          # append

# Conditionals
if [ "$VAR" == "value" ]; then
  echo "Match"
elif [ "$VAR" == "other" ]; then
  echo "Other"
else
  echo "No match"
fi

# String comparison
# [ "$a" == "$b" ]   Equal
# [ "$a" != "$b" ]   Not equal
# [ -z "$a" ]        Empty string
# [ -n "$a" ]        Not empty
# [ $a -eq $b ]      Numeric equal

# File test
# [ -f file ]        Regular file exists
# [ -d dir ]         Directory exists
# [ -r file ]        Readable
# [ -w file ]        Writable
# [ -x file ]        Executable
# [ file1 -nt file2 ]  Newer than

# Loops
for i in {1..10}; do
  echo "Item $i"
done

for file in *.txt; do
  echo "Processing $file"
done

for ((i=0; i<10; i++)); do
  echo $i
done

while read line; do
  echo $line
done < file.txt

until [ condition ]; do
  commands
done

# Functions
function greet() {
  local name=$1
  echo "Hello, $name"
  return 0
}
greet "World"

# Case statement
case $VAR in
  start)
    echo "Starting..."
    ;;
  stop)
    echo "Stopping..."
    ;;
  *)
    echo "Unknown command"
    ;;
esac

# Exit codes
exit 0   # Success
exit 1   # Failure

# Debug
bash -x script.sh    # Print commands as they execute
bash -n script.sh    # Syntax check only
```

---

## 10. Common Interview Questions

### Q: Sự khác biệt giữa process và thread?

| Tiêu chí | Process | Thread |
|----------|---------|--------|
| **Bộ nhớ** | Separate memory space | Chia sẻ memory với process cha |
| **Tài nguyên** | Heavy (file handles, etc.) | Lightweight |
| **Communication** | IPC (pipes, sockets, shared memory) | Trực tiếp qua shared memory |
| **Isolation** | Tách biệt | Phụ thuộc process cha |
| **Creation** | Chậm hơn | Nhanh hơn |
| **Context switch** | Chậm hơn | Nhanh hơn |

### Q: Linux boot sequence?

1. **BIOS/UEFI** — Power-On Self Test (POST).
2. **MBR/GPT** — Load bootloader từ disk.
3. **GRUB** — Hiển thị menu, load kernel.
4. **Kernel** — Initialize devices, mount root filesystem.
5. **systemd** (PID 1) — Start services theo target dependencies.
6. **Runlevel/Target** — Multi-user.target hoặc graphical.target.

### Q: Các signals phổ biến?

| Signal | Số | Mô tả |
|--------|-----|-------|
| **SIGTERM (15)** | 15 | Graceful termination — process có thể cleanup trước khi exit |
| **SIGKILL (9)** | 9 | Force kill — không thể catch hoặc ignore |
| **SIGSTOP (19)** | 19 | Pause process |
| **SIGINT (2)** | 2 | Interrupt (tương đương Ctrl+C) |
| **SIGHUP (1)** | 1 | Hangup — reload config |

### Q: inode là gì?

- **inode** là một cấu trúc dữ liệu lưu trữ metadata của file trong filesystem.
- Thông tin lưu trữ: permissions, owner, size, timestamps, block locations.
- Mỗi file có một **inode number** duy nhất trong filesystem.
- Khi inode full, không thể tạo file mới dù disk còn trống.
- Xem inode: `ls -i file` hoặc `stat file`.

### Q: Soft link vs Hard link?

| Tiêu chí | Soft Link (symlink) | Hard Link |
|----------|---------------------|-----------|
| **Target** | Path đến file/folder | inode của file |
| **Cross filesystem** | Được | Không |
| **Directory** | Được | **Không** |
| **Broken link** | Có thể (nếu target bị xóa/di chuyển) | Không (miễn là có link tồn tại) |
| **Metadata** | Separate inode | Same inode |
| **Permission** | Permissions luôn 777 | Same permissions |

### Q: Linux kernel tuning parameters (sysctl)?

```bash
sysctl -a                    # Xem tất cả params
sysctl -w net.ipv4.tcp_fin_timeout=30    # Set tạm thời
sysctl -p                    # Load config từ /etc/sysctl.conf

# Permanent: thêm vào /etc/sysctl.conf
# net.ipv4.tcp_fin_timeout = 30
```

### Q: Check open ports và services?

```bash
# Listening ports
ss -tulpn                    # Modern (recommended)
netstat -tulpn               # Legacy
lsof -i -P -n               # Files + network

# Service listening
systemctl list-units --type=service --state=running
ps aux | grep
ss -tlnp | grep :80         # Port 80
```

### Q: swap là gì và khi nào nên dùng?

- **swap** là space trên disk dùng làm virtual memory khi RAM đầy.
- Khi nào: emergency buffer khi RAM hết, hibernation (sleep to disk).
- Performance: **chậm hơn RAM** nhiều (disk I/O vs memory).
- Không nên set quá nhỏ hoặc quá lớn — thường 1-2x RAM.

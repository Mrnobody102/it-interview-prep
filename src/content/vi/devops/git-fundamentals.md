# DevOps — Git Fundamentals

## 1. Tổng quan

**Git** là hệ thống quản lý mã nguồn phân tán (distributed VCS), dùng để theo dõi thay đổi code và cộng tác theo nhánh.

- **Working Directory**: thư mục code đang làm việc
- **Staging Area**: vùng tạm chuẩn bị commit
- **Commit**: bản chụp trạng thái mã nguồn tại một thời điểm

---

## 2. Các lệnh cơ bản

```bash
git init
git clone <repo-url>
git add .
git commit -m "message"
git push origin <branch>
git pull --rebase
```

```bash
git fetch
git status
git log --oneline
git diff
git reflog
```

---

## 3. Branching và tích hợp code

### 3.1 Vòng đời nhánh

```bash
git branch feature/auth
git checkout feature/auth
# hoặc git switch -c feature/auth
```

### 3.2 Merge vs Rebase

| Chiến lược | Ưu điểm | Nhược điểm | Khi dùng |
|---|---|---|---|
| **merge** | Giữ đầy đủ lịch sử, an toàn cho nhánh chung | Nhiều merge commit | Hợp nhất các nhánh lớn/public |
| **rebase** | Lịch sử tuyến tính, sạch | Rewrite history | Cập nhật feature branch local trước PR |

```bash
# Rebase feature branch theo main
git checkout feature/auth
git fetch origin
git rebase origin/main
```

```bash
# Merge feature vào main
git checkout main
git merge feature/auth
```

### 3.3 Squash merge

Gộp nhiều commit nhỏ thành 1 commit rõ nghĩa trước khi merge.

---

## 4. Xử lý conflict

### 4.1 Conflict khi merge/rebase/pull

```bash
git status
# sửa file conflict thủ công
git add <fixed-file>
git rebase --continue   # hoặc git merge --continue
```

### 4.2 Conflict khi cherry-pick

```bash
git cherry-pick <commit-hash>
# resolve conflicts
git add <fixed-file>
git cherry-pick --continue
```

### 4.3 Pull khi local chưa commit

```bash
git stash
git pull --rebase
git stash pop
```

---

## 5. Các lệnh thực chiến

### 5.1 Stash

```bash
git stash
git stash list
git stash apply
git stash pop
```

### 5.2 Cherry-pick

Copy một commit cụ thể từ nhánh này sang nhánh khác.

```bash
git cherry-pick <commit-hash>
```

### 5.3 Revert commit đã push

```bash
git log --oneline
git revert <commit-hash>
git push origin <branch>
```

### 5.4 Reset commit local

```bash
git reset --soft HEAD~1   # giữ thay đổi trong staging
git reset --hard HEAD~1   # bỏ thay đổi local
```

> Dùng `--hard` rất cẩn thận, tránh làm mất việc đang làm.

---

## 6. Best practices

- Viết commit message rõ ràng (what + why)
- Giữ **atomic commit** (mỗi commit một thay đổi logic)
- Pull/rebase thường xuyên để giảm xung đột
- Dùng `.gitignore` cho file log, binary, generated files
- Không commit secret/token/key (`.env`, vault, secret manager)
- Với nhánh shared, ưu tiên `git revert` thay vì rewrite history
- Chỉ dùng `--force-with-lease` khi thật sự cần và đã phối hợp team

---

## 7. Câu hỏi phỏng vấn thường gặp

**Q: Khi nào dùng `merge`, khi nào dùng `rebase`?**

> Dùng `rebase` để làm sạch lịch sử nhánh local trước khi mở PR. Dùng `merge` khi tích hợp nhánh shared/public để giữ lịch sử cộng tác an toàn.

**Q: Làm sao hoàn tác một commit đã push mà an toàn?**

> Dùng `git revert <hash>` để tạo commit mới đảo ngược thay đổi cũ. Tránh `reset --hard` + force push trên nhánh nhiều người cùng dùng.

**Q: Staging Area có tác dụng gì?**

> Staging cho phép chọn chính xác phần thay đổi nào đi vào commit tiếp theo, giúp lịch sử commit sạch và dễ review.

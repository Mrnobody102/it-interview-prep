# DevOps — Git Fundamentals

## 1. Overview

**Git** is a distributed version control system used to track source code changes and collaborate safely across teams.

- **Working Directory**: current local files
- **Staging Area**: temporary area before commit
- **Commit**: saved snapshot in repository history

---

## 2. Core Commands

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

## 3. Branching and Integration

### 3.1 Branch lifecycle

```bash
git branch feature/auth
git checkout feature/auth
# or git switch -c feature/auth
```

### 3.2 Merge vs Rebase

| Strategy | Pros | Cons | Best use |
|---|---|---|---|
| **merge** | Keeps full history, safe on shared branches | Adds merge commits | Integrating long-lived/public branches |
| **rebase** | Linear and clean history | Rewrites history | Updating local feature branch before PR |

```bash
# Rebase feature branch onto main
git checkout feature/auth
git fetch origin
git rebase origin/main
```

```bash
# Merge feature into main
git checkout main
git merge feature/auth
```

### 3.3 Squash merge

Combine many small commits into one meaningful commit before merge.

---

## 4. Conflict Resolution

### 4.1 Conflict during merge/rebase/pull

```bash
git status
# edit conflicted files manually
git add <fixed-file>
git rebase --continue   # or git merge --continue
```

### 4.2 Conflict during cherry-pick

```bash
git cherry-pick <commit-hash>
# resolve conflicts
git add <fixed-file>
git cherry-pick --continue
```

### 4.3 Pull with uncommitted local changes

```bash
git stash
git pull --rebase
git stash pop
```

---

## 5. Advanced Day-to-day Commands

### 5.1 Stash

```bash
git stash
git stash list
git stash apply
git stash pop
```

### 5.2 Cherry-pick

Copy one specific commit from one branch to another.

```bash
git cherry-pick <commit-hash>
```

### 5.3 Revert pushed commit

```bash
git log --oneline
git revert <commit-hash>
git push origin <branch>
```

### 5.4 Reset local commit

```bash
git reset --soft HEAD~1   # keep changes staged
git reset --hard HEAD~1   # discard local changes
```

> Use `--hard` carefully. Avoid on shared work.

---

## 6. Git Best Practices

- Write clear commit messages (what + why)
- Keep **atomic commits** (one logical change per commit)
- Pull/rebase frequently to reduce conflict scope
- Use `.gitignore` for logs, generated files, binaries
- Never commit secrets (use `.env`, secret manager, vault)
- Prefer `git revert` over force rewrite on shared branches
- Use `--force-with-lease` only when absolutely necessary and coordinated

---

## 7. Interview Questions

**Q: When should you use `merge` and when `rebase`?**

> Use `rebase` to keep local feature history clean before opening a PR. Use `merge` when integrating shared/public branches to preserve collaboration history safely.

**Q: How do you safely undo a commit that is already pushed?**

> Use `git revert <hash>` to create a new commit that reverses the previous change. Avoid `reset --hard` + force push on shared branches.

**Q: What is the purpose of the staging area?**

> The staging area lets you select exactly which changes go into the next commit, helping build clean and atomic commit history.

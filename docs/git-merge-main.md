# Merge Main into Current Branch

## Quick Commands

```bash
# Fetch latest changes from origin
git fetch origin

# Merge main into your current branch
git merge origin/main
```

## Alternative: Rebase (cleaner history)

```bash
# Fetch latest changes
git fetch origin

# Rebase your branch on top of main
git rebase origin/main
```

## If You Have Uncommitted Changes

```bash
# Stash your changes first
git stash

# Fetch and merge
git fetch origin
git merge origin/main

# Apply your stashed changes back
git stash pop
```

## Resolving Conflicts

After merge/rebase, if there are conflicts:

```bash
# See which files have conflicts
git status

# After resolving conflicts in your editor, mark as resolved
git add <file>

# Continue the merge
git commit

# Or if rebasing
git rebase --continue
```

## Abort if Things Go Wrong

```bash
# Abort a merge
git merge --abort

# Abort a rebase
git rebase --abort
```

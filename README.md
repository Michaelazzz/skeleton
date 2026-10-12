# skeleton

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.8. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Git Workflow Guide

We are following a clean, single-branch history workflow to keep the main branch linear and easy to follow. Each contributor should adhere to the following steps to maintain consistency:

1. Creating a New Feature Branch
   • Always start new work by creating a feature branch from main.
   • Use a descriptive name for the branch, such as feature/feature-name or bugfix/issue-name.

```bash
git checkout main
git pull origin main
git checkout -b feature/feature-name
```

2. Working on the Feature Branch
   • Commit changes to your feature branch as you make progress.
   • Aim for clear, concise commit messages.

3. Syncing with Main (Rebase)
   • Before finalizing your feature, ensure your branch is up-to-date with main.
   • Rebase your feature branch onto the latest main branch to integrate any new changes.

```bash
git fetch origin
git rebase origin/main
```

4. Merging the Feature Branch (Fast-Forward)
   • Once the feature is complete and rebased onto main, switch to main and fast-forward merge your feature branch.

```bash
git checkout main
git merge --ff-only feature/feature-name
```

5. Pushing to the Remote Repository
   • Push the updated main branch to the remote repository to share your work.

```bash
git push origin main
```

6. Deleting the Feature Branch
   • After merging, delete your feature branch locally and on the remote to keep the repository clean.

```bash
git branch -d feature/feature-name
git push origin --delete feature/feature-name
```# skeleton

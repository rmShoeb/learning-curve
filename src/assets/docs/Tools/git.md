# Git

# Configuration
- Repository-specific settings: use the option `--local`. Configuration for this case is saved at `/.git/config` of the repo.
- User-specific settings: use the option `--global`. Configuration for this case is saved at `~/.gitconfig`, in windows `C:\Users\\.gitconfig`.
- System-wide settings (for all users on the system): use the option `--system`. Configuration for this case is saved at `$(prefix)/etc/gitconfig`, in windows `C:\ProgramData\Git\config`.
- If no option is set, `--local` is used by default. The order of priority for configuration levels is: `local`, `global`, `system`.

```bash
git config --local user.email <email>
git config --global user.name <name>
git config --global alias.<alias-name> <git-command> # Create a shortcut for a Git command

# for example
git config --global alias.ci commit # creates a ci command that can be executed as a shortcut to git commit
git config --system core.editor <editor>
git config --global --edit # Open the global configuration file in a text editor for manual editing
git config --global merge.tool kdiff3 # to use third-party merge tool for merge-conflict
```


# Setting up a repository

## Initializing a new repository

```bash
git init # create empty git repo
git init <directory> # Create an empty Git repository in the specified directory
git init --bare <directory> # Initialize an empty Git repository, but omit the working directory
git init <directory> --template=<template_directory>
```

## Cloning an existing repository

```bash
git clone <repo url>
git clone <repo> <directory> # Cloning to a specific folder
git clone --branch <tag> <repo> # Cloning a specific tag
git clone -depth=1 <repo> # Shallow clone
```

## Repo-to-repo collaboration

```bash
git remote add <remote_name> <remote_repo_url> # add a remote repo to an existing repo with <remote_name> tag
git push -u <remote_name> <local_branch_name> # push <local_branch_name> into <remote_name>
```

# Inspecting Repository

```bash
git status # displays the state of the working directory and the staging area
git tag # capture a point in history that is used for a marked version release
git blame <file> # display author metadata attached to specific committed lines in the file
```
## Options for blame:
- `-L` # restrict the output to the requested line range
- `-e` # shows the authors email address instead of username
- `-w` # ignores whitespace changes
- `-M` # detects moved or copied lines within in the same file
- `-C` # detects lines that were moved or copied from other files

## Display Logs

```bash
git log # displays committed snapshots
git log --branches=* # all commits across all branches
git log -n <limit> # Limit the number of commits
git log --oneline # Condense each commit to a single line
git log --stat # include which files were altered and the relative number of lines that were added or deleted from each of them
git log -p # display the patch representing each commit
git log --author="<pattern>" # search for commits by a particular author
git log --grep="<pattern>" # search for commits with a commit message that matches the pattern
git log <since>..<until> # Show only commits that occur between <since> and <until>
git log <file> # Only display commits that include the specified file
git log --graph --decorate --oneline
```


# Saving changes

## Staging Changes

```bash
git add <filename> # stage a file
git add <directory> # stage all files in the directory
git add -p # Begin an interactive staging session that lets you choose portions of a file to add to the next commit
git add . # stage all changes
```

## Committing Changes

```bash
git commit -m "message" # save the changes with an appropriate message
```

## Comparing Changes
Diffing is a function that takes two input data sets and outputs the changes between them.

```bash
git diff # lists the changes made after the last commit across the entire repository
git diff --color-words # highlight changes with colors
git diff HEAD ./path/to/file # changes made to a specific file, checked against HEAD by default
git diff --cached ./path/to/file # diff will compare the staged changes with the local repository
git diff <id1> <id2> # changes between two commits
git diff branch1..other-feature-branch # changes between two branches
git diff main new_branch <file> # compare changes in file between two branches
```

## Shelve Changes
- It takes your uncommitted changes (both staged and unstaged), saves them away for later use, and then reverts them from your working copy.
- By default, stashes are identified simply as a ”WIP” – work in progress.
- By default, Git doesn’t stash changes made to untracked or ignored files.

### Saving Stash

```bash
git stash
git stash save "message" # a meaningful comment about what the stash is about
git stash -u # also stash the untracked changes
# or
git stash --include-untracked
git stash -a # stash all changes (inluding untracked and ignored)
# or
git stash -all
```

### Removing Stash

```bash
git stash pop # to apply the stashed changes, remove the stash
# by default, it applies the most recent stash↪→
git stash pop stash@{2} # apply a specific stash from list
git stash apply # apply the stashed changes to the current branch, keeping the stash
```

### Partial Stash

```bash
git stash -p # or, --patch, iterate through each changed "hunk" in your working copy and ask whether you wish to stash it
```

### Others

```bash
git stash list # lists the stashes
git stash show # view summary of a stash
git stash show -p # or, --patch, to view the full diff of a stash
git stash branch add-stylesheet stash@{1} # create a new branch from the given stash, and pop it from list
git stash drop stash@{1} # delete the stash
git stash clear # delete all stashes
```

## Ignore Files
- Ignored files are tracked in a special file named `.gitignore` that is checked in at the root of your repository.
- There is no explicit git ignore command: instead the `.gitignore` file must be edited and committed by hand when you have new files that you wish to ignore.
- The convention, and simplest approach, is to define a single `.gitignore` file in the root.
- Add personal Git ignore rules into `.git/info/exclude` for a particular repo.
- Add global Git ignore rules

```bash
touch ~/.gitignore
git config --global core.excludesFile ~/.gitignore
```

- To ignore a previously committed file `git rm --cached debug.log`
- Committing an ignored file `git add -f debug.log`
- However a better solution is to define an exception to the general rule.
- To test why a file is being ignored

```bash
git check-ignore -v debug.log
```


# Undo Changes

```bash
git checkout <tag> # bring the tagged work into working stage
git ls-files -s # examine the staging index
```

## Clean
- These commands operate on untracked files.
- By default git clean does not operate recursively on directories, and requires to specify force clean.

```bash
git clean # undo changes to the working directory
git clean -f <path> # delete untracked files from given path
```

### Options:
- `-n` - shows which files are going to be removed without actually removing them
- `-f` - initiates the actual deletion of untracked files from the current directory
- `-d` - remove any untracked directories
- `-x` - force removal of ignored files
- `-i` - interactive mode

## Revert
- This is used for undoing changes to a repository’s commit history. A revert operation will take the specified commit, inverse the changes from that commit, and create a new ”revert commit”.
- The ref pointers are then updated to point at the new revert commit making it the tip of the branch.

```bash
git revert <tag> # creates a new commit with the commit previous to <tag>
```

### Options:
- `-e`, or `--edit` - default behavior
- `--no-edit` - revert without any message edits
- `-n`, or, `--no-commit` - adds it to working directory, without creating new commit

## Reset
- Do not use reset for public/published history, use revert instead.
- Use reset in local history only. Once a commit has been pushed, do not reset from it (can cause confusion among collaborators).

```bash
git reset
# is equivalent to
git reset --mixed HEAD
git reset <tag> # the commit history is reset to that specified commit, commits after this are removed
```

### Options:
- `--hard` - resets working tree, staging index, and commit history
- `--mixed` - default, resets staging index, and commit history
- `--soft` - resets commit history only

## Others

```bash
git reset <file> # Unstaging a file
git reset --hard HEAD~2 # remove two most-recent commits
```


# Rewriting history

## Changing the Last Commit
- Amending does not just alter the most recent commit, it replaces it entirely, meaning the amended commit will be a new entity with its own ref.
- Don’t amend public commits.

```bash
git commit --amend # Instead of creating a new commit, staged changes will be added to the previous commit
git commit --amend -m "message" --no-edit # flag allows the amend to commit without changing its commit message
```

## Rebase

```bash
git rebase <base> # applies commits available here to the <base>↪→
```

### Options:
- `-i` or, `--interactive`
- -`-onto` - rebase on branch from one tag to other

## Reference Logs
- The reflog only provides a safety net if changes have been committed to your local repository and it only tracks movements of the repositories branch tip.
- Additionally reflog entries have an expiration date.
- The default expiration time for reflog entries is 90 days.

```bash
git reflog
# which is equivalent to
git reflog show HEAD # show is passed by default
git reflog --all # get a complete reflog of all refs
git reflog --relative-date
git reflog expire # cleans up old or unreachable reflog entries
git reflog delete
```


# Collaboration

## Remote Connections

```bash
git remote # List the remote connections you have to other repositories
git remote add <name> <url>
git remote remove <name> # or, rm, removes the remote connection <name>
git remote rename <old-name> <new-name>
git remote get-url <name>
git remote show <name> # Outputs high-level information about the remote <name>
git remote prune <name> # Deletes any local branches for <name> that are not present on the remote repository
```

### Options:
- `-v` - include the URL of each connection
- `-f` - fetch immediately after the remote record is created

## Fetch
- It will download the remote content but not update your local repo’s working state, leaving your current work intact.

```bash
git fetch <remote> # Fetch all of the branches from the repository
git fetch <remote> <branch>
git fetch --all # fetch all registered remotes and their branches
git fetch --dry-run
```

## Pull
- It will download the remote content for the active local branch and immediately execute git merge to create a merge commit for the new remote content.
- This is the combination of fetch and merge.

```bash
git pull <remote>
    --no-commit # does not create a merge commit
    --rebase # uses git rebase instead of merge
git pull --verbose # Gives verbose output during a pull which displays the content being downloaded and the merge details
```

## Changing the Last Commit

```bash
git push <remote> <branch>
git push <remote> --force # force the push even if it results in a non-fast-forward merge, not recommended
git push <remote> --all # push all local branches
git push <remote> --tags # push all tags
```

- To push ammended commits, `--force` must be used.

### How changes should be pushed

```bash
git checkout main
git fetch origin main # fetch updates from remote
git rebase -i origin/main # make sure there are no problems with local content
# Squash commits, fix up commit messages etc.↪→
git push origin main
```


# Branching

```bash
git branch # list all branch names
# or
git branch --list
git branch -a # List all remote branches
git branch <branch> # create new branch
git branch -d <branch> # delete the specified branch, prevents operation if it has unmerged changes
git branch -D <branch> # force delete
git push origin --delete <branch> # delete branch from remote repo
# or
git push origin :<branch>
git branch -m <branch> # Rename the current branch to <branch>
```

## Checkout
- Operates upon three distinct entities: files, commits, and branches. Git tracks a history of checkout operations in the reflog.

```bash
git checkout <branch> # move to existing branch
git checkout -b <branch> # create a new branch and move to it
git checkout -b <new-branch> <existing-branch> # base the new branch on existing branch, instead of HEAD
git reset --hard origin/<branchname> # reset a local branch to the remote branche's last commit
```

## Merge
- The current branch will be updated to reflect the merge, but the target branch will be completely unaffected.
- Before starting merge operation,
    - Confirm the receiving branch (`git status`)
    - Fetch latest remote commits and update the local repo
    - Once there is no conflict, start merging
- **Fast Forward Merge:** If the main branch has remained same from the begining of creating the
branch.
- **3-way Merge:** If the main branch progressed after creation of branch.

```bash
git checkout main
git merge new-feature
git branch -d new-feature
git merge --no-ff <branch> # create a merge commit, even if it is fast-forward merge, for documentation
```

- Merge conflicts can occur only in the event of a 3-way merge.
- It’s not possible to have conflicting changes in a fast-forward merge.
- Conflicts only affect the developer conducting the merge, the rest of the team is unaware of the conflict. In case of a conflict,
    - Check status to which file/s have conflicts.
    - See modified file that has conflict to see where the conflict occurred.
    - The most direct way to resolve a merge conflict is to edit the conflicted file.
    - `git add` and `merge` to resolve conflict and new merge commit will be created.

```bash
git status # status of the conflict
git log --merge # produce a log with a list of commits that conflict between the merging branches
git diff # find differences between states of a repository/files
```

- `git merge --abort` will exit from the merge process and return the branch to the state before the merge began.
- `git reset` can be used during a merge conflict to reset conflicted files to a known good state.


# Resources
- [Git Tutorials and Training - Atlassian Git Tutorial](https://www.atlassian.com/git/tutorials)
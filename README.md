# birdperson
Understanding the web of emotions around a web of content

### Committing file changes
* `git status` Check which files have been changed
* `git add <filename>` Add a file to be staged
* `git commit -m "<message>"` Commit all staged files

### Seeing my commit history
* `git log`

### Interacting with the remote version `origin`
* `git pull` Retrieve from orig
* `git push` DO NOT DO THIS YET

* `git branch -D <branch_name>` Delete a local branch from your machine
* `git rebase master` Rebase the current branch to keep it up to date with master. To be done when a pull request is closed
* `git remote prune origin` Delete remote branches from your branch tree
* `git push origin --delete <branch_name>` Delete a remote branch from the central repo ENSURE NO ONE ELSE IS USING OR NEEDS IT

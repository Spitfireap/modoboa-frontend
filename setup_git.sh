#!/bin/sh

# Setup pre and post commit hooks

ln -s $PWD/tools/pre-commit-hook .git/hooks/pre-commit
ln -s $PWD/tools/post-commit-hook .git/hooks/post-commit

chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/post-commit

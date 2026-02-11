# Repository Protection Configuration

This directory contains files to help protect the hawaiipotato.github.io repository from unauthorized changes.

## Quick Start

**Want to prevent others from pushing to this repository?** 

👉 **[Read the Complete Protection Guide](./REPOSITORY_PROTECTION.md)**

## Files in This Directory

- **`CODEOWNERS`** - Designates repository ownership (requires your approval for changes)
- **`workflows/protection.yml`** - GitHub Action that validates and monitors repository changes
- **`REPOSITORY_PROTECTION.md`** - Complete guide on how to protect your repository

## Important

⚠️ **These files alone do NOT prevent unauthorized pushes.**

To fully protect your repository, you **must** configure GitHub repository settings:
1. Go to Repository Settings → Branches
2. Add branch protection rules for your main branch
3. Enable "Require pull request reviews"
4. Enable "Require review from Code Owners"
5. Restrict who can push to the branch

**See [REPOSITORY_PROTECTION.md](./REPOSITORY_PROTECTION.md) for detailed instructions.**

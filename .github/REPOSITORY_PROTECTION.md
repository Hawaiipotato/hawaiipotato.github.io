# Repository Protection Guide

This guide explains how to protect your personal website repository from unauthorized pushes.

## Overview

This repository contains configuration files and workflows to help protect your personal website from unauthorized changes. However, **the most effective protection comes from GitHub repository settings**, which must be configured through the GitHub web interface.

## What's Included

### 1. CODEOWNERS File (`.github/CODEOWNERS`)
- Designates @Hawaiipotato as the owner of all files
- Requires your approval for any changes
- Works with branch protection rules

### 2. Protection Workflow (`.github/workflows/protection.yml`)
- Automatically validates who is making changes
- Warns if someone other than the repository owner makes changes
- Checks for modifications to critical files

## How to Fully Protect Your Repository

To prevent others from pushing to your repository, you need to configure the following GitHub settings:

### Step 1: Manage Collaborator Access

1. Go to your repository on GitHub: `https://github.com/Hawaiipotato/hawaiipotato.github.io`
2. Click on **Settings** (top right)
3. Click on **Collaborators and teams** (left sidebar)
4. **Remove any collaborators** you don't trust
5. Don't add new collaborators unless necessary

### Step 2: Enable Branch Protection Rules

1. In **Settings**, click on **Branches** (left sidebar)
2. Click **Add branch protection rule**
3. Enter branch name pattern: `main` (or `master` depending on your default branch)
4. Enable the following options:
   - ✅ **Require a pull request before merging**
     - ✅ **Require approvals** (set to 1)
     - ✅ **Dismiss stale pull request approvals when new commits are pushed**
   - ✅ **Require status checks to pass before merging**
     - Search and select: `Validate Repository Changes` (after the workflow runs once)
   - ✅ **Require conversation resolution before merging**
   - ✅ **Require signed commits** (optional, but recommended for security)
   - ✅ **Require linear history** (optional, keeps history clean)
   - ✅ **Include administrators** (protects against accidental self-pushes)
   - ✅ **Restrict who can push to matching branches**
     - Add yourself (@Hawaiipotato) as the only allowed pusher
   - ❌ **Allow force pushes** - **DISABLE** this (uncheck)
   - ❌ **Allow deletions** - **DISABLE** this (uncheck)
5. Click **Create** or **Save changes**

### Step 3: Configure CODEOWNERS Protection

1. In **Settings**, go to **Branches**
2. In your branch protection rule, enable:
   - ✅ **Require review from Code Owners**
   
This ensures that any changes must be approved by you (as defined in the CODEOWNERS file).

### Step 4: Repository Visibility and Access

1. In **Settings** → **General**
2. Under **Danger Zone**, ensure your repository visibility is set appropriately:
   - **Public**: Anyone can see the code, but cannot push (good for personal websites)
   - **Private**: Only you and explicit collaborators can see and access

### Step 5: Enable Two-Factor Authentication (2FA)

1. Go to your GitHub account settings (top right → Settings)
2. Click on **Password and authentication**
3. Enable **Two-factor authentication**
4. This protects your account from unauthorized access

### Step 6: Use Deploy Keys Instead of Personal Access Tokens

If you need automated deployments (e.g., for GitHub Pages):
1. In **Settings** → **Deploy keys**
2. Add deploy keys with **read-only access** where possible
3. Avoid using personal access tokens with write permissions

## Quick Reference: Protection Checklist

- [ ] Remove untrusted collaborators
- [ ] Enable branch protection on `main` branch
- [ ] Require pull request reviews
- [ ] Require CODEOWNERS approval
- [ ] Enable status checks (protection workflow)
- [ ] Disable force pushes
- [ ] Disable branch deletions
- [ ] Restrict push access to yourself only
- [ ] Enable 2FA on your GitHub account
- [ ] Review repository access regularly

## Testing the Protection

After setting up branch protection:

1. Try pushing directly to `main`:
   ```bash
   git add .
   git commit -m "Test commit"
   git push origin main
   ```
   This should be **rejected** if branch protection is working.

2. The correct workflow is:
   ```bash
   git checkout -b my-changes
   git add .
   git commit -m "My changes"
   git push origin my-changes
   # Then create a Pull Request on GitHub and approve it yourself
   ```

## Additional Security Measures

### Monitor Repository Activity
- Regularly check the **Insights** → **Pulse** to see recent activity
- Review the **Settings** → **Collaborators** to ensure no unexpected access

### Audit Logs
- For organization repositories, check audit logs regularly
- Look for unexpected access or permission changes

### Signed Commits
Configure GPG signing for additional verification:
```bash
git config --global commit.gpgsign true
```

## Troubleshooting

### "I can't push to my own repository"
- Check if you included administrators in branch protection
- Temporarily disable branch protection or create a PR instead

### "The protection workflow isn't running"
- Ensure the workflow file is on your default branch (`main` or `master`)
- Check **Actions** tab to see if workflows are enabled

### "Someone can still push to my repository"
- Verify they're not listed as a collaborator
- Check that branch protection rules are enabled
- Ensure the rules apply to the correct branch name

## Important Notes

⚠️ **Branch protection rules are the PRIMARY defense mechanism**. The CODEOWNERS file and GitHub Actions workflow provide additional layers but cannot prevent direct pushes without branch protection enabled.

⚠️ **Repository settings must be configured through GitHub's web interface**. These cannot be controlled through code files alone.

⚠️ **For GitHub Pages repositories**, ensure that the GitHub Pages deployment source is set correctly and doesn't allow unauthorized updates.

## Summary

To effectively protect your repository:
1. **Remove untrusted collaborators**
2. **Enable strict branch protection rules** 
3. **Require your approval for all changes**
4. **Monitor your repository regularly**

The files in `.github/` provide automation and warnings, but the real security comes from GitHub's repository settings.

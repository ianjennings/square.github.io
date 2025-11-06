# TestDriver Setup - Square Open Source Portal - Jekyll Static Site Testing

## App Type: web

Test the Square open source portal static site including navigation, repository listings, category filtering, image loading, and responsive design across different viewports

## 📖 Reference Example
https://github.com/testdriverai/cli/tree/main/testdriver/examples/web

## 🚀 Setup Instructions

# TestDriver Setup for Square Open Source Portal

## Overview
This Jekyll static site requires a build step before testing. We'll create two GitHub Actions workflows that run in sequence:

1. **Build and Deploy Workflow** - Builds the Jekyll site and deploys to GitHub Pages
2. **TestDriver Workflow** - Runs tests against the deployed site
3. **Generate Tests Workflow** - Auto-generates new exploratory tests

## Step 1: Create Build and Deploy Workflow

Create `.github/workflows/build-and-deploy.yml` with the provided YAML. This workflow:
- Triggers on pull requests, pushes to main/master, and manual dispatch
- Installs Ruby and Jekyll dependencies
- Builds the Jekyll site
- Deploys to GitHub Pages
- Outputs the GitHub Pages URL for TestDriver to use

## Step 2: Create TestDriver Workflow

Create `.github/workflows/testdriver.yml` with the provided YAML. This workflow:
- Uses `workflow_run` trigger to run AFTER "Build and Deploy" completes successfully
- Only runs if the build workflow succeeded
- Retrieves the GitHub Pages URL
- Sets TD_WEBSITE environment variable with the deployment URL
- Runs TestDriver tests against the deployed site
- Uploads test results as artifacts

## Step 3: Create Generate Tests Workflow

Create `.github/workflows/generate-tests.yml` with the provided YAML. This workflow:
- Uses `workflow_run` trigger to run AFTER "Build and Deploy" completes
- Generates 5 exploratory tests for the web application
- Automatically commits generated tests back to the branch
- Can be manually triggered with custom parameters

## Step 4: Create TestDriver Lifecycle Files

Create `testdriver/lifecycle/provision.yaml` with the provided YAML. This file:
- Launches Chrome browser with the deployed site URL from TD_WEBSITE
- Waits for the page to load
- Does NOT build the Jekyll site (already built by GitHub Actions)

## Step 5: Set Up GitHub Secrets

1. Go to your repository Settings → Secrets and variables → Actions
2. Add `TD_API_KEY` secret with your TestDriver API key from https://app.testdriver.ai

## Step 6: Enable GitHub Pages

1. Go to Settings → Pages
2. Set Source to "GitHub Actions"
3. The site will be available at: https://ianjennings.github.io/square.github.io

## Workflow Execution Order

```
Push/PR → Build and Deploy (builds Jekyll, deploys to Pages)
            ↓ (on completion)
          TestDriver Tests (tests deployed site)
            ↓ (on completion)
          Generate Tests (creates new exploratory tests)
```

## Environment Variables

- `TD_API_KEY`: Your TestDriver API key (set in GitHub Secrets)
- `TD_WEBSITE`: The deployed site URL (set automatically from build workflow output)

## Generating Tests

Run the command manually to generate exploratory tests:
```bash
npx testdriverai@latest generate web 5
```

Or trigger the "Generate TestDriver Tests" workflow from GitHub Actions UI.

## Running Tests

Tests run automatically on every push/PR after the build completes. To run manually:
```bash
export TD_WEBSITE="https://ianjennings.github.io/square.github.io"
npx testdriverai@latest run testdriver/generate/*.yaml
```

## Rationale

This Jekyll static site requires a build workflow because:

1. **Jekyll Build Requirement**: The site uses Jekyll (indicated by `_config.yml`, `Gemfile`, and `bundle exec jekyll serve` in README), which must compile Markdown and templates into static HTML before deployment.

2. **Build-Test Separation**: Following TestDriver best practices, the build process is handled by GitHub Actions BEFORE TestDriver runs. The lifecycle files only launch the browser and navigate to the pre-built site.

3. **GitHub Pages Deployment**: The site deploys to GitHub Pages, providing a stable URL for testing. The build workflow outputs this URL, which is consumed by the TestDriver workflow via the TD_WEBSITE environment variable.

4. **Workflow Chaining**: Using `workflow_run` trigger ensures proper execution order:
   - Build and Deploy runs first (builds Jekyll, deploys to Pages)
   - TestDriver Tests runs after build succeeds (tests the deployed site)
   - Generate Tests runs after build succeeds (creates new exploratory tests)

5. **Test Focus Areas**: The portal displays repository listings with categories, images, and filtering. Tests should verify:
   - Repository cards load and display correctly
   - Category filtering works
   - Images load from `repo_images/` directory
   - Links to GitHub repos are functional
   - Responsive design works across viewports
   - Navigation and merchant-style directory theme displays properly

6. **No Build in Lifecycle Files**: The `provision.yaml` only launches Chrome with the TD_WEBSITE URL - no Jekyll building, no server starting. The app is already deployed and ready to test.

7. **Auto-Generated Tests**: The Generate workflow automatically creates exploratory tests after each successful build and commits them back to the repository, building up a test suite over time.

This approach ensures clean separation of concerns: GitHub Actions handles building and deployment, TestDriver handles testing the deployed application.

---
Generated by [Mechanic](https://github.com/testdriverai/mechanic) 🤖

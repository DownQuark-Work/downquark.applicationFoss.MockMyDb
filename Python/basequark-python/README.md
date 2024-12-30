# basequark-python

[![Release](https://img.shields.io/github/v/release/dq-mlnck/basequark-python)](https://img.shields.io/github/v/release/dq-mlnck/basequark-python)
[![Build status](https://img.shields.io/github/actions/workflow/status/dq-mlnck/basequark-python/main.yml?branch=main)](https://github.com/dq-mlnck/basequark-python/actions/workflows/main.yml?query=branch%3Amain)
[![codecov](https://codecov.io/gh/dq-mlnck/basequark-python/branch/main/graph/badge.svg)](https://codecov.io/gh/dq-mlnck/basequark-python)
[![Commit activity](https://img.shields.io/github/commit-activity/m/dq-mlnck/basequark-python)](https://img.shields.io/github/commit-activity/m/dq-mlnck/basequark-python)
[![License](https://img.shields.io/github/license/dq-mlnck/basequark-python)](https://img.shields.io/github/license/dq-mlnck/basequark-python)

Python Application Boilerplate Template

- **Github repository**: <https://github.com/dq-mlnck/basequark-python/>
- **Documentation** <https://dq-mlnck.github.io/basequark-python/>

## Getting started with your project

First, create a repository on GitHub with the same name as this project, and then run the following commands:

```bash
git init -b main
git add .
git commit -m "init commit"
git remote add origin git@github.com:dq-mlnck/basequark-python.git
git push -u origin main
```

Finally, install the environment and the pre-commit hooks with

```bash
make install
```

You are now ready to start development on your project!
The CI/CD pipeline will be triggered when you open a pull request, merge to main, or when you create a new release.

To finalize the set-up for publishing to PyPI or Artifactory, see [here](https://fpgmaas.github.io/cookiecutter-poetry/features/publishing/#set-up-for-pypi).
For activating the automatic documentation with MkDocs, see [here](https://fpgmaas.github.io/cookiecutter-poetry/features/mkdocs/#enabling-the-documentation-on-github).
To enable the code coverage reports, see [here](https://fpgmaas.github.io/cookiecutter-poetry/features/codecov/).

---

To run the initial application use the following command.

```bash
 make run
```

#!/bin/bash

###
# USAGE:
# # ./twelvefactor-app.sh manage build [heroku]
# argument defaults to DEV which is a no-op
# # # NOTE: This script is being called by `github-workflows` when merged into `dev` or `main`


###
# ABOUT:
# using a combination of these manager scripts
# and workflow configurations that utilize
# github's `context` information we can greatly
# extend the ease of deployments.
####
# e.g ~ with a single workflow all of the following will
# simultaneously be possible and updatable without having
# to touch any line of code.
# - push to dev, build to heroku staging
# - push to main, build to heroku production
# > while out of scope for the current project, the
# > functionality could also be extended to handle
# - phased rollouts
# - feature flags
#  - etc

heroku() {
  echo "eroku"
    if [ "$1" = "teardown" ]; then
        echo "HEROKU teardown"
        rm package.json pnpm-lock.yaml
        exit 0
    fi

    echo "Creating Required Assets for HEROKU Build "
    cp dependencies/pnpm-lock.yaml pnpm-lock.yaml
cat << eof > package.json
{
  "scripts": {
    "heroku-prebuild": "npm install -g pnpm && pnpm install vite typescript && ./twelvefactor-app.sh install",
    "heroku-postbuild": "./twelvefactor-app.sh manage dotfile make_keys ACCELERATOR",
    "heroku-cleanup": "",
    "start": "./twelvefactor-app.sh run"
  }
}
eof
}

dev() {
  echo "called!123"
  # Currently there is no production build.
  # the `dev` funciton allows us to make any
  # conditional changes when the time comes
  # without having to adjust anything on the
  # workflow yml
  heroku
}

# no-op is a valid command here
if declare -f "$1" > /dev/null
    then "$@"
fi

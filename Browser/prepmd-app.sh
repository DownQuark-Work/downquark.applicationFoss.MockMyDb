#!/bin/bash

###
# USAGE: see output located near EOF
###

is_installed() {
    echo "determining required software is installed: '$1'"
    required_asset_is_available=`which $1`
    if [ ! -e "$required_asset_is_available" ]; then
        echo "required asset is not available: $1"
        echo " - attempt installation from homebrew: \`brew search $1\`"
        exit 1
    fi
}

# call managers from root directory
manage() {
    manage_service_worker_cache() {
        is_installed node
        typescript
        # scalable - currently only require one path
        config_file_path_stoplight='./project/public/cache-config/configuration.api.stoplight.json'
        node ./managers/sw-update-cache.js $config_file_path_stoplight
        clean
    }

    case $1 in
        'analyze'|'stat') bash ./managers/analyze-components.sh $2 ;;
        'cache'|'sw') manage_service_worker_cache ;;
        'deploy') bash ./managers/configure-deployment.sh $2 $3 ;;
        'dotfile') bash ./managers/configure-dotfiles.sh $2 $3 ;;
        *) echo "Error: Invalid manager command. Use 'analyze', 'deploy', 'dotfile', or 'cache'"; exit 1 ;;
    esac
}

remove_dependencies() {
    echo "removing previous node_modules and lockfile"
    (cd dependencies; rm -rf node_modules pnpm-lock.yaml)
    (cd project; rm -rf node_modules package.json dist tsc)
}
install_dependencies() {
    is_installed pnpm

    echo "installing dependencies: $1"
    if [ "$1" = "clean" ]; then
        remove_dependencies
    fi
    (cd dependencies; pnpm i)
}

typescript() {
    is_installed tsc

    echo "bundling typescript"
    (cd config; tsc $1)
    # (cd config; pnpx @dotenvx/dotenvx run -- tsc $1)
}

prettier() {
    is_installed pnpx

    if [ "$1" = "w" ]; then # shorthand
        pnpx prettier . --config config/.prettierrc --ignore-path config/.prettierignore --write
    else
        pnpx prettier . --config config/.prettierrc --ignore-path config/.prettierignore $1
    fi
}

dir_12_factor_dependencies="dependencies/node_modules"
dir_project_build_dependencies="project/node_modules"
dir_project_build_dist="project/dist"
dir_project_typescript_transpile="project/tsc"
file_12_factor_packagejson="dependencies/package.json"
file_project_build_packagejson="project/package.json"

remove_previous_distribution() {
    echo "removing old package"
    rm -rf  "../$dir_project_build_dist"

}

configure_project_for_run() {
    # this allows 12 factor separation/encapsulation
    # while enabling `vite`'s default internals to work correctly
    echo "creating temporary directory structures"
    cd project # actual `cd` to be in correct location for upcoming run command
    ln -s "../$dir_12_factor_dependencies"
    ln -s "../$file_12_factor_packagejson"
    echo "creating new typescript sources"
    (cd ..; typescript)
    echo "adding static assets"
    cp -a src/lit/assets/ tsc/lit/assets/
}
remove_processed_configuration() {
    echo "removing processed configurations"
    rm -rf "../$dir_project_build_dependencies" "../$file_project_build_packagejson" "../$dir_project_typescript_transpile"
}

run() {
    if [ -d $dir_project_build_dependencies ]; then
        # sanity: should never be called
        remove_processed_configuration
    fi

    if [ ! -d $dir_12_factor_dependencies ]; then
        echo "node_modules are required - attempting to add them now"
        install_dependencies
    fi

   echo "updating project configuration for each 'run' command"
   configure_project_for_run


    # trap used to clean project dir when `preview` or `dev` is cancelled
    trap 'remove_processed_configuration' INT

    case $1 in
    'build'|'b')
        remove_previous_distribution # make a clean build
        echo "building new package"
        pnpm vite build
        remove_processed_configuration # clean project directory after build
    ;;
    'preview'|'p')
        if [ ! -d "../$dir_project_build_dist" ]; then
            echo "distribution package is required for preview - attempting to create it now"
            pnpm vite build
        fi
        echo "previewing built package"
        pnpm vite preview
    ;;
    *)
        echo "running in development mode"
        PORT=${PORT:-5173} # Use Heroku's $PORT or default to 5173
        # the line below has `verbose` & `debug` enabled
        #  pnpx @dotenvx/dotenvx run --env LOAD_ADDITIONAL='../config/dotfiles/.env.development' -f '../config/dotfiles/.env' --debug --verbose -- pnpm vite --port $PORT --host 0.0.0.0
         pnpx @dotenvx/dotenvx run --env LOAD_ADDITIONAL='../config/dotfiles/.env.development' -f '../config/dotfiles/.env' -- pnpm vite --port $PORT --host 0.0.0.0
    ;;
    esac
}


# run assertions
assert() {
    is_installed node
    is_installed pnpx

    install_dependencies()

    ######################################################
    # playwright CLI Options
    ######################################################
    # --project: selects the browser (Chromium or Firefox)
    # --headed: toggles headless mode
    # --timeout: sets the maximum timeout for each test
    # --grep: filters tests by regular expression
    # --trace: enables detailed tracing in tests
    ######################################################

    case $1 in
        'e2e'|'playwright') echo "running end to end tests"; pnpx playwright test $@;;
        'tap'|'unit') echo "running unit tests"; pnpx tap $@;;
        *) echo "Error: Invalid test type. Use 'unit' or 'e2e'"; exit 1 ;;
    esac
}

# shortcuts
clean() { remove_dependencies
}
e2e() { assert e2e $@
}
init() { install_dependencies clean
}
install() { install_dependencies
}
playwright() { assert e2e $@
}
tap() { assert unit $@
}
ts() { typescript $1
}
unit() { assert unit $@
}


print_usage_options() {

cat <<eof

###
# USAGE:
# ./twelvefactor-app.sh analyze [path/from/src/directory] (./twelvefactor-app.sh analyze ui)
#    > runs analyze task to help debug lit errors
#
# ./twelvefactor-app.sh clean
#    > removes symlinks, node_modules, and .lock files
#
# ./twelvefactor-app.sh init
#    > clean and re-install all package.json depndencies
#
# ./twelvefactor-app.sh install
#    > install and/or update new package.json dependencies
#
# ./twelvefactor-app.sh run [b|build] [p|preview]
#    > transpiles typescript to javascript and then runs the equivalent vite command
#        > vite [dev]
#        > vite build
#        > bite preview
#    > failsafes exist to prevent errors from running commands
#        if the required dependencies do not exist
#
# ./twelvefactor-app.sh typescript [--watch] [any other typescript cli option]
#    > transpiles typescript to javascript. Uses values from /config/tsconfig.json
#
# ./twelvefactor-app.sh assert [tap|unit] [e2e|playwright]
#    > runs unit or end to end test suite
#
###

eof

printf "::> Quick Select Options:\n"
printf "::> (^ full descriptions above ^)\n\n"
select quick_select in "clean" "dev" "build" "preview" "unit" "e2e" "analyze"; do
    case $quick_select in
        clean ) clean; break ;;
        dev ) run; break ;;
        build ) run b; break ;;
        preview ) run p; break ;;
        unit ) assert unit; break ;;
        e2e ) assert e2e; break ;;
        analyze ) analyze; break ;;
    esac
done

}

# required files
if ! [ -e "config/dotfiles/.env.keys" ]; then
    echo "Creating Environment Variable Encryption Keys"
    manage dotfile make_keys ACCELERATOR
fi

if declare -f "$1" > /dev/null
then
    "$@"
else
    print_usage_options
    exit 1
fi

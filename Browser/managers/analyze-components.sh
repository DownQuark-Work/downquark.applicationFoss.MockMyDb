#!/bin/bash

###
# USAGE:
# # ./twelvefactor-app.sh manage analyze|stat

is_installed() {
    echo "determining required software is installed: '$1'"
    required_asset_is_available=`which $1`
    if [ ! -e "$required_asset_is_available" ]; then
        echo "required asset is not available: $1"
        exit 1
    fi
}

is_installed pnpx

path_to_analyze="project/src/$1"
echo "analyzing:  $path_to_analyze"
pnpx web-component-analyzer $path_to_analyze

sleep 1

printf "Proceed to the next analysis?"
echo ""
select yn in "Yes" "No"; do
    case $yn in
        No ) echo "Aborted."; break ;;
        Yes ) echo "Proceeding..."; pnpx lit-analyzer project/src $path_to_analyze; break ;;
    esac
done

#!/usr/bin/env sh

set -e

DIM='\033[1;30m'
NC='\033[0m'

# We remove the -z and xargs here to make the string expansion 
# easier to handle in a simple shell script.
get_staged_files() {
    git diff --staged --name-only --diff-filter ACMR -- "$@"
}

usage() {
    echo "lint-staged.sh - run linters against Git staged files"
    echo ""
    echo "${DIM}Usage:${NC}   lint-staged.sh \"<command>\" \"<glob>\" [\"<glob>\"]..."
    echo "${DIM}Example:${NC} lint-staged.sh \"echo staged files:\" \"*\""
}

lint_staged() {
    if [ $# -lt 2 ]; then
        usage
        exit 2
    fi

    local cmd="$1"
    shift 

    # Get the files as a space-separated list
    local files=$(get_staged_files "$@")

    if [ -n "$files" ]; then
        # We use 'eval' carefully here. 
        # This allows the shell to split the $files variable into multiple arguments.
        echo "${DIM}${cmd} [staged files]${NC}"
        eval "$cmd $files"
    else
        echo "${DIM}No staged files matching patterns. Skipping.${NC}"
    fi

    exit 0
}

lint_staged "$@"
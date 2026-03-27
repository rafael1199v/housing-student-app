#!/usr/bin/env sh

set -e

DIM=''
NC=''

get_staged_files() {
    # Get the prefix (e.g., "frontend/")
    prefix=$(git rev-parse --show-prefix)
    # Get staged files and remove the prefix from the path
    git diff --staged --name-only --diff-filter ACMR -- "$@" | sed "s|^$prefix||"
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

    cmd="$1"
    shift

    staged_files=$(get_staged_files "$@")

    set --
    has_files=0
    while IFS= read -r file; do
        [ -n "$file" ] || continue
        set -- "$@" "$file"
        has_files=1
    done <<EOF
${staged_files}
EOF

    if [ "$has_files" -eq 1 ]; then
        echo "${DIM}${cmd} [staged files]${NC}"
        sh -c "$cmd \"\$@\"" sh "$@"
    else
        echo "${DIM}No staged files matching patterns. Skipping.${NC}"
    fi

    exit 0
}

lint_staged "$@"
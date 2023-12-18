#!/bin/bash

## This script generates links to specified files in the Teams AI github repo.

# Replace 'YOUR_GITHUB_TOKEN' with your actual GitHub token
GITHUB_TOKEN="<GITHUB_TOKEN>"
REPO="microsoft/teams-ai"
BASE_URL="https://api.github.com/repos/$REPO/contents/js/packages/teams-ai/src"
CONTENT_BASE_URL="https://raw.githubusercontent.com/$REPO/main"

# Function to recursively list files
list_files() {
    local url="$1"

    # Get the list of files and directories from the GitHub API
    local items=$(curl -s -H "Authorization: token $GITHUB_TOKEN" "$url" | jq -r '.[] | .path, .type')

    # Iterate over the items
    while read -r path; do
        read -r type

        # Trim leading and trailing whitespace
        type="${type#"${type%%[![:space:]]*}"}"
        type="${type%"${type##*[![:space:]]}"}"
        path="${path#"${path%%[![:space:]]*}"}"
        path="${path%"${path##*[![:space:]]}"}"

        # If the item is a file, output its name
        if [[ "$type" = "file" ]]; then
            if [[ "$path" == *spec.ts || "$path" == *index.ts ]]; then
                continue
            fi



            echo "$CONTENT_BASE_URL/$path"
        # If the item is a directory, recursively list its files
        elif [[ "$type" = "dir" ]]; then
            list_files "https://api.github.com/repos/$REPO/contents/$path"
        else
            echo "Unknown type: $type"
        fi
    done <<< "$items"
}

# Output the list of files
list_files "$BASE_URL"
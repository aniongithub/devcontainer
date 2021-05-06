#!/bin/bash

quote() {
    [[ $# != 0 ]] && printf '%q ' "$@" | sed 's/.$//'
}


rsshfs() {
    if [[ $# -lt 2 ]]
    then
        printf "Error: missing arguments\n" >&2
        printf "Usage:\n" >&2
        printf "  $0 <localpath> <remotehost>:<remotepath> [-o ro]\n" >&2
        printf "  $0 -u <remotehost>:<remotepath>\n" >&2
        exit 1;
    fi

    lpath="$1"
    IFS=: read rhost rpath <<< "$2"
    qrpath="$(quote "$rpath")"

    if [[ "-u" = "$lpath" ]]
    then
        printf "Unmounting '$rhost:$rpath'...\n"
        docker-machine ssh "$rhost" fusermount -u "$qrpath"
    else
        qlpath=$(quote "$lpath")
        shift 2 
        qall=$(quote "$@")

        printf "Mounting '$lpath' on '$rhost:$rpath'...\n"
        fifo=/tmp/rsshfs-$$
        rm -f "$fifo"
        mkfifo -m600 "$fifo" &&
        < "$fifo" /usr/lib/openssh/sftp-server |
        docker-machine ssh "$rhost" sshfs -o reconnect -o slave -o allow_other -o nonempty ":$qlpath" "$qrpath" "$qall" > "$fifo"
        rm "$fifo"
    fi
}
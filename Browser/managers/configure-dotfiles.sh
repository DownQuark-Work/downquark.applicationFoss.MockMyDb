#!/bin/bash

###
# USAGE:
# # ./twelvefactor-app.sh manage [decrypt|encrypt] [make_keys <PASSWORD>]

ENV_KEYS_FILE='config/dotfiles/.env.keys'

decrypt() {
    # TODO: add githook to fail if unencrypted values are being pushed
    echo "decrypting dotfiles"
    pnpx @dotenvx/dotenvx decrypt -f config/dotfiles/.env*  $1
}

encrypt() {
    TMP_KEY_FILE='config/dotfiles/tmpkeyfile'
    echo "encrypting dotfiles"
    mv $ENV_KEYS_FILE $TMP_KEY_FILE
    pnpx @dotenvx/dotenvx encrypt -f config/dotfiles/.env* $1
    mv $TMP_KEY_FILE $ENV_KEYS_FILE
}

encrypted_key_file='U2FsdGVkX19INNydYXuoSuLsQzdv2HQl61pMSFVsw0YSWwdr6GalZDvpr5IX5d7a
gOdhm1I0SH9kchbneDcKHaQSAbyb5LtaFoJchP+VNzNk3UGa4uhTA3KeLF1t/1oG
VajfMl/nyDWa+9q/Wzz1RFXRf/m762mV1Q7GdOzpxQHMv2lGscP8RtIrcZ+stRQN
wdlod2+8JOYhIpJW4ILy5Ctd+hFwRJYm2UvNxht5ivYiJgvX/lxzgftmvAZbhIir
dOgVpV2Km75quQirmZDNbb7w1lxwhPSawQtVSba+eaHGE/4B2E0XRe+YRgz2e9fC
pzFH4BCvMJqQ5BID0vHBORkqXzogO9zprcI3laf89f5UuspqtKe6JU86M2a6U/BL
09iUt+Pa+bWWtyza+gkB4ynXXPumQ1vhTyGy0DZUUWJIRjufyDFrxaMO+rBsj1kH
4QFPPremboS4npstn8zz2gihNgMXPV+dW+pkXbTZUu7ptvZ3pJZgzcaREwFenkzr
WRnhLJeDR3EDGu9CgAnKG92njoURhk7cVLkMv/ufbLVlpnG+KADgCXsnyPZ5Ft3C
ErIeOcENifTl7k5dSrbbp7Nji9StiKVf/ZjejLdGGx63U+0qiiAeWMbNDOY+PFDQ
yfNUjgo/CXi8LVtFzivZ+z34l9r2h4ch9ieLcaJOUrRl1664QN57OpZ6fYvOiLhd
FGfDQIpOzlOaWXBX6zfMshGKNdywyXpAxpW6E9G+FZvkkP+wGW6nMGUb0FYGcFCL
IeQOy09tGgMpyrJIiCIgFTp77BrmqTReuUFJMzaG4SmexPw2Ajy4TjE8LRjnLeb7
uUSzg9X3SdR2J9kNdZziBByV6kDcWGC5qEPmoKa1X51vg5dmG5ay6mvEY2yVeb2Q
AUslkx0IP0ydgZ/LcpRJybCqqmtwZS/z'

make_keys() {
cat << eof > $ENV_KEYS_FILE
$(echo $encrypted_key_file | openssl enc -d -des3 -base64 -pass pass:$1 -pbkdf2)
eof
}


if declare -f "$1" > /dev/null
    then "$@"
else
    echo "incorrect dotfile configuation"
    exit 1
fi

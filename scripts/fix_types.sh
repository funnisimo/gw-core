#!/usr/bin/env sh

# Original command in package.json:
# replace '\\*\\W+TSIGNORE\\W*(\n)(\\W*)(\\*\\/)' '$3$1$2// @ts-ignore$1' dist/gw-utils.d.ts

CMD=$'TSIGNORE(\W*)(\*\/)'
REPLACE=$'$1*/$1// @ts-ignore$1'
npx replace "${CMD}" "${REPLACE}" dist/gw-utils.d.ts

# Getting rid of name mangling to make adding fields to AppOpts easier (like plugins)
npx replace 'index\$5_AppOpts as ' '' dist/gw-utils.d.ts


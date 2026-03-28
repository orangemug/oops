# `@orangemug/oops`

Have I got a compromised pacakge in my npm/pnpm/yarn cache?

## Why?

I kept having to look up the CLI commands to check every time there was a npm package compromise, across the various package managers npm/pnpm/yarn.

This does that for me in one-shot and something I can share.

## Usage

Find out with `oops`

```bash
npx @orangemug/oops --help
# npx @orangemug/oops <dangerous_package_versions>
#
# Example: npx @orangemug/oops '@ctrl/tinycolor:4.1.1' '@ctrl/tinycolor:4.1.2'
```

You can attach this command to a bug tracker ticket somewhere in your company/organisation

> Check for compromised packages with
>
> ```bash
> npx @orangemug/oops \
>   '@ctrl/tinycolor:4.1.1' \
>   '@ctrl/tinycolor:4.1.2'
> ```

The examples are from <https://orca.security/resources/blog/npm-malware-campaign-tinycolor/>

It also support ranges such as `^4`

## Licence

MIT

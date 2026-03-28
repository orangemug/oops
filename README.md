# `@orangemug/oops`

Have I got a compromised pacakge in my npm/pnpm/yarn cache?

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

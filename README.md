
# Bravura Safe Directory Connector

The Bravura Safe Directory Connector is a a desktop application used to sync your Bravura Safe enterprise organization to an existing directory of users and groups.

Supported directories:

- Active Directory
- Any other LDAP-based directory
- Azure Active Directory
- G Suite (Google)
- Okta

The application is written using Electron with Angular and installs on Windows, macOS, and Linux distributions.

## Command-line Interface

A command-line interface tool is also available for the Bravura Safe Directory Connector. The Directory Connector CLI (`bwdc`) is written with TypeScript and Node.js and can also be run on Windows, macOS, and Linux distributions.

## CLI Documentation

The Bravura Safe Directory Connector CLI is self-documented with `--help` content and examples for every command. You should start exploring the CLI by using the global `--help` option:

```bash
bwdc --help
```

This option will list all available commands that you can use with the Directory Connector CLI.

Additionally, you can run the `--help` option on a specific command to learn more about it:

```
bwdc test --help
bwdc config --help
```

## Build/Run

**Requirements**

- [Node.js](https://nodejs.org) v16.13.1 (LTS)
- Windows users: To compile the native node modules used in the app you will need the Visual C++ toolset, available through the standard Visual Studio installer (recommended) or by installing [`windows-build-tools`](https://github.com/felixrieseberg/windows-build-tools) through `npm`. See more at [Compiling native Addon modules](https://github.com/Microsoft/nodejs-guidelines/blob/master/windows-environment.md#compiling-native-addon-modules).

**Run the app**

```bash
npm install
npm run reset # Only necessary if you have previously run the CLI app
npm run rebuild
npm run electron
```

**Run the CLI**

```bash
npm install
npm run reset # Only necessary if you have previously run the desktop app
npm run build:cli:watch
```

You can then run commands from the `./build-cli` folder:

```bash
node ./build-cli/bwdc.js --help
```

## Contribute

Bravura Safe is a clone/fork of Bitwarden

Please visit the [Community Forums](https://community.bitwarden.com/) for general Bitwarden community discussion and the development roadmap.
Security audits and feedback are welcome. Please open an issue or email us privately if the report is sensitive in nature. You can read our security policy in the [`SECURITY.md`](SECURITY.md) file.

### Prettier

We recently migrated to using Prettier as code formatter. All previous branches will need to updated to avoid large merge conflicts using the following steps:

1. Check out your local Branch
2. Run `git merge 225073aa335d33ad905877b68336a9288e89ea10`
3. Resolve any merge conflicts, commit.
4. Run `npm run prettier`
5. Commit
6. Run `git merge -Xours 096196fcd512944d1c3d9c007647a1319b032639`
7. Push

#### Git blame

We also recommend that you configure git to ignore the prettier revision using:

```bash
git config blame.ignoreRevsFile .git-blame-ignore-revs
```

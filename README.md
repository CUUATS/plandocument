# Plan Document Theme for Hugo
A web-based planning document theme based on the
[U.S. Web Design Standards](https://standards.usa.gov/).

## Installation
To install the Plan Document theme, clone the repository in your Hugo themes
directory:

```
mkdir themes
cd themes
git clone https://github.com/CUUATS/plandocument.git
```

## Configuration
Copy the [example configuration](https://github.com/CUUATS/plandocument/blob/master/example.config.yaml)
to your Hugo site configuration, and edit the parameters as appropriate.

## Development
To customize the Plan Document theme, install its dependencies using
[yarn](https://yarnpkg.com/en/):

```
yarn install
```

Then edit files in the `src` directory, and rebuild the static resources:

```
npm run build
```

To build for production, use the `--production` flag:

```
npm run build -- --production
```

## License
The Plan Document theme is available under the terms of the
[BSD 3-clause license](https://github.com/CUUATS/plandocument/blob/master/LICENSE.md).
Parts of the U.S. Web Design Standards are in the public domain, and other
parts are available under [several open source
licenses](https://github.com/18F/web-design-standards/blob/develop/LICENSE.md).
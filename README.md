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

Then build the static resources using [Node.js](https://nodejs.org/):

```
cd plandocument
npm install
npm run build
```

## Configuration
Copy the [example configuration](https://github.com/CUUATS/plandocument/blob/master/example.config.yaml)
to your Hugo site configuration, and edit the parameters as appropriate.

## Features
The Plan Document theme includes several custom features.

### Abstracts
The auto-generated summary for a page can be overriden by adding an abstract
to the page's front matter:

```
abstract: A summary of the page
```

### Page Banners
The Plan Document theme supports page banners using the [USWDS hero
component](https://components.standards.usa.gov/components/detail/hero.html).
To add a banner, add an image to the page bundle named `banner.jpg`. The image
should be approximately 1600x800 pixels and should be web optimized. Then add
front matter for the text of the banner:

```
bannerHeading: The banner headline
bannerText: The text of the banner message
bannerAction: The button text
bannerUrl: /path-to/button-destination
```

### Tagline
Taglines can be used on listing pages to add large text next to the body text.

```
tagline: A useful tagline
```

## Shortcodes
The Plan Document theme also provides several custom shortcodes.

### Accordion
The `accordion` and `accordion-content` shortcodes create expandable sections
using the [USWDS accordion
component](https://components.standards.usa.gov/components/detail/accordion--default.html).
The `accordion` shortcode accepts the optional parameters `border` and
`multiselect`, both of which are `false` by default:

```
{{<accordion border="true" multiselect="true">}}
  {{<accordion-content title="Section One">}}
    Section one text.
  {{</accordion-content>}}
  {{<accordion-content title="Section Two">}}
    Section two text.
  {{</accordion-content>}}
{{</accordion>}}
```

### Button
The `button` shortcode creates a button using the [USWDS button
component](https://components.standards.usa.gov/components/detail/buttons--default.html).
It accepts the following parameters:

* `href`: the destination URL
* `size`: `large` or `small` (default)
* `color`: `primary` (default) or `secondary`

```
{{<button href="/example/page"> size="large"}}Button Text{{</button>}}
```

### Charts
Chart shortcodes have been removed from the Plan Document theme. Use the
`rpc-chart` element from [CCRPC Charts and Visualizations][1] instead.

### Image
The `image` shortcode adds a content image with additional details such as
alternative text, a caption, and an image source. It accepts the following
parameters:

* `src`: source image
* `link`: destination URL
* `alt`: alternative text
* `caption`: image caption
* `attr`: image attribution text
* `attrlink`: image attribution URL
* `position`: `left`, `right`, or `full` (default)

```
{{<image src="example.jpg"
  link="/destination"
  alt="An example in the wild"
  caption="This is the caption."
  attr="Agency" attrlink="https://example.org/"
  position="left">}}
```

### Lead
The `lead` shortcode creates a paragraph of larger text for use at the
beginning of a section:

```
{{<lead>}}
This paragraph introduces the section.
{{</lead>}}
```

### Table
The table shortcode has been removed from the Plan Document theme. Use the
`rpc-table` element from [CCRPC Charts and Visualizations][1] instead.

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

[1]: https://github.com/champaigncountyrpc/ccrpc-charts

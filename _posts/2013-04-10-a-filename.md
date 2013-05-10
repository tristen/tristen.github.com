---
published: false
layout: blog
category: blog
title: Writing TileMill Plugins in OSX
permalink: "/blog/writing-tilemill-plugins"
class: "tilemill-plugins"
headline: "images/blog/tilemill-plugins.png"

---

Writing a plugin for [TileMill](http://mapbox.com/tilemill) is a great way to add features or additional functionality you'd like to see in the app. If you have a good understanding of how [Backbone](http://backbonejs.org) works you're well primed to stat authoring your own. For those not familiar with the plugins interface here's a screenshot of what it looks like:

![](http://cl.ly/LIVX/screenshot_2012-12-02Screen%20Shot%202012-12-02%20at%205.06.47%20PM.png)

The section under _available_ is where you'll find plugins in the wild (or otherwise not installed) and your's too could be on that list for others to use but before I jump into building one let's dive into TileMill.

<div class='note'>
<strong>Note:</strong> Plugins are not officially supported and may potentially break existing TileMill functionality. If you encounter bugs with TileMill, report them <a href='https://github.com/mapbox/tilemill/issues'>to the issue tracker</a> but disable any custom plugins you may have and test again.
</div>

## TileMill.app

To take a pen from [Mathias Bynens's post on creating Mac apps](http://mathiasbynens.be/notes/shell-script-mac-apps): Mac applications have an .app extension and while it looks like a file it’s actually a package. You can view TileMIll's application package by right-clicking Tilemill.app in finder it and choosing “Show Package Contents".

![Show Package Contents osx](http://cl.ly/image/431x2V1m3m3g/screenshot_2012-11-05Screen%20Shot%202012-11-05%20at%208.02.40%20PM.png)

The main application structure is in `Contents > Resources` and it's here you'll find files that resemble [TileMill's master branch](https://github.com/mapbox/tilemill). Have a look at how TileMill is structured. Like a traditional Backbone application the components that make up routing, data retrieval, or rendering are neatly decoupled and added as sing files in respective _controllers_, _models_, and _views_ directories. Depending on what you want to do with your plugin, it's these files you'll likely want to scan through.

## Setting up your Work Environment

1. I recommend opening this `Resources` directory in your code editor as you begin writing your plugin as you can easily console.log anything while TileMill is running.

2. You'll also want to run the TileMill in Chrome over of its GUI to take advantage of DevTools for debugging. You can do this by navigating to [localhost:20009](http://localhost:20009).![](http://cl.ly/image/2l3L00080j1e/screenshot_2012-12-02Screen%20Shot%202012-12-02%20at%201.26.46%20PM.png)

3. Lastly, open the users plugins directory by navigating to `~/.tilemill/node_modules` If you've downloaded any additional third party plugins they'll show up there. Authoring a plugin should be made here before you publish to the world.

![](http://cl.ly/image/2K0C1Y2x1w3x/screenshot_2012-11-06Screen%20Shot%202012-11-06%20at%209.58.29%20AM.png)

## The elements of a plugin

To get started, I recommend [checking out the tilemill-tablesort plugin](https://github.com/tristen/tilemill-tablesort) I wrote for reference. It's goal is to provide sorting functionality to the features data table.

### package.json

A plugin really only has one requirement: a `package.json` file. Mine looks like this:

{% highlight js %}
{
    "name": "tilemill-tablesort",
    "description": "Sort columns on data tables",
    "version": "0.1.0",
    "engines": {
    "tilemill": "~0.10"
    },
    "keywords": ["tilemill"]
}
{% endhighlight %}

TileMill scans the npm registry to find packages that contain __tilemill__ (available to it's version) in its engines object and populates its listing on TileMill's plugin page with the name and description. The version property has an important value as each time you re-publish your plugin with new changes TileMill will pull in this new version and prompt a user to upgrade.

### Plugin assets

Plugins with any UI feature we'll likely contain `.css` or `.js` files. In a file I've named `servers/Route.bones` I reference a script that pushes tilemill-tablesort.css into TileMill's assets/styles array and tablesort.min.js file into the assets/scripts array:

{% highlight js %}
var assets = servers['Route'].prototype.assets;
assets.styles.push(require.resolve('../assets/tilemill-tablesort.css'));
assets.scripts.push(require.resolve('../assets/tablesort.min.js'));
{% endhighlight %}

### Extending existing views

For plugins that provide additional functionality to TileMill's native interface you'll want to extend native code - not duplicate it. Have a look at how my `views/Datasource.js` file looks:

{% highlight js %}
view = views.Datasource.extend();

view.prototype.render = _.wrap(view.prototype.render, function(func) {
    func.call(this);
    $('table', this.el).attr('id', 'features');
    $('tr.min, tr.max', this.el).addClass('no-sort');

    this.sort = new Tablesort(document.getElementById('features'));
});

view.prototype.showAll = _.wrap(view.prototype.showAll, function(func) {
    func.call(this);
    this.sort.refresh();
    return false;
});
{% endhighlight %}

Backbone provides an [extend](http://backbonejs.org/#View-extend) helper method that allows you to bring over the same methods from an existing constructor - In this case, TileMill's already defined view.Datasource. In my view I'm adding new functionality to two existing methods: _render_ and _showAll_. To ensure the functionality of those methods are carried over into my plugin I use [Underscore's wrap](http://underscorejs.org/#wrap) to add my own code to this existing function after its been run. Pass the function in a callback be sure to call it within this new function:

{% highlight js %}
func.call(this);
{% endhighlight %}

The rest of the code is now real authoring and specific to table sorting.

## Publishing

To make your plugin available for others to use you'll need to publish it. Assuming you have [npm](npmjs.org) installed, (_hint:_ this comes bundled with [node.js](http://nodejs.org)) create an npm user account if you haven't done so already by typing `npm adduser` in terminal and following the prompts. The last step is to execute this command in your plugins root directory:

{% highlight bash %}
npm publish
{% endhighlight %}

And you're all set. Feeling uninspired? There are lots of [good feature requests that come up](https://github.com/mapbox/tilemill/issues?labels=plugins&page=1&state=open).

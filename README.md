# ember-tag-input

ember-tag-input is a simple Ember addon that converts a user's typing into tags. New tags are created when the user types a comma, space, or hits the enter key. Tags can be removed using the backspace key or by clicking the x button on each tag.

![](http://i.imgur.com/aVRvs7z.png)

## Usage

In the simplest case, just pass a list of tags to render and actions for adding and removing tags. The component will never change the tags list for you, it will instead call the actions you define when changes need to be made.

```handlebars
{{tag-input
  tags=tags
  addTag=(action 'addTag')
  removeTagAtIndex=(action 'removeTagAtIndex')
}}
```

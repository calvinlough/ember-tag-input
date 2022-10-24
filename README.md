# ember-tag-input


ember-tag-input is a simple Ember addon that converts a user's typing into tags. New tags are created when the user types a comma, space, or hits the enter key. Tags can be removed using the backspace key or by clicking the x button on each tag.

![](http://i.imgur.com/aVRvs7z.png)

## Usage

In the simplest case, just pass a list of tags to render and actions for adding and removing tags. The component will never change the tags list for you, it will instead call actions when changes need to be made. The component will yield each tag in the list, allowing you to render it as you wish.

```handlebars
<TagInput
  @tags={{this.tags}}
  @addTag={{this.addTag}}
  @removeTagAtIndex={{this.removeTagAtIndex}}
  as |tag|
>
  {{tag}}
</TagInput>
```

```js
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
  @tracked tags = [];

  @action addTag(tag) {
    this.tags.pushObject(tag);
  }

  @action removeTagAtIndex(index) {
    this.tags.removeAt(index);
  }
}
```

The above example works if your tags array is just an simple array of strings. If your tags are more complex objects, you can render them however you want, as demonstrated by the following example:

```handlebars
<TagInput
  @tags={{this.tags}}
  @addTag={{this.addTag}}
  @removeTagAtIndex={{this.removeTagAtIndex}}
  as |tag|
>
  <div class="tagInput-name">
    {{tag.name}}
  </div>
  <div class="tagInput-date">
    {{tag.date}}
  </div>
</TagInput>
```
If you pass tags objects, you can use the `modifiers` property to pass extra classes to individual tags:
```
tags = A([
  { name: 'first', modifiers: 'primaryTag' },
  { name: 'second', modifiers: 'secondaryTag' },
]);
```
## Options

### tags
- An array of tags to render.
- **default: null**

### removeConfirmation
- Whether or not it takes two presses of the backspace key to remove a tag. When enabled, the first backspace press will add the class `emberTagInput-tag--remove` to the element that is about to be removed.
- **default: true**

### allowCommaInTags
- If tags are allowed to contain comma.
- **default: false**

### allowSpacesInTags
- If tags are allowed to contain spaces.
- **default: false**

### allowDuplicates
- If duplicates tags are allowed in the list.
- **default: false**

### showRemoveButtons
- If 'x' removal links should be displayed at the right side of each tag.
- **default: true**

### placeholder
- The placeholder text to display when the user hasn't typed anything. Isn't displayed if readOnly=true.
- **default: ''**

### ariaLabel
- The aria-label for the input field.
- **default: ''**

### readOnly
- If a read only view of the tags should be displayed. If enabled, existing tags can't be removed and new tags can't be added.
- **default: false**

### maxlength
- If maxlength value is passed in, each `<input>` field(tag) will have maximum number of characters allowed.
- **default: ''**

## Actions

### addTag
- This action will get called when the user is trying to add a new tag. Your implementation should either add the tag to the tags array or return false if the tag wasn't added.
- **parameters: tag**

### removeTagAtIndex
- This action will get called when the user is trying to remove a tag. Your implementation should remove the element from the tags array at the specified index.
- **parameters: index**

### onKeyUp
- This action will get called after each key press.
- **parameters: currentInputValue**

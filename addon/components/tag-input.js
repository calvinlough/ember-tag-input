import Ember from 'ember';
import layout from '../templates/components/tag-input';

const KEY_CODES = {
  BACK_BUTTON: 8,
  COMMA: 188,
  ENTER: 13,
  SPACE: 32
};

export default Ember.Component.extend({
  layout,

  classNames: ['emberTagInput'],

  tagName: 'ul',

  tags: Ember.A(),

  didInsertElement() {
    let container = this.$(),
      newTagInput = this.$('.js-ember-tag-input-new');

    container.on('click', () => {
      newTagInput.focus();
    });

    newTagInput.on('keydown', (e) => {
      let tags = this.get('tags'),
        newTagInputVal = newTagInput.val().trim();

      if (e.which === KEY_CODES.COMMA || e.which === KEY_CODES.SPACE || e.which === KEY_CODES.ENTER) {
        if (newTagInputVal.length > 0) {
          let onTagAdd = this.get('onTagAdd');

          tags.pushObject(newTagInputVal);
          newTagInput.val('');

          if (onTagAdd) {
            onTagAdd(newTagInputVal);
          }

          e.preventDefault();
        }
      } else if (e.which === KEY_CODES.BACK_BUTTON) {
        if (newTagInputVal.length === 0) {
          let onTagRemove = this.get('onTagRemove'),
            removedTag = tags.popObject();

          if (onTagRemove) {
            onTagRemove(removedTag);
          }
        }
      }
    });

    newTagInput.on('blur', () => {
      let tags = this.get('tags'),
        newTagInputVal = newTagInput.val().trim();

      if (newTagInputVal.length > 0) {
        let onTagAdd = this.get('onTagAdd');

        tags.pushObject(newTagInputVal);

        if (onTagAdd) {
          onTagAdd(newTagInputVal);
        }
      }

      newTagInput.val('');
    });
  }
});

import Ember from 'ember';
import layout from '../templates/components/tag-input';

const KEY_CODES = {
  BACKSPACE: 8,
  COMMA: 188,
  ENTER: 13,
  SPACE: 32
};

const TAG_CLASS = 'emberTagInput-tag';
const REMOVE_CONFIRMATION_CLASS = 'emberTagInput-tag--remove';

export default Ember.Component.extend({
  layout,

  classNames: ['emberTagInput'],

  tagName: 'ul',

  tags: null,

  removeConfirmation: true,

  allowDuplicates: false,

  showRemoveButtons: true,

  placeholder: '',

  didReceiveAttrs() {
    this.set('tags', Ember.A(this.get('tags')));
  },

  addNewTag(tag) {
    const tags = this.get('tags');
    const onTagAdd = this.get('onTagAdd');
    const allowDuplicates = this.get('allowDuplicates');

    if (!allowDuplicates && tags.indexOf(tag) >= 0) {
      return false;
    }

    tags.pushObject(tag);

    if (onTagAdd) {
      onTagAdd(tag);
    }

    return true;
  },

  didInsertElement() {
    let container = this.$(),
      newTagInput = this.$('.js-ember-tag-input-new');

    container.on('click', () => {
      newTagInput.focus();
    });

    newTagInput.on('keydown', (e) => {
      const tags = this.get('tags');
      const newTag = newTagInput.val().trim();

      if (e.which === KEY_CODES.COMMA || e.which === KEY_CODES.SPACE || e.which === KEY_CODES.ENTER) {
        if (newTag.length > 0) {
          if (this.addNewTag(newTag)) {
            newTagInput.val('');
          }
          e.preventDefault();
        }
      } else if (e.which === KEY_CODES.BACKSPACE) {
        if (newTag.length === 0 && tags.length > 0) {
          const onTagRemove = this.get('onTagRemove');

          if (this.get('removeConfirmation')) {
            const lastTag = this.$('.' + TAG_CLASS).last();

            if (!lastTag.hasClass(REMOVE_CONFIRMATION_CLASS)) {
              lastTag.addClass(REMOVE_CONFIRMATION_CLASS);
              return;
            }
          }

          const removedTag = tags.popObject();

          if (onTagRemove) {
            onTagRemove(removedTag);
          }
        }
      } else {
        this.$('.' + TAG_CLASS).removeClass(REMOVE_CONFIRMATION_CLASS);
      }
    });

    newTagInput.on('blur', () => {
      const newTag = newTagInput.val().trim();

      if (newTag.length > 0) {
        if (this.addNewTag(newTag)) {
          newTagInput.val('');
        }
      }

    });
  },

  actions: {
    removeTag(tag, index) {
      const tags = this.get('tags');
      const onTagRemove = this.get('onTagRemove');

      tags.removeAt(index);

      if (onTagRemove) {
        onTagRemove(tag);
      }
    }
  }
});

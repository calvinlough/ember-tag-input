import Ember from 'ember';
import layout from '../templates/components/tag-input';

const { Component, computed } = Ember;

const KEY_CODES = {
  BACKSPACE: 8,
  COMMA: 188,
  ENTER: 13,
  SPACE: 32
};

const TAG_CLASS = 'emberTagInput-tag';
const REMOVE_CONFIRMATION_CLASS = 'emberTagInput-tag--remove';

export default Component.extend({
  layout,

  classNameBindings: [':emberTagInput', 'readOnly:emberTagInput--readOnly'],

  tagName: 'ul',

  tags: null,

  removeConfirmation: true,

  allowDuplicates: false,

  allowSpacesInTags: false,

  showRemoveButtons: true,

  readOnly: false,

  placeholder: '',

  _isRemoveButtonVisible: computed('showRemoveButtons', 'readOnly', function() {
    return this.get('showRemoveButtons') && !this.get('readOnly');
  }),

  onKeyUp: false,

  addNewTag(tag) {
    const tags = this.get('tags');
    const addTag = this.get('addTag');
    const allowDuplicates = this.get('allowDuplicates');

    if (!allowDuplicates && tags.indexOf(tag) >= 0) {
      return false;
    }

    return addTag(tag) !== false;
  },

  didInsertElement() {
    const container = this.$();
    const newTagInput = this.$('.js-ember-tag-input-new');

    container.on('click', () => {
      newTagInput.focus();
    });

    newTagInput.on('keydown', (e) => {
      const allowSpacesInTags = this.get('allowSpacesInTags');
      const tags = this.get('tags');
      const newTag = newTagInput.val().trim();

      if (e.which === KEY_CODES.BACKSPACE) {
        if (newTag.length === 0 && tags.length > 0) {
          const removeTagAtIndex = this.get('removeTagAtIndex');

          if (this.get('removeConfirmation')) {
            const lastTag = this.$('.' + TAG_CLASS).last();

            if (!lastTag.hasClass(REMOVE_CONFIRMATION_CLASS)) {
              lastTag.addClass(REMOVE_CONFIRMATION_CLASS);
              return;
            }
          }

          removeTagAtIndex(tags.length - 1);
        }
      } else {
        if (e.which === KEY_CODES.COMMA || (!allowSpacesInTags && e.which === KEY_CODES.SPACE) || e.which === KEY_CODES.ENTER) {
          if (newTag.length > 0) {
            if (this.addNewTag(newTag)) {
              newTagInput.val('');
            }
          }
          e.preventDefault();
        }

        this.$('.' + TAG_CLASS).removeClass(REMOVE_CONFIRMATION_CLASS);
      }
    });

    newTagInput.on('blur', () => {
      const newTag = newTagInput.val().trim();

      if (newTag.length > 0) {
        if (this.addNewTag(newTag)) {
          newTagInput.val('');
          this.dispatchKeyUp('');
        }
      }
    });

    newTagInput.on('keyup', (e) => {
      this.dispatchKeyUp(e.target.value);
    });
  },

  dispatchKeyUp(value) {
    if (this.get('onKeyUp')) {
      this.get('onKeyUp')(value);
    }
  },

  actions: {
    removeTag(index) {
      const removeTagAtIndex = this.get('removeTagAtIndex');
      removeTagAtIndex(index);
    }
  }
});

import Component from '@ember/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

const KEY_CODES = {
  BACKSPACE: 8,
  COMMA: 188,
  ENTER: 13,
  SPACE: 32
};

const TAG_CLASS = 'emberTagInput-tag';
const REMOVE_CONFIRMATION_CLASS = 'emberTagInput-tag--remove';

export default class TagInput extends Component {
  classNameBindings = [':emberTagInput', 'readOnly:emberTagInput--readOnly'];

  tagName = 'ul';

  tags = null;

  removeConfirmation = true;

  allowCommaInTags = false;

  allowDuplicates = false;

  allowSpacesInTags = false;

  @tracked
  showRemoveButtons = true;

  @tracked
  readOnly = false;

  placeholder = '';

  ariaLabel = '';

  get _isRemoveButtonVisible() {
    return this.showRemoveButtons && !this.readOnly;
  }

  onKeyUp = false;

  addNewTag(tag) {
    const tags = this.tags;
    const addTag = this.addTag;
    const allowDuplicates = this.allowDuplicates;

    if (!allowDuplicates && tags && tags.indexOf(tag) >= 0) {
      return false;
    }

    return addTag(tag) !== false;
  }

  didInsertElement() {
    super.didInsertElement(...arguments);
    this.initEvents();
  }

  dispatchKeyUp(value) {
    if (this.onKeyUp) {
      this.onKeyUp(value);
    }
  }

  _onContainerClick() {
    const newTagInput = this.element.querySelector('.js-ember-tag-input-new');
    const isReadOnly = this.readOnly;

    if (!isReadOnly) {
      newTagInput.focus();
    }
  }

  _onInputKeyDown(e) {
    if (!this.readOnly) {
      const { allowCommaInTags, allowSpacesInTags, tags } = this;
      const backspaceRegex = new RegExp(
        String.fromCharCode(KEY_CODES.BACKSPACE),
        'g'
      );
      const newTag = e.target.value.trim().replace(backspaceRegex, '');

      if (e.which === KEY_CODES.BACKSPACE) {
        if (newTag.length === 0 && tags.length > 0) {
          const removeTagAtIndex = this.removeTagAtIndex;

          if (this.removeConfirmation) {
            const tags = this.element.querySelectorAll('.' + TAG_CLASS);
            const lastTag = tags[tags.length - 1];

            if (
              lastTag &&
              !lastTag.classList.contains(REMOVE_CONFIRMATION_CLASS)
            ) {
              lastTag.classList.add(REMOVE_CONFIRMATION_CLASS);
              return;
            }
          }

          removeTagAtIndex(tags.length - 1);
        }
      } else {
        if (
          (!allowCommaInTags && e.which === KEY_CODES.COMMA) ||
          (!allowSpacesInTags && e.which === KEY_CODES.SPACE) ||
          e.which === KEY_CODES.ENTER
        ) {
          if (newTag.length > 0) {
            if (this.addNewTag(newTag)) {
              e.target.value = '';
            }
          }
          e.preventDefault();
        }

        [].forEach.call(
          this.element.querySelectorAll('.' + TAG_CLASS),
          function (tagEl) {
            tagEl.classList.remove(REMOVE_CONFIRMATION_CLASS);
          }
        );
      }
    }
  }

  _onInputBlur(e) {
    const newTag = e.target.value.trim();

    if (newTag.length > 0) {
      if (this.addNewTag(newTag)) {
        e.target.value = '';
        this.dispatchKeyUp('');
      }
    }
  }

  _onInputKeyUp(e) {
    this.dispatchKeyUp(e.target.value);
  }

  initEvents() {
    const container = this.element;
    const onContainerClick = this._onContainerClick.bind(this);
    const onInputKeyDown = this._onInputKeyDown.bind(this);
    const onInputBlur = this._onInputBlur.bind(this);
    const onInputKeyUp = this._onInputKeyUp.bind(this);

    container.addEventListener('click', onContainerClick);
    const newTagInput = this.element.querySelector('.js-ember-tag-input-new');

    newTagInput.addEventListener('keydown', onInputKeyDown);
    newTagInput.addEventListener('blur', onInputBlur);
    newTagInput.addEventListener('keyup', onInputKeyUp);
  }

  @action
  removeTag(index) {
    const removeTagAtIndex = this.removeTagAtIndex;
    removeTagAtIndex(index);
  }
}

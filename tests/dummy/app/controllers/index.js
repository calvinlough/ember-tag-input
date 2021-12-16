import Ember from 'ember';

export default Ember.Controller.extend({
  tags: ['foo', 'bar'],

  tagsObjects: [{ label: 'foo' }, { label: 'bar' }],

  colors: ['green', 'red', 'purple'],

  readOnly: true,

  actions: {
    addTag(tag) {
      this.get('tags').pushObject(tag);
    },

    addTagObject(tag) {
      this.get('tagsObjects').pushObject({
        label: tag,
        modifiers: this.colors[Math.floor(Math.random() * 3)]
      });
    },

    removeTagObject(index) {
      this.get('tagsObjects').removeAt(index);
    },

    removeTag(index) {
      this.get('tags').removeAt(index);
    },

    onKeyUp(value) {
      this.set('currentInputValue', value);
    },

    toggleReadOnly() {
      this.toggleProperty('readOnly');
    }
  }
});

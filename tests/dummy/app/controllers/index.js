import Ember from 'ember';

export default Ember.Controller.extend({
  tags: ['foo', 'bar'],
  disableEnter: false,

  actions: {
    addTag(tag) {
      this.get('tags').pushObject(tag);
    },

    removeTag(index) {
      this.get('tags').removeAt(index);
    },

    onKeyUp(value) {
      this.set('currentInputValue', value);
    }
  }
});

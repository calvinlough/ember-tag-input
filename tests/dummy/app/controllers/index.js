import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { A } from '@ember/array';

export default class IndexController extends Controller {
  @tracked tags = A(['foo', 'bar']);
  @tracked readOnly = true;
  @tracked currentInputValue;

  @tracked tagsObjects = [{ label: 'foo' }, { label: 'bar' }];
  colors = ['green', 'red', 'purple'];

  @action addTag(tag) {
    this.tags.pushObject(tag);
  }

  @action removeTagAtIndex(index) {
    this.tags.removeAt(index);
  }

  @action addTagObject(tag) {
    this.tagsObjects.pushObject({
      label: tag,
      modifiers: this.colors[Math.floor(Math.random() * 3)]
    });
  }

  @action removeTagObjectAtIndex(index) {
    this.tagsObjects.removeAt(index);
  }

  @action onKeyUp(value) {
    this.currentInputValue = value;
  }

  @action toggleReadOnly() {
    this.readOnly = !this.readOnly;
  }
}

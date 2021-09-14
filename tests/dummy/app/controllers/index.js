import Controller from "@ember/controller";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

export default class IndexController extends Controller {
  @tracked tags = ["foo", "bar"];
  @tracked readOnly = true;
  @tracked currentInputValue;

  @action addTag(tag) {
    this.tags.pushObject(tag);
  }

  @action removeTagAtIndex(index) {
    this.tags.removeAt(index);
  }

  @ction onKeyUp(value) {
    this.currentInputValue = value;
  }

  @ction toggleReadOnly() {
    this.readOnly = !this.readOnly;
  }
}

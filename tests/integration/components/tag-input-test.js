import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { typeInInput } from '../../helpers/ember-tag-input';

moduleForComponent('tag-input', 'Integration | Component | Ember Tag Input', {
  integration: true
});

test('New tags are created when delimiter characters are typed', function(assert) {
  assert.expect(1);

  let done = assert.async();

  this.render(hbs`
    {{tag-input}}
  `);

  Ember.run(() => {
    typeInInput('.js-ember-tag-input-new', 'first second ');

    Ember.run.next(() => {
      assert.equal($('.emberTagInput-tag').length, 2);
      done();
    });
  });
});

test('New tags are created when the field is blurred', function(assert) {
  assert.expect(1);

  let done = assert.async();

  this.render(hbs`
    {{tag-input}}
  `);

  Ember.run(() => {
    typeInInput('.js-ember-tag-input-new', 'blurry');

    $('.js-ember-tag-input-new').blur();

    Ember.run.next(() => {
      assert.equal($('.emberTagInput-tag').length, 1);
      done();
    });
  });
});

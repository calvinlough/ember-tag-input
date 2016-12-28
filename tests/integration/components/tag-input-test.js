import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { typeInInput } from '../../helpers/ember-tag-input';

moduleForComponent('tag-input', 'Integration | Component | Ember Tag Input', {
  integration: true
});

test('New tags are created when delimiter characters are typed', function(assert) {
  assert.expect(1);

  this.render(hbs`
    {{tag-input}}
  `);

  Ember.run(() => {
    typeInInput('.js-ember-tag-input-new', 'first second ');

    Ember.run.next(() => {
      assert.equal($('.emberTagInput-tag').length, 2);
    });
  });
});

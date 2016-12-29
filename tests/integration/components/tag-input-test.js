import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { typeInInput, typeCharacterInInput } from '../../helpers/ember-tag-input';
import sinon from 'sinon';

moduleForComponent('tag-input', 'Integration | Component | Ember Tag Input', {
  integration: true
});

const KEY_CODES = {
  BACKSPACE: 8
};

test('New tags are created when delimiter characters are typed', function(assert) {
  assert.expect(5);

  let done = assert.async();

  this.onTagAdd = sinon.stub();

  this.render(hbs`
    {{tag-input
      onTagAdd=(action onTagAdd)
    }}
  `);

  Ember.run(() => {
    typeInInput('.js-ember-tag-input-new', 'first second ');

    Ember.run.next(() => {
      assert.equal(this.onTagAdd.callCount, 2);
      assert.equal($('.js-ember-tag-input-new').text(), '');
      assert.equal($('.emberTagInput-tag').length, 2);
      assert.equal($('.emberTagInput-tag').get(0).innerText, 'first');
      assert.equal($('.emberTagInput-tag').get(1).innerText, 'second');
      done();
    });
  });
});

test('New tags are created when the field is blurred', function(assert) {
  assert.expect(4);

  let done = assert.async();

  this.onTagAdd = sinon.stub();

  this.render(hbs`
    {{tag-input
      onTagAdd=(action onTagAdd)
    }}
  `);

  Ember.run(() => {
    typeInInput('.js-ember-tag-input-new', 'blurry');

    $('.js-ember-tag-input-new').blur();

    Ember.run.next(() => {
      assert.equal(this.onTagAdd.callCount, 1);
      assert.equal($('.js-ember-tag-input-new').text(), '');
      assert.equal($('.emberTagInput-tag').length, 1);
      assert.equal($('.emberTagInput-tag').get(0).innerText, 'blurry');
      done();
    });
  });
});

test('Tags can be removed using the backspace key', function(assert) {
  assert.expect(4);

  let done = assert.async();

  this.onTagRemove = sinon.stub();

  this.render(hbs`
    {{tag-input
      onTagRemove=(action onTagRemove)
    }}
  `);

  Ember.run(() => {
    typeInInput('.js-ember-tag-input-new', 'removeme ');

    Ember.run.next(() => {
      assert.equal($('.js-ember-tag-input-new').text(), '');
      assert.equal($('.emberTagInput-tag').length, 1);

      typeCharacterInInput('.js-ember-tag-input-new', String.fromCharCode(KEY_CODES.BACKSPACE));

      Ember.run.next(() => {
        assert.equal(this.onTagRemove.callCount, 1);
        assert.equal($('.emberTagInput-tag').length, 0);
        done();
      });
    });
  });
});

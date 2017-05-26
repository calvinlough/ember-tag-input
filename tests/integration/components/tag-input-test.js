import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { typeInInput, typeCharacterInInput } from '../../helpers/ember-tag-input';

moduleForComponent('tag-input', 'Integration | Component | Ember Tag Input', {
  integration: true
});

const KEY_CODES = {
  BACKSPACE: 8
};

test('New tags are created when delimiter characters are typed', function(assert) {
  assert.expect(4);

  const tags = Ember.A();

  this.addTag = function(tag) {
    tags.pushObject(tag);
  };
  this.set('tags', tags);

  this.render(hbs`
    {{tag-input
      tags=tags
      addTag=(action addTag)
    }}
  `);

  const done = assert.async();

  Ember.run(() => {
    typeInInput('.js-ember-tag-input-new', 'first second ');

    Ember.run.next(() => {
      assert.equal($('.js-ember-tag-input-new').text(), '');
      assert.equal($('.emberTagInput-tag').length, 2);
      assert.equal($('.emberTagInput-tag').eq(0).text().trim(), 'first');
      assert.equal($('.emberTagInput-tag').eq(1).text().trim(), 'second');
      done();
    });
  });
});

test('New tags are created when the field is blurred', function(assert) {
  assert.expect(3);

  const tags = Ember.A();

  this.addTag = function(tag) {
    tags.pushObject(tag);
  };
  this.set('tags', tags);

  this.render(hbs`
    {{tag-input
      tags=tags
      addTag=(action addTag)
    }}
  `);

  const done = assert.async();

  Ember.run(() => {
    typeInInput('.js-ember-tag-input-new', 'blurry');

    $('.js-ember-tag-input-new').blur();

    Ember.run.next(() => {
      assert.equal($('.js-ember-tag-input-new').text(), '');
      assert.equal($('.emberTagInput-tag').length, 1);
      assert.equal($('.emberTagInput-tag').eq(0).text().trim(), 'blurry');
      done();
    });
  });
});

test('Tags can be removed using the backspace key', function(assert) {
  assert.expect(5);

  const tags = Ember.A();

  this.addTag = function(tag) {
    tags.pushObject(tag);
  };
  this.removeTagAtIndex = function(index) {
    tags.removeAt(index);
  };
  this.set('tags', tags);

  this.render(hbs`
    {{tag-input
      tags=tags
      addTag=(action addTag)
      removeTagAtIndex=(action removeTagAtIndex)
    }}
  `);

  const done = assert.async();

  Ember.run(() => {
    typeInInput('.js-ember-tag-input-new', 'removeme ');

    Ember.run.next(() => {
      assert.equal($('.js-ember-tag-input-new').text(), '');
      assert.equal($('.emberTagInput-tag').length, 1);

      typeCharacterInInput('.js-ember-tag-input-new', String.fromCharCode(KEY_CODES.BACKSPACE));

      Ember.run.next(() => {
        assert.equal($('.emberTagInput-tag').length, 1);
        assert.equal($('.emberTagInput-tag--remove').length, 1);

        typeCharacterInInput('.js-ember-tag-input-new', String.fromCharCode(KEY_CODES.BACKSPACE));

        Ember.run.next(() => {
          assert.equal($('.emberTagInput-tag').length, 0);
          done();
        });
      });
    });
  });
});

test('Tags can contain multiple words when allowMultipleWords is set to true', function(assert) {
  assert.expect(3);

  const tags = [];

  this.addTag = function(tag) {
    tags.pushObject(tag);
  };
  this.set('tags', tags);

  this.render(hbs`
    {{tag-input
      tags=tags
      addTag=(action addTag)
      allowMultipleWords=true
    }}
  `);

  const done = assert.async();

  Ember.run(() => {
    typeInInput('.js-ember-tag-input-new', 'multiple words rock');

    $('.js-ember-tag-input-new').blur();

    Ember.run.next(() => {
      assert.equal($('.js-ember-tag-input-new').text(), '');
      assert.equal($('.emberTagInput-tag').length, 1);
      assert.equal($('.emberTagInput-tag').eq(0).text().trim(), 'multiple words rock');
      done();
    });
  });
});

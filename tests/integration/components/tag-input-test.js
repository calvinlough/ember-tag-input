import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, typeIn, findAll, blur, triggerKeyEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { A } from '@ember/array';

module('tag-input', 'Integration | Component | Ember Tag Input', function(hooks) {
  setupRenderingTest(hooks);

  const KEY_CODES = {
    BACKSPACE: 8
  };

  test('New tags are created when delimiter characters are typed', async function(assert) {
    assert.expect(4);

    const tags = A();

    this.addTag = function(tag) {
      tags.pushObject(tag);
    };

    this.set('tags', tags);

    await render(hbs`
      <TagInput 
        @tags={{this.tags}}
        @addTag={{this.addTag}}
        as |tag|>
        {{tag}}
      </TagInput>
    `);

    await typeIn(find('.js-ember-tag-input-new'), 'first second ');

    assert.equal(find('.js-ember-tag-input-new').textContent.trim(), '');
    assert.equal(findAll('.emberTagInput-tag').length, 2);
    assert.equal(findAll('.emberTagInput-tag').firstObject.textContent.trim(), 'first');
    assert.equal(findAll('.emberTagInput-tag').lastObject.textContent.trim(), 'second');
  });

  test('New tags are created when the field is blurred', async function(assert) {
    assert.expect(3);

    const tags = A();

    this.addTag = function(tag) {
      tags.pushObject(tag);
    };
    this.set('tags', tags);

    await render(hbs`
      <TagInput 
        @tags={{this.tags}}
        @addTag={{this.addTag}}
        as |tag|>
        {{tag}}
      </TagInput>
    `);

    await typeIn(find('.js-ember-tag-input-new'), 'blurry');
    await blur(find('.js-ember-tag-input-new'));

    assert.equal(find('.js-ember-tag-input-new').textContent.trim(), '');
    assert.equal(findAll('.emberTagInput-tag').length, 1);
    assert.equal(findAll('.emberTagInput-tag').firstObject.textContent.trim(), 'blurry');
  });

  test('Tags can be removed using the backspace key', async function(assert) {
    assert.expect(5);

    const tags = A();

    this.addTag = function(tag) {
      tags.pushObject(tag);
    };

    this.removeTagAtIndex = function(index) {
      tags.removeAt(index);
    };
    this.set('tags', tags);

    await render(hbs`
      <TagInput 
        @tags={{tags}}
        @addTag={{this.addTag}}
        @removeTagAtIndex={{this.removeTagAtIndex}}
        as |tag|>
        {{tag}}
      </TagInput>
    `);

    await typeIn(find('.js-ember-tag-input-new'), 'removeme ');

    assert.equal(find('.js-ember-tag-input-new').textContent.trim(), '');
    assert.equal(findAll('.emberTagInput-tag').length, 1);

    await triggerKeyEvent(find('.js-ember-tag-input-new'), 'keydown', KEY_CODES.BACKSPACE); //First keypress highlights the tag for deletion

    assert.equal(find('.js-ember-tag-input-new').textContent.trim(), '');
    assert.equal(findAll('.emberTagInput-tag').length, 1);

    await triggerKeyEvent(find('.js-ember-tag-input-new'), 'keydown', KEY_CODES.BACKSPACE); //Second keypress deletes the tag

    assert.equal(findAll('.emberTagInput-tag').length, 0);
  });

  test('Tags can contain spaces when allowSpacesInTags is set to true', async function(assert) {
    assert.expect(3);

    const tags = A();

    this.addTag = function(tag) {
      tags.pushObject(tag);
    };
    this.set('tags', tags);

    await render(hbs`
      <TagInput 
        @tags={{tags}}
        @addTag={{this.addTag}}
        @allowSpacesInTags={{true}}
        as |tag|>
        {{tag}}
      </TagInput>
    `);

    await typeIn(find('.js-ember-tag-input-new'), 'multiple words rock');
    await blur(find('.js-ember-tag-input-new'));

    assert.equal(find('.js-ember-tag-input-new').textContent.trim(), '');
    assert.equal(findAll('.emberTagInput-tag').length, 1);
    assert.equal(findAll('.emberTagInput-tag').firstObject.textContent.trim(), 'multiple words rock');
  });

  test('Tags can\'t be added or removed in read only mode', async function(assert) {
    assert.expect(5);

    const tags = A(['hamburger', 'cheeseburger']);
    this.set('tags', tags);

    await render(hbs`
      <TagInput 
        @tags={{tags}}
        @readOnly={{true}}
        as |tag|>
        {{tag}}
      </TagInput>
    `);

    assert.equal(findAll('.emberTagInput-tag').length, 2);
    assert.equal(findAll('.emberTagInput-remove').length, 0);
    assert.equal(findAll('.emberTagInput-new').length, 1);
    assert.equal(find('input').textContent.length, 0);
    assert.ok(find('input').disabled);
  });

  test('send input value when typing', async function(assert) {
    const tags = A();

    this.addTag = function(tag) {
      tags.pushObject(tag);
    };

    this.set('tags', tags);

    let inputValue;

    this.onKeyUp = function(value) {
      inputValue = value;
    };

    await render(hbs`
    <TagInput 
      @tags={{tags}}
      @addTag={{this.addTag}}
      @onKeyUp={{this.onKeyUp}}
      as |tag|>
      {{tag}}
    </TagInput>
  `);

  await typeIn(find('.js-ember-tag-input-new'), 't');
  assert.equal(inputValue, 't');
  await typeIn(find('.js-ember-tag-input-new'), 'e');
  assert.equal(inputValue, 'te');
  await typeIn(find('.js-ember-tag-input-new'), 's');
  assert.equal(inputValue, 'tes');
  await blur(find('.js-ember-tag-input-new'));

  assert.equal(findAll('.emberTagInput-tag').length, 1);
  assert.equal(findAll('.emberTagInput-tag').firstObject.textContent.trim(), 'tes');
  assert.equal(inputValue, '');
  });

  test('Tags can be added after readOnly changes to false', async function(assert) {
    assert.expect(4);

    const tags = A();

    this.addTag = function(tag) {
      tags.pushObject(tag);
    };

    this.set('tags', tags);
    this.set('readOnly', true);

    await render(hbs`
      <TagInput 
        @tags={{tags}}
        @addTag={{this.addTag}}
        @readOnly={{readOnly}}
        as |tag|>
        {{tag}}
      </TagInput>
    `);

    assert.ok(find('input').disabled);

    await this.set('readOnly', false);

    await typeIn(find('.js-ember-tag-input-new'), 'some tag ');

    assert.equal(findAll('.emberTagInput-tag').length, 2);
    assert.equal(findAll('.emberTagInput-tag').firstObject.textContent.trim(), 'some');
    assert.equal(findAll('.emberTagInput-tag').lastObject.textContent.trim(), 'tag');
  });

  test('Tags can\'t be added or removed after readOnly changes from false to true', async function(assert) {
    assert.expect(3);

    const tags = A(['hamburger', 'cheeseburger']);

    this.set('tags', tags);
    this.set('readOnly', false);

    this.removeTagAtIndex = function(index) {
      tags.removeAt(index);
    };

    this.addTag = function(tag) {
      tags.pushObject(tag);
    };

    await render(hbs`
      <TagInput 
        @tags={{tags}}
        @addTag={{this.addTag}}
        @readOnly={{readOnly}}
        @removeTagAtIndex={{this.removeTagAtIndex}}
        as |tag|>
        {{tag}}
      </TagInput>
    `);

    await this.set('readOnly', true);

    assert.ok(find('input').disabled);

    //try adding new tags

    await typeIn(find('.js-ember-tag-input-new'), 'some tag ');

    assert.equal(findAll('.emberTagInput-tag').length, 2);

    //Try deleting 

    await triggerKeyEvent(find('.js-ember-tag-input-new'), 'keydown', KEY_CODES.BACKSPACE); 
    await triggerKeyEvent(find('.js-ember-tag-input-new'), 'keydown', KEY_CODES.BACKSPACE); 

    assert.equal(findAll('.emberTagInput-tag').length, 2);
  });
});

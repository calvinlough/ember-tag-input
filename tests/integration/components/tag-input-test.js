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

    await typeIn('.js-ember-tag-input-new', 'first second ');

    assert.dom('.js-ember-tag-input-new').includesText('');
    assert.dom('.emberTagInput-tag').exists({ count: 2 });
    assert.equal(findAll('.emberTagInput-tag')[0].textContent.trim(), 'first');
    assert.equal(findAll('.emberTagInput-tag')[1].textContent.trim(), 'second');
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

    await typeIn('.js-ember-tag-input-new', 'blurry');
    await blur('.js-ember-tag-input-new');

    assert.dom('.js-ember-tag-input-new').includesText('');
    assert.dom('.emberTagInput-tag').exists({ count: 1 });
    assert.equal(findAll('.emberTagInput-tag')[0].textContent.trim(), 'blurry');
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
        @tags={{this.tags}}
        @addTag={{this.addTag}}
        @removeTagAtIndex={{this.removeTagAtIndex}}
        as |tag|>
        {{tag}}
      </TagInput>
    `);

    await typeIn('.js-ember-tag-input-new', 'removeme ');

    assert.dom('.js-ember-tag-input-new').includesText('');
    assert.dom('.emberTagInput-tag').exists({ count: 1 });

    await triggerKeyEvent('.js-ember-tag-input-new', 'keydown', KEY_CODES.BACKSPACE); //First keypress highlights the tag for deletion

    assert.dom('.js-ember-tag-input-new').includesText('');
    assert.dom('.emberTagInput-tag').exists({ count: 1 });

    await triggerKeyEvent('.js-ember-tag-input-new', 'keydown', KEY_CODES.BACKSPACE); //Second keypress deletes the tag

    assert.dom('.emberTagInput-tag').exists({ count: 0 });
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
        @tags={{this.tags}}
        @addTag={{this.addTag}}
        @allowSpacesInTags={{true}}
        as |tag|>
        {{tag}}
      </TagInput>
    `);

    await typeIn('.js-ember-tag-input-new', 'multiple words rock');
    await blur('.js-ember-tag-input-new');

    assert.dom('.js-ember-tag-input-new').includesText('');
    assert.dom('.emberTagInput-tag').exists({ count: 1 });
    assert.equal(findAll('.emberTagInput-tag')[0].textContent.trim(), 'multiple words rock');
  });

  test('Tags can\'t be added or removed in read only mode', async function(assert) {
    assert.expect(5);

    const tags = A(['hamburger', 'cheeseburger']);
    this.set('tags', tags);

    await render(hbs`
      <TagInput 
        @tags={{this.tags}}
        @readOnly={{true}}
        as |tag|>
        {{tag}}
      </TagInput>
    `);

    assert.dom('.emberTagInput-tag').exists({ count: 2 });
    assert.dom('.emberTagInput-remove').exists({ count: 0 });
    assert.dom('.emberTagInput-new').exists({ count: 1 });
    assert.dom('input').hasText('');
    assert.dom('input').isDisabled();
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
      @tags={{this.tags}}
      @addTag={{this.addTag}}
      @onKeyUp={{this.onKeyUp}}
      as |tag|>
      {{tag}}
    </TagInput>
  `);

  await typeIn('.js-ember-tag-input-new', 't');
  assert.equal(inputValue, 't');
  await typeIn('.js-ember-tag-input-new', 'e');
  assert.equal(inputValue, 'te');
  await typeIn('.js-ember-tag-input-new', 's');
  assert.equal(inputValue, 'tes');
  await blur('.js-ember-tag-input-new');

  assert.dom('.emberTagInput-tag').exists({ count: 1 });
  assert.equal(findAll('.emberTagInput-tag')[0].textContent.trim(), 'tes');
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
        @tags={{this.tags}}
        @addTag={{this.addTag}}
        @readOnly={{this.readOnly}}
        as |tag|>
        {{tag}}
      </TagInput>
    `);

    assert.dom('input').isDisabled();

    await this.set('readOnly', false);

    await typeIn('.js-ember-tag-input-new', 'some tag ');

    assert.dom('.emberTagInput-tag').exists({ count: 2 });
    assert.equal(findAll('.emberTagInput-tag')[0].textContent.trim(), 'some');
    assert.equal(findAll('.emberTagInput-tag')[1].textContent.trim(), 'tag');
  });

  test('Tags can\'t be added or removed after readOnly changes from false to true', async function(assert) {
    assert.expect(5);

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
        @tags={{this.tags}}
        @addTag={{this.addTag}}
        @readOnly={{this.readOnly}}
        @removeTagAtIndex={{this.removeTagAtIndex}}
        as |tag|>
        {{tag}}
      </TagInput>
    `);

    this.set('readOnly', true);

    assert.dom('input').isDisabled();

    //try adding new tags

    // TODO: fails
    try {
      await typeIn(find('.js-ember-tag-input-new'), 'some tag ');
    } catch (error) {
      assert.true(error.message === "Can not `typeIn` disabled '[object HTMLInputElement]'.");
    }

    assert.dom('.emberTagInput-tag').exists({ count: 2 });

    //Try deleting 

    // TODO: fails
    try {
      await triggerKeyEvent('.js-ember-tag-input-new', 'keydown', KEY_CODES.BACKSPACE); 
      await triggerKeyEvent('.js-ember-tag-input-new', 'keydown', KEY_CODES.BACKSPACE); 
    } catch (error) {
      assert.true(error.message === "Can not `triggerKeyEvent` on disabled [object HTMLInputElement]");
    }

    assert.dom('.emberTagInput-tag').exists({ count: 2 });
  });
});

import $ from 'jquery';

export function typeInInput(selector, text) {
  text.split('').forEach((character) => {
    typeCharacterInInput(selector, character);
  });
}

export function typeCharacterInInput(selector, character, eventType = 'keydown') {
  let input = $(selector),
    currentVal = input.val();

  input.val(currentVal + character);

  let e = $.Event(eventType);
  e.which = character.charCodeAt(0);
  input.trigger(e);
}

import $ from 'jquery';
import { run } from '@ember/runloop';

export function typeInInput(selector, text) {
  text.split('').forEach((character) => {
    typeCharacterInInput(selector, character);
  });
}

export function typeCharacterInInput(selector, character, eventType = 'keydown') {
  run(() => {
    let input = $(selector),
      currentVal = input.val();

    input.val(currentVal + character);

    let e = $.Event(eventType);
    e.which = character.charCodeAt(0);
    input.trigger(e);
  })
}

export function typeBackspace(selector, eventType = 'keydown') {
  run(() => {
    let input = $(selector)

    let e = $.Event(eventType);
    e.which = 8
    input.trigger(e);
  })
}

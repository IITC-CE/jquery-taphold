# jquery-taphold

A taphold event for [jQuery](https://jquery.com/).

[**Demo**](https://raw.githack.com/IITC-CE/jquery-taphold/master/demo.html)

To trigger a `taphold` event you need to click/tap an element and hold it for 0.5s (default <var>delay</var>).
If released before the delay passed then a normal click event is triggered instead.
If dragged or moved out of the element then no event is triggered.


### Highlights

- Support mouse, touch, pen input, alone and in [combinations]
- Make use of [Pointer Events], otherwise fall back to their [Mouse] / [Touch] counterparts
- Provide proper bubbling of events
- [Delegated] events are also supported
- `taphold` <var>delay</var> is customizable


[combinations]: https://www.html5rocks.com/en/mobile/touchandmouse/#toc-mostimp
[Pointer Events]: https://www.w3.org/TR/pointerevents2/
[Mouse]: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent#Specifications
[Touch]: https://www.w3.org/TR/touch-events/
[Delegated]: https://learn.jquery.com/events/event-delegation/


### Usage

```js
$('#element').on('taphold', function () {
  // actions
});
```

You can combine the event with a click event:

```js
$('#element')
  .on('taphold', function () {
    // taphold actions
  })
  .on('click', function () {
    // normal actions
  });
```

Delegated events are also supported:

```js
$('#element').on('taphold', '<selector>', function () {
  // triggers on descendants of #element that satisfy specified selector
});
```

Default options are accessible in `$.event.special.taphold.defaults` object:

```js
{
  delay: 500
}
```

Instead of modifying defaults it's possible to pass options directly:

```js
$('#element')
  .on('taphold', {delay: 2000}, function() {
    // to trigger after 2s
  });
```

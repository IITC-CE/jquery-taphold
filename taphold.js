(function ($) {
  function startHandler (event) {
    var data = event.data;
    if (event.originalEvent.isPrimary === false) { return; }
    if (typeof event.button === 'number') {
      if (event.button !== 0) { return; }
    } else if (event.touches) {
      if (event.touches.length !== 1) { return; }
    }
    data._triggered = false;
    data._timer = setTimeout(function (elem) {
      data._timer = null;
      $(elem).triggerHandler($.Event('taphold', {target: event.target}), data);
      data._triggered = true;
    }, data.delay, this);
  }

  function cancelHandler (event) {
    var data = event.data;
    if (data._timer) {
      clearTimeout(data._timer);
      data._timer = null;
    } else if (data._triggered && event.type === 'touchend') {
      // prevent simulated mouse events https://w3c.github.io/touch-events/#mouse-events
      return false;
    }
  }

  function namespaced (name) {
    return name.replace(/\w+/g, '$&.taphold');
  }
  var startevent, cancelevent;
  if (window.PointerEvent) {
    startevent = namespaced('pointerdown');
    cancelevent = namespaced('pointerup pointercancel pointerout');
  } else {
    startevent = namespaced('touchstart mousedown');
    cancelevent = namespaced('touchend touchmove touchcancel mouseup mouseout dragstart');
  }

  $.event.special.taphold = {
    defaults: {
      delay: 500
    },

    setup: function (data, _, eventHandle) {
      data = $.extend({}, $.event.special.taphold.defaults, data);
      eventHandle._clickHandler = function (event) {
        if (data._triggered) {
          event.stopPropagation();
          event.preventDefault();
        }
      };
      // https://stackoverflow.com/a/20290312/2520247
      // https://github.com/jquery/jquery/issues/1735
      this.addEventListener('click', eventHandle._clickHandler, {capture: true});
      $(this)
        .on(startevent, data, startHandler)
        .on(cancelevent, data, cancelHandler);
    },

    teardown: function (_, eventHandle) {
      this.removeEventListener('click', eventHandle._clickHandler, {capture: true});
      $(this).off('.taphold');
    }
  };
})(jQuery);

(function ($) {
  var preventClick = false;
  function startHandler (event) {
    var data = event.data;
    if (event.originalEvent.isPrimary === false) { return; }
    if (typeof event.button === 'number') {
      if (event.button !== 0) { return; }
    } else if (event.touches) {
      if (event.touches.length !== 1) { return; }
    }
    preventClick = false;
    var $elem = $(this);
    data._timer = setTimeout(function () {
      data._timer = null;
      $elem.triggerHandler($.Event('taphold', {target: event.target}), data);
      if (event.type === 'touchstart' || event.pointerType === 'touch') {
        // prevent simulated mouse events https://w3c.github.io/touch-events/#mouse-events
        $(elem).one('touchend', data, function (e) { e.preventDefault(); });
      } else {
        preventClick = true;
      }
    }, data.delay);
  }

  function cancelHandler (event) {
    var data = event.data;
    if (data._timer) {
      clearTimeout(data._timer);
      data._timer = null;
    }
  }

  function preventClickHandler (event) {
    if (preventClick) {
      preventClick = false;
      event.stopPropagation();
      event.preventDefault();
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

  var counter = 0;
  $.event.special.taphold = {
    defaults: {
      delay: 500
    },

    setup: function (data) {
      data = $.extend({}, $.event.special.taphold.defaults, data);
      $(this)
        .on(startevent, data, startHandler)
        .on(cancelevent, data, cancelHandler);
      if (counter++ === 0) {
        // https://stackoverflow.com/a/20290312/2520247
        // Note: listeners directly attached to element may skip capture phase
        //       that's why we add our click-preventing handler to `document`
        document.addEventListener('click', preventClickHandler, {capture: true});
        // https://github.com/jquery/jquery/issues/1735
      }
    },

    teardown: function () {
      $(this).off('.taphold');
      if (counter-- === 1) {
        document.removeEventListener('click', preventClickHandler, {capture: true});
      }
    }
  };
})(jQuery);

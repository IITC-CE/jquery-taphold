(function ($) {
  function startHandler (event) {
    var data = event.data;
    if (event.originalEvent.isPrimary === false) { return; }
    if (typeof event.button === 'number') {
      if (event.button !== 0) { return; }
    } else if (event.touches) {
      if (event.touches.length !== 1) { return; }
    }
    var $elem = $(this)
      .removeData('taphold_triggered');
    data._timer = setTimeout(function () {
      data._timer = null;
      $elem
        .data('taphold_triggered', true)
        .triggerHandler($.Event('taphold', {target: event.target}), data);
    }, data.delay);
  }

  function cancelHandler (event) {
    var data = event.data;
    if (data._timer) {
      clearTimeout(data._timer);
      data._timer = null;
    } else if (event.type === 'touchend' &&
        $(event.delegateTarget).data('taphold_triggered')) {
      // prevent simulated mouse events https://w3c.github.io/touch-events/#mouse-events
      return false;
    }
  }

  function namespaced (name) {
    return name.replace(/\w+/g, '$&.taphold');
  }
  var startevent, cancelevent, clickevent = namespaced('click');
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

    setup: function (data) {
      data = $.extend({}, $.event.special.taphold.defaults, data);
      $(this)
        .on(startevent, data, startHandler)
        .on(cancelevent, data, cancelHandler)
        .on(clickevent, $.noop); // to be able to prevent default action
                                 // otherwise $.event.special.click.handle will be skipped
    },

    teardown: function () {
      $(this)
        .off('.taphold')
        .removeData('taphold_triggered');
    }
  };

  $.event.special.click = {
    delegateType: 'click',
    bindType: 'click',
    handle: function (event) {
      var e = event.originalEvent;
      var path = e.path || e.composedPath && e.composedPath() || [event.delegateTarget];
      if (path.some(function (el) { return $(el).data('taphold_triggered'); })) {
        event.preventDefault();
        return false;
      }
      return event.handleObj.handler.apply(this, arguments);
    }
  };
})(jQuery);

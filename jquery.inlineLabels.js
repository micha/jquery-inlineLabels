(function($) {

  /**
   * Inline label dimmer plugin for jQuery.
   *
   * Fork me on github: http://github.com/micha/jquery-inlineLabels
   *
   * Usage: $(selector).inlineLabels(opacity);
   *
   * Ex: 
   * 
   * <script type="text/javascript">
   *   $(function() {
   *     $("form.awesome span.wrap").inlineLabels(0.4);
   *   });
   * </script>
   *
   * IMPORTANT: Assumes the following structure for the inlineLabels:
   *
   * <span>
   *   <label><span>Label text</span></label>
   *   <input type="text" />
   * </span>
   *
   */

  $.fn.inlineLabels = function(baselineOpacity) {
    $(this).each(function() {
      var label   = $("label span", this);
      var input   = $("input", this);
      var state   = -1;
      var fade    = baselineOpacity || 0.5; // default 50% opacity

      // 'hover' state, slightly faded label
      function state1(event) {
        state = 1;
        label.fadeTo(0,fade/2);
      }
        
      // 'normal' state, unfaded label
      function state2(event) {
        state = 2;
        label.fadeTo(0,fade);
      }
        
      // slightly faded, this state is entered after input is focussed
      function state3(event) {
        state = 3;
        label.fadeTo(0,fade/2);
      }
        
      // completely faded, user date is present in input
      function state4(event) {
        state = 4;
        label.fadeTo(0,0);
      }
        
      // state transition map
      input.hover(
        function(event) {
          if (state < 3) state1(event);
        },
        function(event) {
          if (state < 3) state2(event);
        }
      ).focus(
        function(event) {
          if (state < 3) state3(event);
        }
      ).keyup(
        function(event) {
          if (input.val().length > 0)
            state4(event);
          else
            state3(event);
        }
      ).blur(
        function(event) {
          if (state >= 3 && input.val().length == 0)
            state2(event);
        }
      );

      // initialize state machine
      if (input.val().length > 0)
        state4.call(this, {});
      else
        state2.call(this, {});
    });

    return this;
  };

})(jQuery);

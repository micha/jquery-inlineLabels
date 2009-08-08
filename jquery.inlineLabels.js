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

      // state machine
      var states = [
        // dummy
        function() {},

        // 'hover' state, slightly faded label
        function() {
          state = 1;
          label.fadeTo(0,fade/2);
        },
          
        // 'normal' state, unfaded label
        function() {
          state = 2;
          label.fadeTo(0,fade);
        },
          
        // slightly faded, this state is entered after input is focussed
        function() {
          state = 3;
          label.fadeTo(0,fade/2);
        },
          
        // completely faded, user date is present in input
        function() {
          state = 4;
          label.fadeTo(0,0);
        }
      ];

      function flash() {
        label.fadeTo(0,fade);
        input.fadeTo(0,0);
        setTimeout(function() { label.fadeTo(0,1); states[state]() },1000);
      }
        
      // state transition map
      input.hover(
        function() {
          if (state < 3) states[1]();
        },
        function() {
          if (state < 3) states[2]();
        }
      ).focus(
        function() {
          if (state < 3)
            states[3]();
          else if (input.val().length > 0)
            flash();
        }
      ).keyup(
        function() {
          if (input.val().length > 0)
            states[4]();
          else
            states[3]();
        }
      ).blur(
        function() {
          if (state >= 3 && input.val().length == 0)
            states[2]();
        }
      );

      // initialize state machine
      states[2]();

      var intervalCount = 20;
      var t = setInterval(function() {
        if (intervalCount--) {
          if (state != 4 && input.val().length > 0) {
            intervalCount = 0;
            states[4]();
          }
          console.log("length: "+input.val().length);
        } else {
          clearInterval(t);
        }
      }, 100);

    });

    return this;
  };

})(jQuery);

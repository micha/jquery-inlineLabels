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

  $.inlineLabels = { flash: true };

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
          console.log("state: 1");
          if (state != 5) {
            state = 1;
            label.fadeTo(0,fade/2);
          }
        },
          
        // 'normal' state, unfaded label
        function() {
          console.log("state: 2");
          if (state != 5) {
            state = 2;
            label.fadeTo(0,fade);
          }
        },
          
        // slightly faded, this state is entered after input is focussed
        function() {
          console.log("state: 3");
          if (state != 5) {
            state = 3;
            label.fadeTo(0,fade/2);
          }
        },
          
        // completely faded, user date is present in input
        function() {
          console.log("state: 4");
          if (state != 5) {
            state = 4;
            label.fadeTo(0,0);
          }
        },

        function() {
          console.log("flash");
          if ($.inlineLabels.flash) {
            var oldstate = state;
            state = 5;
            input.fadeTo(0,0);
            label.fadeTo(200,fade/2);
            setTimeout(function() { 
              state = oldstate;
              states[state]();
              input.fadeTo(200,1)
            },500);
          }
        }
      ];

      // state transition map
      input.hover(
        function() {
          console.log("hover-in");
          if (state < 3) states[1]();
        },
        function() {
          console.log("hover-out");
          if (state < 3) states[2]();
        }
      ).focus(
        function() {
          console.log("focus");
          if (state < 3)
            states[3]();
          else if (input.val().length > 0)
            states[5]();
        }
      ).keyup(
        function() {
          console.log("keyup");
          if (input.val().length > 0)
            states[4]();
          else
            states[3]();
        }
      ).blur(
        function() {
          console.log("blur");
          if (state >= 3 && input.val().length == 0)
            states[2]();
        }
      );

      // initialize state machine
      states[2]();

      var intervalCount = 5;
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

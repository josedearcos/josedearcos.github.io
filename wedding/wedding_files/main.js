
$(document).ready(function() {

  var RAISE_THRESHOLD = 950;
  var DESCENT_THRESHOLD = 240;
  var HIDDEN_HEIGHT_AT_ARRIVAL = 190;

  var atArrival = $(window).scrollTop() < 30;
  var atDeparture = $(document).height() - $(window).scrollTop() - $(window).height() < 30;
  var lastScrollTop = 0;
  var activeZone = null;
  var $balloon = $("#balloon");

  var CLOUDS = [
    {top: "400", offset: "-450px", css_class: "cloud-1", delay: .8},
    {top: "500", offset: "10%", css_class: "cloud-3", delay: 1.2},
    {top: "900", offset: "-320px", css_class: "cloud-2", delay: .2},
    {top: "1500", offset: "280px", css_class: "cloud-2", delay: .8},
    {top: "2250", offset: "-380px", css_class: "cloud-4", delay: 1.2},
    {top: "2950", offset: "-380px", css_class: "cloud-1", delay: .8},
    {top: "3750", offset: "25%", css_class: "cloud-6", delay: .7},
    {top: "4050", offset: "-380px", css_class: "cloud-5", delay: 1.2},
  ];

  function createClouds() {
    var cloudIndex = 0;
    $moments = $(".moment").not(".bad");

    $.each(CLOUDS, function(index, cloud) {
      var $cloud = $("<div>").addClass("clouding").
                              addClass(cloud.css_class).
                              addClass("cloud").
                              attr('id', 'cloud-' + index).
                              css("top", cloud.top + 'px').
                              css("margin-left", cloud.offset);
      $("body").append($cloud);

      $(window).scroll(function() {
        $cloud.css({
          top: function(index, value) {
            return (cloud.top - $(window).scrollTop() * cloud.delay);
          }
        });
      });
    });
  }

  var animationHandler = function(e) {
    var scrollTop = $(this).scrollTop();
    var isMovingDown = scrollTop > lastScrollTop;
    var isMovingUp = !isMovingDown;
    var scrollBottom = $(document).height() - scrollTop - $(window).height();
    var maxBalloons = $(window).height() / 940;
    var marginTopArrival = -HIDDEN_HEIGHT_AT_ARRIVAL;
    var marginTopFlying = maxBalloons < 1 ? -((1 - maxBalloons) * 940) : 0;
    var marginTopDeparture = -((1 - maxBalloons) * 940);

    var isReturningToArrivalPoint = scrollTop < 30 && isMovingUp;
    var isArriving = scrollTop > 30 && isMovingDown;
    var isDeparturing = scrollBottom < 30 && isMovingDown;
    var isLeavingDeparturePoint = scrollBottom > 30 && isMovingUp;

    var flagOffset = scrollTop + parseInt($balloon.css('margin-top'));
    var basketOffset = flagOffset + 940;

    var edgePoint = isMovingUp ? flagOffset + RAISE_THRESHOLD : basketOffset - DESCENT_THRESHOLD;

    if (atArrival && isArriving) {
      atArrival = false;
      $balloon.removeClass('soaring').addClass('rocking');
        const IS_MOBILE = $(window).width() <= 640;

        if(IS_MOBILE)
        {
            $balloon.animate({"margin-top": 900 + 'px'}, 1000);
        }
        else
        {
            $balloon.animate({"margin-top": marginTopFlying + 'px'}, 1000);
        }

      setTimeout(function() {
        $balloon.removeClass('rocking').addClass('soaring');
      }, 2000);
    } else if (!atArrival && isReturningToArrivalPoint) {
      atArrival = true;
      $balloon.animate({"margin-top": marginTopFlying + 'px'}, 1000);
    } else if (!atDeparture && isDeparturing) {
      atDeparture = true;
      $balloon.animate({"margin-top" : marginTopFlying + 'px'}, 1000);
    } else if (atDeparture && isLeavingDeparturePoint) {
      atDeparture = false;
      $("#balloon").animate({"margin-top": marginTopFlying + 'px'}, 1000);
    }

    lastScrollTop = scrollTop;
  }

  function setUpAnimations() {
    $(window).scroll(animationHandler);
  }

  createClouds();
  setUpAnimations();

  setTimeout(function() {
    $(window).trigger('scroll')
  }, 200);
});

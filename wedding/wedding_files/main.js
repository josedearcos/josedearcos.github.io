var animationMethods = {
  slideInFromTheSide: function(callback) {
    return function() {
      if ($(this).hasClass('right')) {
        $(this).animate({"margin-right": '0px'}, 500, callback);
      } else if ($(this).hasClass('left')) {
        $(this).animate({"margin-left": '0px'}, 500, callback);
      }
    }
  },
  slideBackToTheSide: function(callback) {
    return function() {
      if ($(this).hasClass('right')) {
        $(this).animate({"margin-right": '-1800px'}, 500, callback);
      } else if ($(this).hasClass('left')) {
        $(this).animate({"margin-left": '-1800px'}, 500, callback);
      }
    }
  },
  selectNavItem: function() {
    $("nav li").removeClass("selected");
    $("nav a[href=#"+$(this).attr('id')+"]").parent().addClass("selected");
  }
}

var WhereZone = function($element) {
  this.moveIn = function() {
    $element.each(animationMethods.selectNavItem);
  }

  this.moveOut = function() {};
}

var VenueZone = function($element) {
  var $bird = $element.find("#bird");
  var $text = $element.find("p");
  var that = this;

  this.moveIn = function() {
    /*$.each($text, animationMethods.slideInFromTheSide());*/
    $.each($bird, animationMethods.slideInFromTheSide());

    $element.each(animationMethods.selectNavItem);
  }

  this.moveOut = function() {
    /*$.each($text, animationMethods.slideBackToTheSide());*/
    $.each($bird, animationMethods.slideBackToTheSide());

  }
}

var EventiZone = function($element) {
  var that = this;
  var $bird = $element.find("#bird");
  var $text = $element.find("p");

  this.moveIn = function() {
    /*$.each($text, animationMethods.slideInFromTheSide());*/
    $.each($bird, animationMethods.slideInFromTheSide());
    $element.each(animationMethods.selectNavItem);
  }

  this.moveOut = function() {
    /*$.each($text, animationMethods.slideBackToTheSide());*/
    $.each($bird, animationMethods.slideBackToTheSide());
  }
}

var HotelsZone = function($element) {
  var that = this;
  var $text = $element.find("p");

  this.moveIn = function() {
    /*$text.each(animationMethods.slideInFromTheSide());*/
    $element.each(animationMethods.selectNavItem);
  }

  this.moveOut = function() {
    /*$right_cloud.each(animationMethods.slideBackToTheSide());*/
    /*$text.each(animationMethods.slideBackToTheSide());*/
  }
}

var FormZone = function($element) {
  var that = this;
  var $text = $element.find("p");

  this.moveIn = function() {
    /*$text.each(animationMethods.slideInFromTheSide());*/
    $element.each(animationMethods.selectNavItem);
  }

  this.moveOut = function() {
   /* $text.each(animationMethods.slideBackToTheSide());*/
  }
}

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

  var zoneControllers = {
    "zone-where" : new WhereZone($("#zone-where")),
    "zone-venue" : new VenueZone($("#zone-venue")),
    "zone-eventi" : new EventiZone($("#zone-eventi")),
    "zone-hotels" : new HotelsZone($("#zone-hotels")),
    "zone-form" : new FormZone($("#zone-form")),
  }

  $.each(zoneControllers, function(index, controller) {
    controller.moveOut();
  });

  var zones = [];

  $(".moment").each(function(index, moment) {
    var offset = $(moment).offset();
    zones.push({
      start: offset.top,
      end: offset.top + $(moment).height(),
      moment: $(moment),
      controller: zoneControllers[moment.id],
      name: $(moment).find("strong").text()
    });
  });

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

    $.each(zones, function(index, zone) {
      if ((!activeZone || activeZone != zone) && edgePoint >= zone.start && edgePoint <= zone.end) {
        if (activeZone && activeZone.controller) {
          activeZone.controller.moveOut();
        }
        activeZone = zone;
        if (activeZone && activeZone.controller) {
          activeZone.controller.moveIn();
        }
        return false;
      }
    });

    if (atArrival && isArriving) {
      atArrival = false;
      $balloon.removeClass('soaring').addClass('rocking');
      $balloon.animate({"margin-top": marginTopFlying + 'px'}, 1000);
      setTimeout(function() {
        $balloon.removeClass('rocking').addClass('soaring');
      }, 2000);
    } else if (!atArrival && isReturningToArrivalPoint) {
      atArrival = true;
      $balloon.animate({"margin-top": marginTopArrival + 'px'}, 1000);
    } else if (!atDeparture && isDeparturing) {
      atDeparture = true;
      $balloon.animate({"margin-top" : marginTopDeparture + 'px'}, 1000);
    } else if (atDeparture && isLeavingDeparturePoint) {
      atDeparture = false;
      $("#balloon").animate({"margin-top": marginTopFlying + 'px'}, 1000);
    }

    lastScrollTop = scrollTop;
  }

  function setUpAnimations() {
    $(window).scroll(animationHandler);
  }

  function setUpNavigation() {
    $("nav li").click(function(e) {
      var $moment = $($(this).find('a').attr('href'));
      var balloonMarginTop = parseInt($balloon.css('margin-top'))
      var hiddenBalloonHeight = balloonMarginTop < 0 ? -1 * balloonMarginTop : 0;

      $moment.each(animationMethods.selectNavItem);

      $('html, body').animate({
        scrollTop: $moment.offset().top - $moment.height() / 2 + hiddenBalloonHeight - 100
      }, 1000);

      e.preventDefault();
      return false;
    })
  }

  createClouds();
  setUpAnimations();
  setUpNavigation();

  setTimeout(function() {
    $(window).trigger('scroll')
  }, 200);
});

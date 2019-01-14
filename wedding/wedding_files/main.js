
$(document).ready(function() {
                  var isMobile = false;
                  if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
                     || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
                  isMobile = true;
  }
                  
  const IS_MOBILE = isMobile;

  var RAISE_THRESHOLD = 950;
  var DESCENT_THRESHOLD = 240;
  var HIDDEN_HEIGHT_AT_ARRIVAL = 140;
  var BALLOON_HEIGHT = 840;
  if (window.matchMedia("(orientation: landscape)").matches && screen.height<600) {
                  BALLOON_HEIGHT = screen.height;
                  HIDDEN_HEIGHT_AT_ARRIVAL=0;
  }
  else
  {
  }
  var atArrival = $(window).scrollTop() < 30;
  var atDeparture = $(document).height() - $(window).scrollTop() - $(window).height() < 30;
  var lastScrollTop = 0;
  var $balloon = $("#balloon");
  var $ribbon = $("#ribbon");

  if (window.matchMedia("(orientation: landscape)").matches && screen.height<600) {
                  $balloon.animate({"background-size": screen.height*0.8,},0);
                  $ribbon.animate({"height": "50%",},0);

                  $balloon.animate({marginTop:HIDDEN_HEIGHT_AT_ARRIVAL},0);
  }
  if(IS_MOBILE)
  {
  var CLOUDS = [
                {top: "400", offset: "-450px", css_class: "cloud-1", delay: .8},
                {top: "500", offset: "10%", css_class: "cloud-3", delay: 1.2},
                {top: "900", offset: "-5%", css_class: "cloud-2", delay: .2},
                {top: "1500", offset: "280px", css_class: "cloud-2", delay: .8},
                {top: "2250", offset: "-20%", css_class: "cloud-4", delay: 1.2},
                {top: "2950", offset: "0%", css_class: "cloud-1", delay: .8},
                {top: "3750", offset: "25%", css_class: "cloud-6", delay: .7},
                {top: "4050", offset: "5%", css_class: "cloud-5", delay: 1.2},
                ];
  }
  else
  {
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
  }
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
    var maxBalloons = $(window).height() / BALLOON_HEIGHT;
    var marginTopFlying = maxBalloons < 1 ? -((1 - maxBalloons) * BALLOON_HEIGHT) : 0;
    var marginTopDeparture = -((1 - maxBalloons) * BALLOON_HEIGHT);

    var isReturningToArrivalPoint = scrollTop < 30 && isMovingUp;
    var isArriving = scrollTop > 30 && isMovingDown;
    var isDeparturing = scrollBottom < 1800 && isMovingDown;
    var isLeavingDeparturePoint = scrollBottom > 1800 && isMovingUp;
  if(IS_MOBILE)
  {
        isDeparturing< RAISE_THRESHOLD && isMovingDown;
        isLeavingDeparturePoint = scrollBottom > RAISE_THRESHOLD && isMovingUp;
      }
    var flagOffset = scrollTop + parseInt($balloon.css('margin-top'));
    var basketOffset = flagOffset + BALLOON_HEIGHT;

    var edgePoint = isMovingUp ? flagOffset + RAISE_THRESHOLD : basketOffset - DESCENT_THRESHOLD;

    if (atArrival && isArriving) {
      atArrival = false;
      $balloon.removeClass('soaring').addClass('rocking');

      if(IS_MOBILE&&window.matchMedia("(orientation: portrait)").matches)
      {
          $balloon.animate({
                           "left": "70%",
                           "margin-top" : "-100px"
                           }, 1000);
        }
        else
        {
                  $balloon.animate({"margin-top": marginTopFlying + 'px'}, 1000);
        }
                  
        console.log(' at arrival');

        setTimeout(function() {
      }, 2000);
    } else if (!atArrival && isReturningToArrivalPoint) {
      atArrival = true;
      console.log('returning at arrival');

      if(IS_MOBILE)
      {
          $balloon.animate({
              "left": "50%",
              "margin-top" : -HIDDEN_HEIGHT_AT_ARRIVAL
              }, 2000);
      }
      else
      {
        $balloon.animate({ "margin-top" : -HIDDEN_HEIGHT_AT_ARRIVAL}, 1000);
      }
    } else if (!atDeparture && isDeparturing) {
      atDeparture = true;
      console.log('At departure');
      //$balloon.removeClass('rocking');
     $balloon.removeClass('rocking').addClass('soaring');

      if(navigator.userAgent.match(/Tablet|iPad/i))
      {
          if (window.matchMedia("(orientation: landscape)").matches) {
          // you're in LANDSCAPE mode
          }
          else
          {
            $balloon.animate({ "margin-top" : "500px"}, 2000);
          }
      }
     else if(IS_MOBILE)
      {
          if (window.matchMedia("(orientation: landscape)").matches) {
          // you're in LANDSCAPE mode
          }
          else
          {
          $balloon.animate({ "margin-top" : "900px"}, 2000);
          }
      }
      else
      {
              $balloon.animate({"margin-top": marginTopFlying + 'px'}, 1000);
      }
    } else if (atDeparture && isLeavingDeparturePoint) {
      atDeparture = false;
      console.log('leaving departure');

      if(IS_MOBILE)
      {
          $balloon.animate({ "margin-top" : "0px"}, 2000);
      }
      else
      {
          $balloon.animate({"margin-top": marginTopFlying + 'px'}, 1000);
      }
                  
    $balloon.removeClass('soaring').addClass('rocking');
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

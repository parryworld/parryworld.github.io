var windowHeight = $(window).height();

$(document).ready(function() {
  $(window).scroll(function(e) {
    var bottomOfWindow = $(window).scrollTop() + $(window).height();
    var topOfElement = $(".content-container").offset().top;
    var difference = bottomOfWindow - topOfElement;
    var max = windowHeight / 2;
    var opacity = difference / max;
    $(".cover").css("opacity", 1 - opacity);
    $(".portfolio").css("opacity", opacity);
  });
});

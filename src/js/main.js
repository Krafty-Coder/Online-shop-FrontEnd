var app = document.getElementById('app');
var typewriter = new Typewriter(app, { loop: true  });
typewriter.typeString('Krafty Don Shop, \n')
.pauseFor(1200)
.ypeString('One stop shop for all the Geeky customized clads')
.pauseFor(1000)
.start();

$(function() {
  $(window).scroll(function() {
    var winTop = $(window).scrollTop();
    if (winTop >= 30) {
      $("body").addClass("sticky-header");

    } else {
      $("body").removeClass("sticky-header");

    }

  })

})

//testing with plain guesswork js
function fixed() {
  window.scroll(function() {
    var winTop = window.scrollTop();
    if (winTop >= 30) {
      body.addClass("sticky-header");
    } else {
      body.removeClass("sticky-header");
    }
  })
}

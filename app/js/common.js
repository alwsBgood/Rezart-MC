if (localStorage.name && localStorage.email)  {
  // запись сохраненных данных сразу в поля, если надо
  $('input[name="entry.906276550"]').val(localStorage.name);
  $('input[type="email"]').val(localStorage.email);
  $('input[type="tel"]').val(localStorage.phone);
}

$(function() {
  $("[name=send]").click(function (e) {
   var btn = $(this);
   var form = $(this).closest('form');

   $(":input.error").removeClass('error');
   $(".allert").remove();

   var error;
   var ref = btn.closest('form').find('[required]');
   var loc = ymaps.geolocation.city+', '+ymaps.geolocation.region+', '+ymaps.geolocation.country;
   $('[name=city').val(loc);
   var msg = btn.closest('form').find('input, textarea, select');
   var send_btn = btn.closest('form').find('[name=send]');
   var send_adress = btn.closest('form').find('[name=send_adress]').val();
   var send_options = btn.closest('form').find('[name=campaign_token]');;
   var formType = btn.closest('form').find('[name=form_type]').val();
   var redirect = btn.closest('form').find('[name=redirect]').val();
   var goal = btn.closest('form').find('[name=goal]').val();
   var alertImage = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 286.1 286.1"><path d="M143 0C64 0 0 64 0 143c0 79 64 143 143 143 79 0 143-64 143-143C286.1 64 222 0 143 0zM143 259.2c-64.2 0-116.2-52-116.2-116.2S78.8 26.8 143 26.8s116.2 52 116.2 116.2S207.2 259.2 143 259.2zM143 62.7c-10.2 0-18 5.3-18 14v79.2c0 8.6 7.8 14 18 14 10 0 18-5.6 18-14V76.7C161 68.3 153 62.7 143 62.7zM143 187.7c-9.8 0-17.9 8-17.9 17.9 0 9.8 8 17.8 17.9 17.8s17.8-8 17.8-17.8C160.9 195.7 152.9 187.7 143 187.7z" fill="#E2574C"/></svg>';

   var name_tl = localStorage.name = form.find('input[name="entry.906276550"]').val();
   var email_tl = localStorage.email = form.find('input[type="email"]').val();
   var phone_tl = localStorage.phone = form.find('input[type="tel"]').val();

   if (!name_tl) { name_tl = 'Имя потерялось'};
   if (!email_tl) { email_tl = 'Мейл потерялся'};
   if (!phone_tl) { phone_tl = 'Телефон потерялся'}


   $(ref).each(function() {
    if ($(this).val() == '') {
      var errorfield = $(this);
      $(this).addClass('error').parent('.field').append('<div class="allert"><span>Заполните это поле</span>' + alertImage + '</div>');
      error = 1;
      $(":input.error:first").focus();
      return;
    } else {
      var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
      if ($(this).attr("type") == 'email') {
        if (!pattern.test($(this).val())) {
          $("[name=email]").val('');
          $(this).addClass('error').parent('.field').append('<div class="allert"><span>Укажите коректный e-mail</span>' + alertImage + '</div>');
          error = 1;
          $(":input.error:first").focus();
        }
      }
      var patterntel = /^()[- +()0-9]{9,18}/i;
      if ($(this).attr("type") == 'tel') {
        if (!patterntel.test($(this).val())) {
          $("[name=phone]").val('');
          $(this).addClass('error').parent('.field').append('<div class="allert"><span>Укажите номер телефона в формате +3809999999</span>' + alertImage + '</div>');
          error = 1;
          $(":input.error:first").focus();
        }
      }
    }
  });
   if (!(error == 1)) {
    $(send_btn).each(function() {
      $(this).attr('disabled', true);
    });
      // Отправка в базу данных
      $.ajax({
       type: 'POST',
       url: 'db/registration.php',
       dataType: 'json',
       data: form.serialize(),
     });
      // Отправка в AMO
      $.ajax({
        type: "POST",
        url:"../amo/amocontactlist.php",
        data: msg,
        success: function() {
          console.log('amo ok!');
        }
      });
      // Отправка в Telegramm
      $.ajax({
        type: 'POST',
        url: 'https://api.telegram.org/bot357106214:AAHodgTmo25b66zg0hgGIx_gmsBvpyHSvdk/sendMessage?chat_id=-183516110&text=У вас новый лид c Rezart Master Class мой господин: ' + name_tl + ' | ' + email_tl + ' | ' + phone_tl + ' Продайте ему что-нибудь поскорее!'
        // data: short_msg,
      });
       // Отправка в Google sheets
       $.ajax({
        type: 'POST',
        url: 'https://docs.google.com/forms/d/e/1FAIpQLScs1Ox8psvYGQy_KRBNWK5Ds1pQCQc_GX4W-OaVg-th8ZOscA/formResponse',
        dataType: 'json',
        data: msg,
      });
    // Отправка на почту
    $.ajax({
      type: 'POST',
      url: 'mail.php',
      data: msg,
      success: function() {
        $.post("parser.php",{ajax: true});
        setTimeout(function() {
          $("[name=send]").removeAttr("disabled");
        }, 1000);
        $('div.md-show').removeClass('md-show');
        window.location = 'http://rezart.agency/mk/success/';
      },
      error: function(xhr, str) {
        console.log("Erorr")
      }
    });

  }
  return false;
})
});


$(document).ready(function() {
  var users = (function () {
    var users = null;
    $.ajax({
      'async': false,
      'global': false,
      'url': '/mk/users.json',
      'dataType': "json",
      'success': function (data) {
        users = data.users_value;
      }
    });
    return users;
  })();
  if( users > 50) {
    $('.places_left').text('Мест больше не осталось :(')
  } else {
    $('.places_counter').text(50 - users);
  }
});

 // Smooth scroll to anchor

 $('.scroll').click(function(){
  $('html, body').animate({
    scrollTop: $( $.attr(this, 'href') ).offset().top
  }, 1000);
  return false;
});

//  INPUT TEL MASK

jQuery(function($){
 $("input[type='tel']").mask("+38 (999) 999-9999");
});


// INPUT STYLIZATION

(function() {
    // trim polyfill : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
    if (!String.prototype.trim) {
        (function() {
            // Make sure we trim BOM and NBSP
            var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
            String.prototype.trim = function() {
                return this.replace(rtrim, '');
            };
        })();
    }

    [].slice.call( document.querySelectorAll( 'input.input__field' ) ).forEach( function( inputEl ) {
        // in case the input is already filled..
        if( inputEl.value.trim() !== '' ) {
            classie.add( inputEl.parentNode, 'input--filled' );
        }

        // events:
        inputEl.addEventListener( 'focus', onInputFocus );
        inputEl.addEventListener( 'blur', onInputBlur );
    } );

    function onInputFocus( ev ) {
        classie.add( ev.target.parentNode, 'input--filled' );
    }

    function onInputBlur( ev ) {
        if( ev.target.value.trim() === '' || ev.target.value.trim() == '(___) ___-____' ) {
            classie.remove( ev.target.parentNode, 'input--filled' );
        }
    }
})();



// Scroll BAR

$(window).scroll(function() {
    // calculate the percentage the user has scrolled down the page
    var scrollPercent = 100 * $(window).scrollTop() / ($(document).height() - $(window).height());

    $('.bar-long').css('width', scrollPercent +"%"  );

  });


//  UP BUTTON

$( document ).ready(function() {
  $('#scrollup img').mouseover( function(){
    $( this ).animate({opacity: 0.65},100);
  }).mouseout( function(){
    $( this ).animate({opacity: 1},100);
  });

  $(window).scroll(function(){
    if ( $(document).scrollTop() > 0 ) {
      $('#scrollup').fadeIn('slow');
    } else {
      $('#scrollup').fadeOut('slow');
    }
  });

  $('#scrollup').click(function() {
    $('body,html').animate({scrollTop:0},1000);
  });
});

// PREVENT SCROLLING

$('.md-trigger').click(function() {
  $("body").addClass('unscroll');
});

$('.md-close').click(function() {
  $("body").removeClass('unscroll');
});

$('.md-overlay').click(function() {
  $("body").removeClass('unscroll');
});




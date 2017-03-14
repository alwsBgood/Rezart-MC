if (localStorage.name)  {
  $('.client_name').html(localStorage.name)
} else {
  $('.client_name').html('Незнакомец')
}


// Time of day greetings



jQuery(document).ready(function($) {
  var time = new Date();
  var hours = time.getHours();

  if(hours >= 23 || hours <= 3) {
    $('.day_greetings').text('Доброй ночи');
  } else if (hours >= 4 && hours <= 11) {
    $('.day_greetings').text('Доброе утро');
  } else if (hours >= 11 && hours <= 16) {
    $('.day_greetings').text('Добрый день');
  } else if (hours >= 17 && hours <= 23) {
    $('.day_greetings').text('Добрый вечер');
  } else {
    $('.day_greetings').text('Приветствуем');
  }

});

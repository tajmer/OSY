$(function(){
	var locale = "ua",
		weatherDiv = $("#weather"),
		scroller = $("#scroller"),
		location = $("p.location");

	getWeatherData(locale, dataReceived, showError);

	function dataReceived(data) {
		// Get the offset from UTC (turn the offset minutes into ms)
		var offset = (new Date()).getTimezoneOffset()*60*1000;
		var city = data.city.name;
		var country = data.city.country;

		$.each(data.list, function(){
			// "this" holds a forecast object
			// Get the local time of this forecast (the api returns it in utc)
			var localTime = new Date(this.dt*1000 - offset);
			addWeather(
				this.weather[0].icon,
				moment(localTime).calendar(),	// We are using the moment.js library to format the date
				this.weather[0].description + ' <b>' + Math.round(this.temp.day) + '°C' + '</b>'
			);
		});
		// Add the location to the page
		location.html(city+', <b>'+country+'</b>');
		weatherDiv.addClass('loaded');
		// Set the slider to the first slide
		showSlide(0);
	}

	function addWeather(icon, day, condition){

		var markup = '<li>'+
			'<img src="assets/img/icons/'+ icon +'.png" />'+
			' <p class="day">'+ day +'</p> <p class="cond">'+ condition +
			'</p></li>';

		scroller.append(markup);
	}

	/* Handling the previous / next arrows */
	var currentSlide = 0;
	weatherDiv.find('a.previous').click(function(e){
		e.preventDefault();
		showSlide(currentSlide-1);
	});

	weatherDiv.find('a.next').click(function(e){
		e.preventDefault();
		showSlide(currentSlide+1);
	});

	// listen for arrow keys
	$(document).keydown(function(e){
		switch(e.keyCode){
			case 37: 
				weatherDiv.find('a.previous').click();
			break;
			case 39:
				weatherDiv.find('a.next').click();
			break;
		}
	});

	function showSlide(i){
		var items = scroller.find('li');

		if (i >= items.length || i < 0 || scroller.is(':animated')){
			return false;
		}

		weatherDiv.removeClass('first last');

		if(i == 0){
			weatherDiv.addClass('first');
		}
		else if (i == items.length-1){
			weatherDiv.addClass('last');
		}

		scroller.animate({left:(-i*100)+'%'}, function(){
			currentSlide = i;
		});
	}

	/* Error handling functions */
	function showError(msg){
		weatherDiv.addClass('error').html(msg);
	}
});
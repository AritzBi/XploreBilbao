var request=require('request');

function getWeatherInfo(cb){
	var address='Bilbao';
	options ={
        url: 'http://api.openweathermap.org/data/2.5/weather?q=' + address,
        json: true
    };
	request.get(options,function(err,response, body_json){
		if(!err && response.statusCode === 200){
			return cb(body_json);
		}else{
			console.log(err);
		}
	});
}

getWeatherInfo(function(cb){
	console.log(cb);
});
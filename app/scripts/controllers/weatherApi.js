var request=require('request');

function getWeatherInfo(cb){
	var address='Bilbao';
	options ={
        url: 'http://api.openweathermap.org/data/2.5/weather?q=' + address,
        json: true
    };
	request.get(option,function(err,response, body_json){
		if(!err && response.statusCode === 200){
			return callback(address, body_json);
		}else{
			console.log(err);
		}
	});
}

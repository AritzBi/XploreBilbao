var request=require('request');

exports.getWeatherInfo= function(cb){
	var address='Bilbao';
	options ={
        //url: 'http://api.openweathermap.org/data/2.5/weather?q=' + address,
        url: 'http://api.openweathermap.org/data/2.5/forecast/daily?q='+address+'&mode=json&units=metric&cnt=7',
        json: true
    };
	request.get(options,function(err,response, body_json){
		if(!err && response.statusCode === 200){
			return cb(body_json);
		}else{
			console.log(err);
		}
	});
};

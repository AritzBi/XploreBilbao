var nools = require("nools");

var Data = function (data) {
	console.log(data);
    this.routeType=data.routeType;
    this.company=data.company;
    this.weather=data.weather;
    console.log(this);
};

var Result = function (result) {
    this.result = result;
};

var inferred = function(){
	this.routeType=0;
	this.company=0;
	this.weather=0;
};

var flow = nools.flow("XploreBilbao", function (flow) {
	console.log("fuera");
    //find any message that start with hello
    flow.rule("RouteTypeOcio", [[Data, "d", "d.routeType == 'ocio'"],[inferred, "i", "i.routeType == 0"]], function (facts) {
    	console.log("Paso por el 1");
    	console.log("Paso por el 1 dos veces");
    	facts.d.routeType=null;
    	console.log("llego");
    	this.modify(facts.d);
    	console.log("primero");
    	facts.i.routeType=1;
    	console.log("Asdasd");
    	this.modify(facts.i);
    });
    flow.rule("RouteTypeTuristico", [[Data, "d", "d.routeType == 'turistico'"],[inferred, "i", "i.routeType==0"]], function (facts) {
    	console.log("Paso por el 2");
    	facts.d.routeType=null;
    	this.modify(facts.d);
    	facts.i.routeType=2;
    	this.modify(facts.i);
    });
    flow.rule("WeatherTypeLluvia", [[Data, "d", "d.weather == 'lluvia'"],[inferred, "i", "i.weather== 0 && i.routeType == 2"]], function (facts) {
    	console.log("Paso por el 3");
    	facts.d.weather=null;
    	this.modify(facts.d);
    	facts.i.weather=1;
    	this.modify(facts.i);
    });
    flow.rule("WeatherTypeNolluvia", [[Data, "d", "d.weather == 'noLluvia'"],[inferred, "i", "i.weather==0 && i.routeType==2"]], function (facts) {
    	console.log("Paso por el 4");
    	facts.d.weather=null;
    	this.modify(facts.d);
    	facts.i.weather=2;
    	this.modify(facts.i);
    });
    flow.rule("CompanyTypeFamily", [[Data, "d", "d.company == 'familia'"],[inferred, "i", "i.routeType==1"]], function (facts) {
    	console.log("Paso por el 5");
    	facts.d.company=null;
    	this.modify(facts.d);
    	facts.i.company=1;
    	this.modify(facts.i);
    });
    flow.rule("CompanyTypeOthers", [[Data, "d", "d.company == 'solo' || d.company == 'pareja' "],[inferred, "i", "i.routeType==1"]], function (facts) {
    	console.log("Paso por el 6");
    	facts.d.company=null;
    	this.modify(facts.d);
    	facts.i.company=2;
    	this.modify(facts.i);
    });
    flow.rule("GoodBye",[[inferred, "i", "i.routeType!=0 && (i.weather!=0 || i.company!=0)"],[Result, "r"]], function (facts) {
    	console.log("Paso por el 7");
    	facts.d.company=null;
    	this.modify(facts.d);
    	facts.i.company=2;
    	this.modify(facts.i);
    });
});

console.log("paso por aqui");
var inferred=new inferred();
console.log(inferred);
var  session1 = flow.getSession(new Data({routeType: 'ocio', weather: 'lluvia', company:'solo'}),inferred);
session1.match().then(function(){
	session1.dispose();
	console.log("pitp");
	console.log(inferred);
});
/*var r1 = new Result();
var  session1 = flow.getSession(new Message("hello world"),r1);
session1.match().then(function(){
	session1.dispose();
});*/


/*var Fibonacci = function (sequence, value) {
    this.sequence = sequence;
    this.value = value || -1;
};

var Result = function (result) {
    this.result = result || -1;
};


var flow = nools.flow("Fibonacci Flow", function (flow) {

    flow.rule("Recurse", [
        ["not", Fibonacci, "f", "f.sequence == 1"],
        [Fibonacci, "f1", "f1.sequence != 1"]
    ], function (facts) {
        this.assert(new Fibonacci(facts.f1.sequence - 1));
    });

    flow.rule("Bootstrap", [
        Fibonacci, "f", "f.value == -1 && (f.sequence == 1 || f.sequence == 2)"
    ], function (facts) {
        this.modify(facts.f, function () {
            this.value = 1;
        });
    });

    flow.rule("Calculate", [
        [Fibonacci, "f1", "f1.value != -1", {sequence: "s1"}],
        [Fibonacci, "f2", "f2.value != -1 && f2.sequence == s1 + 1", {sequence: "s2"}],
        [Fibonacci, "f3", "f3.value == -1 && f3.sequence == s2 + 1"],
        [Result, "r"]
    ], function (facts) {
        var f3 = facts.f3, f1 = facts.f1, f2 = facts.f2;
        var v = f3.value = f1.value + facts.f2.value;
        facts.r.result = v;
        this.modify(f3);
        this.retract(f1);
    });
});

var r1 = new Result(),
    session1 = flow.getSession(new Fibonacci(10), r1),
    s1 = new Date;
session1.match().then(function () {
    console.log("%d [%dms]", r1.result, new Date - s1);
    session1.dispose();
});

var r2 = new Result(),
    session2 = flow.getSession(new Fibonacci(150), r2),
    s2 = new Date;
session2.match().then(function () {
    console.log("%d [%dms]", r2.result, new Date - s2);
    session2.dispose();
});

var r3 = new Result(),
    session3 = flow.getSession(new Fibonacci(1000), r3),
    s3 = new Date;
session3.match().then(function () {
    console.log("%d [%dms]", r3.result, new Date - s3);
    session3.dispose();
});*/
var ecommerceApp = angular.module('ecommerceApp', ['ngRoute', 'ngCookies']);
ecommerceApp.controller('mainController', function($scope, $http, $location, $cookies){

	var apiPath = "http://localhost:3000";

	$scope.register = function(){
		console.log($scope.username);
		$http.post(apiPath + '/register', {
			username: $scope.username,
			password: $scope.password,
			password2: $scope.password2,
			email: $scope.email
		}).then(function successCallback(response){
			console.log(response);
			if(response.data.message == 'added'){
				$cookies.put('token', response.data.token); //Will be used for validation
				$cookies.put('username', $scope.username); //Used strictly for info
				$location.path('/options');
			}
		},function errorCallback(response){
			console.log(response);
		});
	};



	$http.get(apiPath + '/getUserData?token=' + $cookies.get('token'))
	.then(function successCallback(response){
		//response.data.xxxxx = whatever res.json was in express. 
		if(response.data.failure == 'badToken'){
			$location.path = '/login' //Token is bad. Expired or fake. Goodbye.
		}else if(response.data.failure == 'noToken'){
			$location.path = '/login' //No token. Goodbye
		}else{
			//the token is good. Response.data will have their stuff in it.
		}
	}, function errorCallback(response){

	});

});

//Set up routes using the routes module
ecommerceApp.config(function($routeProvider){
	$routeProvider.when('/',{
		templateUrl: 'views/main.html',
		controller: 'mainController'
	})
	.when('/login',{
		templateUrl: 'views/login.html',
		controller: 'mainController'
	})
	.when('/register',{
		templateUrl: 'views/register.html',
		controller: 'mainController'
	})
	.when('/options',{
		templateUrl: 'views/options.html',
		controller: 'mainController'
	})
	.otherwise({
		redirectTo: '/'
	})

});
angular.module('lbxApp')
.run(['$rootScope', '$state', '$stateParams', 'ClientContext', function ($rootScope, $state, $stateParams, ClientContext) {

	$rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {

		$(".page-loading").removeClass("hidden");
		ClientContext.initialize().then(function (result) {
			if (toState.name !== 'app.sign-in' && toState.name !== 'app.password-reminder' && toState.name !== 'app.register') {
				ClientContext.currentState = toState.name;
			}
			
			if (toState.name === 'app.sell' || toState.name === 'app.buy') {
				if (ClientContext.isLoggedIn === false) {
					//clientContext.currentState = toState.name;
	    			event.preventDefault();
	    			$state.go('app.register');
	    		}
	    	}
		});
	});

	$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
		console.log(toState.name);
		$(".page-loading").addClass("hidden");
	});

	$rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
		console.log(unfoundState.to); // "lazy.state"
		console.log(unfoundState.toParams); // {a:1, b:2}
		console.log(unfoundState.options); // {inherit:false} + default options
	});

	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
}]);
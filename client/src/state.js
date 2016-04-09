angular.module('lbxApp')
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider){

	$urlRouterProvider.otherwise('/');
	
	$locationProvider.html5Mode(true);

	$stateProvider
		.state('app', {
			url: '',
			abstract: true,
			views: {
				'': {
					templateUrl: '/src/views/main.html'
				},
				'menu@app': {
					templateUrl: '/src/views/menu/menu.html',
					controller: 'menuController'
				},
				'footer@app': {
					templateUrl: '/src/views/footer/footer.html',
					controller: 'footerController'
				}
			}
		})
		.state('app.blank', {
			url: '/',
			views: {
				'menu@app': {
					templateUrl: '/src/views/info/blank.html'
				},
				'main@app': {
				 	templateUrl: '/src/views/info/info.html'
				},


				// 'main@app': {
				// 	templateUrl: '/src/views/home/home.html',
				// 	controller: 'homeController'
				// },
				// 'footer@app.home': {
				// 	templateUrl: '/src/views/footer/footer.html',
				// 	controller: 'footerController'
				// }
			}
		})
		.state('app.home', {
			url: '/home',
			views: {
				'main@app': {
					templateUrl: '/src/views/home/home.html',
					controller: 'homeController'
				},
				'footer@app.home': {
					templateUrl: '/src/views/footer/footer.html',
					controller: 'footerController'
				}
			}
		})		
		.state('app.sell', {
			url: '/sell',
			views: {
				'main@app': {
					templateUrl: '/src/views/sell/sell.html',
					controller: 'sellController'
				},
				'footer@app.sell': {
					templateUrl: '/src/views/footer/footer.html',
					controller: 'footerController'
				}
			}
		})
		.state('app.buy', {
			url: '/buy',
			params: { state:null},
			views: {
				'main@app': {
					templateUrl: '/src/views/buy/buy.html',
					controller: 'buyController'
				},
				'footer@app.buy': {
					templateUrl: '/src/views/footer/footer.html',
					controller: 'footerController'
				}
			}
		})
		.state('app.how-it-works', {
			url: '/how-it-works',
			views: {
				'main@app': {
					templateUrl: '/src/views/how-it-works/how-it-works.html',
					controller: 'howItWorksController'
				},
				'footer@app.how-it-works': {
					templateUrl: '/src/views/footer/footer.html',
					controller: 'footerController'
				}
			}
		})
		.state('app.contact-us', {
			url: '/contact-us',
			views: {
				'main@app': {
					templateUrl: '/src/views/contact-us/contact-us.html',
					controller: 'contactUsController'
				},
				'footer@app.contact-us': {
					templateUrl: '/src/views/footer/footer.html',
					controller: 'footerController'
				}
			}
		})
		.state('app.profile', {
			url: '/profile',
			views: {
				'main@app': {
					templateUrl: '/src/views/profile/profile.html',
					controller: 'profileController'
				},
				'content@app.profile': {
				 	templateUrl: '/src/views/profile/profile.html',
				 	controller: 'profileController'
				},
				'footer@app.profile': {
					templateUrl: '/src/views/footer/footer.html',
					controller: 'footerController'
				}
			}
		})
		.state('app.profile.home', {
			url: '/home',
			views: {
				'main@app': {
					templateUrl: '/src/views/profile/profile.html',
					controller: 'profileController'
				},
				'content@app.profile.home': {
				 	templateUrl: '/src/views/profile/homeProfile/homeProfile.html',
				 	controller: 'homeProfileController'
				},
				'footer@app.profile.home': {
					templateUrl: '/src/views/footer/footer.html',
					controller: 'footerController'
				}
			}
		})
		.state('app.profile.bids', {
			url: '/bids',
			views: {
				'main@app': {
					templateUrl: '/src/views/profile/profile.html',
					controller: 'profileController'
				},
				'content@app.profile.bids': {
				 	templateUrl: '/src/views/profile/bids/bids.html',
				 	controller: 'bidsController'
				},
				'footer@app.profile.bids': {
					templateUrl: '/src/views/footer/footer.html',
					controller: 'footerController'
				}
			}
		})
		.state('app.profile.bids.detail', {
			url: '/detail',
			views: {
				'main@app': {
					templateUrl: '/src/views/profile/profile.html',
					controller: 'profileController'
				},
				'content@app.profile.bids.detail': {
				 	templateUrl: '/src/views/profile/bids/bids.detail.html',
				 	controller: 'bidsDetailController'
				},
				'footer@app.profile.bids.detail': {
					templateUrl: '/src/views/footer/footer.html',
					controller: 'footerController'
				}
			}
		})			
		.state('app.profile.listings', {
			url: '/listings',
			views: {
				'main@app': {
					templateUrl: '/src/views/profile/profile.html',
					controller: 'profileController'
				},
				'content@app.profile.listings': {
				 	templateUrl: '/src/views/profile/listings/listings.html',
				 	controller: 'listingsController'
				},
				'footer@app.profile.listings': {
					templateUrl: '/src/views/footer/footer.html',
					controller: 'footerController'
				}
			}
		})
		.state('app.profile.listings.detail', {
			url: '/detail',
			views: {
				'main@app': {
					templateUrl: '/src/views/profile/profile.html',
					controller: 'profileController'
				},
				'content@app.profile.listings.detail': {
				 	templateUrl: '/src/views/profile/listings/listings.detail.html',
				 	controller: 'listingsDetailController'
				},
				'footer@app.profile.listings.detail': {
					templateUrl: '/src/views/footer/footer.html',
					controller: 'footerController'
				}
			}
		})	
		.state('app.profile.settings', {
			url: '/settings',
			views: {
				'main@app': {
					templateUrl: '/src/views/profile/profile.html',
					controller: 'profileController'
				},
				'content@app.profile.settings': {
				 	templateUrl: '/src/views/profile/settings/settings.html',
				 	controller: 'settingsController'
				},
				'footer@app.profile.settings': {
					templateUrl: '/src/views/footer/footer.html',
					controller: 'footerController'
				}
			}
		})
		.state('app.sign-in', {
			url: '/sign-in',
			views: {
				'main@app': {
					templateUrl: '/src/views/authenticate/sign-in.html',
					controller: 'signInController'
				}
			}
		})
		.state('app.password-reminder', {
			url: '/password-reminder',
			views: {
				'main@app': {
					templateUrl: '/src/views/authenticate/password-reminder.html',
					controller: 'passwordReminderController'
				}
			}
		})
		.state('app.register', {
			url: '/register',
			views: {
				'main@app': {
					templateUrl: '/src/views/authenticate/register.html',
					controller: 'registerController'
				}
			}
		});
}]);
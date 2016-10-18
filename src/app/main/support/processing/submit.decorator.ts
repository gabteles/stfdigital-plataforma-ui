namespace app.support {

	/** @ngInject */
	function configNgSbumitDecorator($provide: ng.auto.IProvideService) {
		$provide.decorator('ngSubmitDirective', ($delegate, $timeout: ng.ITimeoutService) => {
			let originalCompile = $delegate[0].compile;
			$delegate[0].compile = (element, attrs, transclude) => {
				if (angular.isString(attrs.stfProcessing)) {
					let alreadyMadeRequest = false;
					function handleDuplicateRequests(event) {
						if (alreadyMadeRequest) {
							event.preventDefault();
							event.stopImmediatePropagation();
						} else {
							alreadyMadeRequest = true;
							$timeout(() => {alreadyMadeRequest = false}, 500, false);
						}
					}
					element.on('submit', handleDuplicateRequests);
					attrs['ngSubmit'] = '$stfDecorateNgSubmitHandler(' + attrs['ngSubmit'] + ')';
					return originalCompile(element, attrs, transclude);
				} else {
					return originalCompile(element, attrs, transclude);
				}
			};
			
			return $delegate;
		});
	}

	angular.module('app.support').config(configNgSbumitDecorator);

}
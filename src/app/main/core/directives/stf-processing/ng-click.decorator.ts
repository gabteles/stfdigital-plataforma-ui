namespace app.core {

	/** @ngInject */
	function configNgClickDecorator($provide: ng.auto.IProvideService) {
		$provide.decorator('ngClickDirective', ($delegate, $timeout) => {
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
					element.on('click', handleDuplicateRequests);
					attrs['ngClick'] = '$stfDecorateNgClickHandler(' + attrs['ngClick'] + ')';
					return originalCompile(element, attrs, transclude);
				} else {
					return originalCompile(element, attrs, transclude);
				}
			};
			
			return $delegate;
		});
	}

	angular.module('app.core').config(configNgClickDecorator);

}
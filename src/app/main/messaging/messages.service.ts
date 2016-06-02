namespace app.messaging {
	'use strict';
	
	import IToastService = angular.material.IToastService;
	
	export class MessagesService {
		
		private static DEFAULT_HIDE_DELAY: number = 6000;
		private static DEFAULT_PARENT_SELECTOR: string = '#forms';
		private static DEFAULT_POSITION: string = 'bottom right';
		
		/** ngInject **/
		constructor(private $mdToast: IToastService) {
			
		}
		
		public error(message: string): void {
			this.$mdToast.show(
				this.$mdToast.simple()
					.textContent(message)
					.position(MessagesService.DEFAULT_POSITION)
					.theme('error-toast')
					.hideDelay(MessagesService.DEFAULT_HIDE_DELAY)
			);
		}
		
		public success(message: string): void {
			this.$mdToast.show(
				this.$mdToast.simple()
					.textContent(message)
					.position(MessagesService.DEFAULT_POSITION)
					.theme('success-toast')
					.hideDelay(MessagesService.DEFAULT_HIDE_DELAY)
			);
		}
		
	}
	
	angular.module('app.messaging').service('app.messaging.MessagesService', MessagesService);
}
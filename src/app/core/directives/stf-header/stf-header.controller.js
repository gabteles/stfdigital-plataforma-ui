(function() {

	var app = angular.module('app.core');

	app.service('stfBreadcrumbs', StfBreadcrumbs);

	/** @ngInject */
	function StfBreadcrumbs($rootScope, $state, msNavigationService) {
		self = this;

		self.EMPTY_BREADCRUMB = {
			current: {
				label: '',
				link: ''
			},
			parents: []
		};

		self.breadcrumbs = self.EMPTY_BREADCRUMB;

		self.additionalNavigationItems = {
		};

		self.saveItem = function(path, item) {
			self.additionalNavigationItems[path] = item;
		};

		$rootScope.$watch(function() {
			return $state.current.name;
		}, function(val) {
			self.breadcrumbs = _generateBreadcrumbs(val);
		});

		var _navigationObject = function() {
			var navigation = msNavigationService.getNavigationObject();

			return navigation;
		};

		var _generateBreadcrumbs = function(stateName) {
			var navigation = _navigationObject();

			var recurse = function(nodes) {
				return _.map(nodes, function(node) {
					return [
						node,
						recurse(node.children)
					]
				})
			};

			var flattenedNavigations = _.flattenDeep(recurse(navigation));

			var stateNameComponents = stateName.split('.');

			var matchedNavigation;
			var componentsLength = stateNameComponents.length;
			for (var i = 0; i < componentsLength; i++) {
				var matchedNavigation = _.find(flattenedNavigations, { 'state': stateNameComponents.join('.')} );
				if (matchedNavigation) break;
				stateNameComponents.pop();
			}

			if (!matchedNavigation) {
				// Breadcrumb vazio
				return self.EMPTY_BREADCRUMB;
			} else {
				return _getBreadcrumbFromPath(_getBreadcrumbPath(matchedNavigation._path));
			}
		};

        var _getBreadcrumbPath = function(pathStr) {
			var navigation = _navigationObject();

			var path = pathStr.split('.');
			
			var completePath = [];

			while (completePath.length < path.length) {
				var found = false;

				for (var i = 0; i < navigation.length; i++) {
					if (navigation[i]._id == path[completePath.length]) {
						completePath.push(navigation[i]);
						navigation = navigation[i].children;
						found = true;
						break;
					}
				}
			}

			return completePath;
		};

        var _getBreadcrumbFromPath = function(path) {
			var breadcrumbs = {
				parents: [],
				current: null
			};

			for (var i = 0; i < path.length; i++) {
				var parsedPathPart = _parsePathPart(path[i]);

				if (i+1 == path.length) {
					breadcrumbs.current = parsedPathPart;
				} else {
					breadcrumbs.parents.push(parsedPathPart);
				}
			}

			return breadcrumbs;
		};

        var _parsePathPart = function(part) {
			return {
				label: part.translation,
				link: part.uisref
			};
		};
	}

	app.classy.controller({
		name: 'StfHeaderController',

		inject: ['$scope', '$rootScope', 'msNavigationService', '$state', 'stfBreadcrumbs'],

		init: function() {
			this.$scope.info = {};
			var self = this;
			this.$scope.hasBreadcrumb = function() {
				return self.stfBreadcrumbs.breadcrumbs != self.stfBreadcrumbs.EMPTY_BREADCRUMB;
			};
			if(!this.$scope.layoutOnly) {
				this.$scope.stfBreadcrums = this.stfBreadcrumbs;
			}
		}
	});

})();
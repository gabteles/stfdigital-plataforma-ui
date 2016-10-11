namespace app.core {

    export interface BreadcrumbPath {
        id: string;
        translation: string;
        uisref: string;
        parent?: string;
    }

    export class StfBreadcrumbsService {

        public EMPTY_BREADCRUMB = {
            current: {
				label: '',
				link: ''
			},
			parents: []
        };

        public breadcrumbs = this.EMPTY_BREADCRUMB;

        private registeredPaths: BreadcrumbPath[] = [];

        /** @ngInject */
        constructor($rootScope: ng.IRootScopeService, $state: ng.ui.IStateService, private msNavigationService) {
            $rootScope.$watch(() => {
                return $state.current.name;
            }, (val) => {
                this.breadcrumbs = this._generateBreadcrumbs(val);
            });
        }

        public getRegisteredPath(id: string) {
            return _.find(this.registeredPaths, (p) => p.id === id);
        }

        public registerPath(path: BreadcrumbPath) {
            let foundPath = this.getRegisteredPath(path.id);
            if (!foundPath) {
                this.registeredPaths.push(path);
            }
        }

        private _generateBreadcrumbs(stateName) {
			let navigation = this._navigationObject();

			let recurse = (nodes) => {
				return _.map(nodes, (node: any) => {
					return [
						node,
						recurse(node.children)
					]
				})
			};

			let flattenedNavigations = _.flattenDeep(recurse(navigation));

			let stateNameComponents = stateName.split('.');

			let matchedNavigation;
			let componentsLength = stateNameComponents.length;
			for (let i = 0; i < componentsLength; i++) {
				matchedNavigation = _.find(flattenedNavigations, { 'state': stateNameComponents.join('.')} );
				if (matchedNavigation) break;
				stateNameComponents.pop();
			}

			if (!matchedNavigation) {
				// Breadcrumb vazio
				return this.EMPTY_BREADCRUMB;
			} else {
				return this.getBreadcrumbFromPath(this._getBreadcrumbPath(matchedNavigation._path));
			}
		}

        private _navigationObject() {
			return this.msNavigationService.getNavigationObject();
		}

        private _getBreadcrumbPath(pathStr) {
			let navigation = this._navigationObject();

			let path = pathStr.split('.');
			
			let completePath = [];

			while (completePath.length < path.length) {
				let found = false;

				for (let i = 0; i < navigation.length; i++) {
					if (navigation[i]._id == path[completePath.length]) {
						completePath.push(navigation[i]);
						navigation = navigation[i].children;
						found = true;
						break;
					}
				}
			}

			return completePath;
		}

        private buildPathArrayRecursively(path: BreadcrumbPath, pathArray: BreadcrumbPath[]): BreadcrumbPath[] {
            pathArray.unshift(path);
            if (path.parent) {
                let parent = _.find(this.registeredPaths, (p) => p.id === path.parent);
                if (parent) {
                    this.buildPathArrayRecursively(parent, pathArray);
                }
            }
            return pathArray;
        }

        public generateBreadcrumbFromLocalPath(path) {
            if (!angular.isArray(path) && path.parent) {
                return this.getBreadcrumbFromPath(this.buildPathArrayRecursively(path, []));
            } else {
                return this.getBreadcrumbFromPath(path);
            }
        }

        public getBreadcrumbFromPath(path) {
			let breadcrumbs = {
				parents: [],
				current: null
			};

			for (let i = 0; i < path.length; i++) {
				let parsedPathPart = this._parsePathPart(path[i]);

				if (i+1 == path.length) {
					breadcrumbs.current = parsedPathPart;
				} else {
					breadcrumbs.parents.push(parsedPathPart);
				}
			}

			return breadcrumbs;
		}

        private _parsePathPart(part) {
			return {
				label: part.translation,
				link: part.uisref
			};
		}

    }

    angular.module('app.core').service('stfBreadcrumbsService', StfBreadcrumbsService);
}
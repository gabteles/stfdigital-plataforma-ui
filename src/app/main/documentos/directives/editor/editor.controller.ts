namespace app.documentos {
	import IScope = angular.IScope;
	import IQService = angular.IQService;
	import IIntervalService = angular.IIntervalService;
	import IPromise = angular.IPromise;
	
	export class EditorController {
		
		showEditor: boolean = true;
		showProgress: boolean = false;
		edicaoIniciada: boolean = false;
	
		documento: any;
	
		config: {};
		
		static $inject = ['$q', '$interval', '$scope', 'app.documentos.OnlyofficeService'];
		
		constructor(private $q: IQService, private $interval: IIntervalService, private $scope: EditorScope, private onlyofficeService: OnlyofficeService) {
			this.documento = $scope.documento;
			
			var verificarEdicaoIniciada = () => {
				var tentativas = 0;
				var deferred = $q.defer();
				var verificarEdicao = () => {
					var tratarNaoAtivo = () => {
						tentativas++;
						if (tentativas < 20) {
							$interval(verificarEdicao, 1000, 1);
						} else {
							deferred.reject();
						}
					};
					this.onlyofficeService.recuperarNumeroEdicao($scope.documento.id).then((edicao) => {
						console.log(edicao);
						if (edicao.ativo) {
							deferred.resolve();
						} else {
							tratarNaoAtivo();
						}
					}, (edicao) => {
						console.log(edicao);
						tratarNaoAtivo();
					});
				};
				verificarEdicao();
				return deferred.promise;
			};
			
			var verificarEdicaoCompleta = () => {
				var tentativas = 0;
				var deferred = $q.defer();
				var verificarEdicao = () => {
					this.onlyofficeService.recuperarNumeroEdicao($scope.documento.id).then((edicao) => {
						console.log(edicao);
						tentativas++;
						if (tentativas < 20) {
							$interval(verificarEdicao, 1000, 1);
						} else {
							deferred.reject();
						}
					}, (edicao) => {
						console.log(edicao);
						deferred.resolve();
					});
				};
				verificarEdicao();
				return deferred.promise;
			};
			
			$scope.api = {
				salvar: () => {
					if ($scope.aguardarConclusao == "true") {
						this.showEditor = false;
						this.showProgress = true;
						verificarEdicaoCompleta().then(() => {
							$scope.edicaoConcluida();
						}, () => {
							$scope.edicaoTimeout();
							this.showEditor = true;
							this.showProgress = false;
						});
					} else if ($scope.aguardarConclusao == "false") {
						$scope.edicaoConcluida();
					}
				}
			};
			
			var iniciarEditor = (numeroEdicao) => {
				$q.all([this.onlyofficeService.criarUrlConteudoDocumento($scope.documento.id),
						this.onlyofficeService.recuperarUrlCallback($scope.documento.id)])
					.then((urls) => {
						this.config = {
							editorConfig : {
								lang: 'pt-BR',
								customization: {
									about: true,
									chat: true
								},
								user: {
									id: 'usuario-teste',
									name: 'Usuário Teste'
								},
							},
							document: {
								src: urls[0],
								key: numeroEdicao,
								name: $scope.documento.nome,
								callbackUrl: urls[1]
							}
						};
						verificarEdicaoIniciada().then(() => {
							this.edicaoIniciada = true;
						});
					});
			};
			this.onlyofficeService.gerarNumeroEdicao($scope.documento.id).then((edicao) => {
				iniciarEditor(edicao.numero);
			});
		}
		
		private verificarEdicaoIniciada(): IPromise<any> {
			return this.$q.when();
			/*
			var tentativas = 0;
			var deferred = this.$q.defer();
			var verificarEdicao = () => {
				var tratarNaoAtivo = () => {
					tentativas++;
					if (tentativas < 20) {
						this.$interval(verificarEdicao, 1000, 1);
					} else {
						deferred.reject();
					}
				};
				this.onlyofficeService.recuperarNumeroEdicao(this.documento.id).then((edicao) => {
					console.log(edicao);
					if (edicao.ativo) {
						deferred.resolve();
					} else {
						tratarNaoAtivo();
					}
				}, (edicao) => {
					console.log(edicao);
					tratarNaoAtivo();
				});
			};
			verificarEdicao();
			return deferred.promise;*/
		}
		
	}
	angular.module('app.documentos').controller('app.documentos.EditorController', EditorController);
}
namespace app.documentos {
	import IScope = angular.IScope;
	import IQService = angular.IQService;
	import IIntervalService = angular.IIntervalService;
	import IPromise = angular.IPromise;
	import IDeferred = angular.IDeferred;
	
	export class EditorController {
		
		showEditor: boolean = true;
		showProgress: boolean = false;
		edicaoIniciada: boolean = false;
	
		documento: any;
	
		config: {};
		
		static $inject = ['$q', '$interval', '$scope', 'app.documentos.OnlyofficeService'];
		
		constructor(private $q: IQService, private $interval: IIntervalService, private $scope: EditorScope, private onlyofficeService: OnlyofficeService) {
			this.documento = $scope.documento;
			
			$scope.api = {
				salvar: () => {
					if ($scope.aguardarConclusao == "true") {
						this.showEditor = false;
						this.showProgress = true;
						this.verificarEdicaoCompleta().then(() => {
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
						this.verificarEdicaoIniciada().then(() => {
							this.edicaoIniciada = true;
						});
					});
			};
			this.onlyofficeService.gerarNumeroEdicao($scope.documento.id).then((edicao) => {
				iniciarEditor(edicao.numero);
			});
		}
		
		private tentativasVerificaoEdicaoCompleta: number = 0;
		private deferredEdicaoCompleta: IDeferred<{}>;
		
		verificarEdicaoCompleta() {
			this.tentativasVerificaoEdicaoCompleta = 0;
			this.deferredEdicaoCompleta = this.$q.defer();
			this.iteracaoVerificarEdicaoCompleta();
			return this.deferredEdicaoCompleta.promise;
		};
		
		private iteracaoVerificarEdicaoCompleta() {
			this.onlyofficeService.recuperarNumeroEdicao(this.documento.id).then((edicao) => {
				console.log(edicao);
				this.tentativasVerificaoEdicaoCompleta++;
				if (this.tentativasVerificaoEdicaoCompleta < 20) {
					this.$interval(() => this.iteracaoVerificarEdicaoCompleta(), 1000, 1);
				} else {
					this.deferredEdicaoCompleta.reject();
				}
			}, (edicao) => {
				console.log(edicao);
				this.deferredEdicaoCompleta.resolve();
			});
		}
		
		private tentativasVerificaoEdicaoIniciada: number = 0;
		private deferredEdicaoIniciada: IDeferred<{}>;
		
		private verificarEdicaoIniciada(): IPromise<{}> {
			this.tentativasVerificaoEdicaoIniciada = 0;
			this.deferredEdicaoIniciada = this.$q.defer();
			this.iteracaoVerificarEdicaoIniciada();
			return this.deferredEdicaoIniciada.promise;
		}
		
		private iteracaoVerificarEdicaoIniciada() {
			this.onlyofficeService.recuperarNumeroEdicao(this.documento.id).then((edicao) => {
				console.log(edicao);
				if (edicao.ativo) {
					this.deferredEdicaoIniciada.resolve();
				} else {
					this.tratarNaoAtivo();
				}
			}, (edicao) => {
				console.log(edicao);
				this.tratarNaoAtivo();
			});
		}
		
		private tratarNaoAtivo() {
			this.tentativasVerificaoEdicaoIniciada++;
			if (this.tentativasVerificaoEdicaoIniciada < 20) {
				this.$interval(() => this.iteracaoVerificarEdicaoIniciada(), 1000, 1);
			} else {
				this.deferredEdicaoIniciada.reject();
			}
		}
		
	}
	angular.module('app.documentos').controller('app.documentos.EditorController', EditorController);
}
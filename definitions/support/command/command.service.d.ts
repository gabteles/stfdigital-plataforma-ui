declare namespace app.support.command {
    import Properties = app.support.constants.Properties;
    /**
     * Interface para um comando
     */
    interface Command {
    }
    /**
     * Interface para definição de um alvo do comando.
     * Ex: Processo, Peticao, etc
     */
    interface CommandTarget {
        type: string;
        status?: string;
    }
    /**
     * Interface para definição de um matcher
     * que verifica se o comando é aplicável para um alvo.
     */
    interface CommandMatcher {
        match(targets: CommandTarget[]): boolean;
    }
    /**
     * Interface para definição de um validador para o comando.
     */
    interface CommandValidator {
        isValid(command: Command): boolean;
    }
    /**
     * Interface da configuração de uma rota.
     */
    interface RouteConfig {
        stateName: string;
        navigationItem: string;
        translation: string;
        urlPrefix: string;
        src: string;
    }
    /**
     * Interface da configuração de um alvo de um comando.
     */
    interface TargetConfig {
        type: string;
        mode: string;
    }
    /**
     * Interface para definição de um filtro para os comandos
     */
    interface CommandFilter {
        targetType?: string;
        context?: string;
    }
    /**
     * Classe que define a configuração de um comando.
     */
    class CommandConfig {
        id: string;
        description: string;
        context: string;
        route: RouteConfig;
        target: TargetConfig;
        listable: boolean;
        startProcess: boolean;
        protected matchers: CommandMatcher[];
        protected validator: CommandValidator;
        /**
         * Adiciona um matcher
         */
        addMatcher(matcher: CommandMatcher): void;
        /**
         * Relaciona um validador
         */
        setValidator(validator: CommandValidator): void;
        /**
         * Varifica se o comando é aplicável ao conjunto de alvos
         */
        match(targets: CommandTarget[], filter?: CommandFilter): boolean;
        /**
         * Verifica se um comando é válido
         */
        isValid(command: Command): boolean;
        /**
         * Verifica se o modo do comando é compatível com a quantidade de alvos
         */
        private isCompatibleMode(length);
    }
    /**
     * Serviço para manipulação das configurações de comando.
     */
    class CommandService {
        private $q;
        private properties;
        private commandsConfig;
        /** @ngInject **/
        constructor($http: ng.IHttpService, $q: ng.IQService, properties: Properties);
        /**
         * Lista os comandos
         */
        list(): ng.IPromise<CommandConfig[]>;
        /**
         * Adiciona um matcher a uma configuração
         */
        addMatcher(id: string, matcher: CommandMatcher): void;
        /**
         * Relaciona um validador a uma configuração
         */
        setValidator(id: string, validator: CommandValidator): void;
        /**
         * Lista os comandos que são aplicáveis à lista de alvos.
         */
        listMatched(targets: CommandTarget[], filter?: CommandFilter): ng.IPromise<CommandConfig[]>;
        /**
         * Verifica se um comando é valido de acordo com sua configuração.
         * Um validator deve ser criado para realizar a checagem
         */
        isValid(id: string, command: Command): ng.IPromise<boolean>;
        /**
         * Pesquisa uma configuração por id
         */
        findById(id: any): ng.IPromise<CommandConfig>;
    }
}

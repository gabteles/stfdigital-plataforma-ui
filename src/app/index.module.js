(function ()
{
    'use strict';

    /**
     * Main module of the Fuse
     */
    angular
        .module('app', [

            // Core
            'app.core',

            // Navigation
            'app.navigation',

            // Toolbar
            'app.toolbar',

            // Quick panel
            'app.quick-panel',

            // Pages
            'app.login',
            'app.cadastro',

            'app.novo-processo',

            'app.gestao',
            'app.gestao.meus-paineis',

            //'app.ultimos-acessos',
            'app.pesquisa-avancada',
            
            'app.documentos',

            'app.tarefas.minhas-tarefas',
            //'app.tarefas.painel-de-fases',
            //'app.tarefas.notificacoes',

            'app.configuracoes.meu-perfil',
            //'app.tarefas.peticao',
            //'app.tarefas.peticao-fisica',
            //'app.configuracoes.administracao',
        ]);
})();

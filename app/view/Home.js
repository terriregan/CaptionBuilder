Ext.define("CB.view.Home", {
    extend: 'Ext.container.Container',
    alias: 'widget.home',

    itemId: 'home',

    config: {
        title: 'Welcome to the Caption Builder',
        instructions: ''
    },

    border: false,

    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    },

    items: [
        {
            xtype: 'component',
            html: '[  not implemented  ]'
        }
    ]

});
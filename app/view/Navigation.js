Ext.define('CB.view.Navigation', {
    extend: 'Ext.toolbar.Toolbar',
    alias : 'widget.navigation',
    id: 'main-navigation',

    cls: 'global-nav',

    defaults: {
        scale: 'medium',
        iconAlign: 'bottom'
    },

    requires: [
        'Ext.button.Split'
    ],

    initComponent: function() {
        this.items = [
            {
                glyph: 72,
                scale: 'medium',
                action: '/'
            },
            '-',
            {
                text : 'Open',
                action: '/Project'
            },
            '->',
            {
                xtype: 'component',
                itemId: 'loggedinuser',
                tpl: 'Welcome {username}!',
                margin: '0 15 0 0'
            }
        ];

        this.callParent();
    }

});
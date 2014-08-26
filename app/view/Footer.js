Ext.define('CB.view.Footer', {
    extend: 'Ext.toolbar.Toolbar',
    alias : 'widget.pagefooter',


    height: 30,

    defaults: {
        cls: 'x-bottom-nav-btn',
        overCls: 'x-bottom-nav-btn-over'
    },

    items: [
        {
            xtype: 'component',
            html : '&copy; National Foreign Language Center at the University of Maryland',
            margin: '0 20 0 0'
        },
        '->',
        {
            text: 'Caption Builder Home',
            action: CB.Constants.ACTION_GO_CB_HOME
        },
        {
            xtype: 'tbseparator',
            style: {
                border: '1px inset #dddddd'
            }

        },
        {
           text: 'BLOOM Home',
           action: CB.Constants.ACTION_GO_BLOOM_HOME
        },
        {
            xtype: 'tbseparator',
            style: {
                border: '1px inset #dddddd'
            }

        },
        {
            text: 'Help',
            action: CB.Constants.ACTION_HELP
        },
        {
            xtype: 'tbseparator',
            style: {
                border: '1px inset #dddddd'
            }

        },
        {
            text: 'User Support',
            margin: '0 15 0 0',
            action: CB.Constants.ACTION_SUPPORT
        }
    ]

});

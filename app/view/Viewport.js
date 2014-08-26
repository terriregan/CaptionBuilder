Ext.define('CB.view.Viewport', {
    extend: 'Ext.container.Viewport',

    requires:[
        'Ext.layout.container.Border',
        'Ext.layout.container.Card',
        'Ext.layout.container.VBox',
        'CB.view.ProjectGrid',
        'CB.view.ContentObjectGrid',
        'CB.view.CaptionPanel',
        'CB.view.Header',
        'CB.view.Footer',
        'CB.view.Navigation'
    ],

    layout: 'border',
    border: false,

    items: [
        //HEADER
        {
            region: 'north',
            xtype : 'pageheader',
            cls: 'app-header'
        },

        // CENTER CONTAINER
        {
            region: 'center',
            layout: {
                type:'vbox',
                align:'stretch'
            },

            items: [
                // NAVIGATION
                {
                    xtype:'navigation',
                    border: 0,
                    height: 40
                },

                /* BREADCRUMB
                {
                    xtype : 'component',
                    layout: 'hbox',
                    id: 'breadcrumb',
                    margin: '15, 25, 0, 25',
                    cls: 'breadcrumb'
                },*/

                // PAGE TITLE
                {
                    xtype : 'component',
                    itemId: 'contenttitle',
                    cls: 'page-title',
                    margin: '25, 25, 0, 25'
                },

                // PAGE INSTRUCTIONS
                {
                    xtype : 'component',
                    itemId: 'pageinstructions',
                    cls: 'page-instructions',
                    margin: '15, 25, 0, 25'
                },

                // CONTENT AREA
                {
                    xtype: 'panel',
                    header: false,
                    border: false,

                    itemId: 'cardstack',

                    flex: 1,

                    layout : {
                        type : 'card',
                        deferredRender : true
                    },

                    defaults: {
                        margin: '10 25 25 25'
                    },

                    items: [
                        {
                            xtype: 'home',
                            itemId: 'home'

                        },
                        {
                            xtype: 'projectgrid',
                            itemId: 'projectgrid'
                        },
                        {
                            xtype: 'contentobjectgrid',
                            itemId: 'contentobjectgrid'
                        },
                        {
                            xtype: 'captionpanel',
                            itemId: 'captionpanel'
                        }
                    ]
                }

            ]
        },

        // FOOTER
        {
            region: 'south',
            xtype : 'pagefooter',
            cls: 'app-footer',
            height: 35
        }
    ]
});

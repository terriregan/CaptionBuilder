Ext.define("CB.view.SourcePanel", {
    extend: 'Ext.panel.Panel',
    alias: 'widget.sourcepanel',

    autoScroll: true,

   items: [
        {
            xtype: 'component',
            itemId: 'textToProcess',
            padding: '3 10 10 10',
            width: '100%',
            height: '100%',
            html: 'TEXT'
        }
    ]
});
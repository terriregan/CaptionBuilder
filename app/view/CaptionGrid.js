Ext.define("CB.view.CaptionGrid", {
    extend: 'Ext.panel.Panel',          // change to Container
    alias: 'widget.captiongrid',

    requires: [
        'CB.view.CaptionItem'
    ],

    bodyStyle: {
        background: '#f5f5f5'
    },

    cls: 'caption-grid',

    autoScroll: true,

    //collapsible: true,
    //collapseDirection: Ext.Component.DIRECTION_RIGHT,

    defaults: {
      margin: '1 0 0 0'
    }
});
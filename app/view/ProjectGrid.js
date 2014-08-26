Ext.define("CB.view.ProjectGrid", {
    extend: 'Ext.grid.Panel',
    alias: 'widget.projectgrid',

    itemId: 'projectgrid',

    requires: [
        'Ext.grid.Panel',
        'Ext.ux.grid.FiltersFeature'
    ],

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    config: {
        title: 'Open Project',
        instructions: 'Select a Project'
    },

    header: false,
    flex: 1,
    columnLines: true,
    store: 'ProjectStore',
    autoScroll: true,
    cls: 'grid-nav',

    features: [
         {
            ftype: 'filters',
            local: true
         }
     ],

    columns: [
        {
            text: 'Project Name',
            dataIndex : 'id',
            flex: 2
        },
        {
            text: 'Product',
            dataIndex : 'product',
            flex: 1,
            filter: {
                type: 'list'
            }
        },
        {
            text: 'Year',
            dataIndex : 'year',
            flex: 1,
            filter: {
                type: 'list'
            }
        },
        {
            text: 'Cycle',
            dataIndex : 'cycle',
            flex: 1,
            filter: {
                type: 'list'
            }
        }
    ],

    dockedItems: [{
        xtype: 'toolbar',
        dock: 'bottom',
        height: 28
    }]

});
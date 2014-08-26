Ext.define('CB.view.ContentObjectGrid', {
    extend: 'Ext.grid.Panel',
    alias:  'widget.contentobjectgrid',

    requires: [
        'Ext.grid.Panel',
        'Ext.ux.grid.FiltersFeature',
        'Ext.grid.column.Action',
        'Ext.grid.column.Date'
    ],

    config: {
        title: 'Open Content Object',
        instructions: 'Select a Content Object to caption.'
    },

    store: 'ContentObjectStore',
    columnLines: true,
   /* selModel: {
        selType: 'checkboxmodel',
        headerWidth: 35,
        mode: 'SIMPLE'
    },*/

    header: false,
    autoScroll: false,
    cls: 'grid-nav',

    columns: [  // Ask what columns to go here
        {
            text: 'Source Material Title',
            dataIndex : 'titleEnglish',
            flex: 2
        },

        {
            text: 'FOID',
            dataIndex : 'foid',
            flex: 1,
            renderer: function(value) {
                return Ext.String.format('<a class="btk-link">{0}</a>', value);
            }
        },
        {
            text: 'Media Type',
            dataIndex : 'sourcetype',
            flex: 1
        },
        {
            text: 'Language',
            dataIndex : 'language',
            flex: 1.5
        },
        {
            text: 'Level',
            dataIndex : 'level',
            flex: 1
        },
        // {
        //     text: 'Modified By',
        //     dataIndex : 'lmodusr',
        //     flex: 1
        // },
        // {
        //     text: 'Date Modified',
        //     dataIndex : 'lmod',
        //     xtype: 'datecolumn',
        //     format: 'm/j/Y g:i A',
        //     flex: 1
        // }
    ],

    dockedItems: [{
        xtype: 'toolbar',
        dock: 'bottom',
        height: 28
    }],


    initComponent: function() {

        var filters = {
            ftype: 'filters',
            encode: true,
            local: true,
            filters: [
                {
                    type: 'string',
                    dataIndex: 'language'
                },
                {
                    type: 'string',
                    dataIndex: 'level'
                },
                {
                    type: 'string',
                    dataIndex: 'sourcetype'
                },
                {
                    type: 'string',
                    dataIndex: 'lmodusr'
                }
            ]
        };

        this.features = [filters],
            this.callParent();
    }

});
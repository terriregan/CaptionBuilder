Ext.define('CB.view.Dashboard', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.dashboard',

    requires: [
        'Ext.form.field.ComboBox'
    ],

    border: false,
    cls: 'dashboard',

    layout: {
        type: 'hbox'
    },

    items: [
        {
            xtype: 'container',
            flex: 1,
            layout: {
                type: 'hbox'
            },

            items: [
                {
                    xtype: 'combobox',
                    itemId: 'comboType',
                    editable: false,
                    labelWidth: 130,
                    //value: 'Captions',
                    value: 'Subtitles',
                    fieldLabel : 'I want to work on',
                    store: ['Captions', 'Subtitles'],
                    margin: '0 2 0 0'
                },
                {
                    xtype: 'button',
                    itemId: 'btnType',
                    action: 'start',
                    text: 'BEGIN',
                    width: 80,
                    margin: '0 40 0 0',
                    cls: 'x-btn-dashboard'
                }
            ]
        },
        {
            xtype: 'container',
            layout: {
                type: 'hbox',
                pack: 'end'
            },
            flex: 1,
            items: [
                {
                    xtype: 'combobox',
                    itemId: 'comboHow',
                    editable: false,
                    labelWidth: 155,
                    value: 'Sentences',
                    fieldLabel : 'Create captions from:',
                    store: ['Sentences', 'Paragraphs', 'Line breaks', 'Manual'],
                    margin: '0 2 0 0'
                },
                {
                    xtype: 'button',
                    itemId: 'btnHow',
                    action: 'how',
                    text: 'APPLY',
                    width: 80,
                    cls: 'x-btn-dashboard'
                },
                {
                    xtype: 'button',
                    itemId: 'btnSave',
                    action: 'save',
                    text: 'SAVE',
                    width: 80,
                    cls: 'x-btn-dashboard'
                },
                {
                    xtype: 'component',
                    itemId: 'btnReset',
                    action: 'reset',
                    padding: '4 10 0 10',
                    html: '<a href="#">Reset</a>'
                }
            ]
        }

    ]
});
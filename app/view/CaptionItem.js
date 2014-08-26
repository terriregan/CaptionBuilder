Ext.define("CB.view.CaptionItem", {
    extend: 'Ext.container.Container',
    alias: 'widget.captionitem',

    requires: [
        'Ext.layout.container.HBox',
        'Ext.form.field.Text'
    ],

    config: {
        timeVO : null  // obj props: { id, iso, timeIn, timeOut,caption }
    },

    cls: 'caption-item',

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    bodyStyle: {
        background: '#eee'
    },

    initComponent: function() {
        this.callParent(arguments);

        Ext.suspendLayouts();
        this.add(
            // button IN and TIME-CODE
            {
                xtype: 'container',
                width: 100,

                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },

                margin: '0 0 -5 0',
                padding: 0,

                items: [
                    {
                        xtype: 'button',
                        itemId: 'btnIn',
                        text: 'START',
                        margin: '0 0 1 0',
                        flex: 1,
                        bubbleEvents: ['click']
                    },
                    {
                        xtype: 'textfield',
                        value: this.getTimeVO().timeIn,
                        itemId: 'timeIn',
                        fieldCls: 'x-timecode',
                        flex: 1,
                        maskRe: /[\d:\.]+/,
                        regex: /^[0-5][0-9]:[0-5][0-9]($|\.\d{1,2}$)/,
                        regexText: 'Invalid format. Valid format: 00:00.00',
                        bubbleEvents: ['focus', 'blur']
                    }
                ]
            },
            // button OUT and TIME-CODE
            {
                xtype: 'container',
                width: 100,

                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },

                margin: '0 0 -5 0',
                padding: 0,

                items: [
                    {
                        xtype: 'button',
                        itemId: 'btnOut',
                        text: 'END',
                        margin: '0, 0 1 0',
                        flex: 1,
                        bubbleEvents: ['click']
                    },
                    {
                        xtype: 'textfield',
                        value: this.getTimeVO().timeOut,
                        itemId: 'timeOut',
                        fieldCls: 'x-timecode',
                        flex: 1,
                        maskRe: /[\d:\.]+/,
                        regex: /^[0-5][0-9]:[0-5][0-9]($|\.\d{1,2}$)/,
                        regexText: 'Invalid format. Valid format: 00:00.00',
                        bubbleEvents: ['focus', 'blur']
                    }
                ]
            },
            // CAPTION
            {
                xtype: 'container',
                flex: 1,
                cls: 'caption-container',
                html: '<div class="lang-' + this.getTimeVO().iso + '">' + this.getTimeVO().caption + '<div>'
            }
        );
        Ext.resumeLayouts(true);
    }

});

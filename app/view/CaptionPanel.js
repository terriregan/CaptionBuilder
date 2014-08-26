Ext.define("CB.view.CaptionPanel", {
    extend: 'Ext.container.Container',
    alias: 'widget.captionpanel',

    itemId: 'captionpanel',

    requires:[
        'Ext.layout.container.Border',
        'Ext.layout.container.Card',
        'Ext.layout.container.VBox',
        'Ext.layout.container.HBox',
        'CB.view.Dashboard',
        'CB.view.VideoPanel',
        'CB.view.AudioPanel',
        'CB.view.SourcePanel',
        'CB.view.CaptionGrid'
    ],

    config: {
        title: 'Create Captions',
        instructions: 'Basic instructions for creating captions and subtitles.'
    },

    border: false,

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [
        {
            xtype: 'dashboard',
            padding: '10 0 20 5'
        },
        {
            xtype: 'container',
            flex: 1,
            itemId: 'mediacardstack',

            layout: {
                type: 'card',
                deferredRender : true
            },

            items: [
                // AUDIO
                {
                    xtype: 'container',
                    itemId: 'audioView',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },

                    items: [
                        {
                            xtype: 'audiopanel'
                        },
                        {
                            xtype: 'container',
                            flex: 1,
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },

                            items: [
                                {
                                    xtype: 'sourcepanel',
                                    flex: 1
                                },
                                {
                                    xtype: 'captiongrid',
                                    itemId: 'captionGridAudio',
                                    flex: 1
                                }
                            ]
                        }
                    ]
                },
                // VIDEO
                {
                    xtype: 'container',
                    itemId: 'videoView',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },

                    items: [
                        {
                            xtype: 'videopanel',
                            flex: 1
                        },
                        {
                            xtype: 'captiongrid',
                            itemId: 'captionGridVideo',
                            flex: 1
                        }
                    ]
                }
            ]
        }
    ]
});
/*
    NOTES:
    Fires events:
        none

    Listens for events:
        - EVENT_HASH
        - EVENT_CAPTION
        - EVENT_CAPTION_CREATE

 */

Ext.define('CB.controller.Source', {
    extend: 'Ext.app.Controller',

    refs : [
        {
            ref : 'sourcePanel',
            selector : 'sourcepanel #textToProcess'
        }
    ],

    init : function() {
        this.listen({
            controller : {
                '#Main' : {
                    hash : this.clearSource
                },

                '#Caption' : {
                    caption : this.onCaption,
                    captionCreate : this.onCaptionCreate
                }
            }

           /* TODO - Implement source text selection 
           component : {
                'sourcepanel' : {
                    render : this.onSourcePanelRender
                }
            }*/

        });
    },

    // ----------------------------------------------
    // EVENT HANDLING
    // ----------------------------------------------

    clearSource: function() {
       if (!this.getSourcePanel()) {
            console.log('clearSource')
            Ext.defer(this.clearSource, 100, this);
            return;
        }
        this.getSourcePanel().update('TEXT');
    },

    onCaption: function(co) {
        // this methods is currently the same as onCaptionCreate
        // when source text selection is enable, this will change
        if(co) {
            var text,
                code;

            if( co.captionType == 'captions') {
                text = co.transcript;
                code = co.isoCode;
            } else {
                text = co.translation;
                code = 'eng';
            }

            if( co.mediaType != 'video') {
                var pre = '<pre lang="' + code + '" class="lang-' +  code +'">' + text + '</pre>'
                this.getSourcePanel().update(pre);
            }
        }
    },

    onCaptionCreate: function(co) {
        if(co) {
            var text,
                code;

            if( co.captionType == 'captions') {
                text = co.transcript;
                code = co.isoCode;
            } else {
                text = co.translation;
                code = 'eng';
            }

            if( co.mediaType != 'video') {
                var pre = '<pre lang="' + code + '" class="lang-' +  code +'">' + text + '</pre>'
                this.getSourcePanel().update(pre);
            }
        }
    }
});

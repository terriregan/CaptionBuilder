/*
 TODO:
    - show "loading" messgage
    - show "media not found" message

    NOTES:
    Fires events:
        none

    Listens for events:
        - EVENT_RDF_PARSED
        - EVENT_HASH
        - EVENT_CAPTION
        - EVENT_CAPTION_CLEAR
        - EVENT_CAPTION_CREATE
        - EVENT_TIME_IN
        - EVENT_TIME_OUT

 */
Ext.define('CB.controller.Media', {
    extend: 'Ext.app.Controller',

    id: 'mediaController',

    player: null,
    trackEvents: [],
    audioEl: null,
    videoEl: null,
    audioCaptionEl: null,
    videoCaptionEl: null,
    isoCls: null,

    refs : [
        {
            ref : 'videoPanel',
            selector : 'videopanel'
        },
        {
            ref : 'audioPanel',
            selector : 'audiopanel'
        }
    ],

    init : function() {
        this.listen({
            controller : {
                '#Main' : {
                    hash : this.onHash
                },

                '#Caption' : {
                    rdfParsed : this.onRdfParsed,
                    caption : this.onCaption,
                    captionClear : this.removeTrackEvents,
                    captionCreate : this.onCreate,
                    timeIn : this.onTimeIn,
                    timeOut : this.onTimeOut
                }
            }

            /*
            TODO: Implement Source Panel view for creating captions
            by making text selections
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

    onRdfParsed: function(co) {
        // store refs to avoid unnecessary dom look-ups
        this.storeMediaRefs(co); 

        var playerEl = (co.mediaType == 'video') ? this.videoEl : this.audioEl;

        if(playerEl) {
            this.player = Popcorn(playerEl.dom);
        }
    },

    onCaption: function(co) {
        //nflcapp.console.log('------ onCaption ---------')

        this.addMedia(co);
        this.formatLanguageDisplay(co);
        this.addTrackEvents(co);
    },

    onCreate: function(co) {
        this.addMedia(co);
    },

    onHash: function() {
        this.removeTrackEvents();
        this.removeLastTrackEvent();
        this.removeMedia();
    },

    onTimeIn: function(vo) {
        if(this.player) {
            var trackEvent = this.player.getTrackEvent(vo.id);
            if(trackEvent) {
                trackEvent.start = vo.timeIn;
            }
        }
    },

    onTimeOut: function(vo) {
        if(this.player) {
            var trackEvent = this.player.getTrackEvent(vo.id);
            if(trackEvent) {
                trackEvent.end = vo.timeOut;
            }
        }
    },


    // ----------------------------------------------
    // MEDIA METHODS
    // ----------------------------------------------

    addMedia: function(co) {
        if(this.player && co.media) {
            this.player.media.setAttribute("src", co.media);
        } else {
            // show message saying that there is no media
        }
    },

    removeMedia: function() {
        if(this.player) {
            this.player.media.setAttribute("src", "");
            this.player = null;
        }
    },

    getCurrentTime: function() {
        if(this.player) {
            return this.player.currentTime();
        }
        return null;
    },

    // ----------------------------------------------
    // TRACK EVENT METHODS
    // ----------------------------------------------

    addTrackEvents: function(co) {
        // The currently displayed event does not get removed 
        // during removeTrackEvents, so removing it here
        this.removeLastTrackEvent();  

        for (var i = 0; i < co.captions.length; i++) {
            var caption = co.captions[i];
            this.addTrackEvent(caption.id, caption);
        }
    },

    addTrackEvent: function(id, caption) {
        if(this.player) {
            this.player.subtitle(id, caption);
        }
    },

    removeTrackEvents: function() {
        // nflcapp.console.log('------ removeTrackEvents ---------');

        if(this.player) {

            var trackEvents = this.player.getTrackEvents(),
                len = trackEvents.length;

            for(var i = 0; i < len; i++) {
                this.removeTrackEvent(trackEvents[i].id);
            }
        }
    },

    removeTrackEvent: function(id) {
        if(this.player) {
           this.player.removeTrackEvent(id);
        }
    },

    /*
        Removes currently displayed track event
     */
    removeLastTrackEvent: function() {
        if(this.player) {
            var id = this.player.getLastTrackEventId();
            if(id) {
                this.removeTrackEvent(id);
            }
        }
    },

    // ----------------------------------------------
    // CAPTION FORMAT METHODS
    // ----------------------------------------------

    formatLanguageDisplay: function(co) {

        var captionEl = this.getCaptionEl(co.mediaType),
            cls = (co.captionType == 'captions') ? 'lang-' + co.isoCode : 'lang-eng';

        if(this.isoCls) {
            captionEl.removeCls(this.isoCls);
        }

        captionEl.addCls(cls);
        this.isoCls = cls;
    },

    // ----------------------------------------------
    // UTILITY METHODS
    // ----------------------------------------------

    getCaptionEl: function(mediaType) {
        return (mediaType == 'video') ? this.videoCaptionEl : this.audioCaptionEl;
    },

    storeMediaRefs: function(co) {
        nflcapp.console.log('storeMediaRefs');

        if(co.mediaType == 'video') {
            if(this.videoEl) {
                return;
            } else {
                if( !Ext.get('video-caption') &&  !Ext.get('video-player')) {
                    Ext.defer(this.storeMediaRefs, 100, this, [co]);
                    return;
                }
            }

            this.videoEl = Ext.get('video-player');
            this.videoCaptionEl = Ext.get('video-caption');

        } else {
            if(this.audioEl) {
                return;
            } else {
                if( !Ext.get('audio-caption') &&  !Ext.get('audio-player')) {
                    Ext.defer(this.storeMediaRefs, 100, this, [co]);
                    return;
                }
            }

            this.audioEl = Ext.get('audio-player');
            this.audioCaptionEl = Ext.get('audio-caption');
        }

    }
});


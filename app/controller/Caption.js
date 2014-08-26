/*
    NOTES:
    Fires events:
        - EVENT_RDF_PARSED
        - EVENT_CAPTION
        - EVENT_CAPTION_CLEAR
        - EVENT_CAPTION_CREATE
        - EVENT_TIME_IN
        - EVENT_TIME_OUT

    Listens for events:
         - EVENT_RDF
         - EVENT_RDF_ERROR
         - EVENT_HASH
 */
Ext.define('CB.controller.Caption', {
    extend: 'Ext.app.Controller',

    requires: [
        'CB.view.CaptionItem'
    ],

    co : {
        uri: null,
        changed : false,
        isoCode : 'eng',
        mediaType : null,
        captionType : null,     // captions, subtitles
        translation : null,
        transcript : null,
        media : null,           // video. audio, text
        captions: []            // array of objs with props: { id, iso, timeIn, timeOut, caption }
    },

    captionGrid: null,
    mask: null,

    refs: [
        {
            ref : 'mediaCardStack',
            selector : '#mediacardstack'
        },
        {
            ref : 'captionPanel',
            selector : '#captionpanel'
        },
        {
            ref : 'captionGridVideo',
            selector : '#captionGridVideo'
        },
        {
            ref : 'captionGridAudio',
            selector : '#captionGridAudio'
        },
        {
            ref : 'dashboard',
            selector : 'dashboard'
        }
    ],

    init: function() {
        this.listen({
            controller : {
                '#Main' : {
                    rdf : this.onRdfLoaded,
                    errorRdf: this.onRdfError,
                    hash: this.onHash
                },

                '#Caption' : {
                    captionCreate : this.onCreate,
                    caption : this.onEdit
                }
            },
            component: {
                'dashboard button[action=start]': {
                    click: 'onCaptionBegin'
                },

                'dashboard button[action=how]': {
                    click: 'onGenerateCaptionsFrom'
                }
            }
        })
    },

    // ----------------------------------------------
    // EVENT HANDLING
    // ----------------------------------------------

    onRdfLoaded: function(xdoc, uri, created, lastmod, revision) {
        // console.log('-------  onRdfLoaded  ----------');
        // dc:language (iso code)
        // asset:translation
        // asset:transcription
        // asset:text
        // asset:video
        // asset:audio
        // dc:type [MovingImage, Text, Sound (video, text, audio objects)

        this.co.uri = uri;

        var node = Ext.DomQuery.jsSelect('rdf|Description', xdoc);
        if(node) {

            this.co.mediaType = this.getObjectType(Ext.DomQuery.selectValue('dc|type', node));;

            this.co.isoCode = Ext.DomQuery.selectValue('dc|language', node);
            this.co.translation = Ext.DomQuery.selectValue('asset|translation', node);

            if(this.co.mediaType == 'video') {
                this.co.media = Ext.DomQuery.selectValue('asset|video', node);
                this.co.transcript = Ext.DomQuery.selectValue('asset|transcription', node);

            } else if (this.co.mediaType == 'audio') {
                this.co.media = Ext.DomQuery.selectValue('asset|audio', node);
                this.co.transcript = Ext.DomQuery.selectValue('asset|transcription', node);

            } else if(this.co.mediaType == 'text') {
                this.co.media = Ext.DomQuery.selectValue('asset|audio', node);
                this.co.transcript = Ext.DomQuery.selectValue('asset|text', node);
            }
        }

        this.configureUI();
        this.fireEvent(CB.Constants.EVENT_RDF_PARSED, this.co);
    },

    onRdfError: function(err) {
        console.log(err.status); // 404, 415
    },

    onCaptionBegin: function(btn) {

        this.removeCaptions();
        this.co.captionType = this.getDashboard().down('#comboType').getValue().toLowerCase();
        this.showLoadMask(this.getCaptionPanel(), "Checking for " + this.co.captionType + "...");

        this.loadCaptions();
    },

    onCreate: function() {
        // no captions, create new
        this.toggleDashboard('create');
        this.hideLoadMask();
    },

    onEdit: function() {
        // captions file loaded
        this.toggleDashboard('edit');
        this.hideLoadMask();
    },

    onHash: function() {
        this.resetCo();
        this.removeCaptions();
        this.captionGrid = null;
    },

    onGenerateCaptionsFrom: function() {
        var how = this.getDashboard().down('#comboHow').getValue().toLowerCase();
        var text = (this.co.captionType == 'captions') ? this.co.transcript : this.co.translation,
            captions;
        if(text) {
            switch(how) {
                case 'sentences':
                    captions = CB.util.Caption.generateFromSentences(text);
                    break;

                case 'paragraphs':
                    captions = CB.util.Caption.generateFromParagraphs(text);
                    break;

                case 'line breaks':
                    captions = CB.util.Caption.generateFromLineBreaks(text);
                    break;

                default:
                    // assume manual source text highlighting
            }
        }

        if(captions) {
            this.showLoadMask(this.getCaptionPanel(), "Generating " + this.co.captionType + "...");

            /*
             Defer caption creation function to allow load mask display
             JS is single threaded. DOM modification (i.e. turning mask on) is made immediately
             AFTER current execution path is finished. Masks turned on in beginning of a time-consuming task will not display because
             browser waits with DOM changes until it finishes (after function execution).
             If mask turned  off at the end of method, it might not show at all.
             */
            Ext.defer(function() {
                this.createCaptions(captions);
            }, 10, this);
        }
    },

    onCaptionInOutClick: function(cmp) {
        var item = cmp.up('captionitem');
        var mc = this.getController('Media'),
            currentTime = mc.getCurrentTime()

        // console.log('currentTime ' + currentTime)
        if(currentTime != null) {
            if(cmp.itemId == 'btnIn') {
                this.setCaptionTimeIn(item, currentTime);
                this.updateCaptionDisplay(item.down('#timeIn'), currentTime);

                // if previous caption exists, set its OUT to current caption's IN
                var prevItem = item.previousNode('captionitem(true)');
                if(prevItem) {
                    this.setCaptionTimeOut(prevItem, currentTime);
                    this.updateCaptionDisplay(prevItem.down('#timeOut'), currentTime);
                }
            } else {
                this.setCaptionTimeOut(item, currentTime);
                this.updateCaptionDisplay(item.down('#timeOut'), currentTime)
            }
        }
    },

    onCaptionTimecodeFocus: function(cmp) {
        cmp.restoreValue = cmp.getValue();
    },

    onCaptionTimecodeBlur: function(cmp) {
        var item = cmp.up('captionitem');

        // If field is not empty
        if(cmp.getValue() != '') {
            if(cmp.isValid()) {
               if(cmp.getValue() != '' && cmp.getValue().indexOf('.') == -1) {
                    cmp.setValue(cmp.getValue() + '.00')
                }
                console.log('cmp.getValue()' + cmp.getValue())
                var time = Popcorn.util.toSeconds(cmp.getValue())
                if(cmp.itemId == 'timeIn') {
                    this.setCaptionTimeIn(item, time);

                    // if previous caption exists, set its OUT to current caption's IN
                    var prevItem = item.previousNode('captionitem(true)');
                    if(prevItem) {
                        this.setCaptionTimeOut(prevItem, time);
                        this.updateCaptionDisplay(prevItem.down('#timeOut'), time);
                    }
                } else {
                    this.setCaptionTimeOut(item, time);
                }
            } else {
                Ext.MessageBox.show({
                    title: 'INVALID TIME CODE',
                    msg: '<b>Invalid time code.</b><br>Update with a valid format:<br> 00<b>:</b>00<b>.</b>00',
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR,
                    width: 270
                });
            }
        } else {
            // restore previous value if field is set to empty
            if(cmp.restoreValue) {
                cmp.setValue(cmp.restoreValue);
                cmp.restoreValue = null;
            }
        }
    },


    // ----------------------------------------------
    // UI METHODS
    // ----------------------------------------------

    configureUI: function() {
        console.log('this.getMediaCardStack ' + this.getMediaCardStack)

        if (!this.getMediaCardStack || !this.getMediaCardStack()) {
            //console.log('configureUI')
            Ext.defer(this.configureUI, 100);
            return;
        }

        var layout = this.getMediaCardStack().getLayout();

        if(this.co.mediaType == 'video') {
            layout.setActiveItem('videoView');
            this.captionGrid = this.getCaptionGridVideo();
        } else {
            layout.setActiveItem('audioView');
            this.captionGrid = this.getCaptionGridAudio();
        }

        this.toggleDashboard('start');
    },

    toggleDashboard: function(view) {
        var dashboard = this.getDashboard();

        switch (view) {
            case 'start':
                dashboard.down('#comboHow').hide();
                dashboard.down('#btnHow').hide();
                dashboard.down('#btnSave').hide();
                dashboard.down('#btnReset').hide();
                break;

            case 'create':
                dashboard.down('#comboHow').show();
                dashboard.down('#btnHow').show();
                dashboard.down('#btnSave').hide();
                dashboard.down('#btnReset').hide();
                break;

            case 'edit':
                dashboard.down('#comboHow').hide();
                dashboard.down('#btnHow').hide();
                dashboard.down('#btnSave').show();
                dashboard.down('#btnReset').show();
        }
    },

    showLoadMask: function(target, msg) {
        if(target) {
            this.mask = new Ext.LoadMask({target: target, msg: msg});
            this.mask.show();
        }
    },

    hideLoadMask: function() {
        if(this.mask) {
            this.mask.hide();
        }
    },

    // ----------------------------------------------
    // CAPTION METHODS
    // ----------------------------------------------

    addCaption: function(caption) {
        var iso = (this.co.captionType == 'captions') ? this.co.isoCode : 'eng';
        var timeVO = {
            id: caption.id,
            iso: iso,
            timeIn: caption.start,
            timeOut: caption.end,
            caption: caption.text
        }

        var item = Ext.widget('captionitem', {
            itemId: 'item' + caption.id,
            timeVO: timeVO
        });

        if(item) {
            item.on({
                click: this.onCaptionInOutClick,
                blur: this.onCaptionTimecodeBlur,
                focus: this.onCaptionTimecodeFocus,
                scope: this
            });

            if( this.captionGrid) {
               this.captionGrid.add(item);
            }
        }
    },

    removeCaption: function(caption) {
        //this.captionGrid.add(item);
    },

    removeCaptions: function() {
        this.co.captions = [];
        if(this.captionGrid) {
            this.captionGrid.removeAll();
        }

        this.fireEvent(CB.Constants.EVENT_CAPTION_CLEAR);
    },

    setCaptionTimeIn: function(item, time) {
        // nflcapp.console.log(time);
        var voConfig = item.getTimeVO();

        if(voConfig) {
            var captionData = this.getCaptionById(voConfig.id);

            if(captionData.timeIn != time) { // only update if there is a change
                captionData.timeIn = time;

                // fire event so media can update its track event
                this.fireEvent(CB.Constants.EVENT_TIME_IN, captionData);
            }
        }
    },

    setCaptionTimeOut: function(item, time) {
        //nflcapp.console.log('setCaptionTimeOut ' + time);
        var voConfig = item.getTimeVO();

        if(voConfig) {
            var captionData = this.getCaptionById(voConfig.id);

            if(captionData.timeOut != time) {  // only update if there is a change
                captionData.timeOut = time;

                // fire event so media can update its track event
                this.fireEvent(CB.Constants.EVENT_TIME_OUT, captionData);
            }
        }
    },

    /*
     * @param  field    textfield to update
     * @param  time     time in seconds
     */
    updateCaptionDisplay: function(field, time) {
        field.setValue(CB.util.Utils.secondsToTime(time));
    },

    getCaptionById: function(id) {
        if(this.co.captions) {
            var len = this.co.captions.length;
            for(var i = 0; i < len; i++) {
                if( this.co.captions[i].id == id) {
                    return this.co.captions[i];
                }
            }
            return null;
        }
    },


    // ----------------------------------------------
    // DATA METHODS
    // ----------------------------------------------

   loadCaptions: function() {
        var me = this,
            url = '/apis/learnobj' + this.co.uri + '/' + this.co.captionType + '.xml';

        // for dev
        url = 'resources/media/' + this.co.captionType + '.xml'; 
        //console.log(url);

        Ext.Ajax.request({
            url: url,

            success: function(res, opts) {
                me.parseCaptions(res.responseXML);
            },

            failure: function(res, opts) {
                me.fireEvent(CB.Constants.EVENT_CAPTION_CREATE, me.co);  // no caption file, assume creation? (handle errors)
            }
        });
    },

   parseCaptions: function(xdoc) {
        var me = this,
            i = 1,   // do not start at 0 as Popcorn framework does not recognize a 0 trackEvent id--no idea why
            preview = (me.co.mediaType == 'video') ? 'video-caption' : 'audio-caption',
            captions = Ext.DomQuery.jsSelect('p', xdoc);


       Ext.suspendLayouts();
       Ext.each(captions, function(c) {
            var caption = {
                id: i,
                start: Ext.DomQuery.selectValue('@begin', c),
              // start:0,
                end: Ext.DomQuery.selectValue('@end', c),
                text: c.textContent,
                target: preview
            }

            me.co.captions.push(caption);
            me.addCaption(caption);

            i++;
        });
      
       Ext.resumeLayouts(true);

       this.fireEvent(CB.Constants.EVENT_CAPTION, this.co);
   },

    createCaptions: function(captions) {
         // nflcapp.console.log('createCaptions')

        var me = this,
            preview = (me.co.mediaType == 'video') ? 'video-caption' : 'audio-caption',
            len = captions.length;
       
        Ext.suspendLayouts();

        // TODO: The performance on the loop dom additions is horrible.  This needs to be optimized
        // Do not start at 0 as Popcorn framework does not recognize a 0 trackEvent id
        for( var i = 1; i  < len; i++) {   
            var caption = {
                id: i,
                text: captions[i],
                target: preview
            }
            this.co.captions.push(caption);
            this.addCaption(caption);
        }
        nflcapp.console.log('Loop complete. Added ' + i + ' captions');
        Ext.resumeLayouts(true);

        this.hideLoadMask();
        this.fireEvent(CB.Constants.EVENT_CAPTION, this.co);
    },


    getObjectType: function(nodeValue) {

        switch(nodeValue) {
            case 'MovingImage':
                return'video';

            case 'Sound':
                return 'audio';

            case 'Text':
                return 'text';

            default:
                return null;
        }
    },

    resetCo: function() {
       this.co =  {
          uri: null,
            changed : false,
            isoCode : 'eng',
            mediaType : null,
            captionType : null,
            translation : null,
            transcript : null,
            media : null,
            captions: []
        }
    }
});

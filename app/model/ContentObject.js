// This will need to be moved into a shared - merge the 2 models

Ext.define('CB.model.ContentObject', {
    extend: 'Ext.data.Model',

    proxy : {
        type : 'ajax',
        reader : {
            type : 'json',
            root : 'contentobj'
        }
    },

    fields: [
        {
            name: 'id'                      // lo:contentObjId
        },
        {
            name: 'foid'                    // lo:lrnObjId -- is this a hasMany association?  Can it belong to more than 1 learning object?
        },
        {
            name: 'projid'                  // lo:project - is this a hasMany association?  Can it belong to more than 1 project?
        },
        {
            name: 'level'                   // ilr:level
        },
        {
            name: 'topic'                   // lo:topic
        },
        {
            name: 'language'                // lo:lang  -- prop was language
        },
        {
            name: 'local'                   // this is new (iso is used in language model -- should be the same)
        },
        {
            name: 'titleEnglish',           // asset:title xml:lang="eng"
            type: 'string'
        },
        {
            name: 'uri'                     // asset:uri
        },
        {
            name: 'type',                   // dc:type xsi:type="dcterms:DCMIType"  (text, audio, video)
            type: 'string'
        },
        {
            name: 'sourcetype',            // essentially the modality
            type: 'string'
        },
        {
            name: 'text',                   // asset:text xml:lang="bul"
            type: 'string'
        },
        {
            name: 'audioUrl'                // asset:audio xml:lang="bul" (assume, verify)  -- since this is a link, would it still be of labeled asset:audio or asset:audioURL?
        },
        {
            name: 'videoUrl'                // asset:video xml:lang="bul" (assume, verify)  -- since this is a link, would it still be of labeled asset:video or asset:videoURL?
        },
        {
        	name: 'sourceUrl'
        },
        {
            name: 'wordCount'               // asset:wordCount
        },
        {
            name: 'locked',                 // DOES NOT appear in current rdf
            type: 'boolean'
        },
        {
            name: 'translation',             // asset:translation xml:lang="eng"
            type: 'string'
        },
        {
            name: 'transcription',           // asset:transcript xml:lang="bul" (assume, verify)
            type: 'string'
        },
        {
            name: 'narration'               // asset:narration xml:lang="bul" (assume, verify)
        },
        {
            name: 'lmod'                   // NEW last modified
        },
        {
            name: 'lmodusr'                // NEW last modified user
        }
    ],

    /*
     * Private
     */
    getPathPart:function () {
        return this.data.projid + '/' + this.data.local + '/' + this.data.type + '/data';
    },

    getUuidRequestPath: function(){
        return '/apis/learnobj/UUID/Project/' + this.getPathPart() + '/' + this.data.foid + '/Source.json';
    },
    
    getContentObjUrl: function() {
    	return this.getFinalObjRepositoryPath() + '/' + this.data.foid + '/Source/' + this.data.id + '.json';   	
    },

    getFinalObjMediaUrl: function() {
    	return this.getFinalObjRepositoryPath() + '/' + this.data.foid + '/Media.json';   	
    },

    getReviewLink: function (uri) {
        if(this.data.uri ) {
            return location.protocol +'//' + location.host + this.getFinalObjRepositoryPath() + '/' +  this.data.foid + '/preview.xhtml';
        } else {
            return null;
        }
    },

    // FORMAT : /apis/learnobj/Project/ALLVLO_FY2012_TTO4/apc/video/data/v12apc01/Source/c588a026-d448-4f47-9c8b-29472f15856d
    getDevelopLink: function (uri) {
        if(this.data.uri ) {
            return location.protocol +'//' + location.host + '/apps/CIT#' + this.data.uri;
        } else {
            return null;
        }
    }
});
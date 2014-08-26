/**
 * Created by tregan on 4/13/14.
 */

Ext.define('CB.util.Caption', {
    singleton: true,

    generateFromSentences : function(text) {
        var arr = text.match( /[^\.!\?]+[\.!\?]+/g );
            len = arr.length;

        return arr;
    },

    // TODO
    generateFromLineBreaks : function(text) {

    },

     // TODO
    generateFromParagraphs : function(text) {

    }
})

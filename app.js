/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when upgrading.
*/

var Bloomer;

Ext.Loader.setConfig({
    enabled : true,
    paths: {
        'CB' : 'app',
        'Btk' : '../shared',
        'Ext.ux.Router': '../shared/ux/Router.js',
        'Ext.ux' : '../ext-4.2/examples/ux'        // need to use the 4.2 ux distribution--shared folder uses 4.1 - this is throwing a sencha cmd build error due to apache rewrite
    }
});


Ext.application({
    name: 'CB',
    extend: 'CB.Application',

    launch: function() {
        Ext.tip.QuickTipManager.init();
        Ext.setGlyphFontFamily('Pictos');

        this.checkForLogin();

    }

});

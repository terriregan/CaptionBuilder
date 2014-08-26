Ext.define('CB.Application', {
    name: 'CB',

    extend: 'Ext.app.Application',

    requires: [
        'Ext.ux.Router',
        'Ext.window.MessageBox',
        'CB.Constants',
        'CB.util.Utils',
        'CB.util.Caption'
    ],

    controllers: [
        'Main',
        'Caption',
        'Source',
        'Media'
    ],

    stores: [
        'ProjectStore',
        'ContentObjectStore'
    ],

    models: [

    ],

    views: [
        'CB.view.Viewport'
    ],

    // need to handle browser refreshes
    routes: {

        '/': 'main#onHome',

        '/Project': 'main#onProjectList',
        '/Project/:projectId': 'main#onProject',
        '/ContentObject?*uri/:foid': 'main#onContentObject'
    },

    /**
     * Check if we have a logged user
     */
    checkForLogin: function() {
        Ext.Ajax.request({
            url: '/apis/timetrk/user/loggedinuser.json',
            scope: this,

            callback: function(opts, success, response){
                if ( success ) {
                    var r = Ext.decode(response.responseText);
                    Bloomer = r.user;

                    this.displayView();
                } else {

                    // login failed, return to main login screen
                    this.reDirectToLogin();
                }
            }
        })
    },

    displayView: function() {
        // create main application viewport
        Ext.create('CB.view.Viewport', {
            listeners: {
                afterrender: function() {
                    var mask = Ext.get('loading-mask'),
                        parent = Ext.get('loading-parent');

                    // Destroy the masks
                    mask.fadeOut({callback: function(){ mask.destroy(); }});
                    parent.fadeOut({callback: function(){ parent.destroy(); }});
                }
            }
        });
    },

    reDirectToLogin: function() {
        window.top.location.replace(location.protocol + '//' + location.host + '?redirect=CB&hash=' + location.hash);
    }
});

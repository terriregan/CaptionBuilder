/*
    NOTES:
    Manages global navigation and screen loading
    Fires events:
        - EVENT_RDF
        - EVENT_HASH
        - EVENT_RDF_ERROR

    Listens for events:
        - EVENT_RDF
        - EVENT_RDF_ERROR
        - EVENT_HASH
*/

Ext.define('CB.controller.Main', {
    extend: 'Ext.app.Controller',

    requires : ['CB.util.Utils'],

    projectId: null,
    pendingProjectId: null,
    mask: null,

    requires: [
        'CB.view.Home',
        'CB.view.ProjectGrid'
    ],

    views : ['CB.view.Viewport'],

    refs: [
        {
            ref: 'navigation',
            selector: 'navigation'
        },
        {
            ref : 'cardStack',
            selector : '#cardstack'
        },
        {
            ref : 'contentTitle',
            selector : '#contenttitle'
        },
        {
            ref : 'breadCrumb',
            selector : '#breadcrumb'
        },
        {
            ref : 'pageInstructions',
            selector : '#pageinstructions'
        }
    ],

    init: function() {
        this.listen({
            controller : {
                '#Main' : {
                    rdf : this.onRdfLoaded,
                    errorRdf: this.onRdfError,
                    hash: this.onHash
                }
            },
            component: {
                'navigation': {
                    afterrender: 'afterNavRender'
                },

                'button[action=logout]': {
                    click: 'onLogOut'
                },

                'navigation button': {
                    click: 'onNavClick'
                },

                'home': {
                    render: 'afterViewRender'
                },

                'projectgrid': {
                    itemclick: function(grid, rec) {
                        Ext.Router.redirect('/Project/' + rec.get('id'));
                    }
                },

                'contentobjectgrid': {
                    itemclick: function(grid, rec) {
                        var uri = rec.get('uri'),
                            coid = uri.substr(uri.indexOf('/Project')),
                            foid = rec.get('foid');

                        Ext.Router.redirect('/ContentObject?'+coid + '/' + foid);  // all co's may not be linked to foid, so this may change to titleEnglish
                    }
                },

                'pagefooter button': {
                    click: 'onPageFooterButtonClicked'
                }
            }
        })
    },

    // ----------------------------------------------
    // EVENT HANDLING
    // ----------------------------------------------

    afterViewRender: function(cmp) {
        this.updateScreenTitle(cmp);
    },

    afterNavRender: function(nav) {
        nav.down('#loggedinuser').update({username: Bloomer.displayname});
    },

    onLogOut: function(button) {
        top.document.location.replace('/apis/timetrk/user/logout');
    },

    onNavClick: function(button) {
        Ext.Router.redirect(button.action);
    },

    onPageFooterButtonClicked: function(button) {
       switch( button.action )
        {
            case ( CB.Constants.ACTION_GO_CB_HOME ):
                Ext.Router.redirect(button.action);
                break;

            case ( CB.Constants.ACTION_GO_BLOOM_HOME ):
                top.document.location.replace('/index.html');
                break;

            case ( CB.Constants.ACTION_HELP ):
                Ext.MessageBox.alert('Help', 'Help is not complete');
                break;

            case (CB.Constants.ACTION_SUPPORT ):
                Ext.MessageBox.alert('User Support', 'User Support is not complete');
                break;
        }
    },

    /*
        NOTE: This method is too specific.  Will need to be refactored
        if additional global nav menu items are added.
     */
    onHash: function() {
        var crumbs = location.hash.split('/'),
            trail;

        crumbs.shift();
        var len = crumbs.length;

        if( len < 2 ) {
           this.updateBreadcrumb();
           return;
        }

        var name,
            url = '';
        for( var i = 0; i < len; i++) {
           // nflcapp.console.log(i + ' : ' + crumbs[i])
           if( len == 2 ) {
               trail = [
                   { id: 'link0', url: '/Project', name: 'Open Project'},
                   { id: 'link1', url: null, name: crumbs[1]}
               ]
           } else {
               trail = [
                   { id: 'link0', url: '/Project', name: 'Open Project'},
                   { id: 'link1', url: '/Project/'+ crumbs[2], name: crumbs[2]},
                   { id: 'link2', url: null, name: crumbs[len-1]}
               ]
           }
           this.updateBreadcrumb(trail);
        }
        
        this.updateBreadcrumb(trail);
    },

    // ----------------------------------------------
    // ROUTE HANDLING
    // ----------------------------------------------

    onHome: function () {
        this.projectId = null;
        this.loadScreen('home');

        this.fireEvent(CB.Constants.EVENT_HASH)
    },

    onProjectList: function () {
        this.fireEvent(CB.Constants.EVENT_HASH);

        this.projectId = null;
        this.loadScreen('projectgrid');
    },

    onProject: function(args) {
        this.fireEvent(CB.Constants.EVENT_HASH);

        this.pendingProjectId = args.projectId;
        var cmp = this.loadScreen('contentobjectgrid');
        if (cmp) {
            this.updateDataStore(cmp);
        } else {
            CB.util.Utils.checkForRender('contentobjectgrid', this, this.updateDataStore);
        }
    },

    onContentObject: function(args) {
        this.fireEvent(CB.Constants.EVENT_HASH);

        this.showLoadMask(this.getCardStack(), 'Loading Content Object...');
        this.loadContentObject(args.uri);
    },

    onRdfLoaded: function() {
        this.hideLoadMask();
        this.loadScreen('captionpanel');
    },

    onRdfError: function() {
        this.hideLoadMask();
        Ext.MessageBox.alert('Error', 'Unable to load Content Object');
    },


    // ----------------------------------------------
    // UI METHODS
    // ----------------------------------------------

    loadScreen: function(screen) {

        if (!this.getCardStack()) {
            console.log('loadScreen')
            Ext.defer(this.loadScreen, 100, this, [screen]);
            return;
        }

        var activeCmp = this.getCardStack().getLayout().setActiveItem(screen);
        if(activeCmp) {
            this.updateScreenTitle(activeCmp);
        }

        return activeCmp;
    },

    updateScreenTitle: function(cmp) {
        var page = this.getPageInstructions();
        this.getContentTitle().update(cmp.getTitle().toUpperCase());

        if(cmp.getInstructions()){
            page.update(cmp.getInstructions());
            page.show();
        } else {
            page.hide();
        }
    },

    updateBreadcrumb: function(crumbs) {
        var trail = '';

        if(!this.getBreadCrumb()) {
            Ext.defer(this.updateBreadcrumb, 100, this, [crumbs]);
            return;
        }

        var breadcrumb = this.getBreadCrumb();
        if(crumbs != null ) {
            var len = crumbs.length;
            for( var i = 0; i < len; i++ ) {
                if(crumbs[i].url) {
                    trail += '<a id="' + crumbs[i].id +'" href="' + crumbs[i].url + '">' + crumbs[i].name + '</a>   >   ';
                } else {
                    trail +=  crumbs[i].name;
                }
            }

            breadcrumb.update(trail);

            for( var i = 0; i < len; i++ ) {
                if(crumbs[i].url) {
                    Ext.get(crumbs[i].id).on("click", this.redirect, this, {
                        preventDefault: true,
                    });
                }
            }
            breadcrumb.show();

        } else {  // need to remove listeners el.un('click', this.handlerFn);?
            breadcrumb.hide();
            breadcrumb.update('');
        }
    },

    redirect: function(e, cmp) {
        var url = cmp.href.substring( cmp.href.indexOf('/Project'));
        Ext.Router.redirect(url);
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
    // DATA METHODS
    // ----------------------------------------------

    updateDataStore: function(grid) {
        if(this.pendingProjectId && (this.pendingProjectId != this.projectId)) {  // do not reload if project has nt changed
            this.projectId = this.pendingProjectId;
            this.pendingProjectId = null;

            grid.store.removeAll();

            // var uri = '/apis/learnobj/ContentObjects/Project/' + this.projectId + '.json';
            var uri = 'resources/data/cos.json';
            grid.store.getProxy().url = uri;
            grid.store.load({
                scope: this,
                callback: function(records, operation, success) {
                    if(success) {
                        nflcapp.console.log('success')
                    } else {
                        nflcapp.console.log('error')
                    }
                }
            });
        }
    },

    loadContentObject: function(uri) {
        var me = this,
            url = '/apis/learnobj' + uri + '.rdf';

        // for demo
        url = 'resources/data/rdf.xml'; 

        Ext.Ajax.request({
            url: url,

            success: function(res, opts) {

                var created = res.getResponseHeader('Created'),
                    lastmod = res.getResponseHeader('Last-Modified'),
                    revision = res.getResponseHeader('Revision');

                me.fireEvent(CB.Constants.EVENT_RDF, res.responseXML, uri, created, lastmod, revision);
            },

            failure: function(res, opts) {
                me.fireEvent(CB.Constants.EVENT_RDF_ERROR, res);
            }
        });
    }

});
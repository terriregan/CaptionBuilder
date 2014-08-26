// Need to use shared Btk store
Ext.define('CB.store.ProjectStore', {
    extend: 'Ext.data.Store',

    requires: [
        'CB.model.Project'
    ],

    autoLoad: true,        // should change to false
    storeId: 'ProjectStore',
    model: 'CB.model.Project'
});
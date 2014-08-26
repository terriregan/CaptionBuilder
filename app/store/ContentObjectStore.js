Ext.define('CB.store.ContentObjectStore', {
    extend: 'Ext.data.Store',

    requires: [
        'CB.model.ContentObject'
    ],

    proxy : {
        type : 'ajax',
        reader : {
            type : 'json',
            root : 'contentobjects.contentobj'
        }
    },

    autoLoad: false,
    storeId: 'ContentObjectStore',
    model: 'CB.model.ContentObject'
});
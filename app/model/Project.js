Ext.define('CB.model.Project', {
    extend: 'Ext.data.Model',

    statics : {
        project : null,
        setCurrent : function(project) {
            this.project = project;
        },

        getCurrent : function() {
            return this.project;
        }
    },

    proxy : {
        type : 'ajax',
        url : '/apis/learnobj/projects.json',
        reader : {
            type : 'json',
            root : 'projectlist.project'
        }
    },

    fields: [
        {
            name: 'id',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'product',
            type: 'string'
        },
        {
            name: 'cycle',
            type: 'string'
        },
        {
            name: 'year'
        },
        {
            name: 'uri'
        }
    ],

    getFinalObjectListUrl: function() {
        return '/apis/learnobj' + this.get('uri') + '.json?FOList=1';
    }

});

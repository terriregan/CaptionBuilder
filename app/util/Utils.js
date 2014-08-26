Ext.define('CB.util.Utils', {
	singleton: true,

    checkForRender: function(type, scope, done) {
        //  console.log('checking for render ' + type);
        var cmp = Ext.ComponentQuery.query(type)[0];
        if (!cmp){
            console.log('checkForRender')
            Ext.defer(this.checkForRender, 100, this, [type, scope, done]);
            return;
        }

        if(done) {
            done.call(scope, cmp);
        }
    },

    secondsToTime: function(s) {

        var str = s.toString(),
            ms;

        ms = (str.indexOf('.') == -1) ? '.00' : '.' + str.substr(str.indexOf('.') + 1, 2);

        var sec_num = parseInt(s, 10); // don't forget the second param
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (minutes < 10) { minutes = "0" + minutes; }
        if (seconds < 10) { seconds = "0" + seconds; }

        // nflcapp.console.log('result ' + hours + ':' + minutes + ':' + seconds + '.' + ms)

        if(hours == 0) {
            return  minutes + ':' + seconds + ms;
        } else {
            if (hours < 10) { hours = "0" + hours; }
            return  hours + ':' + minutes + ':' + seconds + ms;
        }
    }

});
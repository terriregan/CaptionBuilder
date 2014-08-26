Ext.define('CB.view.VideoPanel', {
    extend: 'Ext.panel.Panel',          // change to Container
    alias: 'widget.videopanel',

    bodyStyle:'background-color: #eee',

    html : '<div class="media"><video height="300" width="100%" id="video-player" controls><source src="#"></video></div>' +
           '<div id="video-caption" class="caption-preview"></div>'
});
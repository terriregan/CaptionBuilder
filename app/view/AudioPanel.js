Ext.define('CB.view.AudioPanel', {
    extend: 'Ext.panel.Panel',      // change to Container
    alias: 'widget.audiopanel',

    bodyStyle:'background-color: #000',

    html : '<audio id="audio-player" controls><source src="#"></audio><div id="audio-caption" class="caption-preview"></div>'
});
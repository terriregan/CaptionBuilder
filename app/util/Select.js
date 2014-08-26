/*
    NOTES:
    This class written by Tom Ford.
 */
Ext.define('CB.util.Select', {
	singleton: true,

	requires: ['Ext.util.MixedCollection', 'CB.util.Utils'],

	config: {
		sourcePanel:null
	},
	haystackEl: null,
	range: null,
	re: /^gloss-(\d+)$/,
	occur: null,

	getSel: function() {
		var w = window,
			d = document,
			gS = 'getSelection';
		return ('' + (w[gS] ? w[gS]() : d[gS] ? d[gS]() : d.selection.createRange().text)).replace(/(^\s+|\s+$)/g, '');
	},

	getContext: function(el) {
		var n = el.prev('span');
		var obj = {}
		if (n) {
			if (this.re.exec(n.id)) {
				obj.selBefore = RegExp.$1;
			}
		}
		var n = el.next('span');
		if (n) {
			if (this.re.exec(n.id)) {
				obj.selAfter = RegExp.$1;
			}
		}
		return obj;
	},

	wrap: function(ExtDomCfg) {
		var me = this;
		if (this.range) {
			var el = Ext.DomHelper.createDom(ExtDomCfg);
			if (el) {
				this.range.surroundContents(el);
				el = Ext.get(ExtDomCfg.id);
				el.addClsOnOver('gt-item-over');
				el.on('click', function(evt) {
					var srcPan = me.getSourcePanel();
					me.re.exec(this.id);
					srcPan.fireEvent('selectionclick', RegExp.$1);
				}, el);
				window.getSelection().removeAllRanges();
			}
		}
		return Ext.get(ExtDomCfg.id); // or, null
	},

	init: function() {
		this.haystackEl = document.getElementById('srctxt_1');
	},

	fromText: function(json, scope) {
		if (document.createRange == undefined)
			return false;

		var n = this.haystackEl.firstChild;
		var obj = {}
		Ext.apply(obj, json);
		this.occur = Ext.create('Ext.util.MixedCollection');
		while (n) {
			if (n.nodeType == 3) {
				var findx = n.nodeValue.indexOf(json.text);
				while (findx != -1) {
					var oc = this.occur.get(json.text);
					if (oc) {
						oc.count++;
					} else {
						oc = this.occur.add(json.text, {
							count: 1
						});
					}
					if (oc.count == json.occurrence) {
						this.range = document.createRange();
						this.range.setStart(n, findx);
						this.range.setEnd(n, (findx + json.text.length));
						obj.itemId = CB.util.Utils.uniqid();
						var el = this.wrap({
							id: 'gloss-' + obj.itemId,
							tag: 'span',
							cls: 'gt-item'
							//itemId: obj.itemId
						});

						obj.occurrence = oc.count;
						Ext.apply(obj, this.getContext(el));
						obj.found = true;
						scope.fireEvent('selectfromtext', obj);
						return;
					}
					findx = n.nodeValue.indexOf(json.text, findx + 1);
				}
			}
			n = (n.nextSibling) ? n.nextSibling : null;
		}

		this.range = null;
		obj.itemId = CB.util.Utils.uniqid();
		obj.found = false;
		scope.fireEvent('selectfromtext', obj);
	},

	/**
	 * return { occurrence: (int), text: (string), selBefore: id or null,
	 * selAfter: id or null } else false
	 */
	fromRange: function(scope) {
		if (window.getSelection == undefined)
			return false;

		var obj = {}
		var s = window.getSelection();
		this.range = (s) ? s.getRangeAt(0) : null;
		if (this.range) {
			var capn = this.range.commonAncestorContainer.parentNode,
				scpn = this.range.startContainer.parentNode,
				ecpn = this.range.endContainer.parentNode;
			if (scpn.id == 'srctxt_1' && ecpn.id == 'srctxt') {
				this.range.setEnd(scpn.lastChild, scpn.lastChild.length);
				capn = this.range.commonAncestorContainer.parentNode;
				scpn = this.range.startContainer.parentNode;
				ecpn = this.range.endContainer.parentNode;
			}
			try {
				obj.text = this.range.toString();
				var cntr = 0;
				while (obj.text.charCodeAt(0) == 13) {
					this.range.setStart(this.range.startContainer, this.range.startOffset + 1);
					obj.text = this.range.toString();
					if (++cntr > 10)
						throw "Too many new lines selected";
				}
				cntr = 0;
				while (obj.text.charCodeAt(obj.text.length - 1) == 13) {
					this.range.setStart(this.range.startContainer, this.range.startOffset - 1);
					obj.text = this.range.toString();
					if (++cntr > 10)
						throw "Too many new lines selected";
				}

			} catch (e) {
				window.getSelection().removeAllRanges();
				Ext.Msg.alert('Invalid Selection', "Selected text may include some unselectable characters.");
				return false;
			}

			// IE 8 ierange.js bug: carriage returns appear to be
			// misscalculated in the range object
			// appears to be fixable by counting them and recalculating the
			// range offsets
			if (Ext.isIE && document.documentMode == 8) {
				var cnt = 0,
					start = false,
					textCtnr = this.range.commonAncestorContainer.toString();
				for (var i = this.range.startOffset; i > -1; i--) {
					if (textCtnr.charCodeAt(i) == 13) {
						cnt++;
					}
				}
				if (textCtnr.charCodeAt(this.range.startOffset - 1) !== 13) {
					this.range.setStart(this.range.startContainer, this.range.startOffset - cnt);
				}
				this.range.setEnd(this.range.endContainer, this.range.endOffset - cnt);
				obj.text = this.range.toString();
			}

			var tmpstr = obj.text.replace(/([/().])/g, '\\$1'),
				hasLF = obj.text
					.match(/\n/g),
				nre = new RegExp(tmpstr, 'gi');

			if (obj.text.trim().length == 0) {
				return false;
			} else if ((capn && this.re.test(capn.id)) || (scpn && this.re.test(scpn.id)) || (ecpn && this.re.test(ecpn.id))) {
				Ext.Msg.alert('Invalid Selection', "Selected text appears to overlap with another selection.");

				// selection within or overlapping another selection
				window.getSelection().removeAllRanges();
				return false;
			} else if (capn.id == 'srctxt' || (hasLF && hasLF.length)) {
				Ext.Msg.alert('Invalid Selection', "Selections may not include line breaks or other selections.");
				// selection around a previous selection, or
				// selection accross a break tag, this should be valid
				window.getSelection().removeAllRanges();
				return false;
			}
			// now assume you have common ancestor of srctxt_1
			// wrap first
			obj.itemId = CB.util.Utils.uniqid();

			var el = this.wrap({
				id: 'gloss-' + obj.itemId,
				tag: 'span',
				cls: 'gt-item'
				//itemId: obj.itemId
			});

			// then walk back thru siblings to get occurence
			var n = el.dom;
			obj.occurrence = 1;
			n = n.previousSibling;
			var str = '';
			while (n) {
				if (n.nodeType == 3) {
					str += n.nodeValue;
				} else if (n.firstChild && n.firstChild.nodeType == 3) {
					str += n.firstChild.nodeValue;
				}
				n = n.previousSibling;
			}
			var m = str.match(nre);
			if (m) {
				obj.occurrence += m.length;
			}

			Ext.apply(obj, this.getContext(el));
			scope.fireEvent('selectfromrange', obj);
		}
	}

});
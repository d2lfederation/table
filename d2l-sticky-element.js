/*
	Copied with modifications and fixes from https://github.com/seaneking/sticky-element/blob/master/sticky-element.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import 'stickyfilljs/dist/stickyfill.min.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-sticky-element">
	<template strip-whitespace="">
		<style>
			:host {
				position: -webkit-sticky;
				position: sticky;
				top: 0;
				z-index: 4;
				line-height: 0;
			}
		</style>
		<slot></slot>
	</template>
	
</dom-module>`;

document.head.appendChild($_documentContainer.content);
/* global Stickyfill */
Polymer({
	is: 'd2l-sticky-element',
	properties: {
		disabled: {
			type: Boolean,
			observer: '_disabledChanged'
		}
	},
	detached: function() {
		try {
			this._ensureStickyRemoved();
		} catch (e) {
			return;
		}
	},
	_ensureStickyAdded: function() {
		if (this._sticky) return;
		this._sticky = Stickyfill.addOne(this);
	},
	_ensureStickyRemoved: function() {
		if (!this._sticky) return;
		// If remove fails, still unset _sticky.
		var tmp = this._sticky;
		this._sticky = null;
		tmp.remove();
	},
	_updateSticky: function() {
		/**
		 * Stickyfill requires the component to be attached to the DOM
		 * in order to work. If the component is not attached, the attached
		 * method will handle initialization
		 */
		if (!this.isAttached) {
			return;
		}
		var sticky = !this.disabled;
		try {
			if (sticky) {
				this._ensureStickyAdded();
			} else {
				this._ensureStickyRemoved();
			}
		} catch (e) {
			return;
		}
	},
	_disabledChanged: function() {
		// Defer the getComputedStyle() calls until after the page has rendered
		afterNextRender(this, this._updateSticky);
	}
});

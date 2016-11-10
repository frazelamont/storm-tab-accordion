/**
 * @name storm-tabs: Multi-panelled content areas 
 * @version 0.6.0: Thu, 10 Nov 2016 13:36:12 GMT
 * @author mjbp
 * @license MIT
 */
(function(root, factory) {
   var mod = {
       exports: {}
   };
   if (typeof exports !== 'undefined'){
       mod.exports = exports
       factory(mod.exports)
       module.exports = mod.exports.default
   } else {
       factory(mod.exports);
       root.StormTabs = mod.exports.default
   }

}(this, function(exports) {
   'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var KEY_CODES = {
	SPACE: 32,
	ENTER: 13,
	TAB: 9,
	LEFT: 37,
	RIGHT: 39,
	UP: 38,
	DOWN: 40
},
    defaults = {
	tabClass: '.js-tab-accordion-tab',
	titleClass: '.js-tab-accordion-title',
	currentClass: 'active',
	active: 0,
	tabCursorEvent: 'click'
},
    StormTabAccordion = {
	init: function init() {
		var _this = this;

		var hash = location.hash.slice(1) || null;
		this.tabs = [].slice.call(this.DOMElement.querySelectorAll(this.settings.tabClass));
		this.titles = [].slice.call(this.DOMElement.querySelectorAll(this.settings.titleClass));

		this.targets = this.tabs.map(function (el) {
			return document.getElementById(el.getAttribute('href').substr(1)) || console.error('Tab target not found');
		});

		this.current = this.settings.active;
		if (hash) {
			this.targets.forEach(function (target, i) {
				if (target.getAttribute('id') === hash) {
					_this.current = i;
				}
			});
		}
		this.initAria();
		this.initTitles();
		this.initTabs();
		this.open(this.current);

		return this;
	},
	initAria: function initAria() {
		this.tabs.forEach(function (el) {
			el.setAttribute('role', 'tab');
			el.setAttribute('tabIndex', 0);
			el.setAttribute('aria-expanded', false);
			el.setAttribute('aria-selected', false);
			el.setAttribute('aria-controls', el.getAttribute('href') ? el.getAttribute('href').substr(1) : el.parentNode.getAttribute('id'));
		});
		this.targets.forEach(function (el) {
			el.setAttribute('role', 'tabpanel');
			el.setAttribute('aria-hidden', true);
			el.setAttribute('tabIndex', '-1');
		});
		return this;
	},
	initTitles: function initTitles() {
		var _this2 = this;

		var handler = function handler(i) {
			_this2.toggle(i);
		};

		this.titles.forEach(function (el, i) {
			el.addEventListener(_this2.settings.tabCursorEvent, function (e) {
				if (!!e.keyCode && e.keyCode === KEY_CODES.TAB) return;

				if (!e.keyCode || e.keyCode === KEY_CODES.ENTER) {
					e.preventDefault();
					handler.call(_this2, i);
				}
			}, false);
		});

		return this;
	},
	initTabs: function initTabs() {
		var _this3 = this;

		var handler = function handler(i) {
			_this3.toggle(i);
		};

		this.lastFocusedTab = 0;

		this.tabs.forEach(function (el, i) {
			//navigate
			el.addEventListener('keydown', function (e) {
				switch (e.keyCode) {
					case KEY_CODES.UP:
						e.preventDefault();
						_this3.toggle(_this3.current === 0 ? _this3.tabs.length - 1 : _this3.current - 1);
						window.setTimeout(function () {
							_this3.tabs[_this3.current].focus();
						}, 16);
						break;
					case KEY_CODES.LEFT:
						_this3.toggle(_this3.current === 0 ? _this3.tabs.length - 1 : _this3.current - 1);
						window.setTimeout(function () {
							_this3.tabs[_this3.current].focus();
						}, 16);
						break;
					case KEY_CODES.DOWN:
						e.preventDefault();
						_this3.toggle(_this3.current === _this3.tabs.length - 1 ? 0 : _this3.current + 1);
						window.setTimeout(function () {
							_this3.tabs[_this3.current].focus();
						}, 16);
						break;
					case KEY_CODES.RIGHT:
						_this3.toggle(_this3.current === _this3.tabs.length - 1 ? 0 : _this3.current + 1);
						window.setTimeout(function () {
							_this3.tabs[_this3.current].focus();
						}, 16);
						break;
					case KEY_CODES.ENTER:
						handler.call(_this3, i);
						window.setTimeout(function () {
							_this3.tabs[i].focus();
						}, 16);
						break;
					case KEY_CODES.SPACE:
						e.preventDefault();
						_this3.toggle(i);
						window.setTimeout(function () {
							_this3.tabs[i].focus();
						}, 16);
						break;
					case KEY_CODES.TAB:
						e.preventDefault();
						e.stopPropagation();
						_this3.lastFocusedTab = _this3.getTabIndex(e.target);
						_this3.setTargetFocus(_this3.lastFocusedTab);
						handler.call(_this3, i);
						break;
					default:
						//
						break;
				}
			});

			//toggle
			el.addEventListener('click', function (e) {
				e.preventDefault();
				handler.call(_this3, i);
			}, false);
		});

		return this;
	},
	getTabIndex: function getTabIndex(link) {
		for (var i = 0; i < this.tabs.length; i++) {
			if (link === this.tabs[i]) return i;
		}
		return null;
	},
	getFocusableChildren: function getFocusableChildren(node) {
		var focusableElements = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabIndex]:not([tabIndex="-1"])'];
		return [].slice.call(node.querySelectorAll(focusableElements.join(',')));
	},
	setTargetFocus: function setTargetFocus(tabIndex) {
		this.focusableChildren = this.getFocusableChildren(this.targets[tabIndex]);

		if (this.focusableChildren.length) {
			window.setTimeout(function () {
				this.focusableChildren[0].focus();
				this.keyEventListener = this.keyListener.bind(this);
				document.addEventListener('keydown', this.keyEventListener);
			}.bind(this), 0);
		}
	},
	keyListener: function keyListener(e) {
		if (e.keyCode !== KEY_CODES.TAB) return;

		var focusedIndex = this.focusableChildren.indexOf(document.activeElement);

		if (focusedIndex < 0) {
			document.removeEventListener('keydown', this.keyEventListener);
			return;
		}

		if (e.shiftKey && focusedIndex === 0) {
			e.preventDefault();
			this.focusableChildren[this.focusableChildren.length - 1].focus();
		} else {
			if (!e.shiftKey && focusedIndex === this.focusableChildren.length - 1) {
				document.removeEventListener('keydown', this.keyEventListener);
				if (this.lastFocusedTab !== this.tabs.length - 1) {
					e.preventDefault();
					this.lastFocusedTab = this.lastFocusedTab + 1;
					this.tabs[this.lastFocusedTab].focus();
				}
			}
		}
	},
	change: function change(type, i) {
		var methods = {
			open: {
				classlist: 'add',
				tabIndex: {
					target: this.targets[i],
					value: '0'
				}
			},
			close: {
				classlist: 'remove',
				tabIndex: {
					target: this.targets[this.current],
					value: '-1'
				}
			}
		};

		this.tabs[i].classList[methods[type].classlist](this.settings.currentClass);
		this.titles[i].classList[methods[type].classlist](this.settings.currentClass);
		this.targets[i].classList[methods[type].classlist](this.settings.currentClass);

		this.targets[i].setAttribute('aria-hidden', !this.targets[i].getAttribute('aria-hidden'));
		this.tabs[i].setAttribute('aria-selected', !this.targets[i].getAttribute('aria-selected'));
		this.tabs[i].setAttribute('aria-expanded', !this.targets[i].getAttribute('aria-expanded'));
		methods[type].tabIndex.target.setAttribute('tabIndex', methods[type].tabIndex.value);
	},
	open: function open(i) {
		this.change('open', i);
		this.current = i;
		return this;
	},
	close: function close(i) {
		this.change('close', i);
		return this;
	},
	toggle: function toggle(i) {
		if (this.current === i) {
			return;
		}

		!!window.history.pushState && window.history.pushState({ URL: this.tabs[i].getAttribute('href') }, '', this.tabs[i].getAttribute('href'));
		if (this.current === null) {
			this.open(i);
			return this;
		}
		this.close(this.current).open(i);
		return this;
	}
};

var init = function init(sel, opts) {
	var els = [].slice.call(document.querySelectorAll(sel));

	if (!els.length) throw new Error('Tab Accordion cannot be initialised, no augmentable elements found');

	return els.map(function (el) {
		return Object.assign(Object.create(StormTabAccordion), {
			DOMElement: el,
			settings: Object.assign({}, defaults, opts)
		}).init();
	});
};

exports.default = { init: init };;
}));

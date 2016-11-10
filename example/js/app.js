(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _stormTabAccordion = require('./libs/storm-tab-accordion');

var _stormTabAccordion2 = _interopRequireDefault(_stormTabAccordion);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var onDOMContentLoadedTasks = [function () {
  _stormTabAccordion2.default.init('.js-tab-accordion');
}];

if ('addEventListener' in window) window.addEventListener('DOMContentLoaded', function () {
  onDOMContentLoadedTasks.forEach(function (fn) {
    return fn();
  });
});

},{"./libs/storm-tab-accordion":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * @name storm-tabs: Multi-panelled content areas 
 * @version 0.6.0: Thu, 10 Nov 2016 13:36:12 GMT
 * @author mjbp
 * @license MIT
 */
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

exports.default = { init: init };

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL3N0b3JtLXRhYi1hY2NvcmRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7QUFFQSxJQUFNLDBCQUEwQixDQUFDLFlBQU07QUFDdEMsOEJBQWEsSUFBYixDQUFrQixtQkFBbEI7QUFDQSxDQUYrQixDQUFoQzs7QUFJQSxJQUFHLHNCQUFzQixNQUF6QixFQUFpQyxPQUFPLGdCQUFQLENBQXdCLGtCQUF4QixFQUE0QyxZQUFNO0FBQUUsMEJBQXdCLE9BQXhCLENBQWdDLFVBQUMsRUFBRDtBQUFBLFdBQVEsSUFBUjtBQUFBLEdBQWhDO0FBQWdELENBQXBHOzs7Ozs7OztBQ05qQzs7Ozs7O0FBTUEsSUFBTSxZQUFZO0FBQ2hCLFFBQU8sRUFEUztBQUVoQixRQUFPLEVBRlM7QUFHaEIsTUFBSyxDQUhXO0FBSWhCLE9BQU0sRUFKVTtBQUtoQixRQUFPLEVBTFM7QUFNaEIsS0FBRyxFQU5hO0FBT2hCLE9BQU07QUFQVSxDQUFsQjtBQUFBLElBU0MsV0FBVztBQUNWLFdBQVUsdUJBREE7QUFFVixhQUFZLHlCQUZGO0FBR1YsZUFBYyxRQUhKO0FBSVYsU0FBUSxDQUpFO0FBS1YsaUJBQWdCO0FBTE4sQ0FUWjtBQUFBLElBZ0JDLG9CQUFvQjtBQUNuQixLQURtQixrQkFDWjtBQUFBOztBQUNOLE1BQUksT0FBTyxTQUFTLElBQVQsQ0FBYyxLQUFkLENBQW9CLENBQXBCLEtBQTBCLElBQXJDO0FBQ0EsT0FBSyxJQUFMLEdBQVksR0FBRyxLQUFILENBQVMsSUFBVCxDQUFjLEtBQUssVUFBTCxDQUFnQixnQkFBaEIsQ0FBaUMsS0FBSyxRQUFMLENBQWMsUUFBL0MsQ0FBZCxDQUFaO0FBQ0EsT0FBSyxNQUFMLEdBQWMsR0FBRyxLQUFILENBQVMsSUFBVCxDQUFjLEtBQUssVUFBTCxDQUFnQixnQkFB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WUFBYixDQUEwQixNQUExQixDQUFQLEVBQXpCLEVBQXFFLEVBQXJFLEVBQXlFLEtBQUssSUFBTCxDQUFVLENBQVYsRUFBYSxZQUFiLENBQTBCLE1BQTFCLENBQXpFLENBQTlCO0FBQ0EsTUFBRyxLQUFLLE9BQUwsS0FBaUIsSUFBcEIsRUFBMEI7QUFDekIsUUFBSyxJQUFMLENBQVUsQ0FBVjtBQUNBLFVBQU8sSUFBUDtBQUNBO0FBQ0QsT0FBSyxLQUFMLENBQVcsS0FBSyxPQUFoQixFQUNFLElBREYsQ0FDTyxDQURQO0FBRUEsU0FBTyxJQUFQO0FBQ0E7QUFyTmtCLENBaEJyQjs7QUF3T0EsSUFBTSxPQUFPLFNBQVAsSUFBTyxDQUFDLEdBQUQsRUFBTSxJQUFOLEVBQWU7QUFDM0IsS0FBSSxNQUFNLEdBQUcsS0FBSCxDQUFTLElBQVQsQ0FBYyxTQUFTLGdCQUFULENBQTBCLEdBQTFCLENBQWQsQ0FBVjs7QUFFQSxLQUFHLENBQUMsSUFBSSxNQUFSLEVBQWdCLE1BQU0sSUFBSSxLQUFKLENBQVUsb0VBQVYsQ0FBTjs7QUFFaEIsUUFBTyxJQUFJLEdBQUosQ0FBUSxVQUFDLEVBQUQsRUFBUTtBQUN0QixTQUFPLE9BQU8sTUFBUCxDQUFjLE9BQU8sTUFBUCxDQUFjLGlCQUFkLENBQWQsRUFBZ0Q7QUFDdEQsZUFBWSxFQUQwQztBQUV0RCxhQUFVLE9BQU8sTUFBUCxDQUFjLEVBQWQsRUFBa0IsUUFBbEIsRUFBNEIsSUFBNUI7QUFGNEMsR0FBaEQsRUFHSixJQUhJLEVBQVA7QUFJQSxFQUxNLENBQVA7QUFNQSxDQVhEOztrQkFhZSxFQUFFLFVBQUYsRSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgVGFiQWNjb3JkaW9uIGZyb20gJy4vbGlicy9zdG9ybS10YWItYWNjb3JkaW9uJztcblxuY29uc3Qgb25ET01Db250ZW50TG9hZGVkVGFza3MgPSBbKCkgPT4ge1xuXHRUYWJBY2NvcmRpb24uaW5pdCgnLmpzLXRhYi1hY2NvcmRpb24nKTtcbn1dO1xuICAgIFxuaWYoJ2FkZEV2ZW50TGlzdGVuZXInIGluIHdpbmRvdykgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7IG9uRE9NQ29udGVudExvYWRlZFRhc2tzLmZvckVhY2goKGZuKSA9PiBmbigpKTsgfSk7IiwiLyoqXG4gKiBAbmFtZSBzdG9ybS10YWJzOiBNdWx0aS1wYW5lbGxlZCBjb250ZW50IGFyZWFzIFxuICogQHZlcnNpb24gMC42LjA6IFRodSwgMTAgTm92IDIwMTYgMTM6MzY6MTIgR01UXG4gKiBAYXV0aG9yIG1qYnBcbiAqIEBsaWNlbnNlIE1JVFxuICovXG5jb25zdCBLRVlfQ09ERVMgPSB7XG5cdFx0U1BBQ0U6IDMyLFxuXHRcdEVOVEVSOiAxMyxcblx0XHRUQUI6IDksXG5cdFx0TEVGVDogMzcsXG5cdFx0UklHSFQ6IDM5LFxuXHRcdFVQOjM4LFxuXHRcdERPV046IDQwXG5cdH0sXG5cdGRlZmF1bHRzID0ge1xuXHRcdHRhYkNsYXNzOiAnLmpzLXRhYi1hY2NvcmRpb24tdGFiJyxcblx0XHR0aXRsZUNsYXNzOiAnLmpzLXRhYi1hY2NvcmRpb24tdGl0bGUnLFxuXHRcdGN1cnJlbnRDbGFzczogJ2FjdGl2ZScsXG5cdFx0YWN0aXZlOiAwLFxuXHRcdHRhYkN1cnNvckV2ZW50OiAnY2xpY2snXG5cdH0sXG5cdFN0b3JtVGFiQWNjb3JkaW9uID0ge1xuXHRcdGluaXQoKSB7XG5cdFx0XHRsZXQgaGFzaCA9IGxvY2F0aW9uLmhhc2guc2xpY2UoMSkgfHwgbnVsbDtcblx0XHRcdHRoaXMudGFicyA9IFtdLnNsaWNlLmNhbGwodGhpcy5ET01FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5zZXR0aW5ncy50YWJDbGFzcykpO1xuXHRcdFx0dGhpcy50aXRsZXMgPSBbXS5zbGljZS5jYWxsKHRoaXMuRE9NRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuc2V0dGluZ3MudGl0bGVDbGFzcykpO1xuXG5cdFx0XHR0aGlzLnRhcmdldHMgPSB0aGlzLnRhYnMubWFwKGVsID0+IHtcblx0XHRcdFx0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsLmdldEF0dHJpYnV0ZSgnaHJlZicpLnN1YnN0cigxKSkgfHwgY29uc29sZS5lcnJvcignVGFiIHRhcmdldCBub3QgZm91bmQnKTtcblx0XHRcdH0pO1xuXHRcdFx0XHRcblx0XHRcdHRoaXMuY3VycmVudCA9IHRoaXMuc2V0dGluZ3MuYWN0aXZlO1xuXHRcdFx0aWYgKGhhc2gpIHtcblx0XHRcdFx0dGhpcy50YXJnZXRzLmZvckVhY2goKHRhcmdldCwgaSkgPT4ge1xuXHRcdFx0XHRcdGlmICh0YXJnZXQuZ2V0QXR0cmlidXRlKCdpZCcpID09PSBoYXNoKSB7XG5cdFx0XHRcdFx0XHR0aGlzLmN1cnJlbnQgPSBpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmluaXRBcmlhKCk7XG5cdFx0XHR0aGlzLmluaXRUaXRsZXMoKTtcblx0XHRcdHRoaXMuaW5pdFRhYnMoKTtcblx0XHRcdHRoaXMub3Blbih0aGlzLmN1cnJlbnQpO1xuXG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9LFxuXHRcdGluaXRBcmlhKCkge1xuXHRcdFx0dGhpcy50YWJzLmZvckVhY2goZWwgPT4ge1xuXHRcdFx0XHRlbC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAndGFiJyk7XG5cdFx0XHRcdGVsLnNldEF0dHJpYnV0ZSgndGFiSW5kZXgnLCAwKTtcblx0XHRcdFx0ZWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xuXHRcdFx0XHRlbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCBmYWxzZSk7XG5cdFx0XHRcdGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycsIGVsLmdldEF0dHJpYnV0ZSgnaHJlZicpID8gZWwuZ2V0QXR0cmlidXRlKCdocmVmJykuc3Vic3RyKDEpIDogZWwucGFyZW50Tm9kZS5nZXRBdHRyaWJ1dGUoJ2lkJykpO1xuXG5cdFx0XHR9KTtcblx0XHRcdHRoaXMudGFyZ2V0cy5mb3JFYWNoKGVsID0+IHtcblx0XHRcdFx0ZWwuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3RhYnBhbmVsJyk7XG5cdFx0XHRcdGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcblx0XHRcdFx0ZWwuc2V0QXR0cmlidXRlKCd0YWJJbmRleCcsICctMScpO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9LFxuXHRcdGluaXRUaXRsZXMoKSB7XG5cdFx0XHRsZXQgaGFuZGxlciA9IGkgPT4ge1xuXHRcdFx0XHR0aGlzLnRvZ2dsZShpKTtcblx0XHRcdH07XG5cblx0XHRcdHRoaXMudGl0bGVzLmZvckVhY2goKGVsLCBpKSA9PiB7XG5cdFx0XHRcdGVsLmFkZEV2ZW50TGlzdGVuZXIodGhpcy5zZXR0aW5ncy50YWJDdXJzb3JFdmVudCwgZSA9PiB7XG5cdFx0XHRcdFx0aWYoISFlLmtleUNvZGUgJiYgZS5rZXlDb2RlID09PSBLRVlfQ09ERVMuVEFCKSByZXR1cm47XG5cblx0XHRcdFx0XHRpZighZS5rZXlDb2RlIHx8IGUua2V5Q29kZSA9PT0gS0VZX0NPREVTLkVOVEVSKXtcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdGhhbmRsZXIuY2FsbCh0aGlzLCBpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIGZhbHNlKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9LFxuXHRcdGluaXRUYWJzKCkge1xuXHRcdFx0bGV0IGhhbmRsZXIgPSBpID0+IHtcblx0XHRcdFx0dGhpcy50b2dnbGUoaSk7XG5cdFx0XHR9O1xuXG5cdFx0XHR0aGlzLmxhc3RGb2N1c2VkVGFiID0gMDtcblxuXHRcdFx0dGhpcy50YWJzLmZvckVhY2goKGVsLCBpKSA9PiB7XG5cdFx0XHRcdC8vbmF2aWdhdGVcblx0XHRcdFx0ZWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGUgPT4ge1xuXHRcdFx0XHRcdHN3aXRjaCAoZS5rZXlDb2RlKSB7XG5cdFx0XHRcdFx0Y2FzZSBLRVlfQ09ERVMuVVA6XG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHR0aGlzLnRvZ2dsZSgodGhpcy5jdXJyZW50ID09PSAwID8gdGhpcy50YWJzLmxlbmd0aCAtIDEgOiB0aGlzLmN1cnJlbnQgLSAxKSk7XG5cdFx0XHRcdFx0XHR3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7IHRoaXMudGFic1t0aGlzLmN1cnJlbnRdLmZvY3VzKCk7IH0sIDE2KTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgS0VZX0NPREVTLkxFRlQ6XG5cdFx0XHRcdFx0XHR0aGlzLnRvZ2dsZSgodGhpcy5jdXJyZW50ID09PSAwID8gdGhpcy50YWJzLmxlbmd0aCAtIDEgOiB0aGlzLmN1cnJlbnQgLSAxKSk7XG5cdFx0XHRcdFx0XHR3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7IHRoaXMudGFic1t0aGlzLmN1cnJlbnRdLmZvY3VzKCk7IH0sIDE2KTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgS0VZX0NPREVTLkRPV046XG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHR0aGlzLnRvZ2dsZSgodGhpcy5jdXJyZW50ID09PSB0aGlzLnRhYnMubGVuZ3RoIC0gMSA/IDAgOiB0aGlzLmN1cnJlbnQgKyAxKSk7XG5cdFx0XHRcdFx0XHR3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7IHRoaXMudGFic1t0aGlzLmN1cnJlbnRdLmZvY3VzKCk7IH0sIDE2KTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgS0VZX0NPREVTLlJJR0hUOlxuXHRcdFx0XHRcdFx0dGhpcy50b2dnbGUoKHRoaXMuY3VycmVudCA9PT0gdGhpcy50YWJzLmxlbmd0aCAtIDEgPyAwIDogdGhpcy5jdXJyZW50ICsgMSkpO1xuXHRcdFx0XHRcdFx0d2luZG93LnNldFRpbWVvdXQoKCkgPT4geyB0aGlzLnRhYnNbdGhpcy5jdXJyZW50XS5mb2N1cygpOyB9LCAxNik7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIEtFWV9DT0RFUy5FTlRFUjpcblx0XHRcdFx0XHRcdGhhbmRsZXIuY2FsbCh0aGlzLCBpKTsgIFxuXHRcdFx0XHRcdFx0d2luZG93LnNldFRpbWVvdXQoKCkgPT4geyB0aGlzLnRhYnNbaV0uZm9jdXMoKTsgfSwgMTYpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBLRVlfQ09ERVMuU1BBQ0U6XG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHR0aGlzLnRvZ2dsZShpKTtcblx0XHRcdFx0XHRcdHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHsgdGhpcy50YWJzW2ldLmZvY3VzKCk7IH0sIDE2KTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgS0VZX0NPREVTLlRBQjpcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdFx0XHR0aGlzLmxhc3RGb2N1c2VkVGFiID0gdGhpcy5nZXRUYWJJbmRleChlLnRhcmdldCk7XG5cdFx0XHRcdFx0XHR0aGlzLnNldFRhcmdldEZvY3VzKHRoaXMubGFzdEZvY3VzZWRUYWIpO1xuXHRcdFx0XHRcdFx0aGFuZGxlci5jYWxsKHRoaXMsIGkpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0Ly9cblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Ly90b2dnbGVcblx0XHRcdFx0ZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0aGFuZGxlci5jYWxsKHRoaXMsIGkpOyAgXG5cdFx0XHRcdH0sIGZhbHNlKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9LFxuXHRcdGdldFRhYkluZGV4KGxpbmspe1xuXHRcdFx0Zm9yKGxldCBpID0gMDsgaSA8IHRoaXMudGFicy5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdGlmKGxpbmsgPT09IHRoaXMudGFic1tpXSkgcmV0dXJuIGk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9LFxuXHRcdGdldEZvY3VzYWJsZUNoaWxkcmVuKG5vZGUpIHtcblx0XHRcdGxldCBmb2N1c2FibGVFbGVtZW50cyA9IFsnYVtocmVmXScsICdhcmVhW2hyZWZdJywgJ2lucHV0Om5vdChbZGlzYWJsZWRdKScsICdzZWxlY3Q6bm90KFtkaXNhYmxlZF0pJywgJ3RleHRhcmVhOm5vdChbZGlzYWJsZWRdKScsICdidXR0b246bm90KFtkaXNhYmxlZF0pJywgJ2lmcmFtZScsICdvYmplY3QnLCAnZW1iZWQnLCAnW2NvbnRlbnRlZGl0YWJsZV0nLCAnW3RhYkluZGV4XTpub3QoW3RhYkluZGV4PVwiLTFcIl0pJ107XG5cdFx0XHRyZXR1cm4gW10uc2xpY2UuY2FsbChub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoZm9jdXNhYmxlRWxlbWVudHMuam9pbignLCcpKSk7XG5cdFx0fSxcblx0XHRzZXRUYXJnZXRGb2N1cyh0YWJJbmRleCl7XG5cdFx0XHR0aGlzLmZvY3VzYWJsZUNoaWxkcmVuID0gdGhpcy5nZXRGb2N1c2FibGVDaGlsZHJlbih0aGlzLnRhcmdldHNbdGFiSW5kZXhdKTtcblx0XHRcdFxuXHRcdFx0aWYodGhpcy5mb2N1c2FibGVDaGlsZHJlbi5sZW5ndGgpe1xuXHRcdFx0XHR3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW5bMF0uZm9jdXMoKTtcblx0XHRcdFx0XHR0aGlzLmtleUV2ZW50TGlzdGVuZXIgPSB0aGlzLmtleUxpc3RlbmVyLmJpbmQodGhpcyk7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMua2V5RXZlbnRMaXN0ZW5lcik7XG5cdFx0XHRcdH0uYmluZCh0aGlzKSwgMCk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRrZXlMaXN0ZW5lcihlKXtcblx0XHRcdGlmIChlLmtleUNvZGUgIT09IEtFWV9DT0RFUy5UQUIpIHJldHVybjtcblx0XHRcdFxuXHRcdFx0bGV0IGZvY3VzZWRJbmRleCA9IHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW4uaW5kZXhPZihkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcblx0XHRcdFxuXHRcdFx0aWYoZm9jdXNlZEluZGV4IDwgMCkge1xuXHRcdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5rZXlFdmVudExpc3RlbmVyKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRpZihlLnNoaWZ0S2V5ICYmIGZvY3VzZWRJbmRleCA9PT0gMCkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW5bdGhpcy5mb2N1c2FibGVDaGlsZHJlbi5sZW5ndGggLSAxXS5mb2N1cygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYoIWUuc2hpZnRLZXkgJiYgZm9jdXNlZEluZGV4ID09PSB0aGlzLmZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCAtIDEpIHtcblx0XHRcdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5rZXlFdmVudExpc3RlbmVyKTtcblx0XHRcdFx0XHRpZih0aGlzLmxhc3RGb2N1c2VkVGFiICE9PSB0aGlzLnRhYnMubGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0dGhpcy5sYXN0Rm9jdXNlZFRhYiA9IHRoaXMubGFzdEZvY3VzZWRUYWIgKyAxO1xuXHRcdFx0XHRcdFx0dGhpcy50YWJzW3RoaXMubGFzdEZvY3VzZWRUYWJdLmZvY3VzKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRjaGFuZ2UodHlwZSwgaSkge1xuXHRcdFx0bGV0IG1ldGhvZHMgPSB7XG5cdFx0XHRcdG9wZW46IHtcblx0XHRcdFx0XHRjbGFzc2xpc3Q6ICdhZGQnLFxuXHRcdFx0XHRcdHRhYkluZGV4OiB7XG5cdFx0XHRcdFx0XHR0YXJnZXQ6IHRoaXMudGFyZ2V0c1tpXSxcblx0XHRcdFx0XHRcdHZhbHVlOiAnMCdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNsb3NlOiB7XG5cdFx0XHRcdFx0Y2xhc3NsaXN0OiAncmVtb3ZlJyxcblx0XHRcdFx0XHR0YWJJbmRleDoge1xuXHRcdFx0XHRcdFx0dGFyZ2V0OiB0aGlzLnRhcmdldHNbdGhpcy5jdXJyZW50XSxcblx0XHRcdFx0XHRcdHZhbHVlOiAnLTEnXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHR0aGlzLnRhYnNbaV0uY2xhc3NMaXN0W21ldGhvZHNbdHlwZV0uY2xhc3NsaXN0XSh0aGlzLnNldHRpbmdzLmN1cnJlbnRDbGFzcyk7XG5cdFx0XHR0aGlzLnRpdGxlc1tpXS5jbGFzc0xpc3RbbWV0aG9kc1t0eXBlXS5jbGFzc2xpc3RdKHRoaXMuc2V0dGluZ3MuY3VycmVudENsYXNzKTtcblx0XHRcdHRoaXMudGFyZ2V0c1tpXS5jbGFzc0xpc3RbbWV0aG9kc1t0eXBlXS5jbGFzc2xpc3RdKHRoaXMuc2V0dGluZ3MuY3VycmVudENsYXNzKTtcblxuXHRcdFx0dGhpcy50YXJnZXRzW2ldLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAhdGhpcy50YXJnZXRzW2ldLmdldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKSk7XG5cdFx0XHR0aGlzLnRhYnNbaV0uc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgIXRoaXMudGFyZ2V0c1tpXS5nZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnKSk7XG5cdFx0XHR0aGlzLnRhYnNbaV0uc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgIXRoaXMudGFyZ2V0c1tpXS5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSk7XG5cdFx0XHRtZXRob2RzW3R5cGVdLnRhYkluZGV4LnRhcmdldC5zZXRBdHRyaWJ1dGUoJ3RhYkluZGV4JywgbWV0aG9kc1t0eXBlXS50YWJJbmRleC52YWx1ZSk7XG5cdFx0XHRcblx0XHR9LFxuXHRcdG9wZW4oaSkge1xuXHRcdFx0dGhpcy5jaGFuZ2UoJ29wZW4nLCBpKTtcblx0XHRcdHRoaXMuY3VycmVudCA9IGk7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9LFxuXHRcdGNsb3NlKGkpIHtcblx0XHRcdHRoaXMuY2hhbmdlKCdjbG9zZScsIGkpO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSxcblx0XHR0b2dnbGUoaSkge1xuXHRcdFx0aWYodGhpcy5jdXJyZW50ID09PSBpKSB7IHJldHVybjsgfVxuXHRcdFx0XG5cdFx0XHQhIXdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSAmJiB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoeyBVUkw6IHRoaXMudGFic1tpXS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSB9LCAnJywgdGhpcy50YWJzW2ldLmdldEF0dHJpYnV0ZSgnaHJlZicpKTtcblx0XHRcdGlmKHRoaXMuY3VycmVudCA9PT0gbnVsbCkgeyBcblx0XHRcdFx0dGhpcy5vcGVuKGkpO1xuXHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdH1cblx0XHRcdHRoaXMuY2xvc2UodGhpcy5jdXJyZW50KVxuXHRcdFx0XHQub3BlbihpKTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblx0fTtcblxuY29uc3QgaW5pdCA9IChzZWwsIG9wdHMpID0+IHtcblx0bGV0IGVscyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWwpKTtcblx0XG5cdGlmKCFlbHMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ1RhYiBBY2NvcmRpb24gY2Fubm90IGJlIGluaXRpYWxpc2VkLCBubyBhdWdtZW50YWJsZSBlbGVtZW50cyBmb3VuZCcpO1xuXG5cdHJldHVybiBlbHMubWFwKChlbCkgPT4ge1xuXHRcdHJldHVybiBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUoU3Rvcm1UYWJBY2NvcmRpb24pLCB7XG5cdFx0XHRET01FbGVtZW50OiBlbCxcblx0XHRcdHNldHRpbmdzOiBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0cylcblx0XHR9KS5pbml0KCk7XG5cdH0pO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgeyBpbml0IH07Il19

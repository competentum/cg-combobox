/*!
 * cg-combobox v0.0.1 - Accessibale Combobox Component
 * 
 * (c) 2015-2017 Competentum Group | http://competentum.com
 * Released under the MIT license
 * https://opensource.org/licenses/mit-license.php
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["CgCombobox"] = factory();
	else
		root["CgCombobox"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	__webpack_require__(2);

	var _events = __webpack_require__(6);

	var _events2 = _interopRequireDefault(_events);

	var _cgComponentUtils = __webpack_require__(7);

	var _cgComponentUtils2 = _interopRequireDefault(_cgComponentUtils);

	var _merge = __webpack_require__(9);

	var _merge2 = _interopRequireDefault(_merge);

	var _keycode = __webpack_require__(11);

	var _keycode2 = _interopRequireDefault(_keycode);

	var _option = __webpack_require__(12);

	var _option2 = _interopRequireDefault(_option);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var PREFIX = 'cg-combobox';
	var ROOT_CLASS = PREFIX + '-root';
	var INPUT_CLASS = PREFIX + '-input';
	var BUTTON_CLASS = PREFIX + '-button';
	var LIST_CLASS = PREFIX + '-list';
	var LIST_ITEM_CLASS = PREFIX + '-list-item';
	var INPUT_DISABLED_CLASS = PREFIX + '-input-disabled';
	var LIST_ITEM_DISABLED_CLASS = PREFIX + '-list-item-disabled';
	var TEXT_TITLE_CLASS = PREFIX + '-text-title';
	var LIST_ITEM_FOCUSED_CLASS = PREFIX + '-list-item-focused';
	var DIRECTION_AUTO = PREFIX + '-auto';
	var DIRECTION_UP = PREFIX + '-up';

	/**
	 * ComboBox customizing settings
	 * @typedef {Object} ComboBoxSettings
	 * @property {string} placeholder - a string representing placeholder of the component's input.
	 *                                  It is shown when none of options are selected.
	 * @property {string} title - a string containing value to be read by screen reader.
	 * @property {Array} options - an array containing options of the comboBox that are represented as objects.
	 * @property {boolean} disabled - false if comboBox is available for changing value, true if not.
	 * @property {string} direction - when 'up', comboBox expands upward, when 'bottom', comboBox expands down,
	 *                                when 'auto', comboBox automatically chooses the direction depending on free space.
	 * @property {boolean} inputEnabled - false when input is unavailable for user, true if is available.
	 * @property {boolean} filtering - true if list should filter list content depending on input's content, false if not.
	 */

	var CgCombobox = function (_EventEmitter) {
	  _inherits(CgCombobox, _EventEmitter);

	  _createClass(CgCombobox, [{
	    key: 'value',


	    /**
	     * @returns {string} currentComboBoxValue
	     */
	    get: function get() {
	      return this._input.value;
	    }

	    /**
	     * @param {string} newValue
	     */
	    ,
	    set: function set(newValue) {
	      this._input.value = newValue;
	      this.emit(this.constructor.EVENTS.CHANGE);
	    }

	    /**
	     * @param {boolean} newDisabledValue
	     */

	  }, {
	    key: 'disabled',
	    set: function set(newDisabledValue) {
	      this.settings.disabled = newDisabledValue;
	      if (this._input) {
	        this._input.setAttribute('disabled', 'true');
	      }
	    }

	    /**
	     * @constructor
	     * @param {object} settings
	     */

	  }], [{
	    key: 'DEFAULT_SETTINGS',

	    /**
	     *
	     * @returns {ComboBoxSettings}
	     */
	    get: function get() {
	      if (!this._DEFAULT_SETTINGS) {
	        // TODO: fill in standard events handlers below
	        this._DEFAULT_SETTINGS = {
	          placeholder: 'Title',
	          title: 'Combobox',
	          options: [],
	          disabled: false,
	          direction: 'bottom',
	          inputEnabled: false,
	          filtering: false,
	          onExpand: function onExpand() {},
	          onCollapse: function onCollapse() {},
	          onCheck: function onCheck() {},
	          onChange: function onChange() {}
	        };
	      }
	      return this._DEFAULT_SETTINGS;
	    }
	  }, {
	    key: 'EVENTS',
	    get: function get() {
	      if (!this._EVENTS) {
	        this._EVENTS = {
	          CHANGE: 'change',
	          EXPAND: 'expand',
	          COLLAPSE: 'collapse'
	        };
	      }
	      return this._EVENTS;
	    }
	  }]);

	  function CgCombobox(settings) {
	    _classCallCheck(this, CgCombobox);

	    var _this = _possibleConstructorReturn(this, (CgCombobox.__proto__ || Object.getPrototypeOf(CgCombobox)).call(this));

	    _this._applySettings(settings);
	    _this.expanded = false;
	    _this._currentItemsArray = [];

	    _this._render();
	    _this._addListeners();
	    return _this;
	  }

	  _createClass(CgCombobox, [{
	    key: '_applySettings',
	    value: function _applySettings(settings) {
	      var DEFAULT_SETTINGS = this.constructor.DEFAULT_SETTINGS;
	      this.settings = (0, _merge2.default)({}, DEFAULT_SETTINGS, settings);

	      if (settings.container instanceof Element) {
	        this.container = settings.container;
	      } else if (typeof settings.container === 'string') {
	        this.container = document.getElementById(settings.container);
	        if (!this.container) {
	          throw new Error(this.constructor.name + ' initialization error: can not find element with id "' + settings.container + '".');
	        }
	      } else if (typeof settings.container === 'undefined') {
	        this.container = document.createElement('div');
	      } else {
	        throw new Error(this.constructor.name + ' initialization error: type of "settings.container" property is unsupported.');
	      }
	      delete settings.container;

	      // call setters for settings which defined in DEFAULT_SETTINGS only
	      for (var key in DEFAULT_SETTINGS) {
	        if (DEFAULT_SETTINGS.hasOwnProperty(key)) {
	          this[key] = settings[key];
	        }
	      }

	      for (var i = 0; i < settings.options.length; i++) {
	        if (settings.options[i].disabled === undefined) {
	          settings.options[i].disabled = false;
	        }
	      }
	    }

	    /**
	     * @private
	     */

	  }, {
	    key: '_render',
	    value: function _render() {
	      var elementHTML = '\n      <div class=' + ROOT_CLASS + '>\n      <div class=' + TEXT_TITLE_CLASS + '></div>\n        <input type="text" class=' + INPUT_CLASS + ' role="combobox" aria-expanded="true"\n  aria-autocomplete="list" aria-owns="owned_listbox" aria-activedescendant="selected_option" tabindex="1"\n  aria-label=\'' + this.settings.title + '\' placeholder=' + this.settings.placeholder + '>\n        <button class=' + BUTTON_CLASS + '>^</button>\n      </div>\n    ';

	      this._rootElement = _cgComponentUtils2.default.createHTML(elementHTML);

	      this._button = this._rootElement.querySelector('.' + BUTTON_CLASS);
	      this._input = this._rootElement.querySelector('.' + INPUT_CLASS);
	      this._placeholder = this._rootElement.querySelector('.' + TEXT_TITLE_CLASS);
	      if (this.settings.inputEnabled === false) {
	        this._input.setAttribute('disabled', 'disabled');
	      }
	      if (this.settings.disabled) {
	        _cgComponentUtils2.default.addClass(this._input, '' + INPUT_DISABLED_CLASS);
	        this._input.setAttribute('disabled', 'disabled');
	      }
	      this.container.appendChild(this._rootElement);

	      this._renderOptionsList();
	    }

	    /**
	     * @private
	     */

	  }, {
	    key: '_clearOptionsList',
	    value: function _clearOptionsList() {
	      var list = this._rootElement.querySelector('.' + LIST_CLASS);

	      if (list) {
	        list.innerHTML = '';
	      }
	    }

	    /**
	     * @private
	     */

	  }, {
	    key: '_checkConstraints',
	    value: function _checkConstraints() {
	      var list = this._rootElement.querySelector('.' + LIST_CLASS);
	      var offsetTop = this._rootElement.offsetTop;
	      var currentMargin = (this._currentLIHeight + 1) * this.settings.options.length;
	      var offsetBottom = window.innerHeight - offsetTop - this._currentLIHeight;

	      if (offsetBottom < currentMargin) {
	        if (list) list.setAttribute('direction', DIRECTION_UP);
	      }
	    }

	    /**
	     * @private
	     */

	  }, {
	    key: '_renderOptionsList',
	    value: function _renderOptionsList() {
	      var optionsListHTML = '<ul role="listbox" class=' + LIST_CLASS + '></ul>';

	      this._optionsList = _cgComponentUtils2.default.createHTML(optionsListHTML);
	      this._updateOptionsList();
	      if (PREFIX + '-' + this.settings.direction === DIRECTION_AUTO) {
	        this._checkConstraints();
	      }
	    }

	    /**
	     * @private
	     */

	  }, {
	    key: '_updateOptionsList',
	    value: function _updateOptionsList() {
	      this._currentItemsArray = [];

	      for (var i = 0; i < this.settings.options.length; i++) {
	        this._currentItemsArray.push(this.settings.options[i]);
	        if (this.settings.filtering) {
	          if (this._currentItemsArray[i].value.indexOf(this._input.value) === -1) {
	            continue;
	          }
	        }
	        this._addOptionsListItem(this.settings.options[i]);
	      }

	      var prevOptionsList = this._rootElement.querySelector('.' + LIST_CLASS);

	      if (this.expanded) {
	        if (prevOptionsList) {
	          this._rootElement.removeChild(prevOptionsList);
	        }
	        this._rootElement.appendChild(this._optionsList);
	        this._currentLIHeight = document.getElementsByClassName(LIST_ITEM_CLASS)[0].getBoundingClientRect().height;
	      }
	    }

	    /**
	     * @private
	     * @param {string} newItemVal
	     */

	  }, {
	    key: '_addOptionsListItem',
	    value: function _addOptionsListItem(newItemVal) {
	      var newItem = new _option2.default(this._optionsList, newItemVal.value);
	      newItem.render();
	    }

	    /**
	     * @private
	     */

	  }, {
	    key: '_addListeners',
	    value: function _addListeners() {
	      var _this2 = this;

	      document.addEventListener('click', this._onOutSideClick.bind(this));
	      window.addEventListener('resize', function () {
	        _this2._checkConstraints();
	      });
	      this._button.addEventListener('click', this._onButtonClick.bind(this));
	      this._input.addEventListener('input', this._onInputChange.bind(this));
	      this._input.addEventListener('click', this._onInputClick.bind(this));
	      this._input.addEventListener('keydown', this._onKeyDown.bind(this));
	    }

	    /**
	     * @private
	     */

	  }, {
	    key: '_onOutSideClick',
	    value: function _onOutSideClick(event) {
	      if (event.target !== this._button && event.target !== this._input) {
	        this.collapse();
	      }
	    }

	    /**
	     * @private
	     */

	  }, {
	    key: '_onButtonClick',
	    value: function _onButtonClick() {
	      if (this.settings.disabled) {
	        return;
	      }
	      if (this.expanded) {
	        this.collapse();
	      } else {
	        this.expand();
	      }
	    }

	    /**
	     * @private
	     */

	  }, {
	    key: '_onOptionClick',
	    value: function _onOptionClick(event) {
	      this._selectListItem(event.target);
	    }

	    /**
	     * @private
	     */

	  }, {
	    key: '_selectListItem',
	    value: function _selectListItem(item) {
	      this.collapse();
	      if (item.getAttribute('class').indexOf(LIST_ITEM_DISABLED_CLASS) !== -1) {
	        return;
	      }
	      this.value = item.textContent;
	      this._placeholder.textContent = this.settings.placeholder;
	    }

	    /**
	     * @private
	     */

	  }, {
	    key: '_onInputChange',
	    value: function _onInputChange() {
	      if (this.settings.disabled) {
	        return;
	      }
	      if (this.settings.filtering) {
	        this._clearOptionsList();
	        this._updateOptionsList();
	      }
	      if (this._input.value === '') {
	        this._placeholder.textContent = '';
	      }
	    }

	    /**
	     * @private
	     */

	  }, {
	    key: '_onInputClick',
	    value: function _onInputClick() {
	      if (this.settings.disabled) {
	        return;
	      }
	      this.expand();
	    }

	    /**
	     * @private
	     */

	  }, {
	    key: '_onKeyDown',
	    value: function _onKeyDown(event) {
	      if (event.keyCode === _keycode2.default.DOWN) {
	        this.expand();
	        this._currentListItemIndex = 0;
	        this._optionsList.childNodes[this._currentListItemIndex].focus();
	        _cgComponentUtils2.default.addClass(this._optionsList.childNodes[this._currentListItemIndex], LIST_ITEM_FOCUSED_CLASS);
	      }
	    }

	    /**
	     * @private
	     */

	  }, {
	    key: '_onListItemKeyDown',
	    value: function _onListItemKeyDown(event) {
	      var keyCode = event.keyCode;

	      switch (keyCode) {
	        case _keycode2.default.DOWN:
	        case _keycode2.default.RIGHT:
	          this._moveFocusDown();
	          break;
	        case _keycode2.default.UP:
	        case _keycode2.default.LEFT:
	          this._moveFocusUp();
	          break;
	        case _keycode2.default.ENTER:
	        case _keycode2.default.SPACE:
	          this._selectListItem(event.target);
	          break;
	      }
	    }

	    /**
	     * @private
	     */

	  }, {
	    key: '_moveFocusDown',
	    value: function _moveFocusDown() {
	      if (this._currentListItemIndex < this._optionsList.childNodes.length - 1) {
	        this._optionsList.childNodes[++this._currentListItemIndex].focus();
	      }
	    }

	    /**
	     * @private
	     */

	  }, {
	    key: '_moveFocusUp',
	    value: function _moveFocusUp() {
	      if (this._currentListItemIndex > 0) {
	        this._optionsList.childNodes[--this._currentListItemIndex].focus();
	      }
	    }
	  }, {
	    key: '_onListItemFocus',
	    value: function _onListItemFocus(event) {
	      _cgComponentUtils2.default.addClass(event.target, LIST_ITEM_FOCUSED_CLASS);
	    }
	  }, {
	    key: '_onListItemBlur',
	    value: function _onListItemBlur(event) {
	      _cgComponentUtils2.default.removeClass(event.target, LIST_ITEM_FOCUSED_CLASS);
	    }

	    /**
	     * expand Method is available to component's user
	     * @public
	     * @param {boolean} emitEvent
	     * @function
	     */

	  }, {
	    key: 'expand',
	    value: function expand(emitEvent) {
	      if (!this.expanded) {
	        this._optionsList.style.display = 'block';
	        this.expanded = !this.expanded;
	        this._renderOptionsList();
	        this._currentListItemIndex = 0;
	        var childNodes = this._optionsList.childNodes;

	        for (var i = 0; i < childNodes.length; i++) {
	          childNodes[i].addEventListener('keydown', this._onListItemKeyDown.bind(this));
	          childNodes[i].addEventListener('focus', this._onListItemFocus.bind(this));
	          childNodes[i].addEventListener('blur', this._onListItemBlur.bind(this));
	          if (this._currentItemsArray[i]) {
	            if (this._currentItemsArray[i].disabled === false) {
	              childNodes[i].addEventListener('click', this._onOptionClick.bind(this));
	            }
	          }
	        }
	        if (!emitEvent) {
	          return;
	        }
	        this.emit(this.constructor.EVENTS.EXPAND);
	      }
	    }

	    /**
	     * collapse Method is available to component's user
	     * @public
	     * @param {boolean} emitEvent
	     * @function
	     */

	  }, {
	    key: 'collapse',
	    value: function collapse(emitEvent) {
	      if (this.expanded) {
	        this._optionsList.style.display = 'none';
	        this.expanded = !this.expanded;
	      }
	      if (!emitEvent) {
	        return;
	      }
	      this.emit(this.constructor.EVENTS.COLLAPSE);
	    }

	    /**
	     * addOptions is a public method for component's users
	     * @public
	     * @param {Array} newOptions
	     * @function
	     **/

	  }, {
	    key: 'addOptions',
	    value: function addOptions(newOptions) {
	      var _this3 = this;

	      newOptions.forEach(function (value) {
	        if (value.disabled === undefined) {
	          value.disabled = false;
	        }
	        _this3.settings.options.push(value);
	      });
	    }

	    /**
	     * deleteOption is a public method for component's users
	     * @public
	     * @param {string} optionToDelete
	     * @function
	     **/

	  }, {
	    key: 'deleteOption',
	    value: function deleteOption(optionToDelete) {
	      var _this4 = this;

	      this.settings.options.forEach(function (value, index) {
	        if (value.value === optionToDelete) {
	          _this4.settings.options.splice(index, 1);
	        }
	      });
	    }
	  }]);

	  return CgCombobox;
	}(_events2.default);

	module.exports = CgCombobox;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(3);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/postcss-loader/index.js!./../node_modules/less-loader/index.js!./common.less", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/postcss-loader/index.js!./../node_modules/less-loader/index.js!./common.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, ".cg-combobox-root {\n  width: 100%;\n  height: 100%;\n  min-width: 100px;\n  position: relative;\n}\n.cg-combobox-input {\n  display: block;\n  width: 100%;\n  height: 100%;\n  border: none;\n  outline: none;\n  border-bottom: #17AC5B solid 2px;\n  margin: 0;\n  padding-right: 35px;\n}\n.cg-combobox-input::-ms-clear {\n  display: none;\n}\n.cg-combobox-button {\n  display: block;\n  float: right;\n  clear: both;\n  width: 35px;\n  height: 100%;\n  background-color: transparent;\n  border: none;\n  margin-right: -35px;\n  margin-top: -40px;\n}\n.cg-combobox-button:active {\n  border: none;\n}\n.cg-combobox-button:hover {\n  cursor: pointer;\n}\n.cg-combobox-list {\n  z-index: 20;\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  overflow: auto;\n  border: grey solid 1px;\n  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);\n}\n.cg-combobox-list[direction='cg-combobox-up'] {\n  bottom: 100%;\n}\n.cg-combobox-list[direction='cg-combobox-bottom'] {\n  top: 100%;\n}\n.cg-combobox-list-item {\n  background-color: white;\n  position: relative;\n  display: block;\n  text-align: left;\n  margin: 0;\n  padding: 5% 0;\n  padding-left: 5%;\n}\n.cg-combobox-list-item-disabled {\n  color: rgba(1, 0, 0, 0.3);\n}\n.cg-combobox-list-item:hover {\n  cursor: pointer;\n  background-color: rgba(1, 1, 1, 0.2);\n}\n.cg-combobox-list-item-disabled:hover {\n  cursor: default;\n  background-color: white;\n}\n.cg-combobox-arrow {\n  position: relative;\n  z-index: 40;\n  width: 0;\n  height: 0;\n  border-style: solid;\n  margin-top: 70%;\n}\n.cg-combobox-arrow-up {\n  border-width: 0 10px 10px 10px;\n  border-color: transparent transparent grey transparent;\n}\n.cg-combobox-arrow-down {\n  border-width: 10px 10px 0 10px;\n  border-color: grey transparent transparent transparent;\n}\n.cg-combobox-input:disabled {\n  background-color: transparent;\n}\n.cg-combobox-input-disabled {\n  border-bottom: grey solid 2px;\n}\n.cg-combobox-input-disabled:hover {\n  cursor: default;\n}\n.cg-combobox-text-title {\n  position: absolute;\n  z-index: 30;\n  color: #17AC5B;\n  font-weight: 700;\n  font-size: .9em;\n  margin-top: .1%;\n}\n.cg-combobox-list-item-focused {\n  background-color: rgba(1, 0, 0, 0.1);\n  outline: none;\n}\n.cg-combobox-list-item-picture {\n  width: 10%;\n  margin-right: 3px;\n}\n", ""]);

	// exports


/***/ },
/* 4 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 6 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      } else {
	        // At least give some kind of context to the user
	        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
	        err.context = er;
	        throw err;
	      }
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(8);

	module.exports = {

	  /**
	   *
	   * @param {Element} element
	   * @param {string} className
	   */
	  addClass: function addClass(element, className) {
	    var re = new RegExp('(^|\\s)' + className + '(\\s|$)', 'g');
	    if (re.test(element.className)) return;
	    element.className = (element.className + ' ' + className).replace(/\s+/g, ' ').replace(/(^ | $)/g, '');
	  },

	  /**
	   *
	   * @param {Element} element
	   * @param {string} className
	   * @returns {boolean}
	   */
	  hasClass: function (element, className) {
	    return element.matches('.' + className);
	  },

	  /**
	   *
	   * @param {Element} element
	   * @param {string} className
	   */
	  removeClass: function removeClass(element, className) {
	    var re = new RegExp('(^|\\s)' + className + '(\\s|$)', 'g');
	    element.className = element.className.replace(re, '$1').replace(/\s+/g, ' ').replace(/(^ | $)/g, '');
	  },

	  /**
	   * Removes current node from tree.
	   * @param {Node} node
	   */
	  removeNode: function removeNode(node) {
	    if (node.parentNode)
	      node.parentNode.removeChild(node);
	  },

	  /**
	   *
	   * @param {string} html
	   * @returns {Node}
	   */
	  createHTML: function createHTML(html) {
	    var div = document.createElement('div');
	    div.innerHTML = html.trim();
	    return div.firstChild;
	  },

	  /**
	   * Adds coordinates to event object independently of event from touching or mouse. (cx, cy - client coordinates, px, py - page coordinates)
	   * @param event
	   */
	  extendEventObject: function extendEventObject(event) {
	    if (event.touches && event.touches[0]) {
	      event.cx = event.touches[0].clientX;
	      event.cy = event.touches[0].clientY;
	      event.px = event.touches[0].pageX;
	      event.py = event.touches[0].pageY;
	    }
	    else if (event.changedTouches && event.changedTouches[0]) {
	      event.cx = event.changedTouches[0].clientX;
	      event.cy = event.changedTouches[0].clientY;
	      event.px = event.changedTouches[0].pageX;
	      event.py = event.changedTouches[0].pageY;
	    }
	    else {
	      event.cx = event.clientX;
	      event.cy = event.clientY;
	      event.px = event.pageX;
	      event.py = event.pageY;
	    }
	  }
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	if (!Element.prototype.matches) {
	  Element.prototype.matches =
	    Element.prototype.matchesSelector ||
	    Element.prototype.mozMatchesSelector ||
	    Element.prototype.msMatchesSelector ||
	    Element.prototype.oMatchesSelector ||
	    Element.prototype.webkitMatchesSelector ||
	    function (s) {
	      var matches = (this.document || this.ownerDocument).querySelectorAll(s),
	          i       = matches.length;
	      while (--i >= 0 && matches.item(i) !== this) {
	        // empty
	      }
	      return i > -1;
	    };
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/*!
	 * @name JavaScript/NodeJS Merge v1.2.0
	 * @author yeikos
	 * @repository https://github.com/yeikos/js.merge

	 * Copyright 2014 yeikos - MIT license
	 * https://raw.github.com/yeikos/js.merge/master/LICENSE
	 */

	;(function(isNode) {

		/**
		 * Merge one or more objects 
		 * @param bool? clone
		 * @param mixed,... arguments
		 * @return object
		 */

		var Public = function(clone) {

			return merge(clone === true, false, arguments);

		}, publicName = 'merge';

		/**
		 * Merge two or more objects recursively 
		 * @param bool? clone
		 * @param mixed,... arguments
		 * @return object
		 */

		Public.recursive = function(clone) {

			return merge(clone === true, true, arguments);

		};

		/**
		 * Clone the input removing any reference
		 * @param mixed input
		 * @return mixed
		 */

		Public.clone = function(input) {

			var output = input,
				type = typeOf(input),
				index, size;

			if (type === 'array') {

				output = [];
				size = input.length;

				for (index=0;index<size;++index)

					output[index] = Public.clone(input[index]);

			} else if (type === 'object') {

				output = {};

				for (index in input)

					output[index] = Public.clone(input[index]);

			}

			return output;

		};

		/**
		 * Merge two objects recursively
		 * @param mixed input
		 * @param mixed extend
		 * @return mixed
		 */

		function merge_recursive(base, extend) {

			if (typeOf(base) !== 'object')

				return extend;

			for (var key in extend) {

				if (typeOf(base[key]) === 'object' && typeOf(extend[key]) === 'object') {

					base[key] = merge_recursive(base[key], extend[key]);

				} else {

					base[key] = extend[key];

				}

			}

			return base;

		}

		/**
		 * Merge two or more objects
		 * @param bool clone
		 * @param bool recursive
		 * @param array argv
		 * @return object
		 */

		function merge(clone, recursive, argv) {

			var result = argv[0],
				size = argv.length;

			if (clone || typeOf(result) !== 'object')

				result = {};

			for (var index=0;index<size;++index) {

				var item = argv[index],

					type = typeOf(item);

				if (type !== 'object') continue;

				for (var key in item) {

					var sitem = clone ? Public.clone(item[key]) : item[key];

					if (recursive) {

						result[key] = merge_recursive(result[key], sitem);

					} else {

						result[key] = sitem;

					}

				}

			}

			return result;

		}

		/**
		 * Get type of variable
		 * @param mixed input
		 * @return string
		 *
		 * @see http://jsperf.com/typeofvar
		 */

		function typeOf(input) {

			return ({}).toString.call(input).slice(8, -1).toLowerCase();

		}

		if (isNode) {

			module.exports = Public;

		} else {

			window[publicName] = Public;

		}

	})(typeof module === 'object' && module && typeof module.exports === 'object' && module.exports);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)(module)))

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * Created by Praskura on 15.12.2016.
	 */
	exports.default = {
	  BACKSPACE: 8,
	  TAB: 9,
	  ENTER: 13,
	  SHIFT: 16,
	  CTRL: 17,
	  ALT: 18,
	  PAUSE: 19,
	  CAPSLOCK: 20,
	  ESCAPE: 27,
	  SPACE: 32,

	  PAGEUP: 33,
	  PAGEDOWN: 34,
	  END: 35,
	  HOME: 36,
	  LEFT: 37,
	  UP: 38,
	  RIGHT: 39,
	  DOWN: 40,
	  INSERT: 45,
	  DELETE: 46,

	  // numbers
	  KEY_0: 48,
	  KEY_1: 49,
	  KEY_2: 50,
	  KEY_3: 51,
	  KEY_4: 52,
	  KEY_5: 53,
	  KEY_6: 54,
	  KEY_7: 55,
	  KEY_8: 56,
	  KEY_9: 57,

	  // alphabet
	  A: 65,
	  B: 66,
	  C: 67,
	  D: 68,
	  E: 69,
	  F: 70,
	  G: 71,
	  H: 72,
	  I: 73,
	  J: 74,
	  K: 75,
	  L: 76,
	  M: 77,
	  N: 78,
	  O: 79,
	  P: 80,
	  Q: 81,
	  R: 82,
	  S: 83,
	  T: 84,
	  U: 85,
	  V: 86,
	  W: 87,
	  X: 88,
	  Y: 89,
	  Z: 90,

	  SELECT: 93,

	  NUMPAD_0: 96,
	  NUMPAD_1: 97,
	  NUMPAD_2: 98,
	  NUMPAD_3: 99,
	  NUMPAD_4: 100,
	  NUMPAD_5: 101,
	  NUMPAD_6: 102,
	  NUMPAD_7: 103,
	  NUMPAD_8: 104,
	  NUMPAD_9: 105,

	  MULTIPLY: 106,
	  ADD: 107,
	  SUBTRACT: 109,
	  DECIMALPOINT: 110,
	  DIVIDE: 111,

	  // F1~F2
	  F1: 112,
	  F2: 113,
	  F3: 114,
	  F4: 115,
	  F5: 116,
	  F6: 117,
	  F7: 118,
	  F8: 119,
	  F9: 120,
	  F10: 121,
	  F11: 122,
	  F12: 123,

	  // etc / accents
	  NUMLOCK: 144,
	  SCROLLLOCK: 145,
	  SEMICOLON: 186,
	  EQUALSIGN: 187,
	  COMMA: 188,
	  DASH: 189,
	  PERIOD: 190,
	  FORWARDSLASH: 191,
	  GRAVEACCENT: 192,
	  OPENBRACKET: 219,
	  BACKSLASH: 220,
	  CLOSEBRAKET: 221,
	  SINGLEQUOTE: 222
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Praskura on 12.01.2017.
	 */
	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _cgComponentUtils = __webpack_require__(7);

	var _cgComponentUtils2 = _interopRequireDefault(_cgComponentUtils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var PREFIX = 'cg-combobox';
	var LIST_ITEM_CLASS = PREFIX + '-list-item';
	var LIST_ITEM_PICTURE = PREFIX + '-list-item-picture';
	var LIST_ITEM_TEXT = PREFIX + '-list-item-text';

	var ComboBoxOption = function () {
	  function ComboBoxOption(parentElement, value, pic) {
	    _classCallCheck(this, ComboBoxOption);

	    this._value = value;
	    this._disabled = false;
	    this._pic = pic;
	    this._parentElement = parentElement;

	    this.addListeners();
	  }

	  _createClass(ComboBoxOption, [{
	    key: 'render',
	    value: function render() {
	      var optionHTML = '';
	      if (this._pic) {
	        optionHTML = '<li role="option" class=' + LIST_ITEM_CLASS + ' tabindex="-1"><img src="' + this._pic + '"\n                                class="' + LIST_ITEM_PICTURE + '" alt=""><span class="' + LIST_ITEM_TEXT + '">' + this._value + '</span></li>';
	      } else {
	        optionHTML = '<li role="option" class=' + LIST_ITEM_CLASS + ' tabindex="-1">\n                                 <span class="' + LIST_ITEM_TEXT + '">' + this._value + '</span></li>';
	      }

	      this._elem = _cgComponentUtils2.default.createHTML(optionHTML);

	      this._parentElement.appendChild(this._elem);
	    }
	  }, {
	    key: 'addListeners',
	    value: function addListeners() {}
	  }, {
	    key: 'value',
	    get: function get() {
	      return this._value;
	    },
	    set: function set(value) {
	      this._value = value;
	    }
	  }, {
	    key: 'disabled',
	    get: function get() {
	      return this._disabled;
	    },
	    set: function set(value) {
	      this._disabled = value;
	    }
	  }, {
	    key: 'pic',
	    get: function get() {
	      return this._pic;
	    },
	    set: function set(srcPath) {
	      this._pic = srcPath;
	    }
	  }]);

	  return ComboBoxOption;
	}();

	module.exports = ComboBoxOption;

/***/ }
/******/ ])
});
;
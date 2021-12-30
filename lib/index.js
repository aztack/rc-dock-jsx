"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inspect = exports.loadTab = exports.saveTab = exports.DockLayout = exports.autoSaveLayout = exports.HBox = exports.VBox = exports.Tab = exports.Panel = exports.vbox = exports.hbox = exports.panel = exports.tab = exports.setTabIdPrefix = void 0;
var React = __importStar(require("react"));
var rc_dock_1 = require("rc-dock");
var lodash_pick_1 = __importDefault(require("lodash.pick"));
var lodash_omit_1 = __importDefault(require("lodash.omit"));
var lodash_merge_1 = __importDefault(require("lodash.merge"));
var tabId = 0;
var tabPrefix = 'tab-';
function setTabIdPrefix(prefix) {
    tabPrefix = prefix;
}
exports.setTabIdPrefix = setTabIdPrefix;
/**
 * Create a tab
 * @param title tab title
 * @param content content jsx or a function which return jsx
 * @param opts tab options
 * @returns
 */
function tab(title, content, opts) {
    return (0, lodash_merge_1.default)(__assign({ id: "".concat(tabPrefix).concat(tabId++), title: title, content: content }, opts));
}
exports.tab = tab;
/**
 * Create a panel with tabs
 * @param name panel name
 * @param tabs array of tab
 * @param opts panel options
 * @returns
 */
function panel(name, tabs, opts) {
    return (0, lodash_merge_1.default)({ tabs: tabs }, opts);
}
exports.panel = panel;
/**
 * Create a horizontal panel container
 * @param children array of panel/vbox/hbox
 * @param opts container options
 * @returns
 */
function hbox(children, opts) {
    return (0, lodash_merge_1.default)({ mode: 'horizontal', children: children }, opts);
}
exports.hbox = hbox;
/**
 * Create a vertical panel container
 * @param children array of panel/vbox/hbox
 * @param opts container options
 * @returns
 */
function vbox(children, opts) {
    return (0, lodash_merge_1.default)({ mode: 'vertical', children: children }, opts);
}
exports.vbox = vbox;
/** Helper JSX elements */
function Panel(props) {
    return React.createElement(React.Fragment, null);
}
exports.Panel = Panel;
;
function Tab(props) {
    return props.content ? props.content() : React.createElement(React.Fragment, null);
}
exports.Tab = Tab;
function VBox(props) {
    return React.createElement(React.Fragment, null);
}
exports.VBox = VBox;
function HBox(props) {
    return React.createElement(React.Fragment, null);
}
exports.HBox = HBox;
;
function useCombinedRefs() {
    var refs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        refs[_i] = arguments[_i];
    }
    var targetRef = React.useRef(null);
    React.useEffect(function () {
        refs.forEach(function (ref) {
            if (!ref)
                return;
            if (typeof ref === 'function') {
                ref(targetRef.current);
            }
            else {
                ref.current = targetRef.current;
            }
        });
    }, [refs]);
    return targetRef;
}
var logger = console;
var TAG = '[rc-dock]';
var defaultAutoSaveLayoutOptions = { interval: 5000, log: false, key: 'layout' };
function autoSaveLayout(dockLayout, opts, debug) {
    if (opts === void 0) { opts = defaultAutoSaveLayoutOptions; }
    var saveLayoutTimer = -1;
    var savedLayout = localStorage.getItem(opts.key);
    if (savedLayout) {
        try {
            var layoutData = JSON.parse(savedLayout);
            if (debug)
                logger.log("".concat(TAG, ": Loading layout:"), layoutData);
            dockLayout.current.loadLayout(layoutData);
        }
        catch (e) { }
    }
    if (saveLayoutTimer < 0) {
        saveLayoutTimer = window.setInterval(function () {
            var layoutData = dockLayout.current.saveLayout();
            if (debug)
                logger.log("".concat(TAG, ": Saving layout:"), layoutData);
            localStorage.setItem(opts.key, JSON.stringify(layoutData));
        }, opts.interval || 5000);
    }
    return function () { return window.clearInterval(saveLayoutTimer); };
}
exports.autoSaveLayout = autoSaveLayout;
var prevLayout = null;
/**
 * DockLayout
 * @example
 * <DockLayout autosave={{interval: 10000, log: true, key: 'editorKey'}} />
 */
// eslint-disable-next-line @typescript-eslint/no-redeclare
exports.DockLayout = React.forwardRef(function (props, ref) {
    var config = {}; // extracted tab props
    var layout = { dockbox: jsxToJson([props.children], config)[0] };
    var debug = props.debug;
    if (debug) {
        logger.log("".concat(TAG, ": DockLayout.layout:"));
        inspect(layout);
    }
    var innerRef = React.useRef(ref);
    var combinedRef = useCombinedRefs(ref, innerRef);
    var autosave = typeof props.autosave === 'boolean'
        ? defaultAutoSaveLayoutOptions
        : props.autosave;
    if (debug)
        logger.log("".concat(TAG, ": Collected tab props:"), config);
    React.useEffect(function () {
        if (props.autosave) {
            autoSaveLayout(combinedRef, autosave, autosave.log);
        }
    }, [ref]);
    return Object.keys(config).length !== 0
        ? React.createElement(rc_dock_1.DockLayout, __assign(__assign({ ref: combinedRef, saveTab: saveTab, loadTab: function (d) { return loadTab(d, config); } }, props), { layout: props.layout || layout }))
        : React.createElement(rc_dock_1.DockLayout, __assign(__assign({ ref: combinedRef }, props), { layout: props.layout || layout }));
});
function collectTabData(props, config) {
    var it = config[props.title] = (0, lodash_omit_1.default)(props, 'children');
    it['content'] = function () { return React.createElement(React.Fragment, null, props.children); };
}
function jsxToJson(children, config) {
    if (!Array.isArray(children))
        children = [children];
    return children.map(function (item) {
        // TODO: Check validity of children type
        if (item.type === Panel) {
            return panel(item.props.id, jsxToJson(item.props.children, config), (0, lodash_omit_1.default)(item.props, ['id', 'children']));
        }
        else if (item.type === VBox) {
            return vbox(jsxToJson(item.props.children, config));
        }
        else if (item.type === HBox) {
            return hbox(jsxToJson(item.props.children, config));
        }
        else if (item.type === Tab) {
            collectTabData(item.props, config);
            return tab(item.props.title, item.props.children, (0, lodash_pick_1.default)(item.props, 'group', 'minHeight', 'minWidth'));
        }
        else {
            return item;
        }
    });
}
/**
 * Callback of DockLayout.saveTab
 * @param tabData
 * @param props
 * @returns
 * @example
 * <DockLayout saveTab={saved => saveTab(saved, ['customProp'])} />
 */
function saveTab(tabData, props) {
    if (props === void 0) { props = []; }
    return lodash_pick_1.default.apply(void 0, __spreadArray([tabData, 'id', 'title', 'group', 'size', 'minWidth', 'minHeight'], props, false));
}
exports.saveTab = saveTab;
/**
 * Callback of DockLayout.loadTab
 * @param savedTab
 * @param config
 * @returns
 * @example
 * const config = {};
 * <DockLayout loadTab={saved => loadTab(saved, config)} />
 */
function loadTab(savedTab, config) {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    var panel = config[savedTab['title']];
    var id = savedTab.id;
    var title = savedTab['title'];
    if (!id || !title) {
        logger.warn("".concat(TAG, ": Can not create panel with unknown title \"").concat(title, "\""));
        return;
    }
    return __assign(__assign({ id: id }, panel), { title: title });
}
exports.loadTab = loadTab;
/**
 * Inspect raw layout data by cloning
 * must be called right after layout data initialized and before rendering
 * since more filed will be added after rendering
 * @param layout
 */
function inspect(layout) {
    var cloned = layout;
    try {
        cloned = JSON.parse(JSON.stringify(layout));
    }
    catch (e) {
    }
    finally {
        console.dir(cloned);
    }
}
exports.inspect = inspect;
//# sourceMappingURL=index.js.map
import * as React from 'react';
import type { ReactElement } from 'react';
import { BoxData, PanelData, TabData, DockLayout as RcDockLayout, LayoutProps, TabBase } from 'rc-dock';
import pick from 'lodash.pick';
import omit from 'lodash.omit';
import merge from 'lodash.merge';

type Content = ReactElement | ((tab: TabData) => ReactElement);

let tabId = 0;
let tabPrefix = 'tab-';
export function setTabIdPrefix(prefix: string): void {
  tabPrefix = prefix;
}
/**
 * Create a tab
 * @param title tab title
 * @param content content jsx or a function which return jsx
 * @param opts tab options
 * @returns
 */
export function tab(title: string, content: Content, opts?: any): TabData {
  return merge({id: `${tabPrefix}${tabId++}`, title, content, ...opts});
}

/**
 * Create a panel with tabs
 * @param name panel name
 * @param tabs array of tab
 * @param opts panel options
 * @returns
 */
export function panel(name: string, tabs: TabData[], opts?: any): PanelData {
  return merge({tabs}, opts);
}

/**
 * Create a horizontal panel container
 * @param children array of panel/vbox/hbox
 * @param opts container options
 * @returns
 */
export function hbox(children: (BoxData | PanelData)[], opts?: any): BoxData {
  return merge({mode: 'horizontal', children}, opts);
}

/**
 * Create a vertical panel container
 * @param children array of panel/vbox/hbox
 * @param opts container options
 * @returns
 */
export function vbox(children: (BoxData | PanelData)[], opts?: any): BoxData {
  return merge({mode: 'vertical', children}, opts);
}

/** Helper JSX elements */

export function Panel<T>(props: T): JSX.Element {
  return React.createElement(React.Fragment, null);
}

// title is mandatory (as config key) for automatically extract layout config from tab props
export interface TabProps {title: string, minWidth?: number, minHeight?: number, group?: string, closable?: boolean, content?: () => JSX.Element, opts?: any};
export function Tab(props: React.PropsWithChildren<TabProps>): JSX.Element {
  return props.content ? props.content() : React.createElement(React.Fragment, null);
}

export function VBox<T>(props: T): JSX.Element {
  return React.createElement(React.Fragment, null);
}

export function HBox<T>(props: T): JSX.Element {
  return React.createElement(React.Fragment, null);
}
export type DockLayout = RcDockLayout;
export interface AutoSaveLayoutOptions {key: string, interval?: number, log?: boolean} ;

export type DockLayoutProps = LayoutProps & {
  debug?: boolean,
  autosave?: true | AutoSaveLayoutOptions,
};

function useCombinedRefs<T>(...refs: any[]): React.RefObject<T> {
  const targetRef = React.useRef<T>(null);

  React.useEffect(() => {
    refs.forEach(ref => {
      if (!ref) return;

      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        ref.current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
}

const logger = console;
const TAG = '[rc-dock]';

const defaultAutoSaveLayoutOptions =  {interval: 5000, log: false, key: 'layout'};

export function autoSaveLayout(
  dockLayout: React.RefObject<DockLayout>,
  opts: AutoSaveLayoutOptions = defaultAutoSaveLayoutOptions,
  debug: boolean | undefined
): () => void {
  let saveLayoutTimer: number = -1;
  const savedLayout = localStorage.getItem(opts.key);
  if (savedLayout) {
    try {
      const layoutData = JSON.parse(savedLayout);
      if (debug) logger.log(`${TAG}: Loading layout:`, layoutData);
      dockLayout.current!.loadLayout(layoutData);
    } catch (e) {}
  }
  if (saveLayoutTimer < 0) {
    saveLayoutTimer = window.setInterval(() => {
      const layoutData = dockLayout.current!.saveLayout();
      if (debug) logger.log(`${TAG}: Saving layout:`, layoutData);
      localStorage.setItem(opts.key, JSON.stringify(layoutData));
    }, opts.interval || 5000);
  }
  return () => window.clearInterval(saveLayoutTimer);
}
let prevLayout: any = null;
/**
 * DockLayout
 * @example
 * <DockLayout autosave={{interval: 10000, log: true, key: 'editorKey'}} />
 */
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DockLayout = React.forwardRef<DockLayout, React.PropsWithChildren<DockLayoutProps>>((props, ref) => {
  const config: Record<string, TabData> = {}; // extracted tab props
  const layout = {dockbox: jsxToJson([props.children], config)[0]};
  const { debug } = props;

  if (debug) {
    logger.log(`${TAG}: DockLayout.layout:`);
    inspect(layout);
  }

  const innerRef = React.useRef(ref);
  const combinedRef = useCombinedRefs<DockLayout>(ref, innerRef);

  const autosave = typeof props.autosave === 'boolean'
    ? defaultAutoSaveLayoutOptions
    : props.autosave!;
  
    if (debug) logger.log(`${TAG}: Collected tab props:`, config);
    React.useEffect(() => {
      if (props.autosave) {
        autoSaveLayout(combinedRef, autosave, autosave.log);
      }
    }, [ref]);

  return Object.keys(config).length !== 0
    ? React.createElement(RcDockLayout, {
        ref: combinedRef,
        saveTab: saveTab,
        loadTab: (d: TabBase) => loadTab(d as TabData, config) as TabData,
        ...props,
        ...{layout: props.layout || layout}
      })
    : React.createElement(RcDockLayout, {
        ref: combinedRef,
        ...props,
        ...{layout: props.layout || layout}
      });
});

function collectTabData(props: any, config: any): void {
  const it = config[props.title] = omit(props, 'children');
  it['content'] = () => React.createElement(React.Fragment, null, props.children);
}

function jsxToJson(children: any, config?: any) {
  if (!Array.isArray(children)) children = [children];
  return children.map((item: any) => {
    // TODO: Check validity of children type
    if (item.type === Panel) {
      return panel(item.props.id, jsxToJson(item.props.children, config), omit(item.props, ['id', 'children']));
    } else if (item.type === VBox) {
      return vbox(jsxToJson(item.props.children, config));
    } else if (item.type === HBox) {
      return hbox(jsxToJson(item.props.children, config));
    } else if (item.type === Tab) {
      collectTabData(item.props, config);
      return tab(item.props.title, item.props.children, pick(item.props, 'group', 'minHeight', 'minWidth'));
    } else {
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
export function saveTab(tabData: TabData, props: string[] = []): Partial<TabData> {
  return pick(tabData, 'id', 'title', 'group', 'size', 'minWidth', 'minHeight', ...props);
}

/**
 * Callback of DockLayout.loadTab
 * @param savedTab
 * @param config
 * @returns
 * @example
 * const config = {};
 * <DockLayout loadTab={saved => loadTab(saved, config)} />
 */
export function loadTab(savedTab: TabData, config: Record<string, TabData>): TabData | undefined {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const panel = config[savedTab['title'] as string];
  const id = savedTab.id;
  const title = savedTab['title'];
  if (!id || !title) {
    logger.warn(`${TAG}: Can not create panel with unknown title "${title}"`);
    return;
  }
  return {id, ...panel, title};
}

/**
 * Inspect raw layout data by cloning
 * must be called right after layout data initialized and before rendering
 * since more filed will be added after rendering
 * @param layout
 */
export function inspect(layout: object): void {
  let cloned = layout;
  try {
    cloned = JSON.parse(JSON.stringify(layout));
  } catch (e) {
  } finally {
    console.dir(cloned);
  }
}
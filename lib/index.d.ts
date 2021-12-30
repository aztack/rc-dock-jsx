import * as React from 'react';
import type { ReactElement } from 'react';
import { BoxData, PanelData, TabData, DockLayout as RcDockLayout, LayoutProps } from 'rc-dock';
declare type Content = ReactElement | ((tab: TabData) => ReactElement);
export declare function setTabIdPrefix(prefix: string): void;
/**
 * Create a tab
 * @param title tab title
 * @param content content jsx or a function which return jsx
 * @param opts tab options
 * @returns
 */
export declare function tab(title: string, content: Content, opts?: any): TabData;
/**
 * Create a panel with tabs
 * @param name panel name
 * @param tabs array of tab
 * @param opts panel options
 * @returns
 */
export declare function panel(name: string, tabs: TabData[], opts?: any): PanelData;
/**
 * Create a horizontal panel container
 * @param children array of panel/vbox/hbox
 * @param opts container options
 * @returns
 */
export declare function hbox(children: (BoxData | PanelData)[], opts?: any): BoxData;
/**
 * Create a vertical panel container
 * @param children array of panel/vbox/hbox
 * @param opts container options
 * @returns
 */
export declare function vbox(children: (BoxData | PanelData)[], opts?: any): BoxData;
/** Helper JSX elements */
export declare function Panel<T>(props: T): JSX.Element;
export interface TabProps {
    title: string;
    minWidth?: number;
    minHeight?: number;
    group?: string;
    closable?: boolean;
    content?: () => JSX.Element;
    opts?: any;
}
export declare function Tab(props: React.PropsWithChildren<TabProps>): JSX.Element;
export declare function VBox<T>(props: T): JSX.Element;
export declare function HBox<T>(props: T): JSX.Element;
export declare type DockLayout = RcDockLayout;
export interface AutoSaveLayoutOptions {
    key: string;
    interval?: number;
    log?: boolean;
}
export declare type DockLayoutProps = LayoutProps & {
    debug?: boolean;
    autosave?: true | AutoSaveLayoutOptions;
};
export declare function autoSaveLayout(dockLayout: React.RefObject<DockLayout>, opts: AutoSaveLayoutOptions | undefined, debug: boolean | undefined): () => void;
/**
 * DockLayout
 * @example
 * <DockLayout autosave={{interval: 10000, log: true, key: 'editorKey'}} />
 */
export declare const DockLayout: React.ForwardRefExoticComponent<LayoutProps & {
    debug?: boolean | undefined;
    autosave?: true | AutoSaveLayoutOptions | undefined;
} & {
    children?: React.ReactNode;
} & React.RefAttributes<RcDockLayout>>;
/**
 * Callback of DockLayout.saveTab
 * @param tabData
 * @param props
 * @returns
 * @example
 * <DockLayout saveTab={saved => saveTab(saved, ['customProp'])} />
 */
export declare function saveTab(tabData: TabData, props?: string[]): Partial<TabData>;
/**
 * Callback of DockLayout.loadTab
 * @param savedTab
 * @param config
 * @returns
 * @example
 * const config = {};
 * <DockLayout loadTab={saved => loadTab(saved, config)} />
 */
export declare function loadTab(savedTab: TabData, config: Record<string, TabData>): TabData | undefined;
/**
 * Inspect raw layout data by cloning
 * must be called right after layout data initialized and before rendering
 * since more filed will be added after rendering
 * @param layout
 */
export declare function inspect(layout: object): void;
export {};

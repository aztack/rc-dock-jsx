import { DockLayout, HBox, Panel, Tab } from 'rc-dock-jsx';
// import { DockLayout, HBox, Panel, Tab } from './jsx';
import 'rc-dock/dist/rc-dock.css';
import React, { useContext, useState } from 'react';

type IConfig = {
  htmlSize: number;
  cssSize: number;
  jsSize: number;
  setHtmlSize: (size: number) => void;
  setCssSize: (size: number) => void;
  setJsSize: (size: number) => void;
}
const Config = React.createContext<IConfig>({
  htmlSize: 1, setHtmlSize(size: number) {},
  cssSize: 1, setCssSize(size: number) {},
  jsSize: 1, setJsSize(size: number) {},
});

function HTMLPanel() {
  const { htmlSize, setHtmlSize } = useContext<IConfig>(Config);
  return <div className="panel-content">
    <button onClick={() => setHtmlSize(htmlSize + 1)}>Increase</button>
    <button onClick={() => setHtmlSize(htmlSize - 1)}>Decrease</button>
  </div>;
}

function CSSPanel() {
  return <div className="panel-content">CSS</div>;
}

function JavaScriptPanel() {
  return <div className="panel-content">JavaScript</div>;
}

export function App() {
  const [htmlSize, setHtmlSize] = useState<IConfig['htmlSize']>(1);
  const [cssSize, setCssSize] = useState<IConfig['cssSize']>(1);
  const [jsSize, setJsSize] = useState<IConfig['jsSize']>(1);

  return <Config.Provider value={{htmlSize, setHtmlSize, cssSize, setCssSize, jsSize, setJsSize}}>
    <div style={{height: '40px', display: 'flex', alignItems: 'center', marginLeft: '1em'}}>
      <button onClick={() => setHtmlSize(htmlSize === 0 ? 1 : 0)}>Hide HTML</button>&nbsp;
      <button onClick={() => setCssSize(cssSize === 0 ? 1 : 0)}>Hide CSS</button>&nbsp;
      <button onClick={() => setJsSize(jsSize === 0 ? 1 : 0)}>Hide JavaScript</button>
    </div>
    <DockLayout debug={true} autosave={{key: 'editorlayout', interval: 5000}}>
      <HBox>
        <Panel id="html" size={htmlSize}>
          <Tab title="HTML"><HTMLPanel /></Tab>
        </Panel>
        <Panel id="css" size={cssSize}>
          <Tab title="CSS"><CSSPanel /></Tab>
        </Panel>
        <Panel id="js" size={jsSize}>
          <Tab title="JavaScript"><JavaScriptPanel /></Tab>
        </Panel>
      </HBox>
    </DockLayout>
  </Config.Provider>;
}


export default App;

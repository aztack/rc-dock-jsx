# JSX Helpers for [rc-dock](https://github.com/ticlo/rc-dock)

# Example
```tsx
import 'rc-dock/dist/rc-dock.css';
import { DockLayout, HBox, Panel, Tab } from 'rc-dock-jsx';

export function App() {
  return <DockLayout
    debug={true}
    autosave={{key: 'editorlayout', interval: 5000}}>
    <HBox>
      <Panel id="html" size={1}>
        <Tab title="HTML">HTML</Tab>
      </Panel>
      <Panel id="css" size={1}>
        <Tab title="CSS">CSS</Tab>
      </Panel>
      <Panel id="js" size={1}>
        <Tab title="JavaScript">JavaScript</Tab>
      </Panel>
    </HBox>
  </DockLayout>
}
```
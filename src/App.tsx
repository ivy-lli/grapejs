import GjsEditor, {
  AssetsProvider,
  Canvas,
  ModalProvider,
} from '@grapesjs/react';
import type { Editor, EditorConfig } from 'grapesjs';
import grapesjs from 'grapesjs';
import ivyBlocksFlexbox from './plugins/blocks/flex';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MAIN_BORDER_COLOR } from './components/common';
import CustomModal from './components/CustomModal.tsx';
import CustomAssetManager from './components/CustomAssetManager.tsx';
import Topbar from './components/Topbar.tsx';
import RightSidebar from './components/RightSidebar.tsx';
import './style.css';
import 'grapesjs/dist/css/grapes.min.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const gjsOptions: EditorConfig = {
  height: '100vh',
  storageManager: false,
  undoManager: { trackSelection: false },
  selectorManager: { componentFirst: true },
  projectData: {
    assets: [
      'https://via.placeholder.com/350x250/78c5d6/fff',
      'https://via.placeholder.com/350x250/459ba8/fff',
      'https://via.placeholder.com/350x250/79c267/fff',
      'https://via.placeholder.com/350x250/c5d647/fff',
      'https://via.placeholder.com/350x250/f28c33/fff',
    ],
    pages: [
      {
        name: 'Home page',
        component: `<h1>GrapesJS React Custom UI</h1>`,
      },
    ],
  },
};

export default function App() {
  const onEditor = (editor: Editor) => {
    console.log('Editor loaded');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).editor = editor;
  };

  return (
    <ThemeProvider theme={theme}>
      <GjsEditor
        className="gjs-custom-editor text-white bg-slate-900"
        grapesjs={grapesjs}
        options={gjsOptions}
        plugins={[ivyBlocksFlexbox/*grapesjsBlocksFlexbox*/]}
        onEditor={onEditor}
      >
        <div className={`flex h-full border-t ${MAIN_BORDER_COLOR}`}>
          <div className="gjs-column-m flex flex-col flex-grow">
            <Topbar className="min-h-[48px]" />
            <Canvas className="flex-grow gjs-custom-editor-canvas" />
          </div>
          <RightSidebar
            className={`gjs-column-r w-[300px] border-l ${MAIN_BORDER_COLOR}`}
          />
        </div>
        <ModalProvider>
          {({ open, title, content, close }) => (
            <CustomModal
              open={open}
              title={title}
              children={content}
              close={close}
            />
          )}
        </ModalProvider>
        <AssetsProvider>
          {({ assets, select, close, Container }) => (
            <Container>
              <CustomAssetManager
                assets={assets}
                select={select}
                close={close}
              />
            </Container>
          )}
        </AssetsProvider>
      </GjsEditor>
    </ThemeProvider>
  );
}

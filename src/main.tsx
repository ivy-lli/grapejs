// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
import grapesjs, { Editor } from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import './index.css';

const editor = grapesjs.init({
  container : '#gjs',
  components: '<div class="txt-red">Hello world!</div>',
  style: '.txt-red{color: red}',
  height: 'calc(100vh - 40px)',
  storageManager: false,
  layerManager: {
    appendTo: '.layers-container'
  },
  panels: { 
    defaults: [{
      id: 'layers',
      el: '.panel__right',
      resizable: {
        maxDim: 350,
        minDim: 250,
        tc: false, // Top handler
        cl: true, // Left handler
        cr: false, // Right handler
        bc: false, // Bottom handler
        // Being a flex child we need to change `flex-basis` property
        // instead of the `width` (default)
        keyWidth: 'flex-basis',
      }
    }, {
      id: 'panel-switcher',
      el: '.panel__switcher',
      buttons: [
        {
          id: 'show-layers',
          active: true,
          label: 'Layers',
          command: 'show-layers',
          // Once activated disable the possibility to turn it off
          togglable: false,
        }, {
          id: 'show-style',
          active: true,
          label: 'Styles',
          command: 'show-styles',
          togglable: false,
        }, {
          id: 'show-traits',
          active: true,
          label: 'Traits',
          command: 'show-traits',
          togglable: false,
        }
      ],
    }]
  },
  // The Selector Manager allows to assign classes and
  // different states (eg. :hover) on components.
  // Generally, it's used in conjunction with Style Manager
  // but it's not mandatory
  selectorManager: {
    appendTo: '.styles-container'
  },
  styleManager: {
    appendTo: '.styles-container',
    sectors: [{
      name: 'Dimension',
      open: false,
      // Use built-in properties
      buildProps: ['width', 'min-height', 'padding'],
      // Use `properties` to define/override single property
      properties: [
        {
          // Type of the input,
          // options: integer | radio | select | color | slider | file | composite | stack
          type: 'integer',
          name: 'The width', // Label for the property
          property: 'width', // CSS property (if buildProps contains it will be extended)
          units: ['px', '%'], // Units, available only for 'integer' types
          defaults: 'auto', // Default value
          min: 0, // Min value, available only for 'integer' types
        }
      ]
    },{
      name: 'Extra',
      open: false,
      buildProps: ['background-color', 'box-shadow', 'custom-prop'],
      properties: [
        {
          id: 'custom-prop',
          name: 'Custom Label',
          property: 'font-size',
          type: 'select',
          defaults: '32px',
          // List of options, available only for 'select' and 'radio'  types
          options: [
            { value: '12px', name: 'Tiny' },
            { value: '18px', name: 'Medium' },
            { value: '32px', name: 'Big' },
          ],
        }
      ]
    }]
  },
  traitManager: {
    appendTo: '.traits-container',
  },
  blockManager: {
    appendTo: '#blocks',
    blocks: [
      {
        id: 'section',
        label: '<b>Section</b>',
        attributes: {class: 'gjs-block-section'},
        content: `<section>
          <h1>This is a simple title</h1>
          <div>This is just a Lorem text: Lorem ipsum...</div>
        </section>`
      }, {
        id: 'input',
        label: 'Input',
        attributes: {class: 'gjs-input'},
        content: `<input></input>`,
      }
    ]
  }
});

editor.Panels.addPanel({
  id: 'panel-top',
  el: '.panel__top'
})
editor.Panels.addPanel({
  id: 'basic-actions',
  el: '.panel__basic-actions',
  buttons: [{
    id: 'visibility',
    active: true,
    className: 'btn-toggle-borders',
    label: '<u>B</u>',
    command: 'sw-visibility'
  },
  {
    id: 'export',
    className: 'btn-open-export',
    label: 'Exp',
    command: 'export-template',
    context: 'export-template', // For grouping context of buttons from the same panel
  }, {
    id: 'show-json',
    className: 'btn-show-json',
    label: 'JSON',
    context: 'show-json',
    command(editor: Editor) {
      editor.Modal.setTitle('Components JSON')
        .setContent(`<textarea style="width:100%; height: 250px;">
          ${JSON.stringify(editor.getComponents())}
        </textarea>`)
        .open();
    }
  }]
});

editor.DomComponents.addType('input', {
  isComponent: el => el.tagName == 'INPUT',
  model: {
    defaults: {
      traits: [
        // Strings are automatically converted to text types
        'name', // Same as: { type: 'text', name: 'name' }
        'placeholder',
        {
          type: 'select', // Type of the trait
          label: 'Type', // The label you will see in Settings
          name: 'type', // The name of the attribute/property to use on component
          options: [
            { id: 'text', name: 'Text'},
            { id: 'email', name: 'Email'},
            { id: 'password', name: 'Password'},
            { id: 'number', name: 'Number'},
          ]
        }, {
          type: 'checkbox',
          name: 'required',
      }],
      // As by default, traits are binded to attributes, so to define
      // their initial value we can use attributes
      attributes: { type: 'text', required: true },
    },
  },
});


// Define commands
editor.Commands.add('show-layers', {
  getRowEl(editor) { return editor.getContainer().closest('.editor-row'); },
  getLayersEl(row) { return row.querySelector('.layers-container') },

  run(editor, sender) {
    const lmEl = this.getLayersEl(this.getRowEl(editor));
    lmEl.style.display = '';
  },
  stop(editor, sender) {
    const lmEl = this.getLayersEl(this.getRowEl(editor));
    lmEl.style.display = 'none';
  },
});
editor.Commands.add('show-styles', {
  getRowEl(editor) { return editor.getContainer().closest('.editor-row'); },
  getStyleEl(row) { return row.querySelector('.styles-container') },

  run(editor, sender) {
    const smEl = this.getStyleEl(this.getRowEl(editor));
    smEl.style.display = '';
  },
  stop(editor, sender) {
    const smEl = this.getStyleEl(this.getRowEl(editor));
    smEl.style.display = 'none';
  },
});
editor.Commands.add('show-traits', {
  getTraitsEl(editor) {
    const row = editor.getContainer().closest('.editor-row');
    return row.querySelector('.traits-container');
  },
  run(editor, sender) {
    this.getTraitsEl(editor).style.display = '';
  },
  stop(editor, sender) {
    this.getTraitsEl(editor).style.display = 'none';
  },
});


// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )

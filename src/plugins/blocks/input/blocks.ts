import type { Editor, BlockProperties } from 'grapesjs';
import { PluginOptions } from '.';

const addTraits = (editor: Editor) => {
  editor.DomComponents.addType('input', {
    isComponent: el => el.tagName === 'INPUT',
    model: {
      defaults: {
        traits: [
          'label',
          'placeholder',
          {
            type: 'select',
            label: 'Type',
            name: 'type',
            options: [
              { id: 'text', name: 'Text'},
              { id: 'email', name: 'Email'},
              { id: 'password', name: 'Password'},
              { id: 'number', name: 'Number'},
            ]
          }, {
            type: 'checkbox',
            name: 'required',
          },
          {
            type: 'data',
            name: 'value'
          }
        ],
        attributes: { label: 'My label', type: 'text', required: false },
      },
      init() {
        this.on('change:attributes', this.handleAttrChange);
        this.on('change:attributes:label', this.handleLabelChange);
      },
      label() {
        return this.getChildAt(0);
      },
      handleAttrChange() {
        const input = this.getEl()!.children[1];
        Object.entries(this.getAttributes())
          .filter(([key]) => ['placeholder', 'type', 'required', 'value'].includes(key))
          .map(([key, value]) => input.setAttribute(key, value));
      },
      handleLabelChange() {
        this.getEl()!.children[0].textContent = this.getAttributes().label;
      },
    },

});
}

export default function (editor: Editor, opts: Required<PluginOptions>) {
  const bm = editor.BlockManager;
  addTraits(editor);
  const { category, stylePrefix } = opts;
  const clsRow = `${stylePrefix}row`;
  const clsCell = `${stylePrefix}cell`;

  // Make row and column classes private
  const privateCls = [`.${clsRow}`, `.${clsCell}`];
  editor.on(
    'selector:add',
    selector =>
      privateCls.indexOf(selector.getFullName()) >= 0 &&
      selector.set('private', 1)
  );

  const commonBlockProps: Partial<BlockProperties> = {
    category,
    select: true,
  };

  bm.add('input', {
    ...commonBlockProps,
    activate: true,
    label: 'Input',
    media: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path fill="currentColor" d="M22 9c0-.6-.5-1-1.3-1H3.4C2.5 8 2 8.4 2 9v6c0 .6.5 1 1.3 1h17.4c.8 0 1.3-.4 1.3-1V9zm-1 6H3V9h18v6z"></path>
        <path fill="currentColor" d="M4 10h1v4H4z"></path>
      </svg>`,
    content: {
      type: 'input',
      content: `<label>My label</label>
        <input type="text"></input>`,
      styles: `[data-gjs-type="input"] {
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        [data-gjs-type="input"][required] label:after {
          content: ' *';
        }`
    }
  });

  bm.add('text', {
    ...commonBlockProps,
    activate: true,
    label: opts.labelText,
    media: `<svg viewBox="0 0 24 24">
        <path fill="currentColor" d="M18.5,4L19.66,8.35L18.7,8.61C18.25,7.74 17.79,6.87 17.26,6.43C16.73,6 16.11,6 15.5,6H13V16.5C13,17 13,17.5 13.33,17.75C13.67,18 14.33,18 15,18V19H9V18C9.67,18 10.33,18 10.67,17.75C11,17.5 11,17 11,16.5V6H8.5C7.89,6 7.27,6 6.74,6.43C6.21,6.87 5.75,7.74 5.3,8.61L4.34,8.35L5.5,4H18.5Z" />
      </svg>`,
    content: {
      type: 'text',
      content: 'Insert your text here',
      style: { padding: '10px' },
    }
  });

  bm.add('link', {
    ...commonBlockProps,
    label: opts.labelLink,
    media: `<svg viewBox="0 0 24 24">
        <path fill="currentColor" d="M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z" />
      </svg>`,
    content: {
      type: 'link',
      content: 'Link',
      style: { color: '#d983a6' }
    }
  });

  bm.add('image', {
    ...commonBlockProps,
    activate: true,
    label: opts.labelImage,
    media: `<svg viewBox="0 0 24 24">
        <path fill="currentColor" d="M21,3H3C2,3 1,4 1,5V19A2,2 0 0,0 3,21H21C22,21 23,20 23,19V5C23,4 22,3 21,3M5,17L8.5,12.5L11,15.5L14.5,11L19,17H5Z" />
      </svg>`,
    content: {
      style: { color: 'black' },
      type: 'image',
    }
  });
}
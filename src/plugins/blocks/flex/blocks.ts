import type { Editor } from 'grapesjs';
import { PluginOptions } from '.';

export default (editor: Editor, opt: PluginOptions = {}) => {
  const bm = editor.BlockManager;
  const stylePrefix = opt.stylePrefix;
  const clsRow = `${stylePrefix}row`;
  const clsCell = `${stylePrefix}cell`;
  const labelRow = opt.labelRow;
  const labelCell = opt.labelColumn;

  const attrsToString = (attrs: Record<string, any>) => {
    const result = [];

    for (const key in attrs) {
      let value = attrs[key];
      const toParse = value instanceof Array || value instanceof Object;
      value = toParse ? JSON.stringify(value) : value;
      result.push(`${key}=${toParse ? `'${value}'` : `"${value}"`}`);
    }

    return result.length ? ` ${result.join(' ')}` : '';
  }

  const rowAttr = {
    class: clsRow,
    'data-gjs-droppable': `.${clsCell}`,
    'data-gjs-custom-name': labelRow,
  };

  const colAttr = {
    class: clsCell,
    'data-gjs-draggable': `.${clsRow}`,
    'data-gjs-custom-name': labelCell,
    // X Flex
    'data-gjs-unstylable': ['width'],
    'data-gjs-stylable-require': ['flex-basis'],
    'data-gjs-type': 'gridColumn'
  };

  const privateCls = [`.${clsRow}`, `.${clsCell}`];
  editor.on('selector:add', selector =>
    privateCls.indexOf(selector.getFullName()) >= 0 && selector.set('private', 1))

  const label = 'Flexbox';
  const category = 'Layout';
  const attrsRow = attrsToString(rowAttr);
  const attrsCell = attrsToString(colAttr);
  const styleRow = `
    .${clsRow} {
      display: flex;
      justify-content: flex-start;
      align-items: stretch;
      flex-wrap: nowrap;
      padding: 10px;
    }
    @media (max-width: 768px) {
      .${clsRow} {
        flex-wrap: wrap;
      }
    }
    `;
  const styleClm = `
    .${clsCell} {
      min-height: 75px;
      flex-grow: 1;
      flex-basis: 100%;
    }
    [data-gjs-type="gridColumn"]:empty {
      text-decoration: none;
      padding: 5px;
    }
    [data-gjs-type="gridColumn"]:empty:before {
      background-color: #ddd;
      color: #000;
      font-size: 16px;
      font-weight: bold;
      font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", "Open Sans", Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 30px;
      padding: 0 10px;
      opacity: 0.3;
      border-radius: 3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      content: "Column";`;

  bm.add('flexbox', {
    label,
    media: `<svg viewBox="0 0 23 24">
    <path fill="currentColor" d="M2 20h8V4H2v16Zm-1 0V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1ZM13 20h8V4h-8v16Zm-1 0V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1Z"/>
  </svg>`,
    category,
    attributes: { class: 'gjs-fonts gjs-f-b2' },
    content: `
        <div ${attrsRow}>
          <div ${attrsCell}></div>
          <div ${attrsCell}></div>
        </div>
        <style>
          ${styleRow}
          ${styleClm}
        </style>
        `,
    ...opt.flexboxBlock
  });
}
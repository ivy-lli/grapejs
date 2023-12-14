import type { Plugin } from 'grapesjs';
import loadBlocks from './blocks';

export type PluginOptions = {
  /**
   * Classes prefix
   * @default 'gjs-'
   */
  stylePrefix?: string;

  /**
   * Blocks category name
   * @default 'Basic'
   */
  category?: string;

  /**
   * Text label
   * @default 'Text'
   */
  labelText?: string;

  /**
   * Link label
   * @default 'Link'
   */
  labelLink?: string;

  /**
   * Image label
   * @default 'Image'
   */
  labelImage?: string;
};

const plugin: Plugin<PluginOptions> = (editor, opts = {}) => {
  const config: Required<PluginOptions> = {
    stylePrefix: 'gjs-',
    category: 'Basic',
    labelText: 'Text',
    labelLink: 'Link',
    labelImage: 'Image',
    ...opts
  };

  loadBlocks(editor, config);
};

export default plugin;
import type { PluginOption } from 'vite';

export default function resolveMetaChromeExtension(): PluginOption {
  return {
    name: 'resolve-meta-chrome-extension',
    resolveImportMeta: property => {
      if (property === 'url') {
        return 'chrome.runtime.getURL("")';
      }
    },
  };
}

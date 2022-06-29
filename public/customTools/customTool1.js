unlayer.registerTool({
  name: 'my_tool',
  label: 'My Tool',
  icon: 'fa-smile',
  supportedDisplayModes: ['web', 'email'],
  options: {
    colors: { // Property Group
      title: "Colors", // Title for Property Group
      position: 1, // Position of Property Group
      options: {
        "textColor": { // Property: textColor
          "label": "Text Color", // Label for Property
          "defaultValue": "#FF0000",
          "widget": "color_picker" // Property Editor Widget: color_picker
        },
        "backgroundColor": { // Property: backgroundColor
          "label": "Background Color", // Label for Property
          "defaultValue": "#FF0000",
          "widget": "color_picker" // Property Editor Widget: color_picker
        }
      }
    }
  },
  values: {},
  renderer: {
    Viewer: unlayer.createViewer({
      render(values) {
        return `<div style="color: ${values.textColor}; background-color: ${values.backgroundColor};">I am a custom tool.</div>`
      }
    }),
    exporters: {
      web: function(values) {
        return `<div style="color: ${values.textColor}; background-color: ${values.backgroundColor};">I am a custom tool.</div>`
      },
      email: function(values) {
        return `<div style="color: ${values.textColor}; background-color: ${values.backgroundColor};">I am a custom tool.</div>`
      }
    },
    head: {
      css: function(values) {},
      js: function(values) {}
    }
  }
});
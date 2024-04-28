# Raw Json Exporter

Exports figma data as a single json document with as much as possible of the internal figma data structure left as-is. The purpose of this plugin is act as a data dump for further processing externally.

All variable names be set to `<collectionName>/<variableName>`.

All properties bound to a variable in the data set will have its value replaced by a string reference `{<collectionName>/<variableName>}`.

Here's an example json dump:

```json
{
  "variables": [
    {
      "id": "VariableID:5:14",
      "name": "Color/Blue/50",
      "collection": "Reference",
      "valuesByMode": {
        "Mode 1": {
          "type": "rgba",
          "r": 0.9607843160629272,
          "g": 0.9803921580314636,
          "b": 0.9960784316062927,
          "a": 1
        }
      }
    },
    {
      "id": "VariableID:5:76",
      "name": "Color/Primary/Base/Light",
      "collection": "Theme",
      "valuesByMode": {
        "Light": { "type": "alias", "id": "VariableID:5:20" },
        "Dark": { "type": "alias", "id": "VariableID:5:18" }
      }
    }
  ],
  "textStyles": [
    {
      "remote": false,
      "description": "",
      "name": "Caption",
      "textCase": "ORIGINAL",
      "hangingList": false,
      "hangingPunctuation": false,
      "listSpacing": 0,
      "paragraphSpacing": 0,
      "paragraphIndent": 0,
      "leadingTrim": "NONE",
      "lineHeight": { "type": "alias", "id": "VariableID:5:181" },
      "textDecoration": "NONE",
      "fontSize": { "type": "alias", "id": "VariableID:5:181" },
      "type": "TEXT",
      "fontName": { "family": "Lato", "style": "Light" },
      "letterSpacing": { "unit": "PERCENT", "value": 0 },
      "fontFamily": { "type": "alias", "id": "VariableID:5:177" },
      "fontStyle": { "type": "alias", "id": "VariableID:5:180" }
    }
  ],
  "effectStyles": [
    {
      "name": "Shadow/Thin",
      "effects": [
        {
          "showShadowBehindNode": false,
          "blendMode": "NORMAL",
          "visible": true,
          "spread": 0,
          "radius": { "type": "alias", "id": "VariableID:6:307" },
          "type": "DROP_SHADOW",
          "color": { "type": "alias", "id": "VariableID:5:167" },
          "offset": { "x": 0, "y": 4 },
          "offsetY": { "type": "alias", "id": "VariableID:6:307" }
        }
      ]
    }
  ],
  "paintStyles": [
    {
      "name": "Test color",
      "paints": [
        {
          "gradientTransform": [
            [6.123234262925839e-17, 1, 0],
            [-1, 6.123234262925839e-17, 1]
          ],
          "type": "GRADIENT_LINEAR",
          "blendMode": "NORMAL",
          "opacity": 1,
          "visible": true,
          "gradientStops": [{}, {}]
        }
      ]
    }
  ],
  "gridStyles": [
    {
      "name": "Test grid",
      "grids": [
        {
          "pattern": "GRID",
          "sectionSize": { "type": "alias", "id": "VariableID:6:306" },
          "visible": true
        },
        { "pattern": "GRID", "sectionSize": 10, "visible": true }
      ]
    }
  ]
}
```

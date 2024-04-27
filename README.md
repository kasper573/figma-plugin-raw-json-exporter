# Raw Json Exporter

Exports figma data as a single json document with as much as possible of the internal figma data structure left as-is. The purpose of this plugin is act as a data dump for further processing externally.

All variable names be set to `<collectionName>/<variableName>`.

All properties bound to a variable in the data set will have its value replaced by a string reference `{<collectionName>/<variableName>}`.

Here's an example json dump:

```json
{
  "variables": [
    {
      "name": "Reference/Color/Blue/50",
      "type": "COLOR",
      "valuesByMode": {
        "Mode 1": {
          "r": 0.9607843160629272,
          "g": 0.9803921580314636,
          "b": 0.9960784316062927,
          "a": 1
        }
      }
    },
    {
      "name": "Theme/Color/Primary/Base/Light",
      "type": "COLOR",
      "valuesByMode": {
        "Light": "{Reference/Color/Blue/600}",
        "Dark": "{Reference/Color/Blue/400}"
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
      "lineHeight": "{Reference/Text/Size/#1}",
      "textDecoration": "NONE",
      "fontSize": "{Reference/Text/Size/#1}",
      "type": "TEXT",
      "fontName": { "family": "Lato", "style": "Light" },
      "letterSpacing": { "unit": "PERCENT", "value": 0 },
      "fontFamily": "{Reference/Text/Family/Default}",
      "fontStyle": "{Reference/Text/Weight/Regular}"
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
          "radius": "{Reference/Space/100}",
          "type": "DROP_SHADOW",
          "color": "{Reference/Color/Black/25%}",
          "offset": { "x": 0, "y": 4 },
          "offsetY": "{Reference/Space/100}"
        }
      ]
    }
  ],
  "paintStyles": [
    {
      "name": "TestPaint",
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
      "name": "TestGrid",
      "grids": [
        {
          "pattern": "GRID",
          "sectionSize": "{Reference/Space/50}",
          "visible": true
        },
        { "pattern": "GRID", "sectionSize": 10, "visible": true }
      ]
    }
  ]
}
```

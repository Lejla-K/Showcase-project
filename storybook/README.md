# Peau App — Component Storybook

A Storybook-style browser for the Peau App design system, generated from the Figma
component library:

**[Peau App_New › Components (Adjusted)](https://www.figma.com/design/fAjGnlWWU5b4eE3OQAmBOr/Peau-App_New?node-id=60879-52981)**

Open `storybook/index.html` in a browser — there is no build step, no dependencies
and no server required.

## What's in it

37 stories across 25 components, grouped the way Storybook groups them:

| Group | Components |
| --- | --- |
| Actions | Button, Icon button |
| Inputs | Text field, Checkbox, Radio button, Switch, Slider, Search |
| Data display | Badge, Divider, Chip |
| Containment | Card, List, Sheet |
| Navigation | App bar, Tabs, Menu |
| Feedback | Snackbar, Dialog, Tooltip, Progress indicator, Loading indicator |
| Foundations | Colour tokens, Typography scale, Corner radii |

Each component has a **Playground** story whose controls are the component's *real
Figma variant properties* (`Type`, `Size`, `State`, `Configuration`, `Density`, …),
plus one or more **All variants** stories that render the complete variant matrix
exactly as it is laid out on the Figma canvas.

## Features

- **Sidebar tree** with live search
- **Controls addon** generated from each story's arg types — radios, selects,
  toggles, ranges and text inputs, with a reset
- **Code addon** showing the re-indented HTML for the current args, with copy
- **Docs addon** carrying each component's Figma description, its node id, a
  deep link back into Figma and a link to the Material 3 guidance it follows
- **Toolbar**: canvas background (surface / primary container / on-surface / grid),
  viewport presets (412 / 768 / 1140), zoom, and a dark UI theme for the shell
- **URL routing** — every story is linkable as `#/story/<id>`

## Files

```
storybook/
├── index.html            the shell
├── css/tokens.css        design tokens, pulled from the Figma variables
├── css/components.css    the Peau component library
├── css/storybook.css     the Storybook chrome
├── js/stories.js         story registry + component renderers
└── js/storybook.js       the runtime (tree, canvas, addons, routing)
```

`css/tokens.css` is the single source of truth for colour, shape and type. It maps
1:1 onto the Figma variable names, so re-theming is a matter of editing that file:

| Figma variable | CSS custom property | Value |
| --- | --- | --- |
| `Schemes/Primary` | `--schemes-primary` | `#fe8729` |
| `Schemes/On Primary` | `--schemes-on-primary` | `#2b1708` |
| `Schemes/Secondary variant` | `--schemes-secondary-variant` | `#6c4828` |
| `Schemes/Outline` | `--schemes-outline` | `#c3bcb9` |
| `M3/color variants/primary/primary60` | `--primary60` | `#fdac6d` |
| `States/Secondary 8%` | `--states-secondary-8` | `rgba(43,23,8,.08)` |
| `States/Disabled` | `--states-disabled` | `rgba(29,27,32,.1)` |
| `Corner/Extra-large` | `--corner-extra-large` | `28px` |
| `Corner/Full` | `--corner-full` | `1000px` |

## Notes on fidelity

- Button, icon button, text field, checkbox, radio, switch and the token set were
  built from design context read directly out of Figma, so their padding, radii,
  state-layer colours and type ramps are exact.
- The remaining components were built from the Figma component metadata (variant
  names and geometry) combined with the same token set. They follow the Material 3
  specs that each component's Figma description links to. Read them as faithful
  rather than pixel-verified — the Figma MCP call budget ran out partway through.
- Icons use **Material Symbols Rounded**, which is the source the Figma icons were
  exported from (the layer names are literally
  `check_circle_24dp_FILL1_wght400_GRAD0_opsz24`). Icons are loaded from Google
  Fonts rather than from Figma's asset URLs, which expire after seven days.
  Every `.peau-icon` has an explicit box so a font-load failure clips the ligature
  name instead of breaking the layout.

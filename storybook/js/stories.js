/* ============================================================
   Story registry for the Peau App component library.

   Each story mirrors a component set on the Figma page
   "Components (Adjusted)" — the `args` are the component's real
   Figma variant properties, and `figma` links back to the node.
   ============================================================ */

const FIGMA_FILE = "https://www.figma.com/design/fAjGnlWWU5b4eE3OQAmBOr/Peau-App_New";
const node = (id) => `${FIGMA_FILE}?node-id=${id.replace(":", "-")}`;

const esc = (s) => String(s).replace(/[&<>"]/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const icon = (name) => `<span class="peau-icon" aria-hidden="true">${name}</span>`;

/* Renders a labelled grid of every combination of one arg — used by
   the "All variants" stories so the canvas mirrors the Figma matrix. */
const matrix = (cols, rows, cell, colLabel = String, rowLabel = String) => {
  let html = `<div class="sb-matrix" style="grid-template-columns:auto repeat(${cols.length},auto)">`;
  html += `<span></span>`;
  cols.forEach((c) => { html += `<span class="sb-label">${esc(colLabel(c))}</span>`; });
  rows.forEach((r) => {
    html += `<span class="sb-label">${esc(rowLabel(r))}</span>`;
    cols.forEach((c) => { html += `<div>${cell(c, r)}</div>`; });
  });
  return html + `</div>`;
};

const STATES = ["Enabled", "Hovered", "Focused", "Pressed", "Disabled"];
const stateClass = (p, s) => (s === "Enabled" ? "" : ` ${p}--${s.toLowerCase()}`);

/* ------------------------------------------------------------------ */

const STORIES = [

/* ================= BUTTONS ================= */
{
  id: "button--playground",
  group: "Actions",
  component: "Button",
  name: "Playground",
  figma: "60883:83723",
  docs: {
    text: "Buttons communicate actions that users can take.",
    bullets: [
      "Can contain an optional leading icon",
      "Colour options in this file: filled, text and outlined",
      "Five sizes: extra small, small, medium, large, extra large",
      "Two shapes: round and square",
      "Keep labels concise and use sentence-case",
    ],
    link: "https://m3.material.io/components/buttons/overview",
  },
  args: {
    variant:  { control: "radio",   options: ["filled", "text", "outline"], value: "filled", desc: "Figma: Button / Button - text / Button - outline" },
    type:     { control: "radio",   options: ["Round", "Square"], value: "Round", desc: "Shape" },
    size:     { control: "select",  options: ["XSmall", "Small", "Medium", "Large", "XLarge"], value: "Medium", desc: "Size" },
    state:    { control: "select",  options: STATES, value: "Enabled", desc: "Interaction state" },
    showIcon: { control: "boolean", value: false, desc: "Leading icon" },
    icon:     { control: "text",    value: "add", desc: "Material Symbols glyph name" },
    labelText:{ control: "text",    value: "Upgrade", desc: "Label" },
  },
  render: (a) => button(a),
},
{
  id: "button--all-sizes",
  group: "Actions",
  component: "Button",
  name: "All sizes",
  figma: "60883:83723",
  docs: { text: "Every size at rest, round and square, exactly as laid out in the Figma variant matrix." },
  args: {
    variant:  { control: "radio",   options: ["filled", "text", "outline"], value: "filled" },
    showIcon: { control: "boolean", value: false },
  },
  render: (a) => matrix(
    ["XSmall", "Small", "Medium", "Large", "XLarge"],
    ["Round", "Square"],
    (size, type) => button({ ...a, size, type, state: "Enabled", labelText: "Upgrade", icon: "add" })
  ),
},
{
  id: "button--all-states",
  group: "Actions",
  component: "Button",
  name: "All states",
  figma: "60883:83723",
  docs: {
    text: "State layers come straight from the Figma tokens: hover and pressed use States/Secondary 8%, focus uses States/Secondary 12% plus a 3px focus indicator, and disabled fills with States/Disabled at 38% content opacity.",
  },
  args: {
    variant: { control: "radio",  options: ["filled", "text", "outline"], value: "filled" },
    size:    { control: "select", options: ["XSmall", "Small", "Medium"], value: "Medium" },
  },
  render: (a) => matrix(
    STATES,
    ["Round", "Square"],
    (state, type) => button({ ...a, state, type, labelText: "Upgrade", showIcon: false })
  ),
},

/* ================= ICON BUTTON ================= */
{
  id: "icon-button--playground",
  group: "Actions",
  component: "Icon button",
  name: "Playground",
  figma: "60883:84536",
  docs: {
    text: "Icon buttons are used for the lowest-priority actions, especially when presenting multiple options. Standard icon buttons have no container until they are interacted with.",
    link: "https://m3.material.io/components/icon-buttons/overview",
  },
  args: {
    variant: { control: "select",  options: ["filled", "tonal", "outline", "standard"], value: "filled" },
    size:    { control: "select",  options: ["xs", "s", "m", "l", "xl"], value: "s" },
    type:    { control: "radio",   options: ["Round", "Square"], value: "Round" },
    state:   { control: "select",  options: STATES, value: "Enabled" },
    icon:    { control: "text",    value: "favorite" },
  },
  render: (a) => iconButton(a),
},
{
  id: "icon-button--all-variants",
  group: "Actions",
  component: "Icon button",
  name: "All variants",
  figma: "60883:84536",
  docs: { text: "The four container styles across every interaction state." },
  args: { size: { control: "select", options: ["xs", "s", "m"], value: "s" } },
  render: (a) => matrix(
    STATES,
    ["filled", "tonal", "outline", "standard"],
    (state, variant) => iconButton({ ...a, state, variant, icon: "favorite", type: "Round" })
  ),
},

/* ================= TEXT FIELD ================= */
{
  id: "text-field--playground",
  group: "Inputs",
  component: "Text field",
  name: "Playground",
  figma: "60880:64325",
  docs: {
    text: "Use a text field when someone needs to enter text into a UI, such as filling in contact or payment information. Supporting text can be toggled between hide and show.",
    link: "https://m3.material.io/components/text-fields/overview",
  },
  args: {
    state:              { control: "select",  options: ["Enabled", "Hovered", "Focused", "Error", "Disabled"], value: "Enabled" },
    textConfiguration:  { control: "select",  options: ["Label text", "Input text", "Placeholder text"], value: "Label text" },
    leadingIcon:        { control: "boolean", value: false },
    trailingIcon:       { control: "boolean", value: false },
    showSupportingText: { control: "boolean", value: true },
    labelText:          { control: "text",    value: "Label" },
    supportingText:     { control: "text",    value: "Supporting text" },
  },
  render: (a) => `<div style="padding-bottom:24px">${textField(a)}</div>`,
},
{
  id: "text-field--all-states",
  group: "Inputs",
  component: "Text field",
  name: "All states",
  figma: "60880:64325",
  docs: { text: "Outlined style across every state and text configuration — the full Figma matrix." },
  args: {
    leadingIcon:  { control: "boolean", value: false },
    trailingIcon: { control: "boolean", value: false },
  },
  render: (a) => `<div style="padding-bottom:24px">` + matrix(
    ["Enabled", "Hovered", "Focused", "Error", "Disabled"],
    ["Label text", "Input text", "Placeholder text"],
    (state, textConfiguration) => textField({
      ...a, state, textConfiguration,
      labelText: "Label", supportingText: "Supporting text", showSupportingText: false,
    })
  ) + `</div>`,
},

/* ================= SELECTION CONTROLS ================= */
{
  id: "checkbox--playground",
  group: "Inputs",
  component: "Checkbox",
  name: "Playground",
  figma: "60880:64165",
  docs: {
    text: "Checkboxes allow users to select one or more options from a set, present a list containing sub-selections, and turn an item on or off.",
    link: "https://m3.material.io/components/checkbox/overview",
  },
  args: {
    type:  { control: "select", options: ["Selected", "Unselected", "Indeterminate", "Error selected", "Error unselected", "Error indeterminate"], value: "Selected" },
    state: { control: "select", options: STATES, value: "Enabled" },
  },
  render: (a) => checkbox(a),
},
{
  id: "checkbox--all-variants",
  group: "Inputs",
  component: "Checkbox",
  name: "All variants",
  figma: "60880:64165",
  docs: { text: "Six types across five states — 30 variants, matching the Figma component set exactly." },
  args: {},
  render: () => matrix(
    STATES,
    ["Selected", "Indeterminate", "Unselected", "Error selected", "Error indeterminate", "Error unselected"],
    (state, type) => checkbox({ type, state })
  ),
},
{
  id: "radio--playground",
  group: "Inputs",
  component: "Radio button",
  name: "Playground",
  figma: "60880:65267",
  docs: {
    text: "Radio buttons are the recommended way to allow users to make a single selection from a list of options.",
    link: "https://m3.material.io/components/radio-button/overview",
  },
  args: {
    selected: { control: "boolean", value: true },
    state:    { control: "select",  options: STATES, value: "Enabled" },
  },
  render: (a) => radio(a),
},
{
  id: "radio--all-variants",
  group: "Inputs",
  component: "Radio button",
  name: "All variants",
  figma: "60880:65267",
  docs: { text: "Selected radios tint their state layer with States/Primary; unselected ones use States/Secondary." },
  args: {},
  render: () => matrix(STATES, [true, false],
    (state, selected) => radio({ selected, state }),
    String, (s) => (s ? "Selected" : "Unselected")),
},
{
  id: "switch--playground",
  group: "Inputs",
  component: "Switch",
  name: "Playground",
  figma: "60880:53257",
  docs: {
    text: "Switches are the preferred way to adjust settings. They're used to control binary options — think On/Off or True/False.",
    link: "https://m3.material.io/components/switch/overview",
  },
  args: {
    selected: { control: "boolean", value: true },
    state:    { control: "select",  options: STATES, value: "Enabled" },
    showIcon: { control: "boolean", value: false, desc: "Figma: Icon=True" },
  },
  render: (a) => switchCtl(a),
},
{
  id: "switch--all-variants",
  group: "Inputs",
  component: "Switch",
  name: "All variants",
  figma: "60880:53257",
  docs: { text: "Selected × State × Icon — the 20 variants in the Figma set. The off track is an outlined Schemes/Primary container with a smaller Schemes/Secondary-variant handle." },
  args: {},
  render: () => matrix(STATES,
    [[true, false], [true, true], [false, false], [false, true]],
    (state, [selected, showIcon]) => switchCtl({ selected, state, showIcon }),
    String, ([sel, ic]) => `${sel ? "On" : "Off"}${ic ? " · icon" : ""}`),
},

/* ================= SLIDER ================= */
{
  id: "slider--playground",
  group: "Inputs",
  component: "Slider",
  name: "Playground",
  figma: "60880:53417",
  docs: {
    text: "Sliders let users make selections from a range of values. The Figma building blocks define a 4×44 handle, 4×4 track stops and a 16px-tall track.",
    link: "https://m3.material.io/components/sliders/overview",
  },
  args: {
    type:          { control: "radio",   options: ["Standard", "Centered", "Range"], value: "Standard" },
    value:         { control: "range",   min: 0, max: 100, step: 1, value: 40 },
    valueEnd:      { control: "range",   min: 0, max: 100, step: 1, value: 75, desc: "Range slider upper handle" },
    showStops:     { control: "boolean", value: false },
    showValueLabel:{ control: "boolean", value: false },
  },
  render: (a) => `<div style="padding-top:52px">${slider(a)}</div>`,
},

/* ================= BADGE / DIVIDER / CHIP ================= */
{
  id: "badge--all-sizes",
  group: "Data display",
  component: "Badge",
  name: "All sizes",
  figma: "55343:13544",
  docs: {
    text: "Badges show notifications, counts or status information. Small is a 6px dot; Large is a 16px pill that carries a number.",
    link: "https://m3.material.io/components/badges/overview",
  },
  args: {
    size:  { control: "radio", options: ["Small", "Large"], value: "Large" },
    label: { control: "text",  value: "3" },
  },
  render: (a) => `<div class="sb-row" style="gap:32px">
    <div class="sb-col" style="align-items:center;gap:8px">
      ${badge(a)}
      <span class="sb-label">Size=${esc(a.size)}</span>
    </div>
    <div class="sb-col" style="align-items:center;gap:8px">
      <span style="position:relative;display:inline-flex">
        ${icon("notifications")}
        <span style="position:absolute;top:-2px;right:-6px">${badge(a)}</span>
      </span>
      <span class="sb-label">On an icon</span>
    </div>
  </div>`,
},
{
  id: "divider--all-variants",
  group: "Data display",
  component: "Divider",
  name: "All variants",
  figma: "55412:15783",
  docs: {
    text: "Dividers separate content into clear groups. Full-width, inset (16dp) and middle-inset horizontal variants, plus verticals and a subhead variant.",
    link: "https://m3.material.io/components/divider/overview",
  },
  args: {},
  render: () => `<div class="sb-col" style="gap:28px">
    <div class="sb-col" style="gap:8px">
      <span class="sb-label">Horizontal / Full-width</span><hr class="peau-divider peau-divider--horizontal">
      <span class="sb-label">Horizontal / Inset</span><hr class="peau-divider peau-divider--horizontal peau-divider--inset">
      <span class="sb-label">Horizontal / Middle-inset</span><hr class="peau-divider peau-divider--horizontal peau-divider--middle-inset">
      <span class="sb-label">Horizontal / Divider with subhead</span>
      <div class="peau-divider-subhead">Subhead</div>
    </div>
    <div class="sb-row" style="gap:26px;align-items:flex-start">
      <div class="sb-col" style="gap:8px;align-items:center">
        <hr class="peau-divider peau-divider--vertical"><span class="sb-label">Full-width</span>
      </div>
      <div class="sb-col" style="gap:8px;align-items:center">
        <hr class="peau-divider peau-divider--vertical" style="height:104px"><span class="sb-label">Inset</span>
      </div>
      <div class="sb-col" style="gap:8px;align-items:center">
        <hr class="peau-divider peau-divider--vertical" style="height:88px"><span class="sb-label">Middle-inset</span>
      </div>
    </div>
  </div>`,
},
{
  id: "chip--playground",
  group: "Data display",
  component: "Chip",
  name: "Playground",
  figma: "62846:14230",
  docs: { text: "Non-interactive chip from the Custom components frame — used for skin-type tags and microbiome labels in the Peau app." },
  args: {
    label:    { control: "text",    value: "Dry skin" },
    selected: { control: "boolean", value: false },
    showIcon: { control: "boolean", value: false },
    icon:     { control: "text",    value: "check" },
  },
  render: (a) => chip(a),
},

/* ================= CARDS ================= */
{
  id: "card--playground",
  group: "Containment",
  component: "Card",
  name: "Playground",
  figma: "60885:92995",
  docs: {
    text: "Cards hold content and actions about a single subject. The Figma set covers stacked and horizontal layouts with media or a free slot.",
    link: "https://m3.material.io/components/cards/overview",
  },
  args: {
    style:   { control: "radio",  options: ["Elevated", "Outlined", "Filled"], value: "Elevated" },
    layout:  { control: "radio",  options: ["Media & text", "Slot"], value: "Media & text" },
    orientation: { control: "radio", options: ["Stacked", "Horizontal"], value: "Horizontal" },
    title:   { control: "text",   value: "Hydration routine" },
    text:    { control: "text",   value: "Your barrier is looking stronger this week." },
    icon:    { control: "text",   value: "water_drop" },
  },
  render: (a) => card(a),
},
{
  id: "card--all-variants",
  group: "Containment",
  component: "Card",
  name: "All variants",
  figma: "60885:92995",
  docs: { text: "Both layouts in all three container styles." },
  args: {},
  render: () => matrix(
    ["Elevated", "Outlined", "Filled"],
    ["Horizontal", "Stacked"],
    (style, orientation) => card({
      style, orientation, layout: "Media & text",
      title: "Hydration routine", text: "Barrier looking stronger.", icon: "water_drop",
    })
  ),
},

/* ================= APP BAR ================= */
{
  id: "app-bar--playground",
  group: "Navigation",
  component: "App bar",
  name: "Playground",
  figma: "58114:20521",
  docs: {
    text: "Top app bars display navigation, actions and text at the top of a screen. Elevation switches to On-scroll once content passes beneath.",
    link: "https://m3.material.io/components/top-app-bar/overview",
  },
  args: {
    configuration: { control: "select", options: ["Small", "Small-centered", "Small-image", "Search", "Medium", "Large"], value: "Small" },
    elevation:     { control: "radio",  options: ["Flat", "On-scroll"], value: "Flat" },
    headline:      { control: "text",   value: "My skin" },
  },
  render: (a) => appBar(a),
},
{
  id: "app-bar--all-configurations",
  group: "Navigation",
  component: "App bar",
  name: "All configurations",
  figma: "58114:20565",
  docs: { text: "All six configurations at both elevations — the complete Figma matrix." },
  args: { elevation: { control: "radio", options: ["Flat", "On-scroll"], value: "Flat" } },
  render: (a) => `<div class="sb-col" style="gap:14px">` +
    ["Small", "Small-centered", "Small-image", "Search", "Medium", "Large"].map((c) =>
      `<div class="sb-col" style="gap:6px">
         <span class="sb-label">Configuration=${esc(c)}</span>
         ${appBar({ ...a, configuration: c, headline: "My skin" })}
       </div>`).join("") + `</div>`,
},
{
  id: "tabs--playground",
  group: "Navigation",
  component: "Tabs",
  name: "Playground",
  figma: "60892:100945",
  docs: {
    text: "Tabs organise content across different screens and views. Primary tabs sit at the top of a screen; secondary tabs group content inside an area.",
    link: "https://m3.material.io/components/tabs/overview",
  },
  args: {
    style:         { control: "radio",  options: ["Primary", "Secondary"], value: "Primary" },
    type:          { control: "radio",  options: ["Fixed", "Scrollable"], value: "Fixed" },
    configuration: { control: "select", options: ["Label only", "Label & icon", "Icon only"], value: "Label only" },
    activeIndex:   { control: "select", options: [0, 1, 2], value: 0 },
  },
  render: (a) => tabs(a),
},
{
  id: "tabs--all-variants",
  group: "Navigation",
  component: "Tabs",
  name: "All variants",
  figma: "60892:101245",
  docs: { text: "Style × Type × Configuration, laid out as in the Figma frame." },
  args: {},
  render: () => `<div class="sb-col" style="gap:18px">` +
    [["Primary", "Label only"], ["Primary", "Label & icon"], ["Primary", "Icon only"],
     ["Secondary", "Label only"], ["Secondary", "Label & icon"]].map(([style, configuration]) =>
      `<div class="sb-row" style="gap:24px;align-items:flex-start">
         ${["Fixed", "Scrollable"].map((type) =>
           `<div class="sb-col" style="gap:6px">
              <span class="sb-label">${esc(type)} · ${esc(style)} · ${esc(configuration)}</span>
              ${tabs({ style, type, configuration, activeIndex: 0 })}
            </div>`).join("")}
       </div>`).join("") + `</div>`,
},
{
  id: "menu--playground",
  group: "Navigation",
  component: "Menu",
  name: "Playground",
  figma: "60885:94830",
  docs: {
    text: "Menus display a list of choices on a temporary surface. Density shrinks the row height from 48dp to 40dp to 32dp.",
    link: "https://m3.material.io/components/menus/overview",
  },
  args: {
    density:      { control: "radio",   options: ["0", "-2", "-4"], value: "0" },
    showLeading:  { control: "boolean", value: true },
    showTrailing: { control: "boolean", value: false },
  },
  render: (a) => menu(a),
},
{
  id: "list--playground",
  group: "Containment",
  component: "List",
  name: "Playground",
  figma: "60883:71215",
  docs: {
    text: "Lists are continuous, vertical indexes of text and images. Density shrinks the row from 72dp to 64dp to 56dp.",
    link: "https://m3.material.io/components/lists/overview",
  },
  args: {
    density:        { control: "radio",   options: ["0", "-2", "-4"], value: "0" },
    showLeading:    { control: "boolean", value: true },
    showSupporting: { control: "boolean", value: true },
    showTrailing:   { control: "boolean", value: true },
    showDividers:   { control: "boolean", value: true },
  },
  render: (a) => list(a),
},

/* ================= FEEDBACK ================= */
{
  id: "snackbar--playground",
  group: "Feedback",
  component: "Snackbar",
  name: "Playground",
  figma: "60880:53062",
  docs: {
    text: "Snackbars show short updates about app processes at the bottom of the screen.",
    link: "https://m3.material.io/components/snackbar/overview",
  },
  args: {
    configuration:       { control: "select",  options: ["Text only", "Text & action", "Text & longer action"], value: "Text & action" },
    lines:               { control: "radio",   options: ["One line", "Two lines"], value: "One line" },
    showCloseAffordance: { control: "boolean", value: false },
    text:                { control: "text",    value: "Scan saved to your timeline" },
    actionLabel:         { control: "text",    value: "Undo" },
  },
  render: (a) => snackbar(a),
},
{
  id: "snackbar--all-variants",
  group: "Feedback",
  component: "Snackbar",
  name: "All variants",
  figma: "60880:53097",
  docs: { text: "The ten configurations in the Figma set: three content shapes × one/two lines × close affordance." },
  args: {},
  render: () => `<div class="sb-col" style="gap:14px">` +
    [["Text only", "One line"], ["Text & action", "One line"],
     ["Text only", "Two lines"], ["Text & action", "Two lines"],
     ["Text & longer action", "Two lines"]].flatMap(([configuration, lines]) =>
      [false, true].map((showCloseAffordance) =>
        `<div class="sb-col" style="gap:5px">
           <span class="sb-label">${esc(configuration)} · ${esc(lines)}${showCloseAffordance ? " · close" : ""}</span>
           ${snackbar({ configuration, lines, showCloseAffordance,
             text: "Scan saved to your timeline", actionLabel: "Undo" })}
         </div>`)).join("") + `</div>`,
},
{
  id: "dialog--playground",
  group: "Feedback",
  component: "Dialog",
  name: "Playground",
  figma: "60880:65339",
  docs: {
    text: "Basic dialogs interrupt users with urgent information, details or actions.",
    link: "https://m3.material.io/components/dialogs/overview",
  },
  args: {
    showIcon:      { control: "boolean", value: false, desc: "Figma: Icon=True" },
    headline:      { control: "text",    value: "Rescan your skin?" },
    body:          { control: "text",    value: "Your last scan was 12 days ago. A fresh scan keeps your routine accurate." },
    confirmLabel:  { control: "text",    value: "Scan now" },
    dismissLabel:  { control: "text",    value: "Later" },
  },
  render: (a) => dialog(a),
},
{
  id: "tooltip--all-variants",
  group: "Feedback",
  component: "Tooltip",
  name: "All variants",
  figma: "55412:16992",
  docs: {
    text: "Plain tooltips describe an element; rich tooltips add a subhead, body text and actions.",
    link: "https://m3.material.io/components/tooltips/overview",
  },
  args: {},
  render: () => `<div class="sb-col" style="gap:20px">
    <div class="sb-col" style="gap:6px">
      <span class="sb-label">Plain tooltip · Type=Single line</span>
      <span class="peau-tooltip">Rescan</span>
    </div>
    <div class="sb-col" style="gap:6px">
      <span class="sb-label">Plain tooltip · Type=Multi line</span>
      <span class="peau-tooltip peau-tooltip--multi">Rescan your skin to refresh your routine recommendations</span>
    </div>
    <div class="sb-col" style="gap:6px">
      <span class="sb-label">Rich tooltip</span>
      <div class="peau-tooltip-rich">
        <span class="peau-tooltip-rich__subhead">Microbiome diversity</span>
        <span class="peau-tooltip-rich__body">A higher score means a broader mix of skin flora, which usually means a healthier barrier.</span>
        <div class="peau-tooltip-rich__actions">
          ${button({ variant: "text", size: "Small", type: "Round", state: "Enabled", labelText: "Learn more" })}
        </div>
      </div>
    </div>
  </div>`,
},
{
  id: "progress--linear",
  group: "Feedback",
  component: "Progress indicator",
  name: "Linear",
  figma: "60892:107101",
  docs: {
    text: "Linear progress indicators. The Figma set covers Flat and Wave shapes at 4dp and 8dp thickness, determinate and indeterminate.",
    link: "https://m3.material.io/components/progress-indicators/overview",
  },
  args: {
    type:      { control: "radio",   options: ["Flat", "Wave"], value: "Flat" },
    thickness: { control: "radio",   options: ["4 dp", "8 dp"], value: "4 dp" },
    progress:  { control: "range",   min: 0, max: 100, step: 10, value: 50 },
    indeterminate: { control: "boolean", value: false },
  },
  render: (a) => linearProgress(a),
},
{
  id: "progress--circular",
  group: "Feedback",
  component: "Progress indicator",
  name: "Circular",
  figma: "60892:107588",
  docs: { text: "Circular progress indicators at 4dp and 8dp, determinate and indeterminate." },
  args: {
    thickness:     { control: "radio",   options: ["4 dp", "8 dp"], value: "4 dp" },
    progress:      { control: "range",   min: 0, max: 100, step: 10, value: 30 },
    indeterminate: { control: "boolean", value: false },
  },
  render: (a) => circularProgress(a),
},
{
  id: "loading--playground",
  group: "Feedback",
  component: "Loading indicator",
  name: "Playground",
  figma: "60892:108086",
  docs: { text: "The Peau loading indicator morphs between shapes. Steps 1–7 in Figma are frames of that morph; here it animates continuously." },
  args: {
    showContainer: { control: "boolean", value: false },
  },
  render: (a) => `<div class="sb-row" style="gap:24px">
    <span class="peau-loading${a.showContainer ? " peau-loading--container" : ""}"><span class="peau-loading__shape"></span></span>
  </div>`,
},

/* ================= SHEETS & SEARCH ================= */
{
  id: "search--playground",
  group: "Inputs",
  component: "Search",
  name: "Playground",
  figma: "60892:98994",
  docs: {
    text: "The search bar from the app-bar building blocks — a 56dp pill on Schemes/Primary container.",
    link: "https://m3.material.io/components/search/overview",
  },
  args: {
    alignment:   { control: "radio",   options: ["Left aligned", "Centered"], value: "Left aligned" },
    placeholder: { control: "text",    value: "Search products" },
    showAvatar:  { control: "boolean", value: true },
  },
  render: (a) => searchBar(a),
},
{
  id: "sheet--playground",
  group: "Containment",
  component: "Sheet",
  name: "Playground",
  figma: "60892:100694",
  docs: {
    text: "Bottom and side sheets show supplementary content anchored to an edge of the screen.",
    link: "https://m3.material.io/components/bottom-sheets/overview",
  },
  args: {
    kind:       { control: "radio",   options: ["Bottom", "Side"], value: "Bottom" },
    title:      { control: "text",    value: "Filter products" },
    showHandle: { control: "boolean", value: true },
  },
  render: (a) => sheet(a),
},

/* ================= FOUNDATIONS ================= */
{
  id: "foundations--colour",
  group: "Foundations",
  component: "Colour",
  name: "Tokens",
  figma: "60879:52981",
  docs: { text: "Every colour variable published on the Figma page, resolved live from tokens.css." },
  args: {},
  render: () => tokenGrid([
    "--schemes-primary", "--schemes-on-primary", "--schemes-primary-container",
    "--schemes-secondary", "--schemes-secondary-variant", "--schemes-on-surface",
    "--schemes-outline", "--schemes-surface", "--primary60",
    "--states-primary-8", "--states-primary-12",
    "--states-secondary-8", "--states-secondary-12", "--states-disabled",
  ]),
},
{
  id: "foundations--type",
  group: "Foundations",
  component: "Typography",
  name: "Scale",
  figma: "60879:52981",
  docs: { text: "The M3 type roles used across the file. Display roles are set in Funnel Display, body roles in Funnel Sans." },
  args: {},
  render: () => [
    ["Headline large", "--headline-large", "var(--font-display)"],
    ["Headline small", "--headline-small", "var(--font-display)"],
    ["Title medium",   "--title-medium",   "var(--font-display)"],
    ["Title small",    "--title-small",    "var(--font-display)"],
    ["Label large",    "--label-large",    "var(--font-display)"],
    ["Body large",     "--body-large",     "var(--font-body)"],
    ["Body medium",    "--body-medium",    "var(--font-body)"],
    ["Body small",     "--body-small",     "var(--font-body)"],
  ].map(([label, prefix, family]) =>
    `<div style="display:flex;flex-direction:column;gap:2px;margin-bottom:18px">
       <span class="sb-label">${esc(label)}</span>
       <span style="font-family:${family};font-size:var(${prefix}-size);line-height:var(${prefix}-line);letter-spacing:var(${prefix}-track);color:var(--schemes-on-surface)">Healthy skin, understood</span>
     </div>`).join(""),
},
{
  id: "foundations--shape",
  group: "Foundations",
  component: "Shape",
  name: "Corner radii",
  figma: "60879:52981",
  docs: { text: "Corner tokens from the Figma Corner collection." },
  args: {},
  render: () => `<div class="sb-row" style="gap:18px">` +
    [["Extra small", "--corner-extra-small"], ["Small", "--corner-small"],
     ["Medium", "--corner-medium"], ["Large", "--corner-large"],
     ["Extra large", "--corner-extra-large"], ["Full", "--corner-full"]].map(([n, v]) =>
      `<div class="sb-col" style="gap:6px;align-items:center">
         <div style="width:72px;height:72px;background:var(--primary60);border-radius:var(${v})"></div>
         <span class="sb-label">${esc(n)}</span>
         <span class="sb-label" style="text-transform:none">var(${v})</span>
       </div>`).join("") + `</div>`,
},
];

/* ==================================================================
   Component renderers — plain HTML strings, one per Figma component.
   ================================================================== */

function button(a) {
  const variant = a.variant || "filled";
  const size = (a.size || "Medium").toLowerCase();
  const cls = [
    "peau-btn",
    `peau-btn--${size}`,
    a.type === "Square" ? "peau-btn--square" : "",
    variant !== "filled" ? `peau-btn--${variant}` : "",
    stateClass("peau-btn", a.state || "Enabled").trim(),
  ].filter(Boolean).join(" ");
  const ic = a.showIcon ? icon(a.icon || "add") : "";
  return `<button class="${cls}"${a.state === "Disabled" ? " disabled" : ""}>
  <span class="peau-btn__content">
    <span class="peau-btn__state-layer">${ic}<span class="peau-btn__label">${esc(a.labelText ?? "Upgrade")}</span></span>
  </span>
</button>`;
}

function iconButton(a) {
  const variant = a.variant || "filled";
  const cls = [
    "peau-icon-btn",
    a.size && a.size !== "s" ? `peau-icon-btn--${a.size}` : "",
    a.type === "Square" ? "peau-icon-btn--square" : "",
    variant !== "filled" ? `peau-icon-btn--${variant}` : "",
    stateClass("peau-icon-btn", a.state || "Enabled").trim(),
  ].filter(Boolean).join(" ");
  return `<button class="${cls}" aria-label="${esc(a.icon || "favorite")}"${a.state === "Disabled" ? " disabled" : ""}>
  <span class="peau-icon-btn__content">
    <span class="peau-icon-btn__state-layer">${icon(a.icon || "favorite")}</span>
  </span>
</button>`;
}

function textField(a) {
  const state = a.state || "Enabled";
  const cfg = a.textConfiguration || "Label text";
  const cls = `peau-textfield${state === "Enabled" ? "" : ` peau-textfield--${state.toLowerCase()}`}`;
  let content;
  if (cfg === "Input text") {
    content = `<p class="peau-textfield__text peau-textfield__text--input">${esc(a.labelText || "Input")}</p>`;
  } else if (cfg === "Placeholder text") {
    content = `<p class="peau-textfield__text">${esc(a.labelText || "Placeholder")}</p>`;
  } else {
    content = `<p class="peau-textfield__text">${esc(a.labelText || "Label")}</p>`;
  }
  if (state === "Focused") content += `<span class="peau-textfield__caret"></span>`;
  return `<div class="${cls}">
  <div class="peau-textfield__box">
    <div class="peau-textfield__state-layer">
      ${a.leadingIcon ? icon("search") : ""}
      <div class="peau-textfield__content">${content}</div>
      ${a.trailingIcon ? icon("cancel") : ""}
    </div>
  </div>
  ${a.showSupportingText ? `<div class="peau-textfield__supporting">${esc(a.supportingText || "Supporting text")}</div>` : ""}
</div>`;
}

function checkbox(a) {
  const type = a.type || "Selected";
  const isError = type.startsWith("Error");
  const base = isError ? type.replace("Error ", "") : type.toLowerCase();
  const cls = [
    "peau-checkbox",
    base === "unselected" || base === "Unselected" ? "peau-checkbox--unselected" : "",
    isError ? "peau-checkbox--error" : "",
    stateClass("peau-checkbox", a.state || "Enabled").trim(),
  ].filter(Boolean).join(" ");
  const glyph = /indeterminate/i.test(type) ? "remove" : "check";
  return `<span class="${cls}" role="checkbox" aria-checked="${/unselected/i.test(type) ? "false" : /indeterminate/i.test(type) ? "mixed" : "true"}" tabindex="0">
  <span class="peau-checkbox__state-layer">
    <span class="peau-checkbox__box"></span>
    <span class="peau-icon peau-checkbox__mark">${glyph}</span>
  </span>
</span>`;
}

function radio(a) {
  const cls = [
    "peau-radio",
    a.selected ? "peau-radio--selected" : "",
    stateClass("peau-radio", a.state || "Enabled").trim(),
  ].filter(Boolean).join(" ");
  return `<span class="${cls}" role="radio" aria-checked="${!!a.selected}" tabindex="0">
  <span class="peau-radio__container">
    <span class="peau-radio__state-layer"><span class="peau-radio__icon"></span></span>
  </span>
</span>`;
}

function switchCtl(a) {
  const cls = [
    "peau-switch",
    a.selected ? "" : "peau-switch--off",
    stateClass("peau-switch", a.state || "Enabled").trim(),
  ].filter(Boolean).join(" ");
  const glyph = a.showIcon ? icon(a.selected ? "check" : "close") : "";
  return `<span class="${cls}" role="switch" aria-checked="${!!a.selected}" tabindex="0">
  <span class="peau-switch__handle">
    <span class="peau-switch__target">
      <span class="peau-switch__state-layer">
        <span class="peau-switch__shape">${glyph}</span>
      </span>
    </span>
  </span>
</span>`;
}

function slider(a) {
  const type = a.type || "Standard";
  const v = Number(a.value ?? 40);
  const v2 = Number(a.valueEnd ?? 75);
  let activeStyle;
  if (type === "Range") {
    const lo = Math.min(v, v2), hi = Math.max(v, v2);
    activeStyle = `left:${lo}%;width:${hi - lo}%`;
  } else if (type === "Centered") {
    const lo = Math.min(50, v), hi = Math.max(50, v);
    activeStyle = `left:${lo}%;width:${hi - lo}%`;
  } else {
    activeStyle = `left:0;width:${v}%`;
  }
  const stops = a.showStops
    ? `<span class="peau-slider__stops">${Array.from({ length: 11 }, () => `<span class="peau-slider__stop"></span>`).join("")}</span>`
    : "";
  const handle = (pos) => `<span class="peau-slider__handle" style="left:${pos}%"></span>`;
  const valueLabel = (pos, val) => a.showValueLabel
    ? `<span class="peau-slider__value" style="left:${pos}%">${val}</span>` : "";
  return `<div class="peau-slider" role="slider" aria-valuenow="${v}" aria-valuemin="0" aria-valuemax="100" tabindex="0">
  <span class="peau-slider__track">
    <span class="peau-slider__active" style="${activeStyle}"></span>
    ${stops}
  </span>
  ${handle(v)}${valueLabel(v, v)}
  ${type === "Range" ? handle(v2) + valueLabel(v2, v2) : ""}
</div>`;
}

function badge(a) {
  const size = (a.size || "Large").toLowerCase();
  return `<span class="peau-badge peau-badge--${size}">${size === "large" ? esc(a.label ?? "3") : ""}</span>`;
}

function chip(a) {
  const cls = `peau-chip${a.selected ? " peau-chip--selected" : ""}`;
  return `<span class="${cls}">${a.showIcon ? icon(a.icon || "check") : ""}${esc(a.label ?? "Dry skin")}</span>`;
}

function card(a) {
  const styleMap = { Elevated: "elevated", Outlined: "outlined", Filled: "filled" };
  const horizontal = a.orientation === "Horizontal";
  const cls = [
    "peau-card",
    `peau-card--${styleMap[a.style] || "elevated"}`,
    horizontal ? "peau-card--horizontal" : "peau-card--stacked",
  ].join(" ");
  if (a.layout === "Slot") {
    return `<div class="${cls}" style="${horizontal ? "height:auto" : ""}">
  <div class="peau-card__slot">Slot</div>
</div>`;
  }
  return `<div class="${cls}">
  <div class="peau-card__media">${icon(a.icon || "water_drop")}</div>
  <div class="peau-card__body">
    <span class="peau-card__title">${esc(a.title ?? "Hydration routine")}</span>
    <span class="peau-card__text">${esc(a.text ?? "")}</span>
  </div>
</div>`;
}

function appBar(a) {
  const cfg = a.configuration || "Small";
  const onScroll = a.elevation === "On-scroll";
  const cls = [
    "peau-appbar",
    onScroll ? "peau-appbar--on-scroll" : "",
    cfg === "Small-centered" ? "peau-appbar--centered" : "",
    cfg === "Medium" ? "peau-appbar--medium" : "",
    cfg === "Large" ? "peau-appbar--large" : "",
  ].filter(Boolean).join(" ");

  if (cfg === "Search") {
    return `<div class="${cls}">
  <div class="peau-appbar__leading">${iconButton({ variant: "standard", icon: "menu", size: "s" })}</div>
  ${searchBar({ alignment: "Left aligned", placeholder: "Search products", showAvatar: false, compact: true })}
  <div class="peau-appbar__trailing">${iconButton({ variant: "standard", icon: "more_vert", size: "s" })}</div>
</div>`;
  }

  const leading = cfg === "Small-image"
    ? `<span class="peau-appbar__avatar">${icon("person")}</span>`
    : iconButton({ variant: "standard", icon: "arrow_back", size: "s" });

  return `<div class="${cls}">
  <div class="peau-appbar__leading">${leading}</div>
  <span class="peau-appbar__headline">${esc(a.headline ?? "My skin")}</span>
  <div class="peau-appbar__trailing">
    ${iconButton({ variant: "standard", icon: "search", size: "s" })}
    ${iconButton({ variant: "standard", icon: "more_vert", size: "s" })}
  </div>
</div>`;
}

function searchBar(a) {
  const cls = [
    "peau-searchbar",
    a.alignment === "Centered" ? "peau-searchbar--centered" : "",
  ].filter(Boolean).join(" ");
  const style = a.compact ? ' style="flex:1 0 0;min-width:0;width:auto;height:48px"' : "";
  return `<div class="${cls}"${style}>
  ${icon("search")}
  <span class="peau-searchbar__label">${esc(a.placeholder ?? "Search products")}</span>
  ${a.showAvatar ? `<span class="peau-appbar__avatar">${icon("person")}</span>` : ""}
</div>`;
}

function tabs(a) {
  const cfg = a.configuration || "Label only";
  const cls = [
    "peau-tabs",
    `peau-tabs--${(a.style || "Primary").toLowerCase()}`,
    a.type === "Scrollable" ? "peau-tabs--scrollable" : "",
    cfg === "Label & icon" ? "peau-tabs--with-icon" : "",
  ].filter(Boolean).join(" ");
  const items = [
    { label: "Skin", glyph: "face" },
    { label: "Microbiome", glyph: "biotech" },
    { label: "Products", glyph: "science" },
  ];
  const active = Number(a.activeIndex ?? 0);
  const body = items.map((it, i) => {
    const inner =
      cfg === "Icon only" ? icon(it.glyph)
      : cfg === "Label & icon" ? `${icon(it.glyph)}<span>${esc(it.label)}</span>`
      : `<span>${esc(it.label)}</span>`;
    return `<button class="peau-tab${i === active ? " peau-tab--active" : ""}" role="tab" aria-selected="${i === active}">${inner}</button>`;
  }).join("");
  return `<div class="${cls}" role="tablist">${body}</div>`;
}

function menu(a) {
  const d = a.density === "0" || a.density === undefined ? "" : ` peau-menu--density-${a.density}`;
  const items = [
    { label: "Rescan", glyph: "photo_camera", trailing: "⌘R" },
    { label: "Share", glyph: "share", trailing: "⌘S" },
    { label: "Export", glyph: "download", trailing: "⌘E" },
    { label: "Delete", glyph: "delete", trailing: "", disabled: true },
  ];
  return `<div class="peau-menu${d}" role="menu">` + items.map((it) =>
    `<div class="peau-menu-item${it.disabled ? " peau-menu-item--disabled" : ""}" role="menuitem">
       ${a.showLeading ? icon(it.glyph) : ""}
       <span class="peau-menu-item__label">${esc(it.label)}</span>
       ${a.showTrailing && it.trailing ? `<span class="sb-label" style="text-transform:none">${esc(it.trailing)}</span>` : ""}
     </div>`).join("") + `</div>`;
}

function list(a) {
  const d = a.density === "0" || a.density === undefined ? "" : ` peau-list--density-${a.density}`;
  const items = [
    { h: "Hydration", s: "Up 12% this week", t: "82", glyph: "water_drop" },
    { h: "Barrier", s: "Stable", t: "74", glyph: "shield" },
    { h: "Microbiome", s: "Needs attention", t: "61", glyph: "biotech" },
  ];
  return `<div class="peau-list${d}" role="list">` + items.map((it, i) =>
    `<div class="peau-list-item" role="listitem">
       ${a.showLeading ? `<span class="peau-list-item__leading">${icon(it.glyph)}</span>` : ""}
       <span class="peau-list-item__content">
         <span class="peau-list-item__headline">${esc(it.h)}</span>
         ${a.showSupporting ? `<span class="peau-list-item__supporting">${esc(it.s)}</span>` : ""}
       </span>
       ${a.showTrailing ? `<span class="peau-list-item__trailing">${esc(it.t)}</span>` : ""}
     </div>` +
    (a.showDividers && i < items.length - 1
      ? `<hr class="peau-divider peau-divider--horizontal peau-divider--inset" style="width:auto">` : "")
  ).join("") + `</div>`;
}

function snackbar(a) {
  const cfg = a.configuration || "Text & action";
  const twoLines = a.lines === "Two lines";
  const longer = cfg === "Text & longer action";
  const cls = [
    "peau-snackbar",
    twoLines && !longer ? "peau-snackbar--two-lines" : "",
    longer ? "peau-snackbar--stacked" : "",
  ].filter(Boolean).join(" ");
  const text = twoLines
    ? `${esc(a.text ?? "")} — we'll keep tracking your barrier while you sleep.`
    : esc(a.text ?? "");
  const action = cfg !== "Text only"
    ? `<button class="peau-snackbar__action">${esc(a.actionLabel ?? "Undo")}</button>` : "";
  const close = a.showCloseAffordance
    ? `<button class="peau-snackbar__close" aria-label="Dismiss">${icon("close")}</button>` : "";
  return `<div class="${cls}" role="status">
  <span class="peau-snackbar__text">${text}</span>
  <span class="peau-snackbar__actions">${action}${close}</span>
</div>`;
}

function dialog(a) {
  return `<div class="peau-dialog${a.showIcon ? " peau-dialog--centered" : ""}" role="dialog" aria-modal="true">
  ${a.showIcon ? `<span class="peau-dialog__icon">${icon("photo_camera")}</span>` : ""}
  <span class="peau-dialog__headline">${esc(a.headline ?? "Rescan your skin?")}</span>
  <span class="peau-dialog__body">${esc(a.body ?? "")}</span>
  <div class="peau-dialog__actions">
    ${button({ variant: "text", size: "Small", type: "Round", state: "Enabled", labelText: a.dismissLabel ?? "Later" })}
    ${button({ variant: "text", size: "Small", type: "Round", state: "Enabled", labelText: a.confirmLabel ?? "Scan now" })}
  </div>
</div>`;
}

function linearProgress(a) {
  const thick = a.thickness === "8 dp";
  const cls = [
    "peau-progress-linear",
    thick ? "peau-progress-linear--8dp" : "",
    a.type === "Wave" ? "peau-progress-linear--wave" : "",
    a.indeterminate ? "peau-progress-linear--indeterminate" : "",
  ].filter(Boolean).join(" ");
  const p = Math.max(0, Math.min(100, Number(a.progress ?? 50)));
  if (a.indeterminate) {
    return `<div class="${cls}" role="progressbar">
  <span class="peau-progress-linear__active" style="width:30%"></span>
</div>`;
  }
  return `<div class="${cls}" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100">
  <span class="peau-progress-linear__active" style="width:${p}%"></span>
  <span class="peau-progress-linear__track"></span>
  <span class="peau-progress-linear__stop"></span>
</div>`;
}

function circularProgress(a) {
  const stroke = a.thickness === "8 dp" ? 8 : 4;
  const size = a.thickness === "8 dp" ? 44 : 40;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(100, Number(a.progress ?? 30)));
  const offset = a.indeterminate ? c * 0.75 : c * (1 - p / 100);
  const cls = `peau-progress-circular${a.indeterminate ? " peau-progress-circular--indeterminate" : ""}`;
  return `<span class="${cls}" role="progressbar"${a.indeterminate ? "" : ` aria-valuenow="${p}"`}>
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    ${a.indeterminate ? "" : `<circle class="peau-progress-circular__track" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${stroke}"></circle>`}
    <circle class="peau-progress-circular__active" cx="${size / 2}" cy="${size / 2}" r="${r}"
            stroke-width="${stroke}" stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}"></circle>
  </svg>
</span>`;
}

function sheet(a) {
  const side = a.kind === "Side";
  return `<div class="peau-sheet peau-sheet--${side ? "side" : "bottom"}">
  ${!side && a.showHandle ? `<span class="peau-sheet__drag-handle"></span>` : ""}
  <div class="peau-sheet__header">
    <span class="peau-sheet__header-title">${esc(a.title ?? "Filter products")}</span>
    ${iconButton({ variant: "standard", icon: "close", size: "s" })}
  </div>
  <div class="peau-sheet__body">
    ${list({ density: "-2", showLeading: true, showSupporting: false, showTrailing: false, showDividers: true })}
  </div>
</div>`;
}

function tokenGrid(names) {
  const cs = getComputedStyle(document.documentElement);
  return `<div class="sb-tokens">` + names.map((n) => {
    const value = cs.getPropertyValue(n).trim();
    return `<div class="sb-token">
      <span class="sb-token__swatch" style="background:${value}"></span>
      <span>
        <span class="sb-token__name">${esc(n)}</span><br>
        <span class="sb-token__value">${esc(value)}</span>
      </span>
    </div>`;
  }).join("") + `</div>`;
}

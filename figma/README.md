# Study Surface → Figma

The Study Surface page (`../studysurface.html`) pushed into Figma as frames and
components, with the `:root` tokens from `../studysurface.css` bound as Figma
variables.

**Target file:** https://www.figma.com/design/7X01GFbXOviokU4mnFhgf9
(created in the "Test team" drafts; the originally supplied file was not
editable by the authorised account)

## Already in the file

- **Variable collection "Study Surface Tokens"** — 23 variables, mode
  "Expressive": `color/*`, `stage/*`, `track/*`, `radius/*`, `stroke/*`,
  `size/*`. Every fill, stroke, radius and rail/sidebar width in the screen is
  bound to these, not hardcoded.
- **12 text styles** — Inter ramp: `Display/Plan Title`, `Title/Section`,
  `Title/Card`, `Title/Group`, `Body/Row`, `Body/Row Strong`, `Body/Note`,
  `Label/Pill`, `Caption/Meta`, `Caption/Control`, `Micro/Label`, `Micro/Count`.
- **Components page** — Progress Pip (Empty/Filled/Filled Alt), CLIR Dot
  (None/C/L/I/R/All four), Checkbox (Unchecked/Checked), Pill Button, Feel Pill,
  Icon (13 variants, imported from the source SVGs), Sidebar Item, Plan List
  Item, Stage Row, Task Row.
- **"My Plan" page** — sidebar, header band (plan strip with real chapter
  widths, stage flag, playhead, milestone diamonds, resume banner), rail (all
  five cards), day bar, Warm up group, Translation 2.0 group with six task rows,
  and the expanded notes on tasks 1 and 3.

## Not yet in the file

`remaining-step.js` — task 5's two workout embed cards, the Redline Prep tutor
group, the day pager, and the sidebar full-height fix. Written and reviewed but
never executed: the Figma MCP monthly tool-call quota ran out (Starter plan,
View seat = 20 calls/month). Also still to do afterwards: the day-close
reflection state, which is `hidden` in the HTML and belongs beside the screen as
a separate state frame.

## Running the rest

Run the contents of `remaining-step.js` through the Figma MCP `use_figma` tool
against file key `7X01GFbXOviokU4mnFhgf9`, once quota is available (a Full or
Dev seat raises the limit to 200/day). The node IDs it references are stable.

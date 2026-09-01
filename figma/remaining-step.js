// Remaining step of the Study Surface → Figma push.
// Run via the Figma MCP `use_figma` tool against fileKey 7X01GFbXOviokU4mnFhgf9.
// Adds: task 5's workout embed cards, the Redline Prep tutor group, the day
// pager, and stretches the sidebar to full height.
//
// Node IDs referenced (stable, created by earlier steps):
//   8:5    Sidebar          10:59  Timeline
//   15:194 Task 5 card

await Promise.all(["Regular","Medium","Semi Bold","Bold","Extra Bold"].map(s => figma.loadFontAsync({ family: "Inter", style: s })));
const comps = figma.root.children.find(p => p.name === "Components");
const screen = figma.root.children.find(p => p.name === "My Plan");
await figma.setCurrentPageAsync(screen);

const vars = await figma.variables.getLocalVariablesAsync();
const V = Object.fromEntries(vars.map(v => [v.name, v]));
const T = Object.fromEntries((await figma.getLocalTextStylesAsync()).map(s => [s.name, s]));
const paint = n => figma.variables.setBoundVariableForPaint({ type: "SOLID", color: { r: 0, g: 0, b: 0 } }, "color", V[n]);
const radius = (n, v) => ["topLeftRadius","topRightRadius","bottomLeftRadius","bottomRightRadius"].forEach(k => n.setBoundVariable(k, V[v]));
const text = (chars, styleName, colorVar) => {
  const t = figma.createText();
  t.characters = chars; t.textStyleId = T[styleName].id; t.fills = [paint(colorVar)];
  return t;
};
const dotSet = comps.findOne(n => n.type === "COMPONENT_SET" && n.name === "CLIR Dot");
const taskSet = comps.findOne(n => n.type === "COMPONENT_SET" && n.name === "Task Row");
const K = Object.keys(taskSet.componentPropertyDefinitions);
const key = p => K.find(k => k.startsWith(p));

const embedCard = (parent, { dot, name, kind, meta }) => {
  const c = figma.createAutoLayout("VERTICAL", { name: `embed/${name}`, itemSpacing: 5 });
  c.fills = [paint("color/surface")];
  c.strokes = [paint("color/ink")];
  c.setBoundVariable("strokeWeight", V["stroke/width"]);
  c.cornerRadius = 9;
  c.paddingLeft = 10; c.paddingRight = 10; c.paddingTop = 9; c.paddingBottom = 9;
  parent.appendChild(c); c.layoutSizingHorizontal = "FILL";
  const top = figma.createAutoLayout("HORIZONTAL", { name: "embed-top", itemSpacing: 7 });
  top.fills = []; top.counterAxisAlignItems = "CENTER";
  c.appendChild(top); top.layoutSizingHorizontal = "FILL";
  top.appendChild(dotSet.children.find(x => x.name === `Type=${dot}`).createInstance());
  const b = text(name, "Body/Row Strong", "color/ink");
  top.appendChild(b); b.layoutSizingHorizontal = "FILL";
  const chip = figma.createAutoLayout("HORIZONTAL", { name: "kind" });
  chip.paddingLeft = 6; chip.paddingRight = 6; chip.paddingTop = 1; chip.paddingBottom = 1;
  chip.fills = [paint("color/band")];
  chip.strokes = [paint("color/ink")];
  chip.setBoundVariable("strokeWeight", V["stroke/width"]);
  chip.cornerRadius = 999;
  const ct = figma.createText();
  ct.characters = kind; ct.fontName = { family: "Inter", style: "Extra Bold" }; ct.fontSize = 9;
  ct.fills = [paint("color/ink")];
  chip.appendChild(ct);
  top.appendChild(chip);
  const bm = figma.createAutoLayout("HORIZONTAL", { name: "bookmark" });
  bm.primaryAxisAlignItems = "CENTER"; bm.counterAxisAlignItems = "CENTER";
  bm.resize(24, 24);
  bm.layoutSizingHorizontal = "FIXED"; bm.layoutSizingVertical = "FIXED";
  bm.fills = [paint("color/surface")];
  bm.strokes = [paint("color/ink")];
  bm.setBoundVariable("strokeWeight", V["stroke/width"]);
  bm.cornerRadius = 7;
  bm.appendChild(text("☆", "Caption/Meta", "color/ink"));
  top.appendChild(bm);
  const m = figma.createAutoLayout("HORIZONTAL", { name: "embed-meta", itemSpacing: 9 });
  m.fills = [];
  c.appendChild(m);
  meta.forEach(x => m.appendChild(text(x, "Micro/Count", "color/ink-60")));
  return c;
};

// ── task 5 notes ────────────────────────────────────────────────
const t5 = await figma.getNodeByIdAsync("15:194");
const n5 = figma.createAutoLayout("VERTICAL", { name: "notes" });
n5.fills = []; n5.paddingLeft = 52; n5.paddingRight = 11; n5.paddingBottom = 11;
t5.appendChild(n5); n5.layoutSizingHorizontal = "FILL";
const wrap5 = figma.createAutoLayout("HORIZONTAL", { name: "embed", itemSpacing: 8 });
wrap5.fills = [];
n5.appendChild(wrap5); wrap5.layoutSizingHorizontal = "FILL";
embedCard(wrap5, { dot: "I", name: "Sufficient & Necessary Sprint", kind: "Workout", meta: ["20 questions", "25m", "Conditionals"] });
embedCard(wrap5, { dot: "R", name: "Paradox Reps", kind: "Workout", meta: ["15 questions", "18m", "Resolution"] });

// ── tutor group ─────────────────────────────────────────────────
const timeline = await figma.getNodeByIdAsync("10:59");
const g = figma.createAutoLayout("VERTICAL", { name: "Group/Redline Prep (tutor)" });
g.fills = [paint("color/surface")];
g.strokes = [paint("color/ink")];
g.setBoundVariable("strokeWeight", V["stroke/width"]);
radius(g, "radius/card");
g.clipsContent = true;
timeline.appendChild(g); g.layoutSizingHorizontal = "FILL";

const head = figma.createAutoLayout("HORIZONTAL", { name: "group-head", itemSpacing: 9 });
head.fills = []; head.counterAxisAlignItems = "CENTER";
head.paddingLeft = 13; head.paddingRight = 13; head.paddingTop = 11; head.paddingBottom = 11;
g.appendChild(head); head.layoutSizingHorizontal = "FILL";
head.appendChild(text("⌄", "Title/Group", "color/ink"));
head.appendChild(text("Redline Prep", "Title/Group", "color/ink"));
const who = figma.createAutoLayout("HORIZONTAL", { name: "who" });
who.paddingLeft = 7; who.paddingRight = 7; who.paddingTop = 1; who.paddingBottom = 1;
who.fills = [paint("color/band")];
who.strokes = [paint("color/ink")];
who.setBoundVariable("strokeWeight", V["stroke/width"]);
who.cornerRadius = 999;
const wt = figma.createText();
wt.characters = "Homework"; wt.fontName = { family: "Inter", style: "Bold" }; wt.fontSize = 10;
wt.fills = [paint("color/ink")];
who.appendChild(wt);
head.appendChild(who);
const gap = figma.createFrame();
gap.name = "spacer"; gap.fills = []; gap.resize(10, 1);
head.appendChild(gap); gap.layoutSizingHorizontal = "FILL";
head.appendChild(text("0 of 2 done · 45m", "Caption/Meta", "color/ink-60"));

const body = figma.createAutoLayout("VERTICAL", { name: "group-body", itemSpacing: 5 });
body.fills = []; body.paddingLeft = 9; body.paddingRight = 9; body.paddingBottom = 9;
g.appendChild(body); body.layoutSizingHorizontal = "FILL";

const tutorTasks = [
  { n: "1.", title: "Redo the 8 questions we missed on Monday", time: "11:00 am · 30m", icon: "drill", dot: "L", launch: true },
  { n: "2.", title: "One sentence on why each trap answer worked", time: "11:30 am · 15m", icon: "log", dot: "None", launch: false }
];
const tutorIds = [];
for (const t of tutorTasks) {
  const card = figma.createAutoLayout("VERTICAL", { name: `Task ${t.n}` });
  card.fills = [paint("color/surface")];
  card.strokes = [paint("color/ink")];
  card.setBoundVariable("strokeWeight", V["stroke/width"]);
  radius(card, "radius/row");
  card.clipsContent = true;
  body.appendChild(card); card.layoutSizingHorizontal = "FILL";
  const inst = taskSet.children.find(c => c.name === "State=Default").createInstance();
  card.appendChild(inst); inst.layoutSizingHorizontal = "FILL";
  inst.setProperties({
    [key("Number")]: t.n, [key("Title")]: t.title, [key("Time")]: t.time,
    [key("Show more")]: true, [key("Show launch")]: t.launch
  });
  const nested = inst.findAllWithCriteria({ types: ["INSTANCE"] });
  const icon = nested.find(x => x.name === "Icon");
  const dot = nested.find(x => x.name === "CLIR Dot");
  if (icon) icon.setProperties({ Name: t.icon });
  if (dot) dot.setProperties({ Type: t.dot });
  tutorIds.push(card.id);
}

// ── day pager ───────────────────────────────────────────────────
const pager = figma.createAutoLayout("HORIZONTAL", { name: "Day pager", itemSpacing: 9 });
pager.fills = [];
timeline.appendChild(pager); pager.layoutSizingHorizontal = "FILL";
for (const label of ["← Tuesday, Jul 14", "Thursday, Jul 16 →"]) {
  const b = figma.createAutoLayout("HORIZONTAL", { name: label });
  b.primaryAxisAlignItems = "CENTER"; b.counterAxisAlignItems = "CENTER";
  b.paddingTop = 11; b.paddingBottom = 11;
  b.fills = [paint("color/surface")];
  b.strokes = [paint("color/ink")];
  b.setBoundVariable("strokeWeight", V["stroke/width"]);
  radius(b, "radius/card");
  const t = figma.createText();
  t.characters = label; t.fontName = { family: "Inter", style: "Bold" }; t.fontSize = 12;
  t.fills = [paint("color/ink")];
  b.appendChild(t);
  pager.appendChild(b);
  b.layoutSizingHorizontal = "FILL";
}

// ── sidebar to full height ──────────────────────────────────────
const sidebar = await figma.getNodeByIdAsync("8:5");
sidebar.layoutSizingVertical = "FILL";

return { createdNodeIds: [n5.id, g.id, pager.id, ...tutorIds] };

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";
const require = createRequire(import.meta.url);

test("orbit ticker continues across revolutions, resumes after badge exit, and cleans up", () => {
  class Element {
    constructor(badge = false) { this.badge = badge; this.values = {}; this.firstElementChild = {}; }
    closest() { return this.badge ? this : null; }
  }
  const badges = Array.from({ length: 8 }, () => new Element(true));
  const listeners = new Map();
  const decorations = new Map();
  const stage = {
    clientWidth: 400,
    querySelectorAll: (selector) => selector === "[data-orbit-badge]" ? badges : [],
    querySelector: (selector) => {
      if (!decorations.has(selector)) decorations.set(selector, new Element());
      return decorations.get(selector);
    },
    addEventListener: (name, callback) => listeners.set(name, callback),
    removeEventListener: (name) => listeners.delete(name),
    contains: () => false,
  };
  const card = { querySelectorAll: () => [] };
  let refIndex = 0;
  let ticker;
  let cleanup;
  let mediaCleanup;
  let observersDisconnected = 0;
  const timeline = { from() { return this; }, play() { return this; } };
  const gsap = {
    registerPlugin() {},
    quickSetter: (node, property) => (value) => { node.values[property] = value; },
    timeline: () => timeline,
    set() {},
    matchMedia: () => ({ add: (_query, callback) => { mediaCleanup = callback(); }, revert: () => mediaCleanup() }),
    ticker: { add: (callback) => { ticker = callback; }, remove: (callback) => { assert.equal(callback, ticker); ticker = undefined; } },
  };
  const source = ts.transpileModule(fs.readFileSync(new URL("../components/about/CreativeTechOrbit.tsx", import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const compiledModule = { exports: {} };
  vm.runInNewContext(`(function(require, module, exports) { ${source}\n})`, {
    document: { hidden: false }, Element, Node: Element,
    IntersectionObserver: class { constructor(callback) { this.callback = callback; } observe() { this.callback([{ isIntersecting: true }]); } disconnect() { observersDisconnected++; } },
    ResizeObserver: class { observe() {} disconnect() { observersDisconnected++; } },
  })((name) => {
    if (name === "react") return { useId: () => "orbit-test", useRef: () => ({ current: refIndex++ === 0 ? card : stage }) };
    if (name === "motion/react") return { motion: { article: "article" }, useReducedMotion: () => false };
    if (name === "@gsap/react") return { useGSAP: (callback) => { cleanup = callback(); } };
    if (name === "gsap") return { default: gsap };
    return require(name);
  }, compiledModule, compiledModule.exports);
  const tree = compiledModule.exports.default();
  const initialPositions = [];
  const inspect = (node) => {
    if (Array.isArray(node)) { node.forEach(inspect); return; }
    if (!node?.props) return;
    if (node.props["data-orbit-badge"]) initialPositions.push(node.props.style);
    inspect(node.props.children);
  };
  inspect(tree);
  assert.equal(initialPositions.length, 8);
  for (const position of initialPositions) {
    for (const axis of ["left", "top"]) {
      assert.match(position[axis], /^\d+(?:\.\d{1,3})?%$/);
      assert.equal(position[axis], `${Number.parseFloat(position[axis])}%`);
    }
  }
  const advance = (seconds) => { for (let frame = 0; frame < seconds * 60; frame++) ticker(frame / 60, 1000 / 60); };
  advance(100);
  const before = badges.map((badge) => ({ ...badge.values }));
  advance(2);
  badges.forEach((badge, index) => {
    assert.ok(Number.isFinite(badge.values.x) && Number.isFinite(badge.values.y));
    assert.notEqual(badge.values.x, before[index].x);
  });
  listeners.get("pointerover")({ pointerType: "mouse", target: badges[0] });
  advance(4);
  const paused = badges[0].values.x;
  advance(1);
  assert.ok(Math.abs(badges[0].values.x - paused) < 0.001);
  listeners.get("pointerout")({ relatedTarget: new Element() });
  advance(1);
  assert.ok(Math.abs(badges[0].values.x - paused) > 0.1);
  cleanup();
  assert.equal(ticker, undefined);
  assert.equal(listeners.size, 0);
  assert.equal(observersDisconnected, 2);
});

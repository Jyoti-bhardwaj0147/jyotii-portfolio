import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";
import * as THREE from "three";

const require = createRequire(import.meta.url);
const source = ts.transpileModule(fs.readFileSync(new URL("../lib/globe-utils.ts", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const exports = {};
vm.runInNewContext(source, { exports, require: (name) => name === "three" ? THREE : require(name) });
const { globePosition, connectionPoints } = exports;

test("globe coordinates preserve poles, prime meridian and antipodal longitudes", () => {
  assert.ok(globePosition(90, 0).distanceTo(new THREE.Vector3(0, 1, 0)) < 1e-10);
  assert.ok(globePosition(0, 0).z > .999);
  assert.ok(globePosition(0, 180).z < -.999);
  assert.ok(Math.abs(globePosition(28.61, 77.21).length() - 1) < 1e-10);
});

test("international arcs stay above Earth and meet their geographic endpoints", () => {
  const india = globePosition(28.61, 77.21);
  for (const [lat, lon] of [[51.51,-.13],[40.71,-74.01],[52.52,13.4],[-33.87,151.21],[35.68,139.69],[25.2,55.27]]) {
    const destination = globePosition(lat, lon);
    const points = connectionPoints(india, destination);
    assert.ok(points[0].distanceTo(india.clone().multiplyScalar(1.012)) < 1e-10);
    assert.ok(points.at(-1).distanceTo(destination.clone().multiplyScalar(1.012)) < 1e-10);
    assert.ok(points.every(p => Number.isFinite(p.x) && p.length() >= 1.012 - 1e-10));
    assert.ok(points[32].length() > 1.08);
  }
});

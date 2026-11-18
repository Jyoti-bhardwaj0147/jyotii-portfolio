import { Vector3 } from "three";

export function globePosition(latitude: number, longitude: number, radius = 1) {
  const lat = latitude * Math.PI / 180;
  const lon = longitude * Math.PI / 180;
  return new Vector3(Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)).multiplyScalar(radius);
}

export function connectionPoints(start: Vector3, end: Vector3, segments = 64) {
  const a = start.clone().normalize();
  const b = end.clone().normalize();
  const angle = Math.acos(Math.max(-1, Math.min(1, a.dot(b))));
  const sine = Math.sin(angle);
  return Array.from({ length: segments + 1 }, (_, i) => {
    const t = i / segments;
    const point = angle < 0.0001 ? a.clone() : a.clone().multiplyScalar(Math.sin((1 - t) * angle) / sine)
      .addScaledVector(b, Math.sin(t * angle) / sine);
    return point.normalize().multiplyScalar(1.012 + Math.sin(Math.PI * t) * (0.08 + angle * 0.1));
  });
}

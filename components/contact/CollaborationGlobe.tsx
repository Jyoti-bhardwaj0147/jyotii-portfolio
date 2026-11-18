"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { AdditiveBlending, CatmullRomCurve3, Group, ShaderMaterial, Vector3 } from "three";
import land from "@/lib/globe/land-points.json";
import { connectionPoints, globePosition } from "@/lib/globe-utils";

type Props = { reduced: boolean; active: boolean; pointer: RefObject<{ x: number; y: number; hovered: boolean }> };

const pointVertex = `
  uniform float size; uniform float pixelHeight;
  varying float shade;
  void main() {
    vec4 view = modelViewMatrix * vec4(position, 1.0);
    shade = .55 + .45 * max(0., normalize(normalMatrix * normalize(position)).z);
    gl_PointSize = clamp(size * pixelHeight / -view.z, 1., 64.);
    gl_Position = projectionMatrix * view;
  }`;
const pointFragment = `
  uniform float reveal; uniform float glow; uniform float time;
  varying float shade;
  void main() {
    float d = length(gl_PointCoord - .5) * 2.;
    if (d > 1.) discard;
    float alpha = mix(1. - smoothstep(.55, 1., d), exp(-d*d*5.), glow);
    vec3 color = mix(vec3(.64,.24,.95), vec3(1.,.79,1.), shade);
    color += glow * pow(1.-d, 8.);
    gl_FragColor = vec4(color, alpha * reveal * mix(shade, .85 + .15*sin(time + gl_FragCoord.x*.03), glow));
  }`;
const atmosphereVertex = `varying vec3 n; varying vec3 v;
  void main(){ vec4 p=modelViewMatrix*vec4(position,1.); n=normalize(normalMatrix*normal); v=normalize(-p.xyz); gl_Position=projectionMatrix*p; }`;
const atmosphereFragment = `varying vec3 n; varying vec3 v; uniform float reveal;
  void main(){float rim=pow(1.-max(0.,dot(normalize(n),normalize(v))),3.5);gl_FragColor=vec4(.68,.19,1.,rim*.65*reveal);}`;
const routeVertex = `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const routeFragment = `varying vec2 vUv; uniform float time; uniform float offset; uniform float reveal; uniform float hover;
  void main(){float phase=fract(time*.18+offset);float pulse=pow(max(0.,sin(phase*3.14159265)),2.);float trail=exp(-pow((vUv.x-phase)*13.,2.));float entrance=1.-smoothstep(reveal-.12,reveal,vUv.x);vec3 color=mix(vec3(.65,.22,1.),vec3(.95,.65,1.),vUv.x);gl_FragColor=vec4(color,(.35+pulse*.4+trail*.25)*entrance*(1.+hover*.2));}`;

const destinations = [[28.61,77.21],[51.51,-.13],[40.71,-74.01],[52.52,13.4],[-33.87,151.21],[35.68,139.69],[25.2,55.27]];
const routes = destinations.slice(1).map(([lat,lon]) => new CatmullRomCurve3(connectionPoints(globePosition(...destinations[0] as [number,number]),globePosition(lat,lon))));

function Scene({ reduced, pointer }: Props) {
  const tilt = useRef<Group>(null);
  const globe = useRef<Group>(null);
  const dots = useRef<ShaderMaterial>(null);
  const halo = useRef<ShaderMaterial>(null);
  const hotspots = useRef<ShaderMaterial>(null);
  const travelers = useRef<ShaderMaterial>(null);
  const routeMaterials = useRef<(ShaderMaterial | null)[]>([]);
  const elapsed = useRef(0);
  const { size, gl, invalidate, setDpr } = useThree();
  const [coarse] = useState(() => window.matchMedia("(pointer: coarse)").matches);
  const positions = useMemo(() => new Float32Array(land.filter((_,i) => !coarse || i % 2 === 0).flatMap(([lat,lon]) => globePosition(lat,lon,1.003).toArray())), [coarse]);
  const endpoints = useMemo(() => new Float32Array(destinations.flatMap(([lat,lon]) => globePosition(lat,lon,1.018).toArray())), []);
  const materials = useMemo(() => routes.map((_,i) => ({ time:{value:0}, offset:{value:i/6}, reveal:{value:0}, hover:{value:0} })), []);
  const dotUniforms = useMemo(() => ({ size:{value:.009}, pixelHeight:{value:600}, reveal:{value:0}, glow:{value:0}, time:{value:0} }), []);
  const hotUniforms = useMemo(() => ({ size:{value:.2}, pixelHeight:{value:600}, reveal:{value:0}, glow:{value:1}, time:{value:0} }), []);
  const travelUniforms = useMemo(() => ({ size:{value:.075}, pixelHeight:{value:600}, reveal:{value:0}, glow:{value:1}, time:{value:0} }), []);
  const atmosphereUniforms = useMemo(() => ({ reveal:{value:0} }), []);
  const moving = useMemo(() => new Float32Array(routes.flatMap(route => route.getPoint(.4).toArray())), []);
  const particleGeometry = useRef<import("three").BufferGeometry>(null);
  const sampled = useMemo(() => routes.map(route => route.getPoints(240)), []);
  const scratch = useMemo(() => new Vector3(), []);

  useEffect(() => { invalidate(); }, [reduced, invalidate]);
  useFrame((_, delta) => {
    const dt = Math.min(delta, .05);
    if (!reduced) elapsed.current += dt;
    const t = reduced ? 5 : elapsed.current;
    const reveal = (delay: number) => reduced ? 1 : Math.min(1, Math.max(0, (t-delay)/.8));
    if (globe.current && tilt.current) {
      globe.current.rotation.y = -.65 - (reduced ? 0 : t * Math.PI / 40);
      globe.current.position.y = reduced ? 0 : Math.sin(t*Math.PI/3)*.025;
      globe.current.scale.setScalar(.94 + .06*reveal(0));
      tilt.current.rotation.x += ((reduced ? 0 : pointer.current.y*.07)-tilt.current.rotation.x)*Math.min(1,dt*4);
      tilt.current.rotation.z = -.1;
      tilt.current.rotation.y += ((reduced ? 0 : pointer.current.x*.12)-tilt.current.rotation.y)*Math.min(1,dt*4);
    }
    const pixels = size.height * gl.getPixelRatio();
    for (const mat of [dots.current,hotspots.current,travelers.current]) if(mat){mat.uniforms.pixelHeight.value=pixels;mat.uniforms.time.value=reduced?0:t;}
    if(dots.current) dots.current.uniforms.reveal.value=reveal(.3);
    if(halo.current) halo.current.uniforms.reveal.value=reveal(.1);
    if(hotspots.current) hotspots.current.uniforms.reveal.value=reveal(.65);
    if(travelers.current) travelers.current.uniforms.reveal.value=reveal(1);
    routeMaterials.current.forEach((material,i) => {
      if (!material) return;
      const uniforms = material.uniforms;
      uniforms.time.value=reduced?2:t;
      uniforms.reveal.value=reveal(.85+i*.08)*1.12;
      uniforms.hover.value=pointer.current.hovered?1:0;
      const phase=(t*.18+i/6)%1;
      const index=phase*240, lower=Math.floor(index);
      scratch.copy(sampled[i][lower]).lerp(sampled[i][Math.min(240,lower+1)],index-lower);
      scratch.toArray(moving,i*3);
    });
    if(particleGeometry.current) particleGeometry.current.attributes.position.needsUpdate=true;
  });

  return <>
    <PerformanceMonitor onDecline={() => setDpr(1)} />
    <group ref={tilt} position={[0,.08,0]}>
      <group ref={globe}>
        <mesh><sphereGeometry args={[.998,64,48]} /><meshBasicMaterial color="#0d0618" /></mesh>
        <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions,3]} /></bufferGeometry>
          <shaderMaterial ref={dots} uniforms={dotUniforms} vertexShader={pointVertex} fragmentShader={pointFragment} transparent depthWrite={false} blending={AdditiveBlending} />
        </points>
        <mesh><sphereGeometry args={[1.025,64,48]} /><shaderMaterial ref={halo} uniforms={atmosphereUniforms} vertexShader={atmosphereVertex} fragmentShader={atmosphereFragment} transparent depthWrite={false} blending={AdditiveBlending} /></mesh>
        {routes.map((route,i) => <mesh key={i}><tubeGeometry args={[route,96,.004,6,false]} /><shaderMaterial ref={(material) => { routeMaterials.current[i] = material; }} uniforms={materials[i]} vertexShader={routeVertex} fragmentShader={routeFragment} transparent depthWrite={false} blending={AdditiveBlending} /></mesh>)}
        <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[endpoints,3]} /></bufferGeometry><shaderMaterial ref={hotspots} uniforms={hotUniforms} vertexShader={pointVertex} fragmentShader={pointFragment} transparent depthWrite={false} blending={AdditiveBlending} /></points>
        <points><bufferGeometry ref={particleGeometry}><bufferAttribute attach="attributes-position" args={[moving,3]} /></bufferGeometry><shaderMaterial ref={travelers} uniforms={travelUniforms} vertexShader={pointVertex} fragmentShader={pointFragment} transparent depthWrite={false} blending={AdditiveBlending} /></points>
      </group>
    </group>
  </>;
}

export default function CollaborationGlobe(props: Props) {
  const [lost,setLost] = useState(false);
  const [ready,setReady] = useState(false);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (!ready || !canvas.current) return;
    const element=canvas.current;
    const lose=()=>setLost(true);
    element.addEventListener("webglcontextlost",lose);
    return ()=>element.removeEventListener("webglcontextlost",lose);
  },[ready]);
  if(lost) return <div className="collaboration-fallback" />;
  return <div className={`collaboration-canvas${ready?" is-ready":""}`}>
    <Canvas camera={{position:[0,.3,4.8],fov:38}} dpr={[1,1.5]} frameloop={props.active&&!props.reduced?"always":"demand"} gl={{alpha:true,antialias:true,powerPreference:"low-power"}} fallback={null}
      onCreated={({gl})=>{canvas.current=gl.domElement;setReady(true);}}>
      <Scene {...props} />
    </Canvas>
  </div>;
}

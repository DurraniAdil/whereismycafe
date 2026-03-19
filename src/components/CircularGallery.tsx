import { useEffect, useRef } from 'react';
import {
    Camera,
    Mesh,
    Plane,
    Program,
    Renderer,
    Texture,
    Transform,
} from 'ogl';

/* ───────────────────────── UTIL ───────────────────────── */

function lerp(p1: number, p2: number, t: number) {
    return p1 + (p2 - p1) * t;
}

function debounce(func: Function, wait: number) {
    let timeout: number;
    return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = window.setTimeout(() => func(...args), wait);
    };
}

/* ───────────────────────── MEDIA (IMAGE PLANE) ───────────────────────── */

class Media {
    plane: Mesh;
    program: Program;
    x = 0;
    extra = 0;
    width = 0;
    widthTotal = 0;
    speed = 0;

    constructor({ gl, geometry, image, index, length, scene, borderRadius, text, textColor }: any) {
        const texture = new Texture(gl, {
            generateMipmaps: false,
        });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = image;
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            if (!ctx) return;
            canvas.width = 1024;
            canvas.height = 1024;

            // Draw image
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Draw text
            if (text) {
                ctx.fillStyle = textColor || '#ffffff';
                ctx.font = 'bold 80px sans-serif';
                ctx.textAlign = 'right';
                ctx.textBaseline = 'bottom';
                ctx.fillText(text, canvas.width - 40, canvas.height - 40);
            }

            texture.image = canvas;
        };

        this.program = new Program(gl, {
            vertex: `
                attribute vec3 position;
                attribute vec2 uv;
                uniform mat4 modelViewMatrix;
                uniform mat4 projectionMatrix;
                varying vec2 vUv;

                void main() {
                    vUv = uv;
                    vec3 p = position;
                    p.z = sin(p.x * 3.0) * 0.5;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
                }
            `,
            fragment: `
                precision highp float;
                varying vec2 vUv;
                uniform sampler2D tMap;
                uniform float uBorderRadius;

                float roundedRect(vec2 uv, vec2 size, float radius) {
                    vec2 d = abs(uv - 0.5) * size - (size - radius);
                    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - radius;
                }

                void main() {
                    vec4 tex = texture2D(tMap, vUv);
                    float d = roundedRect(vUv, vec2(1.0), uBorderRadius);
                    float alpha = 1.0 - smoothstep(0.0, 0.01, d);
                    gl_FragColor = vec4(tex.rgb, tex.a * alpha);
                }
            `,
            uniforms: {
                tMap: { value: texture },
                uBorderRadius: { value: borderRadius || 0 },
            },
            transparent: true,
        });

        this.plane = new Mesh(gl, { geometry, program: this.program });
        this.plane.setParent(scene);

        this.x = index * 2.5;
        this.widthTotal = length * 2.5;
    }

    update(scroll: { current: number; last: number }) {
        this.plane.position.x = this.x - scroll.current - this.extra;

        const x = this.plane.position.x;
        // const H = 5; // controls curvature width (user suggested variable but didn't use it in their code)

        // 🔥 curve math (this is what you were missing)
        const curve = Math.sin(x * 0.6) * 0.8;

        this.plane.position.y = curve;
        this.plane.rotation.z = -curve * 0.6;

        this.speed = scroll.current - scroll.last;

        // Infinite scroll logic
        if (this.plane.position.x < -this.widthTotal / 2) {
            this.extra -= this.widthTotal;
        } else if (this.plane.position.x > this.widthTotal / 2) {
            this.extra += this.widthTotal;
        }
    }
}

/* ───────────────────────── APP ───────────────────────── */

class App {
    container: HTMLElement;
    renderer: Renderer;
    gl: any;
    camera: Camera;
    scene: Transform;
    medias: Media[] = [];

    scroll = {
        current: 0,
        target: 0,
        last: 0,
        ease: 0.05,
        speed: 0.002,
    };

    bend = 0;
    raf = 0;

    constructor(container: HTMLElement, items: any[], options: any = {}) {
        this.container = container;

        this.renderer = new Renderer({ alpha: true, antialias: true });
        this.gl = this.renderer.gl;

        container.appendChild(this.gl.canvas);

        this.camera = new Camera(this.gl);
        this.camera.position.z = 8;

        this.scene = new Transform();

        this.scroll.ease = options.scrollEase || 0.05;
        this.scroll.speed = (options.scrollSpeed || 1) * 0.002;
        this.bend = options.bend || 0;

        const geometry = new Plane(this.gl);

        this.medias = items.map(
            (item, i) =>
                new Media({
                    gl: this.gl,
                    geometry,
                    image: item.image,
                    text: item.text,
                    index: i,
                    length: items.length,
                    scene: this.scene,
                    borderRadius: options.borderRadius || 0,
                    textColor: options.textColor,
                })
        );

        this.update();
        this.addEvents();
        this.onResize();
        window.addEventListener('resize', this.onResize);
    }

    onResize = () => {
        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;
        this.renderer.setSize(width, height);
        this.camera.perspective({
            aspect: this.gl.canvas.width / this.gl.canvas.height,
        });
    };

    addEvents() {
        window.addEventListener('wheel', (e) => {
            this.scroll.target += e.deltaY * 0.0008;
        });
    }

    update = () => {
        this.scroll.last = this.scroll.current;
        this.scroll.current = lerp(
            this.scroll.current,
            this.scroll.target,
            this.scroll.ease
        );

        this.medias.forEach((m) => m.update(this.scroll));

        this.renderer.render({
            scene: this.scene,
            camera: this.camera,
        });

        this.raf = requestAnimationFrame(this.update);
    };

    destroy() {
        cancelAnimationFrame(this.raf);
        window.removeEventListener('resize', this.onResize);
        this.container.innerHTML = '';
    }
}

/* ───────────────────────── REACT WRAPPER ───────────────────────── */

interface CircularGalleryProps {
    items: { image: string; text?: string }[];
    bend?: number;
    textColor?: string;
    borderRadius?: number;
    scrollSpeed?: number;
    scrollEase?: number;
}

export default function CircularGallery({
    items,
    bend = 1,
    textColor = '#ffffff',
    borderRadius = 0,
    scrollSpeed = 1,
    scrollEase = 0.05,
}: CircularGalleryProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const app = new App(ref.current, items, {
            bend,
            textColor,
            borderRadius,
            scrollSpeed,
            scrollEase,
        });

        return () => app.destroy();
    }, [items, bend, textColor, borderRadius, scrollSpeed, scrollEase]);

    return <div ref={ref} className="w-full h-full" />;
}
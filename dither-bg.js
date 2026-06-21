// Dither Background Effect (Vanilla Three.js implementation of the React Three Fiber version)

(function () {
    const waveVertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
    }
    `;

    const combinedFragmentShader = `
    precision highp float;
    uniform vec2 resolution;
    uniform float time;
    uniform float waveSpeed;
    uniform float waveFrequency;
    uniform float waveAmplitude;
    uniform vec3 waveColor;
    uniform vec2 mousePos;
    uniform int enableMouseInteraction;
    uniform float mouseRadius;
    uniform float colorNum;
    uniform float pixelSize;

    varying vec2 vUv;

    vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

    float cnoise(vec2 P) {
      vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
      vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
      Pi = mod289(Pi);
      vec4 ix = Pi.xzxz;
      vec4 iy = Pi.yyww;
      vec4 fx = Pf.xzxz;
      vec4 fy = Pf.yyww;
      vec4 i = permute(permute(ix) + iy);
      vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
      vec4 gy = abs(gx) - 0.5;
      vec4 tx = floor(gx + 0.5);
      gx = gx - tx;
      vec2 g00 = vec2(gx.x, gy.x);
      vec2 g10 = vec2(gx.y, gy.y);
      vec2 g01 = vec2(gx.z, gy.z);
      vec2 g11 = vec2(gx.w, gy.w);
      vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
      g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
      float n00 = dot(g00, vec2(fx.x, fy.x));
      float n10 = dot(g10, vec2(fx.y, fy.y));
      float n01 = dot(g01, vec2(fx.z, fy.z));
      float n11 = dot(g11, vec2(fx.w, fy.w));
      vec2 fade_xy = fade(Pf.xy);
      vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
      return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
    }

    const int OCTAVES = 4;
    float fbm(vec2 p) {
      float value = 0.0;
      float amp = 1.0;
      float freq = waveFrequency;
      for (int i = 0; i < OCTAVES; i++) {
        value += amp * abs(cnoise(p));
        p *= freq;
        amp *= waveAmplitude;
      }
      return value;
    }

    float pattern(vec2 p) {
      vec2 p2 = p - time * waveSpeed;
      return fbm(p + fbm(p2)); 
    }

    const float bayerMatrix8x8[64] = float[64](
      0.0/64.0, 48.0/64.0, 12.0/64.0, 60.0/64.0,  3.0/64.0, 51.0/64.0, 15.0/64.0, 63.0/64.0,
      32.0/64.0,16.0/64.0, 44.0/64.0, 28.0/64.0, 35.0/64.0,19.0/64.0, 47.0/64.0, 31.0/64.0,
      8.0/64.0, 56.0/64.0,  4.0/64.0, 52.0/64.0, 11.0/64.0,59.0/64.0,  7.0/64.0, 55.0/64.0,
      40.0/64.0,24.0/64.0, 36.0/64.0, 20.0/64.0, 43.0/64.0,27.0/64.0, 39.0/64.0, 23.0/64.0,
      2.0/64.0, 50.0/64.0, 14.0/64.0, 62.0/64.0,  1.0/64.0,49.0/64.0, 13.0/64.0, 61.0/64.0,
      34.0/64.0,18.0/64.0, 46.0/64.0, 30.0/64.0, 33.0/64.0,17.0/64.0, 45.0/64.0, 29.0/64.0,
      10.0/64.0,58.0/64.0,  6.0/64.0, 54.0/64.0,  9.0/64.0,57.0/64.0,  5.0/64.0, 53.0/64.0,
      42.0/64.0,26.0/64.0, 38.0/64.0, 22.0/64.0, 41.0/64.0,25.0/64.0, 37.0/64.0, 21.0/64.0
    );

    vec3 dither(vec2 coord, vec3 color) {
      vec2 scaledCoord = floor(coord / pixelSize);
      int x = int(mod(scaledCoord.x, 8.0));
      int y = int(mod(scaledCoord.y, 8.0));
      float threshold = bayerMatrix8x8[y * 8 + x] - 0.25;
      float step = 1.0 / (colorNum - 1.0);
      color += threshold * step;
      float bias = 0.2;
      color = clamp(color - bias, 0.0, 1.0);
      return floor(color * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);
    }

    void main() {
      vec2 fragCoord = gl_FragCoord.xy;
      
      // Calculate pixelated UV for the wave pattern to avoid sub-pixel rendering before dither
      vec2 normalizedPixelSize = pixelSize / resolution;
      vec2 uvPixel = normalizedPixelSize * floor((fragCoord / resolution) / normalizedPixelSize);
      
      vec2 uv = uvPixel - 0.5;
      uv.x *= resolution.x / resolution.y;
      
      float f = pattern(uv);
      if (enableMouseInteraction == 1) {
        vec2 mouseNDC = (mousePos / resolution - 0.5) * vec2(1.0, -1.0);
        mouseNDC.x *= resolution.x / resolution.y;
        float dist = length(uv - mouseNDC);
        float effect = 1.0 - smoothstep(0.0, mouseRadius, dist);
        f -= 0.5 * effect;
      }
      
      vec3 col = mix(vec3(0.0), waveColor, f);
      
      // Apply Dither directly to the computed color
      col = dither(fragCoord, col);
      
      gl_FragColor = vec4(col, 1.0);
    }
    `;

    document.addEventListener('DOMContentLoaded', () => {
        const canvas = document.getElementById('dither-canvas');
        if (!canvas) return;

        const container = canvas.parentElement;
        
        // Settings matching user's React component
        const config = {
            waveSpeed: 0.05,
            waveFrequency: 3,
            waveAmplitude: 0.3,
            waveColor: new THREE.Color(0.5, 0.5, 0.5),
            colorNum: 4,
            pixelSize: 2.0,
            enableMouseInteraction: 1,
            mouseRadius: 0.3
        };

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, preserveDrawingBuffer: true, antialias: false });
        renderer.setPixelRatio(1); // Force pixel ratio to 1 for correct dither scaling

        const scene = new THREE.Scene();
        // Use an Orthographic camera covering exactly -1 to 1 to render a fullscreen quad
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        const uniforms = {
            time: { value: 0 },
            resolution: { value: new THREE.Vector2(1, 1) },
            waveSpeed: { value: config.waveSpeed },
            waveFrequency: { value: config.waveFrequency },
            waveAmplitude: { value: config.waveAmplitude },
            waveColor: { value: config.waveColor },
            mousePos: { value: new THREE.Vector2(0, 0) },
            enableMouseInteraction: { value: config.enableMouseInteraction },
            mouseRadius: { value: config.mouseRadius },
            colorNum: { value: config.colorNum },
            pixelSize: { value: config.pixelSize }
        };

        const material = new THREE.ShaderMaterial({
            vertexShader: waveVertexShader,
            fragmentShader: combinedFragmentShader,
            uniforms: uniforms,
            transparent: true,
            depthWrite: false,
            depthTest: false
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        let width = container.clientWidth;
        let height = container.clientHeight;

        const resize = () => {
            width = container.clientWidth;
            height = container.clientHeight;
            renderer.setSize(width, height, false); // false to avoid overriding CSS width/height
            uniforms.resolution.value.set(width, height);
        };
        
        if (window.ResizeObserver) {
            new ResizeObserver(resize).observe(container);
        } else {
            window.addEventListener('resize', resize);
        }
        resize();

        // Mouse interaction
        const handlePointerMove = (e) => {
            if (!config.enableMouseInteraction) return;
            const rect = container.getBoundingClientRect();
            uniforms.mousePos.value.set(e.clientX - rect.left, e.clientY - rect.top);
        };
        container.addEventListener('mousemove', handlePointerMove);
        container.addEventListener('touchmove', (e) => handlePointerMove(e.touches[0]), { passive: true });

        // Animation loop
        const startTime = performance.now();
        const animate = () => {
            requestAnimationFrame(animate);
            // Only update time if the section is in view to save performance
            const rect = container.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
                uniforms.time.value = (performance.now() - startTime) * 0.001;
                renderer.render(scene, camera);
            }
        };
        
        animate();
    });
})();

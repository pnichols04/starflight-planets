// @ts-check

import * as THREE from 'three';

export class App {
  /**
   * The running instance of the application.
   * @type {App} */
  static _current;

  /**
   * Gets a reference to the running instance of the application.
   * @type {App} A reference to the running instance of the application.
   */
  static get current() {
    if (!App._current) {
      App._current = new App();
    }

    return App._current;
  }

  /**
   * @type {Map<string, THREE.Camera>} A dictionary of the cameras managed by the application.
   */
  _cameras;

  /**
   * @type {HTMLElement} The DOM element that hosts the 3D rendering context.
   */
  _canvas;

  /**
   * @type {THREE.WebGLRenderer} The WebGL renderer for the application.
   */
  _renderer;

  /**
   * @type {ResizeObserver} An observer of changes to the container's size.
   */
  _resizeObserver;

  /**
   * @type {Map<string, THREE.Scene>} The scenes managed by the application.
   */
  _scenes;

  /**
   * Initializes a new App instance.
   */
  constructor() {
    this._cameras = new Map();
    this._scenes = new Map();
  }

  /**
   * Initializes the application.
   * @param {string} canvasId
   */
  init(canvasId) {
    // Init scene

    const scene = new THREE.Scene();
    this._scenes.set('Main', scene);

    // Init camera

    const camera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      1,
      5000
    );
    camera.position.set(0, 0, 5);
    camera.userData['autoAspect'] = true;
    this._cameras.set('Main', camera);

    // Init renderer

    if (!canvasId) {
      throw new Error(
        '[App.init] A canvas for the renderer must be specified.'
      );
    }

    const canvas = document.getElementById(canvasId);
    this._canvas = canvas;
    this._renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    this._renderer.setSize(
      this._canvas.clientWidth,
      this._canvas.clientHeight
    );
    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.outputEncoding = THREE.sRGBEncoding;
    this._renderer.shadowMap.enabled = true;
    // this._container.appendChild(this._renderer.domElement);

    // Wire up window resize

    this._resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target.id === canvas.id && entry.contentBoxSize) {
          this.onContainerResize(entry.contentRect);
        }
      }
    });
    this._resizeObserver.observe(canvas);
  }

  /**
   * Manage container size changes.
   * @param {DOMRectReadOnly} rect The new size of the renderer container */
  onContainerResize(rect) {
    const width = rect.width;
    const height = rect.height;
    // eslint-disable-next-line no-unused-vars
    for (const [key, camera] of this._cameras.entries()) {
      // @ts-ignore
      if (camera.isPerspectiveCamera && camera.userData['autoAspect']) {
        // @ts-ignore
        camera.aspect = width / height;
        // @ts-ignore
        camera.updateProjectionMatrix();
      }
    }

    this._renderer.setSize(width, height);
    console.info(
      `[App.onContainerResize] Renderer resized to (${width}, ${height}).`
    );
  }

  /**
   * Gets a reference to the collection of cameras that the application manages.
   * @type {Map<string, THREE.Camera>} The cameras that the application manages.
   */
  get cameras() {
    return this._cameras;
  }

  /**
   * Gets a reference to the DOM element that hosts the 3D rendering context.
   * @type {HTMLElement} The DOM element that hosts the 3D rendering context.
   */
  get container() {
    return this._canvas;
  }

  /**
   * Gets a reference to the application's WebGLRenderer.
   * @type {THREE.WebGLRenderer} A reference to the application's WebGLRenderer.
   */
  get renderer() {
    return this._renderer;
  }

  /**
   * Gets a reference to the collection of scenes that the application manages.
   * @type {Map<string, THREE.Scene>} The cameras that the application manages.
   */
  get scenes() {
    return this._scenes;
  }
}

/**
 * The dock: a 0-1 number line drawn with PixiJS.
 *
 * The dock owns no maths. It is told which values to show and where a package
 * was dropped; the engine decides everything about correctness and progression.
 *
 * Zoom levels:
 *   0 - the whole 0 to 1 dock, pier posts at every tenth
 *   1 - one tenth wide, posts at every hundredth
 *   2 - one hundredth wide, posts at every thousandth
 * Labels reflow at each level, so 0.8 is written 0.80 next to 0.75.
 */

import { Application, Container, Graphics, Text } from 'pixi.js';
import {
  type Dec,
  type DisplayConfig,
  formatAtPlaces,
  fromThousandths,
} from '../engine/decimal.ts';

export const STAGE_WIDTH = 1280;
export const STAGE_HEIGHT = 720;

const DOCK_LEFT = 150;
const DOCK_RIGHT = 1130;
const DOCK_WIDTH = DOCK_RIGHT - DOCK_LEFT;
const DOCK_Y = 470;
const PACKAGE_Y = 322;
const CONVEYOR_Y = 250;

const COLOR_SKY = 0x0d2436;
const COLOR_WATER = 0x123c53;
const COLOR_DECK = 0xc8a06a;
const COLOR_DECK_DARK = 0x9b7746;
const COLOR_POST = 0x8b6a3f;
const COLOR_TEXT = 0xf4efe4;
const COLOR_PACKAGE = 0xe8b44a;
const COLOR_PACKAGE_DRAG = 0xf6cf7a;
const COLOR_ANCHOR = 0x7fd1c1;
const COLOR_ROBO = 0xe07a5f;
const COLOR_GHOST = 0x9fd3ff;
const COLOR_LAMP_OFF = 0x36536a;
const COLOR_LAMP_ON = 0xffd166;

/** The one font stack the game uses. No downloaded or third-party fonts. */
export const FONT_STACK =
  'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export type ZoomLevel = 0 | 1 | 2;

export interface DockPackage {
  readonly value: Dec;
  /** Current dock position in thousandths. */
  position: number;
  readonly kind: 'target' | 'anchor' | 'robo';
  readonly draggable: boolean;
}

export interface DockCallbacks {
  onDrop(thousandths: number): void;
}

interface Ghost {
  readonly at: number;
  readonly label: string;
}

const WINDOW_SIZE: Record<ZoomLevel, number> = { 0: 1000, 1: 100, 2: 10 };
const STEP_SIZE: Record<ZoomLevel, number> = { 0: 10, 1: 5, 2: 1 };
const LABEL_PLACES: Record<ZoomLevel, number> = { 0: 1, 1: 2, 2: 3 };

export class DockView {
  readonly app = new Application();

  private readonly world = new Container();
  private readonly layerDock = new Container();
  private readonly layerGhosts = new Container();
  private readonly layerPackages = new Container();
  private readonly layerLens = new Container();
  private readonly layerLamps = new Container();

  private level: ZoomLevel = 0;
  private viewLow = 0;
  private viewHigh = 1000;
  private targetLow = 0;
  private targetHigh = 1000;

  private display: DisplayConfig = { separator: '.' };

  private anchor?: DockPackage;
  private target?: DockPackage;
  private ghosts: Ghost[] = [];
  private compare?: { a: Dec; b: Dec; places: number };
  private lampsTotal = 0;
  private lampsLit = 0;
  private lensVisible = false;

  private dragging = false;
  private keyboardActive = false;
  /** A drop only counts once the learner has actually moved the package. */
  private moved = true;
  private requireMove = false;
  private callbacks: DockCallbacks = { onDrop: () => undefined };

  async init(parent: HTMLElement): Promise<void> {
    await this.app.init({
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      background: COLOR_SKY,
      antialias: true,
      resolution: Math.min(2, window.devicePixelRatio || 1),
      autoDensity: true,
    });
    this.app.canvas.setAttribute('role', 'img');
    this.app.canvas.setAttribute(
      'aria-label',
      'A harbour dock drawn as a number line from 0 to 1.',
    );
    parent.appendChild(this.app.canvas);
    this.world.addChild(
      this.layerDock,
      this.layerGhosts,
      this.layerPackages,
      this.layerLens,
      this.layerLamps,
    );
    this.app.stage.addChild(this.world);
    this.app.ticker.add(() => this.tick());
    this.attachPointer();
    this.redraw();
  }

  setCallbacks(callbacks: DockCallbacks): void {
    this.callbacks = callbacks;
  }

  setDisplay(display: DisplayConfig): void {
    this.display = display;
    this.redraw();
  }

  /* ------------------------------ geometry ----------------------------- */

  private xOf(thousandths: number): number {
    const span = this.viewHigh - this.viewLow || 1;
    return DOCK_LEFT + ((thousandths - this.viewLow) / span) * DOCK_WIDTH;
  }

  private valueAt(x: number): number {
    const span = this.viewHigh - this.viewLow;
    const raw = this.viewLow + ((x - DOCK_LEFT) / DOCK_WIDTH) * span;
    return Math.min(1000, Math.max(0, Math.round(raw)));
  }

  snap(thousandths: number): number {
    const step = STEP_SIZE[this.level];
    return Math.min(1000, Math.max(0, Math.round(thousandths / step) * step));
  }

  step(): number {
    return STEP_SIZE[this.level];
  }

  currentLevel(): ZoomLevel {
    return this.level;
  }

  /** Move the lens to a zoom level focused on a value. */
  setZoom(level: ZoomLevel, focusThousandths: number, animate = true): void {
    this.level = level;
    const size = WINDOW_SIZE[level];
    let low = Math.floor(focusThousandths / size) * size;
    low = Math.min(1000 - size, Math.max(0, low));
    this.targetLow = low;
    this.targetHigh = low + size;
    this.lensVisible = level > 0;
    if (!animate) {
      this.viewLow = this.targetLow;
      this.viewHigh = this.targetHigh;
    }
    this.redraw();
  }

  resetZoom(animate = true): void {
    this.setZoom(0, 500, animate);
  }

  private tick(): void {
    const ease = 0.18;
    const dLow = this.targetLow - this.viewLow;
    const dHigh = this.targetHigh - this.viewHigh;
    if (Math.abs(dLow) > 0.5 || Math.abs(dHigh) > 0.5) {
      this.viewLow += dLow * ease;
      this.viewHigh += dHigh * ease;
      this.redraw();
    } else if (this.viewLow !== this.targetLow || this.viewHigh !== this.targetHigh) {
      this.viewLow = this.targetLow;
      this.viewHigh = this.targetHigh;
      this.redraw();
    }
    if (this.bounce > 0) {
      this.bounce -= 1;
      this.redraw();
    }
  }

  /* ------------------------------- content ----------------------------- */

  showAnchor(value: Dec | undefined): void {
    this.anchor = value
      ? { value, position: value.t, kind: 'anchor', draggable: false }
      : undefined;
    this.redraw();
  }

  /** Put the draggable package on the conveyor, ready to be placed. */
  showTarget(
    value: Dec,
    startThousandths: number,
    kind: 'target' | 'robo' = 'target',
    requireMove = true,
  ): void {
    this.target = {
      value,
      position: this.snap(startThousandths),
      kind,
      draggable: true,
    };
    this.keyboardActive = false;
    this.requireMove = requireMove;
    this.moved = !requireMove;
    this.redraw();
  }

  /** True once the package has been moved away from where it arrived. */
  hasMoved(): boolean {
    return this.moved;
  }

  hideTarget(): void {
    this.target = undefined;
    this.redraw();
  }

  targetPosition(): number | undefined {
    return this.target?.position;
  }

  setTargetDraggable(draggable: boolean): void {
    if (this.target) {
      this.target = { ...this.target, draggable };
      this.redraw();
    }
  }

  setGhosts(ghosts: Ghost[]): void {
    this.ghosts = ghosts;
    this.redraw();
  }

  /** Feedback level 3: both packages rewritten to the same number of places. */
  setComparison(a: Dec, b: Dec, places: number): void {
    this.compare = { a, b, places };
    this.redraw();
  }

  clearComparison(): void {
    this.compare = undefined;
    this.redraw();
  }

  setLamps(total: number, lit: number): void {
    this.lampsTotal = total;
    this.lampsLit = lit;
    this.redraw();
  }

  private bounce = 0;

  playBounce(): void {
    this.bounce = 24;
  }

  clear(): void {
    this.anchor = undefined;
    this.target = undefined;
    this.ghosts = [];
    this.compare = undefined;
    this.redraw();
  }

  /* ------------------------------ input -------------------------------- */

  private attachPointer(): void {
    const stage = this.app.stage;
    stage.eventMode = 'static';
    stage.hitArea = { contains: () => true } as never;

    const localX = (globalX: number): number => {
      const rect = this.app.canvas.getBoundingClientRect();
      const scale = rect.width / STAGE_WIDTH || 1;
      return (globalX - rect.left) / scale;
    };

    this.app.canvas.addEventListener('pointerdown', (event) => {
      if (!this.target?.draggable) return;
      const x = localX(event.clientX);
      const packageX = this.xOf(this.target.position);
      if (Math.abs(x - packageX) > 90) return;
      this.dragging = true;
      this.keyboardActive = false;
      this.app.canvas.setPointerCapture(event.pointerId);
    });

    this.app.canvas.addEventListener('pointermove', (event) => {
      if (!this.dragging || !this.target) return;
      const next = this.snap(this.valueAt(localX(event.clientX)));
      if (next !== this.target.position) this.moved = true;
      this.target.position = next;
      this.redraw();
    });

    const finish = (event: PointerEvent) => {
      if (!this.dragging || !this.target) return;
      this.dragging = false;
      try {
        this.app.canvas.releasePointerCapture(event.pointerId);
      } catch {
        /* capture may already be gone */
      }
      if (this.requireMove && !this.moved) return;
      this.callbacks.onDrop(this.target.position);
    };
    this.app.canvas.addEventListener('pointerup', finish);
    this.app.canvas.addEventListener('pointercancel', finish);
  }

  /**
   * Keyboard alternative to dragging: arrow keys move the package, Enter drops.
   * Returns true when the key was used by the dock.
   */
  handleKey(event: KeyboardEvent): boolean {
    if (!this.target?.draggable) return false;
    const big = event.shiftKey ? 10 : 1;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      const direction = event.key === 'ArrowLeft' ? -1 : 1;
      this.keyboardActive = true;
      const next = this.snap(this.target.position + direction * this.step() * big);
      if (next !== this.target.position) this.moved = true;
      this.target.position = next;
      this.redraw();
      return true;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      if (this.requireMove && !this.moved) return true;
      this.callbacks.onDrop(this.target.position);
      return true;
    }
    return false;
  }

  /* ------------------------------- drawing ----------------------------- */

  private label(value: Dec, places?: number): string {
    const want = places ?? Math.max(value.places, LABEL_PLACES[this.level]);
    try {
      return formatAtPlaces(value, want, this.display);
    } catch {
      return formatAtPlaces(value, value.places, this.display);
    }
  }

  private redraw(): void {
    this.drawDock();
    this.drawGhosts();
    this.drawPackages();
    this.drawLens();
    this.drawLamps();
  }

  private text(content: string, x: number, y: number, size: number, color: number): Text {
    const label = new Text({
      text: content,
      style: { fontFamily: FONT_STACK, fontSize: size, fill: color, align: 'center' },
    });
    label.anchor.set(0.5, 0.5);
    label.x = x;
    label.y = y;
    return label;
  }

  private drawDock(): void {
    this.layerDock.removeChildren();
    const g = new Graphics();
    g.rect(0, 300, STAGE_WIDTH, STAGE_HEIGHT - 300).fill(COLOR_WATER);
    g.rect(DOCK_LEFT - 40, DOCK_Y - 16, DOCK_WIDTH + 80, 30).fill(COLOR_DECK);
    g.rect(DOCK_LEFT - 40, DOCK_Y + 12, DOCK_WIDTH + 80, 8).fill(COLOR_DECK_DARK);
    // Conveyor rail the package arrives on.
    g.rect(DOCK_LEFT - 40, CONVEYOR_Y + 40, DOCK_WIDTH + 80, 6).fill(0x2a4a60);
    this.layerDock.addChild(g);

    const span = this.viewHigh - this.viewLow;
    const step = span >= 1000 ? 100 : span >= 100 ? 10 : 1;
    const first = Math.ceil(this.viewLow / step) * step;
    for (let t = first; t <= this.viewHigh + 0.001; t += step) {
      const x = this.xOf(t);
      if (x < DOCK_LEFT - 30 || x > DOCK_RIGHT + 30) continue;
      const post = new Graphics();
      post.rect(x - 4, DOCK_Y - 16, 8, 52).fill(COLOR_POST);
      post.circle(x, DOCK_Y - 22, 7).fill(COLOR_DECK);
      this.layerDock.addChild(post);
      const places = span >= 1000 ? 1 : span >= 100 ? 2 : 3;
      this.layerDock.addChild(
        this.text(
          formatAtPlaces(fromThousandths(Math.round(t)), places, this.display),
          x,
          DOCK_Y + 62,
          span >= 1000 ? 17 : 19,
          COLOR_TEXT,
        ),
      );
    }
  }

  private drawGhosts(): void {
    this.layerGhosts.removeChildren();
    for (const ghost of this.ghosts) {
      const x = this.xOf(ghost.at);
      if (x < DOCK_LEFT - 60 || x > DOCK_RIGHT + 60) continue;
      const g = new Graphics();
      g.moveTo(x, DOCK_Y - 130).lineTo(x, DOCK_Y - 10).stroke({
        width: 3,
        color: COLOR_GHOST,
        alpha: 0.85,
      });
      g.roundRect(x - 54, DOCK_Y - 172, 108, 46, 10).fill({
        color: COLOR_GHOST,
        alpha: 0.22,
      });
      this.layerGhosts.addChild(g);
      this.layerGhosts.addChild(
        this.text(ghost.label, x, DOCK_Y - 149, 22, COLOR_GHOST),
      );
    }
  }

  private drawPackages(): void {
    this.layerPackages.removeChildren();
    if (this.anchor) this.drawPackage(this.anchor, DOCK_Y - 48, COLOR_ANCHOR, true);
    if (this.compare) {
      const { a, b, places } = this.compare;
      this.layerPackages.addChild(
        this.text(
          `${this.label(a, places)}   and   ${this.label(b, places)}`,
          STAGE_WIDTH / 2,
          CONVEYOR_Y - 60,
          34,
          COLOR_TEXT,
        ),
      );
    }
    if (this.target) {
      const dragging = this.dragging || this.keyboardActive;
      const y = dragging ? PACKAGE_Y : PACKAGE_Y;
      const colour =
        this.target.kind === 'robo'
          ? COLOR_ROBO
          : dragging
            ? COLOR_PACKAGE_DRAG
            : COLOR_PACKAGE;
      const wobble = this.bounce > 0 ? Math.sin(this.bounce * 0.9) * 10 : 0;
      this.drawPackage(this.target, y + wobble, colour, true);
    }
  }

  private drawPackage(
    pack: DockPackage,
    y: number,
    colour: number,
    showGuide = false,
  ): void {
    const x = this.xOf(pack.position);
    if (x < DOCK_LEFT - 10 || x > DOCK_RIGHT + 10) {
      this.drawOffViewChip(pack, y, colour, x < DOCK_LEFT);
      return;
    }
    const clampedX = Math.min(DOCK_RIGHT + 40, Math.max(DOCK_LEFT - 40, x));
    const g = new Graphics();
    if (showGuide) {
      g.moveTo(clampedX, y + 26).lineTo(clampedX, DOCK_Y - 16).stroke({
        width: 3,
        color: colour,
        alpha: 0.7,
      });
    }
    g.roundRect(clampedX - 62, y - 27, 124, 54, 12).fill(colour);
    g.roundRect(clampedX - 62, y - 27, 124, 54, 12).stroke({
      width: 3,
      color: 0x00000033,
    });
    // Parcel tape, drawn clear of the label.
    g.moveTo(clampedX - 62, y + 19).lineTo(clampedX + 62, y + 19).stroke({
      width: 2,
      color: 0x00000022,
    });
    this.layerPackages.addChild(g);
    this.layerPackages.addChild(
      this.text(this.label(pack.value), clampedX, y, 26, 0x1b2b36),
    );
  }

  /**
   * A package outside the zoomed window is drawn as a small chip at the edge
   * with an arrow, so it never looks as though it sits at the edge value.
   */
  private drawOffViewChip(
    pack: DockPackage,
    y: number,
    colour: number,
    onLeft: boolean,
  ): void {
    const x = onLeft ? DOCK_LEFT - 14 : DOCK_RIGHT + 14;
    const g = new Graphics();
    g.roundRect(x - 46, y - 18, 92, 36, 9).fill({ color: colour, alpha: 0.55 });
    this.layerPackages.addChild(g);
    this.layerPackages.addChild(
      this.text(
        `${onLeft ? '<' : ''} ${this.label(pack.value)} ${onLeft ? '' : '>'}`.trim(),
        x,
        y,
        19,
        0x11212c,
      ),
    );
    this.layerPackages.addChild(
      this.text('off this view', x, y + 28, 13, 0x8fa9bd),
    );
  }

  private drawLens(): void {
    this.layerLens.removeChildren();
    if (!this.lensVisible) return;
    const g = new Graphics();
    g.roundRect(DOCK_LEFT - 46, DOCK_Y - 210, DOCK_WIDTH + 92, 300, 24).stroke({
      width: 6,
      color: 0xd9b26a,
      alpha: 0.9,
    });
    this.layerLens.addChild(g);
    this.layerLens.addChild(
      this.text(
        this.level === 1 ? 'zoomed to tenths' : 'zoomed to hundredths',
        DOCK_LEFT + 96,
        DOCK_Y - 226,
        18,
        0xd9b26a,
      ),
    );
  }

  private drawLamps(): void {
    this.layerLamps.removeChildren();
    if (this.lampsTotal <= 0) return;
    const spacing = 34;
    const startX = STAGE_WIDTH / 2 - ((this.lampsTotal - 1) * spacing) / 2;
    for (let i = 0; i < this.lampsTotal; i += 1) {
      const g = new Graphics();
      const lit = i < this.lampsLit;
      g.circle(startX + i * spacing, 72, 11).fill(lit ? COLOR_LAMP_ON : COLOR_LAMP_OFF);
      if (lit) {
        g.circle(startX + i * spacing, 72, 17).stroke({
          width: 2,
          color: COLOR_LAMP_ON,
          alpha: 0.4,
        });
      }
      this.layerLamps.addChild(g);
    }
    this.layerLamps.addChild(
      this.text('pier lamps', STAGE_WIDTH / 2, 38, 15, 0x8fa9bd),
    );
  }
}

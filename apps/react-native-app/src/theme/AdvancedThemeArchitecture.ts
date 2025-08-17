/**
 * Advanced Theme Architecture
 *
 * Advanced theming architecture with inheritance and composition
 * using the Composite design pattern for maximum reusability and maintainability.
 */

// MARK: - Theme Component Interface

/**
 * Interface defining the contract for all theme components
 * This enables the Composite pattern where components can be composed together
 */
export interface ThemeComponent {
  /**
   * Resolves a theme value for a given key
   * @param key The theme key to resolve
   * @returns The resolved value or undefined if not found
   */
  getValue(key: ThemeKey): any;

  /**
   * Gets all available keys in this component
   * @returns Array of available theme keys
   */
  getAvailableKeys(): ThemeKey[];

  /**
   * Merges this component with another component
   * @param other The component to merge with
   * @returns A new merged component
   */
  merge(other: ThemeComponent): ThemeComponent;
}

// MARK: - Theme Key System

/**
 * Enumeration of all possible theme keys for type-safe access
 */
export enum ThemeKey {
  // Color keys
  PRIMARY_COLOR = 'primaryColor',
  SECONDARY_COLOR = 'secondaryColor',
  TERTIARY_COLOR = 'tertiaryColor',
  BACKGROUND_COLOR = 'backgroundColor',
  SURFACE_COLOR = 'surfaceColor',
  TEXT_COLOR = 'textColor',
  SUCCESS_COLOR = 'successColor',
  WARNING_COLOR = 'warningColor',
  ERROR_COLOR = 'errorColor',

  // Typography keys
  PRIMARY_FONT = 'primaryFont',
  BODY_FONT = 'bodyFont',
  HEADING_FONT = 'headingFont',
  FONT_SIZE = 'fontSize',
  FONT_WEIGHT = 'fontWeight',
  LINE_HEIGHT = 'lineHeight',
  LETTER_SPACING = 'letterSpacing',

  // Layout keys
  SPACING = 'spacing',
  PADDING = 'padding',
  MARGIN = 'margin',
  BORDER_RADIUS = 'borderRadius',
  GRID_COLUMNS = 'gridColumns',
  GRID_GUTTER = 'gridGutter',

  // Shadow keys
  SHADOW_RADIUS = 'shadowRadius',
  SHADOW_OFFSET = 'shadowOffset',
  SHADOW_OPACITY = 'shadowOpacity',
  SHADOW_COLOR = 'shadowColor',

  // Animation keys
  ANIMATION_DURATION = 'animationDuration',
  ANIMATION_EASING = 'animationEasing',
  SPRING_RESPONSE = 'springResponse',
  SPRING_DAMPING = 'springDamping',

  // Accessibility keys
  HIGH_CONTRAST = 'highContrast',
  REDUCED_MOTION = 'reducedMotion',
  DYNAMIC_TYPE = 'dynamicType',
}

export enum ThemeKeyCategory {
  COLORS = 'Colors',
  TYPOGRAPHY = 'Typography',
  LAYOUT = 'Layout',
  SHADOWS = 'Shadows',
  ANIMATIONS = 'Animations',
  ACCESSIBILITY = 'Accessibility',
}

/**
 * Gets the category for a theme key
 */
export function getThemeKeyCategory(key: ThemeKey): ThemeKeyCategory {
  switch (key) {
    case ThemeKey.PRIMARY_COLOR:
    case ThemeKey.SECONDARY_COLOR:
    case ThemeKey.TERTIARY_COLOR:
    case ThemeKey.BACKGROUND_COLOR:
    case ThemeKey.SURFACE_COLOR:
    case ThemeKey.TEXT_COLOR:
    case ThemeKey.SUCCESS_COLOR:
    case ThemeKey.WARNING_COLOR:
    case ThemeKey.ERROR_COLOR:
      return ThemeKeyCategory.COLORS;

    case ThemeKey.PRIMARY_FONT:
    case ThemeKey.BODY_FONT:
    case ThemeKey.HEADING_FONT:
    case ThemeKey.FONT_SIZE:
    case ThemeKey.FONT_WEIGHT:
    case ThemeKey.LINE_HEIGHT:
    case ThemeKey.LETTER_SPACING:
      return ThemeKeyCategory.TYPOGRAPHY;

    case ThemeKey.SPACING:
    case ThemeKey.PADDING:
    case ThemeKey.MARGIN:
    case ThemeKey.BORDER_RADIUS:
    case ThemeKey.GRID_COLUMNS:
    case ThemeKey.GRID_GUTTER:
      return ThemeKeyCategory.LAYOUT;

    case ThemeKey.SHADOW_RADIUS:
    case ThemeKey.SHADOW_OFFSET:
    case ThemeKey.SHADOW_OPACITY:
    case ThemeKey.SHADOW_COLOR:
      return ThemeKeyCategory.SHADOWS;

    case ThemeKey.ANIMATION_DURATION:
    case ThemeKey.ANIMATION_EASING:
    case ThemeKey.SPRING_RESPONSE:
    case ThemeKey.SPRING_DAMPING:
      return ThemeKeyCategory.ANIMATIONS;

    case ThemeKey.HIGH_CONTRAST:
    case ThemeKey.REDUCED_MOTION:
    case ThemeKey.DYNAMIC_TYPE:
      return ThemeKeyCategory.ACCESSIBILITY;
  }
}

// MARK: - Resolution Support Interfaces

/**
 * Represents a step in the resolution path for debugging and analysis
 */
export interface ResolutionStep {
  theme: CompositeTheme;
  component: ThemeComponent;
  key: ThemeKey;
  value: any;
  found: boolean;
}

/**
 * Statistics about component coverage in a theme
 */
export interface ComponentCoverage {
  totalKeys: number;
  totalPossibleKeys: number;
  coverageByCategory: Record<ThemeKeyCategory, number>;
  inheritanceDepth: number;
}

// MARK: - Leaf Components

/**
 * Concrete color palette component holding color values
 */
export class ColorPaletteComponent implements ThemeComponent {
  private colors: Map<ThemeKey, string> = new Map();

  constructor(colors: Record<string, string> = {}) {
    Object.entries(colors).forEach(([key, value]) => {
      this.colors.set(key as ThemeKey, value);
    });
  }

  getValue(key: ThemeKey): any {
    return this.colors.get(key);
  }

  getAvailableKeys(): ThemeKey[] {
    return Array.from(this.colors.keys());
  }

  merge(other: ThemeComponent): ThemeComponent {
    if (other instanceof ColorPaletteComponent) {
      const mergedColors = new Map(this.colors);
      other.colors.forEach((value, key) => {
        mergedColors.set(key, value);
      });
      return new ColorPaletteComponent(Object.fromEntries(mergedColors));
    }
    return this;
  }

  /**
   * Sets a color value for a specific key
   */
  setColor(color: string, key: ThemeKey): void {
    this.colors.set(key, color);
  }

  /**
   * Gets a color value for a specific key
   */
  getColor(key: ThemeKey): string | undefined {
    return this.colors.get(key);
  }
}

/**
 * Concrete typography component holding font and text styling values
 */
export class TypographyComponent implements ThemeComponent {
  private typography: Map<ThemeKey, any> = new Map();

  constructor(typography: Record<string, any> = {}) {
    Object.entries(typography).forEach(([key, value]) => {
      this.typography.set(key as ThemeKey, value);
    });
  }

  getValue(key: ThemeKey): any {
    return this.typography.get(key);
  }

  getAvailableKeys(): ThemeKey[] {
    return Array.from(this.typography.keys());
  }

  merge(other: ThemeComponent): ThemeComponent {
    if (other instanceof TypographyComponent) {
      const mergedTypography = new Map(this.typography);
      other.typography.forEach((value, key) => {
        mergedTypography.set(key, value);
      });
      return new TypographyComponent(Object.fromEntries(mergedTypography));
    }
    return this;
  }

  /**
   * Sets a typography value for a specific key
   */
  setValue(value: any, key: ThemeKey): void {
    this.typography.set(key, value);
  }

  /**
   * Gets a typography value for a specific key
   */
  getValueForKey(key: ThemeKey): any {
    return this.typography.get(key);
  }
}

/**
 * Concrete layout metrics component holding spacing and layout values
 */
export class LayoutMetricsComponent implements ThemeComponent {
  private metrics: Map<ThemeKey, number> = new Map();

  constructor(metrics: Record<string, number> = {}) {
    Object.entries(metrics).forEach(([key, value]) => {
      this.metrics.set(key as ThemeKey, value);
    });
  }

  getValue(key: ThemeKey): any {
    return this.metrics.get(key);
  }

  getAvailableKeys(): ThemeKey[] {
    return Array.from(this.metrics.keys());
  }

  merge(other: ThemeComponent): ThemeComponent {
    if (other instanceof LayoutMetricsComponent) {
      const mergedMetrics = new Map(this.metrics);
      other.metrics.forEach((value, key) => {
        mergedMetrics.set(key, value);
      });
      return new LayoutMetricsComponent(Object.fromEntries(mergedMetrics));
    }
    return this;
  }

  /**
   * Sets a metric value for a specific key
   */
  setMetric(value: number, key: ThemeKey): void {
    this.metrics.set(key, value);
  }

  /**
   * Gets a metric value for a specific key
   */
  getMetric(key: ThemeKey): number | undefined {
    return this.metrics.get(key);
  }
}

/**
 * Concrete shadow component holding shadow configuration values
 */
export class ShadowComponent implements ThemeComponent {
  private shadows: Map<ThemeKey, any> = new Map();

  constructor(shadows: Record<string, any> = {}) {
    Object.entries(shadows).forEach(([key, value]) => {
      this.shadows.set(key as ThemeKey, value);
    });
  }

  getValue(key: ThemeKey): any {
    return this.shadows.get(key);
  }

  getAvailableKeys(): ThemeKey[] {
    return Array.from(this.shadows.keys());
  }

  merge(other: ThemeComponent): ThemeComponent {
    if (other instanceof ShadowComponent) {
      const mergedShadows = new Map(this.shadows);
      other.shadows.forEach((value, key) => {
        mergedShadows.set(key, value);
      });
      return new ShadowComponent(Object.fromEntries(mergedShadows));
    }
    return this;
  }

  /**
   * Sets a shadow value for a specific key
   */
  setShadow(value: any, key: ThemeKey): void {
    this.shadows.set(key, value);
  }

  /**
   * Gets a shadow value for a specific key
   */
  getShadow(key: ThemeKey): any {
    return this.shadows.get(key);
  }
}

/**
 * Concrete animation component holding animation configuration values
 */
export class AnimationComponent implements ThemeComponent {
  private animations: Map<ThemeKey, any> = new Map();

  constructor(animations: Record<string, any> = {}) {
    Object.entries(animations).forEach(([key, value]) => {
      this.animations.set(key as ThemeKey, value);
    });
  }

  getValue(key: ThemeKey): any {
    return this.animations.get(key);
  }

  getAvailableKeys(): ThemeKey[] {
    return Array.from(this.animations.keys());
  }

  merge(other: ThemeComponent): ThemeComponent {
    if (other instanceof AnimationComponent) {
      const mergedAnimations = new Map(this.animations);
      other.animations.forEach((value, key) => {
        mergedAnimations.set(key, value);
      });
      return new AnimationComponent(Object.fromEntries(mergedAnimations));
    }
    return this;
  }

  /**
   * Sets an animation value for a specific key
   */
  setAnimation(value: any, key: ThemeKey): void {
    this.animations.set(key, value);
  }

  /**
   * Gets an animation value for a specific key
   */
  getAnimation(key: ThemeKey): any {
    return this.animations.get(key);
  }
}

/**
 * Concrete accessibility component holding accessibility configuration values
 */
export class AccessibilityComponent implements ThemeComponent {
  private accessibility: Map<ThemeKey, boolean> = new Map();

  constructor(accessibility: Record<string, boolean> = {}) {
    Object.entries(accessibility).forEach(([key, value]) => {
      this.accessibility.set(key as ThemeKey, value);
    });
  }

  getValue(key: ThemeKey): any {
    return this.accessibility.get(key);
  }

  getAvailableKeys(): ThemeKey[] {
    return Array.from(this.accessibility.keys());
  }

  merge(other: ThemeComponent): ThemeComponent {
    if (other instanceof AccessibilityComponent) {
      const mergedAccessibility = new Map(this.accessibility);
      other.accessibility.forEach((value, key) => {
        mergedAccessibility.set(key, value);
      });
      return new AccessibilityComponent(Object.fromEntries(mergedAccessibility));
    }
    return this;
  }

  /**
   * Sets an accessibility value for a specific key
   */
  setAccessibility(value: boolean, key: ThemeKey): void {
    this.accessibility.set(key, value);
  }

  /**
   * Gets an accessibility value for a specific key
   */
  getAccessibility(key: ThemeKey): boolean | undefined {
    return this.accessibility.get(key);
  }
}

// MARK: - Composite Theme

/**
 * Composite theme class that holds multiple components and supports inheritance
 */
export class CompositeTheme implements ThemeComponent {
  private components: ThemeComponent[] = [];
  private parentTheme?: CompositeTheme;

  constructor(components: ThemeComponent[] = [], parentTheme?: CompositeTheme) {
    this.components = components;
    this.parentTheme = parentTheme;
  }

  getValue(key: ThemeKey): any {
    // First, try to find the value in our own components
    for (const component of this.components) {
      const value = component.getValue(key);
      if (value !== undefined) {
        return value;
      }
    }

    // If not found, delegate to parent theme (inheritance)
    return this.parentTheme?.getValue(key);
  }

  getAvailableKeys(): ThemeKey[] {
    const keys = new Set<ThemeKey>();

    // Add keys from our components
    for (const component of this.components) {
      component.getAvailableKeys().forEach(key => keys.add(key));
    }

    // Add keys from parent theme
    if (this.parentTheme) {
      this.parentTheme.getAvailableKeys().forEach(key => keys.add(key));
    }

    return Array.from(keys);
  }

  merge(other: ThemeComponent): ThemeComponent {
    if (other instanceof CompositeTheme) {
      // Merge components
      const mergedComponents = [...this.components, ...other.components];

      // Create new composite with merged components
      return new CompositeTheme(mergedComponents, this.parentTheme);
    } else {
      // Add the other component to our list
      const newComponents = [...this.components, other];
      return new CompositeTheme(newComponents, this.parentTheme);
    }
  }

  /**
   * Adds a component to this theme
   */
  addComponent(component: ThemeComponent): void {
    this.components.push(component);
  }

  /**
   * Removes a component from this theme
   */
  removeComponent(component: ThemeComponent): void {
    const index = this.components.indexOf(component);
    if (index > -1) {
      this.components.splice(index, 1);
    }
  }

  /**
   * Sets the parent theme for inheritance
   */
  setParentTheme(parent: CompositeTheme | undefined): void {
    this.parentTheme = parent;
  }

  /**
   * Gets the parent theme
   */
  getParentTheme(): CompositeTheme | undefined {
    return this.parentTheme;
  }

  /**
   * Gets all components in this theme
   */
  getComponents(): ThemeComponent[] {
    return [...this.components];
  }

  /**
   * Creates a child theme that inherits from this theme
   */
  createChildTheme(components: ThemeComponent[] = []): CompositeTheme {
    return new CompositeTheme(components, this);
  }

  /**
   * Resolves a value with full inheritance chain using recursive resolution
   */
  resolveValue(key: ThemeKey): any {
    return this.resolveValueRecursively(key, new Set<string>());
  }

  /**
   * Recursive resolution with cycle detection
   */
  private resolveValueRecursively(key: ThemeKey, visitedThemes: Set<string>): any {
    const themeId = this.toString();

    // Check for cycles in inheritance chain
    if (visitedThemes.has(themeId)) {
      console.warn(`⚠️ Cycle detected in theme inheritance chain for key: ${key}`);
      return undefined;
    }

    const newVisitedThemes = new Set(visitedThemes);
    newVisitedThemes.add(themeId);

    // First, try to find the value in our own components
    for (const component of this.components) {
      const value = component.getValue(key);
      if (value !== undefined) {
        return value;
      }
    }

    // If not found, recursively delegate to parent theme
    return this.parentTheme?.resolveValueRecursively(key, newVisitedThemes);
  }

  /**
   * Gets all available keys including inherited ones with cycle detection
   */
  getAllAvailableKeys(): ThemeKey[] {
    return this.getAllAvailableKeysRecursively(new Set<string>());
  }

  /**
   * Recursive key collection with cycle detection
   */
  private getAllAvailableKeysRecursively(visitedThemes: Set<string>): ThemeKey[] {
    const themeId = this.toString();

    // Check for cycles in inheritance chain
    if (visitedThemes.has(themeId)) {
      console.warn('⚠️ Cycle detected in theme inheritance chain during key collection');
      return [];
    }

    const newVisitedThemes = new Set(visitedThemes);
    newVisitedThemes.add(themeId);

    const keys = new Set<ThemeKey>();

    // Add keys from our components
    this.getAvailableKeys().forEach(key => keys.add(key));

    // Add keys from parent theme recursively
    if (this.parentTheme) {
      this.parentTheme.getAllAvailableKeysRecursively(newVisitedThemes).forEach(key => keys.add(key));
    }

    return Array.from(keys);
  }

  /**
   * Gets the inheritance chain for debugging and analysis
   */
  getInheritanceChain(): CompositeTheme[] {
    return this.getInheritanceChainRecursively(new Set<string>());
  }

  /**
   * Recursive inheritance chain collection with cycle detection
   */
  private getInheritanceChainRecursively(visitedThemes: Set<string>): CompositeTheme[] {
    const themeId = this.toString();

    // Check for cycles in inheritance chain
    if (visitedThemes.has(themeId)) {
      console.warn('⚠️ Cycle detected in theme inheritance chain during chain collection');
      return [];
    }

    const newVisitedThemes = new Set(visitedThemes);
    newVisitedThemes.add(themeId);

    const chain: CompositeTheme[] = [this];

    // Add parent theme to chain recursively
    if (this.parentTheme) {
      const parentChain = this.parentTheme.getInheritanceChainRecursively(newVisitedThemes);
      for (const theme of parentChain) {
        chain.push(theme);
      }
    }

    return chain;
  }

  /**
   * Gets the resolution path for a specific key (for debugging)
   */
  getResolutionPath(key: ThemeKey): ResolutionStep[] {
    return this.getResolutionPathRecursively(key, new Set<string>(), []);
  }

  /**
   * Recursive resolution path collection with cycle detection
   */
  private getResolutionPathRecursively(key: ThemeKey, visitedThemes: Set<string>, currentPath: ResolutionStep[]): ResolutionStep[] {
    const themeId = this.toString();

    // Check for cycles in inheritance chain
    if (visitedThemes.has(themeId)) {
      console.warn('⚠️ Cycle detected in theme inheritance chain during path resolution');
      return currentPath;
    }

    const newVisitedThemes = new Set(visitedThemes);
    newVisitedThemes.add(themeId);

    const path = [...currentPath];

    // Check each component in this theme
    for (const component of this.components) {
      const value = component.getValue(key);
      if (value !== undefined) {
        path.push({
          theme: this,
          component,
          key,
          value,
          found: true
        });
        return path;
      } else {
        path.push({
          theme: this,
          component,
          key,
          value: undefined,
          found: false
        });
      }
    }

    // If not found in this theme, continue with parent
    if (this.parentTheme) {
      return this.parentTheme.getResolutionPathRecursively(key, newVisitedThemes, path);
    }

    return path;
  }

  /**
   * Gets component coverage statistics for this theme
   */
  getComponentCoverage(): ComponentCoverage {
    const allKeys = Object.values(ThemeKey);
    const coverage: Record<ThemeKeyCategory, number> = {} as Record<ThemeKeyCategory, number>;
    let totalKeys = 0;

    for (const key of allKeys) {
      if (this.resolveValue(key) !== undefined) {
        const category = getThemeKeyCategory(key);
        coverage[category] = (coverage[category] || 0) + 1;
        totalKeys += 1;
      }
    }

    return {
      totalKeys,
      totalPossibleKeys: allKeys.length,
      coverageByCategory: coverage,
      inheritanceDepth: this.getInheritanceChain().length - 1
    };
  }
}

// MARK: - Theme Factory

/**
 * Factory class for creating common theme configurations
 */
export class ThemeFactory {

  /**
   * Creates a default light theme
   */
  static createDefaultLightTheme(): CompositeTheme {
    const colors = new ColorPaletteComponent({
      [ThemeKey.PRIMARY_COLOR]: '#007AFF',
      [ThemeKey.SECONDARY_COLOR]: '#FF9500',
      [ThemeKey.BACKGROUND_COLOR]: '#FFFFFF',
      [ThemeKey.TEXT_COLOR]: '#000000',
      [ThemeKey.SUCCESS_COLOR]: '#34C759',
      [ThemeKey.WARNING_COLOR]: '#FFCC02',
      [ThemeKey.ERROR_COLOR]: '#FF3B30'
    });

    const typography = new TypographyComponent({
      [ThemeKey.PRIMARY_FONT]: 'SF Pro Display',
      [ThemeKey.BODY_FONT]: 'SF Pro Text',
      [ThemeKey.FONT_SIZE]: 16,
      [ThemeKey.FONT_WEIGHT]: 'Regular'
    });

    const layout = new LayoutMetricsComponent({
      [ThemeKey.SPACING]: 8,
      [ThemeKey.PADDING]: 16,
      [ThemeKey.BORDER_RADIUS]: 8
    });

    return new CompositeTheme([colors, typography, layout]);
  }

  /**
   * Creates a default dark theme
   */
  static createDefaultDarkTheme(): CompositeTheme {
    const colors = new ColorPaletteComponent({
      [ThemeKey.PRIMARY_COLOR]: '#0A84FF',
      [ThemeKey.SECONDARY_COLOR]: '#FF9F0A',
      [ThemeKey.BACKGROUND_COLOR]: '#000000',
      [ThemeKey.TEXT_COLOR]: '#FFFFFF',
      [ThemeKey.SUCCESS_COLOR]: '#30D158',
      [ThemeKey.WARNING_COLOR]: '#FFD60A',
      [ThemeKey.ERROR_COLOR]: '#FF453A'
    });

    const typography = new TypographyComponent({
      [ThemeKey.PRIMARY_FONT]: 'SF Pro Display',
      [ThemeKey.BODY_FONT]: 'SF Pro Text',
      [ThemeKey.FONT_SIZE]: 16,
      [ThemeKey.FONT_WEIGHT]: 'Regular'
    });

    const layout = new LayoutMetricsComponent({
      [ThemeKey.SPACING]: 8,
      [ThemeKey.PADDING]: 16,
      [ThemeKey.BORDER_RADIUS]: 8
    });

    return new CompositeTheme([colors, typography, layout]);
  }

  /**
   * Creates a corporate theme
   */
  static createCorporateTheme(): CompositeTheme {
    const colors = new ColorPaletteComponent({
      [ThemeKey.PRIMARY_COLOR]: '#1A365D',
      [ThemeKey.SECONDARY_COLOR]: '#CCCCCC',
      [ThemeKey.BACKGROUND_COLOR]: '#FFFFFF',
      [ThemeKey.TEXT_COLOR]: '#333333'
    });

    const typography = new TypographyComponent({
      [ThemeKey.PRIMARY_FONT]: 'Helvetica Neue',
      [ThemeKey.BODY_FONT]: 'Helvetica',
      [ThemeKey.FONT_SIZE]: 14,
      [ThemeKey.FONT_WEIGHT]: 'Medium'
    });

    const layout = new LayoutMetricsComponent({
      [ThemeKey.SPACING]: 12,
      [ThemeKey.PADDING]: 20,
      [ThemeKey.BORDER_RADIUS]: 4
    });

    return new CompositeTheme([colors, typography, layout]);
  }

  /**
   * Creates a creative theme
   */
  static createCreativeTheme(): CompositeTheme {
    const colors = new ColorPaletteComponent({
      [ThemeKey.PRIMARY_COLOR]: '#8B5CF6',
      [ThemeKey.SECONDARY_COLOR]: '#EC4899',
      [ThemeKey.BACKGROUND_COLOR]: '#FAF5FF',
      [ThemeKey.TEXT_COLOR]: '#4C1D95'
    });

    const typography = new TypographyComponent({
      [ThemeKey.PRIMARY_FONT]: 'Avenir',
      [ThemeKey.BODY_FONT]: 'Avenir',
      [ThemeKey.FONT_SIZE]: 18,
      [ThemeKey.FONT_WEIGHT]: 'Light'
    });

    const layout = new LayoutMetricsComponent({
      [ThemeKey.SPACING]: 16,
      [ThemeKey.PADDING]: 24,
      [ThemeKey.BORDER_RADIUS]: 16
    });

    return new CompositeTheme([colors, typography, layout]);
  }

  // MARK: - Lightweight Variant Themes

  /**
   * Creates a high contrast variant theme that inherits from light theme
   */
  static createHighContrastTheme(): CompositeTheme {
    const baseTheme = this.createDefaultLightTheme();

    // Only override colors for high contrast - inherit everything else
    const highContrastColors = new ColorPaletteComponent({
      [ThemeKey.PRIMARY_COLOR]: '#000000',
      [ThemeKey.SECONDARY_COLOR]: '#FFFFFF',
      [ThemeKey.BACKGROUND_COLOR]: '#FFFFFF',
      [ThemeKey.TEXT_COLOR]: '#000000',
      [ThemeKey.SUCCESS_COLOR]: '#34C759',
      [ThemeKey.WARNING_COLOR]: '#FF9500',
      [ThemeKey.ERROR_COLOR]: '#FF3B30'
    });

    return baseTheme.createChildTheme([highContrastColors]);
  }

  /**
   * Creates a large text variant theme that inherits from light theme
   */
  static createLargeTextTheme(): CompositeTheme {
    const baseTheme = this.createDefaultLightTheme();

    // Only override typography for large text - inherit everything else
    const largeTextTypography = new TypographyComponent({
      [ThemeKey.FONT_SIZE]: 20,
      [ThemeKey.LINE_HEIGHT]: 1.5,
      [ThemeKey.LETTER_SPACING]: 0.5
    });

    return baseTheme.createChildTheme([largeTextTypography]);
  }

  /**
   * Creates a compact layout variant theme that inherits from light theme
   */
  static createCompactLayoutTheme(): CompositeTheme {
    const baseTheme = this.createDefaultLightTheme();

    // Only override layout metrics for compact layout - inherit everything else
    const compactLayout = new LayoutMetricsComponent({
      [ThemeKey.SPACING]: 4,
      [ThemeKey.PADDING]: 8,
      [ThemeKey.MARGIN]: 4,
      [ThemeKey.BORDER_RADIUS]: 4
    });

    return baseTheme.createChildTheme([compactLayout]);
  }

  /**
   * Creates a dark high contrast variant theme
   */
  static createDarkHighContrastTheme(): CompositeTheme {
    const baseTheme = this.createDefaultDarkTheme();

    // Only override colors for high contrast - inherit everything else
    const highContrastColors = new ColorPaletteComponent({
      [ThemeKey.PRIMARY_COLOR]: '#FFFFFF',
      [ThemeKey.SECONDARY_COLOR]: '#000000',
      [ThemeKey.BACKGROUND_COLOR]: '#000000',
      [ThemeKey.TEXT_COLOR]: '#FFFFFF',
      [ThemeKey.SUCCESS_COLOR]: '#30D158',
      [ThemeKey.WARNING_COLOR]: '#FFD60A',
      [ThemeKey.ERROR_COLOR]: '#FF453A'
    });

    return baseTheme.createChildTheme([highContrastColors]);
  }

  /**
   * Creates a reduced motion variant theme
   */
  static createReducedMotionTheme(): CompositeTheme {
    const baseTheme = this.createDefaultLightTheme();

    // Only override animation and accessibility settings
    const reducedMotionAnimations = new AnimationComponent({
      [ThemeKey.ANIMATION_DURATION]: 0,
      [ThemeKey.ANIMATION_EASING]: 'linear'
    });

    const reducedMotionAccessibility = new AccessibilityComponent({
      [ThemeKey.REDUCED_MOTION]: true
    });

    return baseTheme.createChildTheme([reducedMotionAnimations, reducedMotionAccessibility]);
  }

  /**
   * Creates a corporate high contrast variant
   */
  static createCorporateHighContrastTheme(): CompositeTheme {
    const baseTheme = this.createCorporateTheme();

    // Only override colors for high contrast
    const highContrastColors = new ColorPaletteComponent({
      [ThemeKey.PRIMARY_COLOR]: '#000000',
      [ThemeKey.SECONDARY_COLOR]: '#FFFFFF',
      [ThemeKey.TEXT_COLOR]: '#000000'
    });

    return baseTheme.createChildTheme([highContrastColors]);
  }
}

// MARK: - Theme Manager

/**
 * Manager class for handling theme operations and persistence
 */
export class AdvancedThemeManager {
  private currentTheme: CompositeTheme;
  private availableThemes: Map<string, CompositeTheme> = new Map();

  constructor() {
    this.currentTheme = ThemeFactory.createDefaultLightTheme();
    this.loadDefaultThemes();
  }

  private loadDefaultThemes(): void {
    // Base themes
    this.availableThemes.set('Light', ThemeFactory.createDefaultLightTheme());
    this.availableThemes.set('Dark', ThemeFactory.createDefaultDarkTheme());
    this.availableThemes.set('Corporate', ThemeFactory.createCorporateTheme());
    this.availableThemes.set('Creative', ThemeFactory.createCreativeTheme());

    // Lightweight variant themes
    this.availableThemes.set('High Contrast', ThemeFactory.createHighContrastTheme());
    this.availableThemes.set('Large Text', ThemeFactory.createLargeTextTheme());
    this.availableThemes.set('Compact Layout', ThemeFactory.createCompactLayoutTheme());
    this.availableThemes.set('Dark High Contrast', ThemeFactory.createDarkHighContrastTheme());
    this.availableThemes.set('Reduced Motion', ThemeFactory.createReducedMotionTheme());
    this.availableThemes.set('Corporate High Contrast', ThemeFactory.createCorporateHighContrastTheme());
  }

  /**
   * Switches to a different theme
   */
  switchTheme(themeName: string): void {
    const theme = this.availableThemes.get(themeName);
    if (theme) {
      this.currentTheme = theme;
    }
  }

  /**
   * Creates a new theme based on the current theme
   */
  createDerivedTheme(name: string, components: ThemeComponent[]): CompositeTheme {
    const derivedTheme = this.currentTheme.createChildTheme(components);
    this.availableThemes.set(name, derivedTheme);
    return derivedTheme;
  }

  /**
   * Saves a theme with a specific name
   */
  saveTheme(theme: CompositeTheme, name: string): void {
    this.availableThemes.set(name, theme);
  }

  /**
   * Removes a theme
   */
  removeTheme(name: string): void {
    this.availableThemes.delete(name);
  }

  /**
   * Gets a theme value with inheritance
   */
  getValue(key: ThemeKey): any {
    return this.currentTheme.resolveValue(key);
  }

  /**
   * Gets all available theme names
   */
  getThemeNames(): string[] {
    return Array.from(this.availableThemes.keys());
  }

  /**
   * Gets the current theme
   */
  getCurrentTheme(): CompositeTheme {
    return this.currentTheme;
  }

  /**
   * Gets a theme by name
   */
  getTheme(name: string): CompositeTheme | undefined {
    return this.availableThemes.get(name);
  }
}

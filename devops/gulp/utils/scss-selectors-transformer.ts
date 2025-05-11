interface ModuleClasses {
  [key: string]: string;
}

// Define bypass patterns that should not be namespaced
const BYPASS_PATTERNS = [
  /^\.js-/, // Classes starting with js- prefix
  /^\.u-/, // Utility classes starting with u- prefix
  /^\.is-/, // State classes starting with is- prefix
  /^\.has-/, // State classes starting with has- prefix
  /^\.sbc-/, // Custom Shopify Builder Component classes
];

const shouldBypassNamespace = (className: string): boolean => {
  return BYPASS_PATTERNS.some(pattern => pattern.test(className));
};

const transformSelector = (
  prefix: string | null,
  selector: string,
  moduleClasses?: ModuleClasses,
  folderName?: string
): string => {
  // Handle module classes if provided, regardless of prefix
  if (moduleClasses && folderName) {
    // Extract class names and other selectors
    const parts = selector.split(/\s+/);
    
    const transformedParts = parts.map(part => {
      // Only transform if it's a class selector
      if (!part.startsWith('.')) {
        return part;
      }

      // Handle multiple classes in the same selector (e.g., .foo.bar)
      const classes = part.split('.');
      const transformedClasses = classes.map(cls => {
        if (!cls) return ''; // Skip empty strings from leading dots
        
        const className = `.${cls}`;
        
        // Check if this class should bypass namespacing
        if (shouldBypassNamespace(className)) {
          return cls;
        }

        // Apply namespace transformation
        const cleanClassName = cls;
        const moduleKey = `sbc-${folderName}__${cleanClassName}`;
        
        if (moduleClasses) {
          moduleClasses[cleanClassName] = moduleKey;
        }
        
        return moduleKey;
      });

      return `.${transformedClasses.filter(Boolean).join('.')}`;
    });

    return prefix ? `${prefix} ${transformedParts.join(' ')}` : transformedParts.join(' ');
  }

  return prefix ? `${prefix} ${selector}` : selector;
};

export default transformSelector; 
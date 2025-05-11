// Define bypass patterns that should not be namespaced
var BYPASS_PATTERNS = [
    /^\.js-/, // Classes starting with js- prefix
    /^\.u-/, // Utility classes starting with u- prefix
    /^\.is-/, // State classes starting with is- prefix
    /^\.has-/, // State classes starting with has- prefix
    /^\.sbc-/, // Custom Shopify Builder Component classes
];
var shouldBypassNamespace = function (className) {
    return BYPASS_PATTERNS.some(function (pattern) { return pattern.test(className); });
};
var transformSelector = function (prefix, selector, moduleClasses, folderName) {
    // Handle module classes if provided, regardless of prefix
    if (moduleClasses && folderName) {
        // Extract class names and other selectors
        var parts = selector.split(/\s+/);
        var transformedParts = parts.map(function (part) {
            // Only transform if it's a class selector
            if (!part.startsWith('.')) {
                return part;
            }
            // Handle multiple classes in the same selector (e.g., .foo.bar)
            var classes = part.split('.');
            var transformedClasses = classes.map(function (cls) {
                if (!cls)
                    return ''; // Skip empty strings from leading dots
                var className = ".".concat(cls);
                // Check if this class should bypass namespacing
                if (shouldBypassNamespace(className)) {
                    return cls;
                }
                // Apply namespace transformation
                var cleanClassName = cls;
                var moduleKey = "sbc-".concat(folderName, "__").concat(cleanClassName);
                if (moduleClasses) {
                    moduleClasses[cleanClassName] = moduleKey;
                }
                return moduleKey;
            });
            return ".".concat(transformedClasses.filter(Boolean).join('.'));
        });
        return prefix ? "".concat(prefix, " ").concat(transformedParts.join(' ')) : transformedParts.join(' ');
    }
    return prefix ? "".concat(prefix, " ").concat(selector) : selector;
};
export default transformSelector;

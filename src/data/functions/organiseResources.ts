export function organiseResources(structure, resources) {

    // Handle undefined or null structure
    if (!structure || !Array.isArray(structure)) {
        console.warn('Structure is not valid, returning empty array');
        return [];
    }

    // Deep clone the structure to avoid modifying the original
    const enrichedStructure = JSON.parse(JSON.stringify(structure));

    // Helper function to find and add resources to matching nodes
    function addResourceToNode(node, resource) {
        // Initialize resources array if it doesn't exist
        if (!node.resources) {
            node.resources = [];
        }

        // Check if this node matches any of the resource's visibility values
        if (resource.visibility && Array.isArray(resource.visibility) && node.value) {
            // Check if any visibility value matches the node's value
            const hasMatch = resource.visibility.some(visibilityValue =>
                visibilityValue === node.value
            );
            if (hasMatch) {
                node.resources.push(resource);
            }
        }

        // Recursively check children
        if (node.children && Array.isArray(node.children)) {
            node.children.forEach(child => {
                // Initialize resources array for child if it doesn't exist
                if (!child.resources) {
                    child.resources = [];
                }
                // Ensure child has text and value fields
                if (child.text && child.value) {
                    addResourceToNode(child, resource);
                }
            });
        }
    }

    // Process each resource
    resources.forEach(resource => {
        enrichedStructure.forEach(node => {
            addResourceToNode(node, resource);
        });
    });

    return enrichedStructure;
}
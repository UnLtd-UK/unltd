import slugify from 'slugify';

interface Resource {
    groups: string[];
    sub_groups?: string[] | null;
    specific_groups?: string[] | null;
}

interface GroupNode {
    name: string;
    slug: string;
    path: string;
    children: GroupNode[];
}

export function groups(resources: Resource[]): GroupNode[] {
    const groupMap = new Map<string, GroupNode>();

    resources.forEach(resource => {
        // Convert groups to array if it's a string
        const groups = Array.isArray(resource.groups) ? resource.groups : [resource.groups];
        groups.forEach(groupName => {
            if (!groupMap.has(groupName)) {
                groupMap.set(groupName, {
                    name: groupName,
                    slug: slugify(groupName, {
                        lower: true,
                        strict: true,
                        locale: "en",
                        trim: true,
                    }),
                    path: `/resources/${slugify(groupName, {
                        lower: true,
                        strict: true,
                        locale: "en",
                        trim: true,
                    })}`,
                    children: []
                });
            }

            const group = groupMap.get(groupName)!;

            // Process sub-groups
            if (resource.sub_groups) {
                resource.sub_groups.forEach(subGroupName => {
                    let subGroup = group.children.find(child => child.name === subGroupName);
                    if (!subGroup) {
                        subGroup = {
                            name: subGroupName,
                            slug: slugify(subGroupName, {
                                lower: true,
                                strict: true,
                                locale: "en",
                                trim: true,
                            }),
                            path: `${group.path}/${slugify(subGroupName, {
                                lower: true,
                                strict: true,
                                locale: "en",
                                trim: true,
                            })}`,
                            children: []
                        };
                        group.children.push(subGroup);
                    }

                    // Process specific groups
                    if (resource.specific_groups) {
                        resource.specific_groups.forEach(specificGroupName => {
                            if (!subGroup.children.some(child => child.name === specificGroupName)) {
                                subGroup.children.push({
                                    name: specificGroupName,
                                    slug: slugify(specificGroupName, {
                                        lower: true,
                                        strict: true,
                                        locale: "en",
                                        trim: true,
                                    }),
                                    path: `${subGroup.path}/${slugify(specificGroupName, {
                                        lower: true,
                                        strict: true,
                                        locale: "en",
                                        trim: true,
                                    })}`,
                                    children: []
                                });
                            }
                        });
                    }
                });
            }
        });
    });

    return Array.from(groupMap.values());
}
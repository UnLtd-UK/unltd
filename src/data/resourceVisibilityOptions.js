export const structure = async () => {
    const response = await fetch("https://unltd.directus.app/fields/resources", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const responseData = await response.json();

    // Find the visibility field object
    const visibilityField = responseData.data?.find(field => field.field === 'visibility');

    // Extract the choices from the nested structure
    const choices = visibilityField?.meta?.options?.choices || [];

    return choices
};
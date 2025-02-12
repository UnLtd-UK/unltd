function calculateReadTime(text) {
    // Average reading speed in words per minute
    const wordsPerMinute = 200;

    // Split the text into words and count them
    const words = text.trim().split(/\s+/).length;

    // Calculate the read time in minutes
    const minutes = Math.ceil(words / wordsPerMinute);

    return minutes;
}

export { calculateReadTime }
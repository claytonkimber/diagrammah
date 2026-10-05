function parseTime(label) {
    if (typeof label !== 'string') return null;
    const labelLower = label.trim().toLowerCase();
    const units = {
        's':  1000000000000, // 1e12
        'ms': 1000000000,    // 1e9
        'us': 1000000,       // 1e6
        'ns': 1000,          // 1e3
        'ps': 1
    };

    // Sort units by length descending to match 'ms' before 's'
    const sortedUnits = Object.keys(units).sort((a, b) => b.length - a.length);

    for (const u of sortedUnits) {
        if (labelLower.endsWith(u)) {
            const numericPartString = labelLower.slice(0, labelLower.length - u.length).trim();
            const numericPart = Number(numericPartString);

            if (!isNaN(numericPart) && numericPartString !== '') {
                return numericPart * units[u];
            }
        }
    }

    return null; // Return null if no recognized unit is found
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { parseTime };
}

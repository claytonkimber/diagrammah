const state = {
    timeDivisions: []
};

// Generate large number of time divisions
for (let i = 0; i < 5000; i++) {
    state.timeDivisions.push({ id: `t_${i}`, x: i * 10 });
}

const signal = {
    type: 'digital',
    nodes: []
};

// Generate nodes
for (let i = 4999; i >= 0; i--) {
    signal.nodes.push({ timeId: `t_${i}`, value: (i % 2).toString() });
}

function getNodeValueOriginal(signal, timeId) {
    const sortedNodes = signal.nodes
        .map(node => ({ ...node, time: state.timeDivisions.find(t => t.id === node.timeId) }))
        .filter(node => node.time)
        .sort((a, b) => a.time.x - b.time.x);

    let value = signal.type === 'digital' ? '0' : '0.0';
    for (const node of sortedNodes) {
        if (node.timeId === timeId) return node.value;
        value = node.value;
    }
    return value;
}

function getNodeValueOptimized(signal, timeId) {
    const timeLookup = state.timeDivisions.reduce((acc, t) => {
        acc[t.id] = t;
        return acc;
    }, {});

    const sortedNodes = signal.nodes
        .map(node => ({ ...node, time: timeLookup[node.timeId] }))
        .filter(node => node.time)
        .sort((a, b) => a.time.x - b.time.x);

    let value = signal.type === 'digital' ? '0' : '0.0';
    for (const node of sortedNodes) {
        if (node.timeId === timeId) return node.value;
        value = node.value;
    }
    return value;
}

const ITERATIONS = 10;

console.time('Original');
for (let i = 0; i < ITERATIONS; i++) {
    getNodeValueOriginal(signal, 't_2500');
}
console.timeEnd('Original');

console.time('Optimized');
for (let i = 0; i < ITERATIONS; i++) {
    getNodeValueOptimized(signal, 't_2500');
}
console.timeEnd('Optimized');

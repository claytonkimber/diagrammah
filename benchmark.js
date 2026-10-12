const fs = require('fs');

// Simple benchmark to simulate the environment
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

// Generate nodes (scrambled a bit)
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
    const timeLookup = new Map(state.timeDivisions.map(t => [t.id, t]));

    const sortedNodes = signal.nodes
        .map(node => ({ ...node, time: timeLookup.get(node.timeId) }))
        .filter(node => node.time)
        .sort((a, b) => a.time.x - b.time.x);

    let value = signal.type === 'digital' ? '0' : '0.0';
    for (const node of sortedNodes) {
        if (node.timeId === timeId) return node.value;
        value = node.value;
    }
    return value;
}

console.log("Benchmarking Original...");
const startOriginal = Date.now();
for (let i = 0; i < 10; i++) {
    getNodeValueOriginal(signal, 't_2500');
}
const endOriginal = Date.now();
console.log(`Original: ${endOriginal - startOriginal}ms`);

console.log("Benchmarking Optimized...");
const startOptimized = Date.now();
for (let i = 0; i < 10; i++) {
    getNodeValueOptimized(signal, 't_2500');
}
const endOptimized = Date.now();
console.log(`Optimized: ${endOptimized - startOptimized}ms`);

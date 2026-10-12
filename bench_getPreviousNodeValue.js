const state = {
    timeDivisions: []
};

// 1000 time divisions
for (let i = 0; i < 1000; i++) {
    state.timeDivisions.push({ id: `t${i}`, x: i * 10 });
}

const signal = {
    nodes: []
};

// 500 nodes
for (let i = 0; i < 500; i++) {
    signal.nodes.push({ id: `n${i}`, timeId: `t${i * 2}`, value: `${i}` });
}

function getPreviousNodeValue_Original(signal, timeId) {
    const timeDiv = state.timeDivisions.find(t => t.id === timeId);
    if (!timeDiv) return '0';

    const sortedNodes = signal.nodes
        .map(node => ({...node, x: state.timeDivisions.find(t=>t.id === node.timeId)?.x}))
        .filter(node => node.x < timeDiv.x)
        .sort((a, b) => b.x - a.x);

    return sortedNodes.length > 0 ? sortedNodes[0].value : '0';
}

function getPreviousNodeValue_Optimized(signal, timeId) {
    const timeDiv = state.timeDivisions.find(t => t.id === timeId);
    if (!timeDiv) return '0';

    const timeMap = new Map();
    for (let i = 0; i < state.timeDivisions.length; i++) {
        timeMap.set(state.timeDivisions[i].id, state.timeDivisions[i].x);
    }

    const sortedNodes = signal.nodes
        .map(node => ({...node, x: timeMap.get(node.timeId)}))
        .filter(node => node.x < timeDiv.x)
        .sort((a, b) => b.x - a.x);

    return sortedNodes.length > 0 ? sortedNodes[0].value : '0';
}

const ITERATIONS = 1000;

console.time('Baseline');
for(let j=0; j<ITERATIONS; j++) {
    getPreviousNodeValue_Original(signal, 't800');
}
console.timeEnd('Baseline');


console.time('Optimized');
for(let j=0; j<ITERATIONS; j++) {
    getPreviousNodeValue_Optimized(signal, 't800');
}
console.timeEnd('Optimized');

const state = { timeDivisions: [] };
for (let i = 0; i < 1000; i++) {
    state.timeDivisions.push({ id: `t${i}`, x: i * 10 });
}

const signal = { nodes: [] };
for (let i = 0; i < 500; i++) {
    signal.nodes.push({ timeId: `t${Math.floor(Math.random() * 1000)}`, value: '1' });
}

function oldMethod() {
    return signal.nodes
        .map(node => ({ ...node, time: state.timeDivisions.find(t => t.id === node.timeId) }))
        .filter(node => node.time)
        .sort((a, b) => a.time.x - b.time.x);
}

function newMethod() {
    const timeMap = new Map(state.timeDivisions.map(t => [t.id, t]));
    return signal.nodes
        .map(node => ({ ...node, time: timeMap.get(node.timeId) }))
        .filter(node => node.time)
        .sort((a, b) => a.time.x - b.time.x);
}

const ITERATIONS = 10000;

console.time('Old');
for(let j=0; j<ITERATIONS; j++) {
    oldMethod();
}
console.timeEnd('Old');

console.time('New');
for(let j=0; j<ITERATIONS; j++) {
    newMethod();
}
console.timeEnd('New');

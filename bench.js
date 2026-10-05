const state = {
    timeDivisions: []
};
for (let i = 0; i < 5000; i++) {
    state.timeDivisions.push({ id: `t${i}`, x: i * 10 });
}

function findClosestTimeDivision(x) {
    if (state.timeDivisions.length === 0) return { closestTimeId: null, prevTimeId: null };
    const sorted = [...state.timeDivisions].sort((a,b) => a.x - b.x);
    let closest = sorted[0];
    let minDiff = Math.abs(x - closest.x);
    for (let i = 1; i < sorted.length; i++) {
        let diff = Math.abs(x - sorted[i].x);
        if (diff < minDiff) {
            minDiff = diff;
            closest = sorted[i];
        }
    }

    const prevDivs = sorted.filter(t => t.x < x);
    const prev = prevDivs.length > 0 ? prevDivs[prevDivs.length - 1] : null;

    return { closestTimeId: closest.id, prevTimeId: prev ? prev.id : null };
}

function findClosestTimeDivisionOpt(x) {
    if (state.timeDivisions.length === 0) return { closestTimeId: null, prevTimeId: null, closestDiv: null };
    const sorted = [...state.timeDivisions].sort((a,b) => a.x - b.x);
    let closest = sorted[0];
    let minDiff = Math.abs(x - closest.x);
    for (let i = 1; i < sorted.length; i++) {
        let diff = Math.abs(x - sorted[i].x);
        if (diff < minDiff) {
            minDiff = diff;
            closest = sorted[i];
        }
    }

    const prevDivs = sorted.filter(t => t.x < x);
    const prev = prevDivs.length > 0 ? prevDivs[prevDivs.length - 1] : null;

    return { closestTimeId: closest.id, prevTimeId: prev ? prev.id : null, closestDiv: closest };
}

const ITERATIONS = 1000;

console.time('Old');
for(let j=0; j<ITERATIONS; j++) {
    const mouseX = Math.random() * 50000;
    const { closestTimeId } = findClosestTimeDivision(mouseX);
    const closestDiv = state.timeDivisions.find(t => t.id === closestTimeId);
}
console.timeEnd('Old');


console.time('New');
for(let j=0; j<ITERATIONS; j++) {
    const mouseX = Math.random() * 50000;
    const { closestDiv } = findClosestTimeDivisionOpt(mouseX);
}
console.timeEnd('New');

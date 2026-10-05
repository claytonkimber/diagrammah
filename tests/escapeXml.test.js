const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

// Extract the escapeXml function from index.html
const htmlPath = path.join(__dirname, '..', 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Match the escapeXml function. It might have `if (str === null || str === undefined)` now.
const match = htmlContent.match(/function escapeXml[\s\S]*?\}\);[\s\S]*?\}/);
if (!match) {
    throw new Error('Could not find escapeXml function in index.html');
}

// Evaluate the function in the local scope
const escapeXmlStr = match[0];
const escapeXml = new Function('str', `
    return (${escapeXmlStr})(str);
`);

test('escapeXml', async (t) => {
    await t.test('escapes <', () => {
        assert.strictEqual(escapeXml('<'), '&lt;');
    });

    await t.test('escapes >', () => {
        assert.strictEqual(escapeXml('>'), '&gt;');
    });

    await t.test('escapes &', () => {
        assert.strictEqual(escapeXml('&'), '&amp;');
    });

    await t.test('escapes \'', () => {
        assert.strictEqual(escapeXml('\''), '&apos;');
    });

    await t.test('escapes "', () => {
        assert.strictEqual(escapeXml('"'), '&quot;');
    });

    await t.test('escapes all special characters', () => {
        assert.strictEqual(escapeXml('<>&\'"'), '&lt;&gt;&amp;&apos;&quot;');
    });

    await t.test('escapes multiple occurrences', () => {
        assert.strictEqual(escapeXml('<<>>&&\'\'""'), '&lt;&lt;&gt;&gt;&amp;&amp;&apos;&apos;&quot;&quot;');
    });

    await t.test('returns unmodified string if no special characters', () => {
        assert.strictEqual(escapeXml('hello world'), 'hello world');
    });

    await t.test('handles empty string', () => {
        assert.strictEqual(escapeXml(''), '');
    });

    await t.test('handles text mixed with special characters', () => {
        assert.strictEqual(escapeXml('Hello <World> & "Friends"\''), 'Hello &lt;World&gt; &amp; &quot;Friends&quot;&apos;');
    });

    await t.test('handles null', () => {
        assert.strictEqual(escapeXml(null), '');
    });

    await t.test('handles undefined', () => {
        assert.strictEqual(escapeXml(undefined), '');
    });

    await t.test('handles numbers by coercing to string', () => {
        assert.strictEqual(escapeXml(123), '123');
        assert.strictEqual(escapeXml(0), '0');
    });

    await t.test('handles booleans by coercing to string', () => {
        assert.strictEqual(escapeXml(true), 'true');
        assert.strictEqual(escapeXml(false), 'false');
    });
});

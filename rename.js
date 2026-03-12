const fs = require('fs');
const path = require('path');

const rootDir = __dirname;

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.git')) {
                results = results.concat(walk(file));
            }
        } else {
            if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json') || file.endsWith('.txt')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(rootDir);
let modifiedCount = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    // replace "isNew": with "isNewCafe":
    content = content.replace(/"isNew"\s*:/g, '"isNewCafe":');
    // replace isNew: with isNewCafe:
    content = content.replace(/\bisNew\s*:/g, 'isNewCafe:');
    // replace .isNew with .isNewCafe
    content = content.replace(/\.isNew\b/g, '.isNewCafe');
    // replace { isNew } with { isNewCafe }
    content = content.replace(/\{\s*isNew\s*\}/g, '{ isNewCafe }');
    // replace isNew === with isNewCafe ===
    content = content.replace(/\bisNew\s*===/g, 'isNewCafe ===');
    // query parameters like ?isNew= or isNew=
    content = content.replace(/\bisNew=/g, 'isNewCafe=');
    // Variable destructuration with comma: const { vibe, area, maxPrice, trending, isNew }
    content = content.replace(/,\s*isNew\b/g, ', isNewCafe');

    if (original !== content) {
        fs.writeFileSync(file, content, 'utf8');
        modifiedCount++;
        console.log(`Updated ${file}`);
    }
});
console.log(`Updated ${modifiedCount} files.`);

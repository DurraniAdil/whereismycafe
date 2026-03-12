const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('dist') && !file.includes('.next')) {
                results = results.concat(walk(file));
            }
        } else {
            if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json') || file.endsWith('.txt')) {
                if (!file.includes('package-lock.json') && !file.includes('package.json')) {
                    results.push(file);
                }
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
    content = content.replace(/"isNew"\s*:/g, '"isNewCafe":');
    content = content.replace(/\bisNew\s*:/g, 'isNewCafe:');
    content = content.replace(/\.isNew\b/g, '.isNewCafe');
    content = content.replace(/\{\s*isNew\s*\}/g, '{ isNewCafe }');
    content = content.replace(/\bisNew\s*===/g, 'isNewCafe ===');
    content = content.replace(/\bisNew=/g, 'isNewCafe=');
    content = content.replace(/,\s*isNew\b/g, ', isNewCafe');
    content = content.replace(/const isNew \=/g, 'const isNewCafe =');

    if (original !== content) {
        fs.writeFileSync(file, content, 'utf8');
        modifiedCount++;
        console.log(`Updated ${file}`);
    }
});
console.log(`Updated ${modifiedCount} files.`);

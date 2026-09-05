const fs = require('fs');
const path = require('path');

const dir = 'src/services';

function getTsFiles(currentPath) {
    let results = [];
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
        if (entry.isDirectory()) {
            results = results.concat(getTsFiles(fullPath));
        } else if (entry.isFile() && entry.name.endsWith('.ts') && entry.name !== 'api.ts' && entry.name !== 'UserService.ts') {
            results.push(fullPath);
        }
    }
    return results;
}

const files = getTsFiles(dir);

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    
    // Replace axios import
    content = content.replace(/import axios from ['"]axios['"];/g, 'import api from "../api";');
    
    // Remove API constant definition
    content = content.replace(/const API = process\.env\.REACT_APP_API_BASE_URL;/g, '');
    
    // Replace axios.get, post, etc with api.
    content = content.replace(/axios\./g, 'api.');
    
    // Remove ${API}
    content = content.replace(/\$\{API\}/g, '');

    fs.writeFileSync(f, content);
    console.log('Updated ' + f);
});

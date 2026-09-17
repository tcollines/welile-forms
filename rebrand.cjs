const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  // Names
  content = content.replace(/Manifest Forms/g, 'Welile Forms');
  content = content.replace(/Manifest Management/g, 'Welile Management');
  content = content.replace(/Manifest/g, 'Welile');
  content = content.replace(/manifest-forms/g, 'welile-forms');
  content = content.replace(/manifest-management/g, 'welile-management');
  
  // Kairos
  content = content.replace(/Kairos Chatbot/g, 'Welile AI Chatbot');
  content = content.replace(/Kairos AI/g, 'Welile AI');
  content = content.replace(/Kairos/g, 'Welile AI');
  content = content.replace(/kairos/g, 'welileai');

  // Colors
  content = content.replace(/orange/g, 'purple');
  content = content.replace(/amber/g, 'fuchsia');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', filePath);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        walk(fullPath);
      }
    } else {
      if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.html') || fullPath.endsWith('.css') || fullPath.endsWith('.json') || fullPath.endsWith('.md')) {
        replaceInFile(fullPath);
      }
    }
  }
}

walk(path.join(__dirname, 'src'));
replaceInFile(path.join(__dirname, 'index.html'));
replaceInFile(path.join(__dirname, 'package.json'));

// Rename KairosChatbot.tsx to WelileAIChatbot.tsx
const oldPath = path.join(__dirname, 'src', 'components', 'KairosChatbot.tsx');
const newPath = path.join(__dirname, 'src', 'components', 'WelileAIChatbot.tsx');
if (fs.existsSync(oldPath)) {
  fs.renameSync(oldPath, newPath);
  console.log('Renamed KairosChatbot.tsx to WelileAIChatbot.tsx');
  
  // Need to update imports that referenced KairosChatbot
  walk(path.join(__dirname, 'src')); // re-run to replace KairosChatbot imports to WelileAIChatbot if they were renamed
}

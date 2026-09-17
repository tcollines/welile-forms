const fs = require('fs');
const path = require('path');

function fixSpace(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  content = content.replace(/Welile AIChatbot/g, 'WelileAIChatbot');
  content = content.replace(/Welile AI_question/g, 'welileAI_question');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed', filePath);
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
      if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
        fixSpace(fullPath);
      }
    }
  }
}

walk(path.join(__dirname, 'src'));

const fs = require('fs');

// Fix kbeauty.html
let html = fs.readFileSync('kbeauty.html', 'utf8');

// Update nav links
html = html.replace(
  `<li><a href="#hero" class="nav-link active">Stem Cell</a></li>
          <li><a href="#kbeauty-section" class="nav-link">K-Beauty</a></li>`,
  `<li><a href="/" class="nav-link">Stem Cell</a></li>
          <li><a href="/kbeauty" class="nav-link active">K-Beauty</a></li>`
);

// Remove hero
html = html.replace(/<section id="hero"[\s\S]*?<\/section>/, '');
// Remove why-wellsam
html = html.replace(/<!-- 1\.5\. Why The Wellsam -->[\s\S]*?<section id="why-wellsam"[\s\S]*?<\/section>/, '');
// Remove essence
html = html.replace(/<!-- 2\. The Essence \(The Power of Stem Cells\) -->[\s\S]*?<section id="essence"[\s\S]*?<\/section>/, '');
// Remove masters
html = html.replace(/<!-- 3\. The Masters \(Medical Staff\) -->[\s\S]*?<section id="masters"[\s\S]*?<\/section>/, '');
// Remove sanctuary
html = html.replace(/<!-- 4\. The Sanctuary \(Hospital Intro\) -->[\s\S]*?<section id="sanctuary"[\s\S]*?<\/section>/, '');

fs.writeFileSync('kbeauty.html', html);


// Fix index.html nav links
let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace(
  `<li><a href="#hero" class="nav-link active">Stem Cell</a></li>
          <li><a href="#kbeauty-section" class="nav-link">K-Beauty</a></li>`,
  `<li><a href="/" class="nav-link active">Stem Cell</a></li>
          <li><a href="/kbeauty" class="nav-link">K-Beauty</a></li>`
);
fs.writeFileSync('index.html', indexHtml);

console.log("Done");

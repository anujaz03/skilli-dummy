const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../backup_vanilla/index.html');
const outputPath = path.join(__dirname, '../index.html');

let html = fs.readFileSync(inputPath, 'utf8');

const stageStartStr = '<div class="cinematic-stage-container reveal-scale">';
const stageStart = html.indexOf(stageStartStr);
const stageEndMark = html.indexOf('<!-- Client Results Section -->');

if (stageStart === -1 || stageEndMark === -1) {
  console.error("Could not find start or end markings in index.html!");
  process.exit(1);
}

// Find the </section> closing tag of team-core
const sectionEndIndex = html.lastIndexOf('</section>', stageEndMark);

// Search backwards from sectionEndIndex to find the closing tag for section-container (which is a </div>)
// The HTML structure at the end of the section is:
//                     </div> <!-- closes cinematic-stage-container -->
//                 </div> <!-- closes section-container -->
//             </section>
// Let's find the last </div> before </section> which will be the one for section-container.
// Let's find the second to last </div> before </section>, which would be for cinematic-stage-container closing.
let searchIndex = sectionEndIndex;
let divClosingTagsFound = 0;
let stageEnd = -1;

while (searchIndex > stageStart) {
  const nextDivEnd = html.lastIndexOf('</div>', searchIndex);
  if (nextDivEnd === -1 || nextDivEnd < stageStart) {
    break;
  }
  divClosingTagsFound++;
  if (divClosingTagsFound === 2) {
    // This is the closing tag of cinematic-stage-container!
    // We want to slice up to and including the closing tag of cinematic-stage-container.
    stageEnd = nextDivEnd + '</div>'.length;
    break;
  }
  searchIndex = nextDivEnd - 1;
}

if (stageEnd === -1) {
  console.error("Could not find the closing tag of cinematic-stage-container!");
  process.exit(1);
}

console.log("Replacing cinematic-stage-container: from index", stageStart, "to", stageEnd);

const reactMountDiv = '<div id="team-orbit-root" class="reveal-scale"></div>';
html = html.substring(0, stageStart) + reactMountDiv + html.substring(stageEnd);

// Now, insert the module script before </body>
const bodyEndMark = html.indexOf('</body>');
if (bodyEndMark === -1) {
  console.error("Could not find </body> in index.html!");
  process.exit(1);
}

const moduleScript = '\n    <script type="module" src="/src/main.tsx"></script>\n';
html = html.substring(0, bodyEndMark) + moduleScript + html.substring(bodyEndMark);

fs.writeFileSync(outputPath, html, 'utf8');
console.log("Integrated index.html successfully!");

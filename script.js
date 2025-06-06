let annotations = [];
let currentIndex = 0;

fetch("data/annotations.json")
  .then(res => res.json())
  .then(data => {
    annotations = data;
    renderAnnotation();
  });

function renderAnnotation() {
  const viewer = document.getElementById("annotation-viewer");
  const progress = document.getElementById("progress-bar");
  viewer.innerHTML = "";
  if (progress) progress.innerHTML = "";

  if (currentIndex >= annotations.length) {
    viewer.innerHTML = "<p>🎉 No more annotations to show.</p>";
    return;
  }

  const item = annotations[currentIndex];

  const block = document.createElement("div");
  block.className = "annotation-block";

  const counter = document.createElement("div");
  counter.className = "counter";
  counter.textContent = `Example ${currentIndex + 1} of ${annotations.length}`;
  viewer.appendChild(counter);

  // Side-by-side layout
  const layout = document.createElement("div");
  layout.className = "flex-container";

  const leftPanel = document.createElement("div");
  leftPanel.className = "flex-panel";
  leftPanel.innerHTML = `<h3>Source</h3><p>${item.source}</p>`;

  const rightPanel = document.createElement("div");
  rightPanel.className = "flex-panel";
  rightPanel.innerHTML = `<h3>Summary</h3><p>` + highlightSpans(item.summary, item.nonfactual_spans) + `</p>`;

  layout.appendChild(leftPanel);
  layout.appendChild(rightPanel);
  block.appendChild(layout);

  const attrBox = document.createElement("div");
  attrBox.className = "attributes";
  attrBox.textContent = "Click on a highlighted span to view attributes.";
  block.appendChild(attrBox);

  // Navigation buttons
  const nav = document.createElement("div");
  nav.className = "nav-buttons";

  const backBtn = document.createElement("button");
  backBtn.textContent = "← Back";
  backBtn.className = "button";
  backBtn.disabled = currentIndex === 0;
  backBtn.onclick = () => {
    currentIndex--;
    renderAnnotation();
  };

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next →";
  nextBtn.className = "button";
  nextBtn.onclick = () => {
    currentIndex++;
    renderAnnotation();
  };

  nav.appendChild(backBtn);
  nav.appendChild(nextBtn);
  block.appendChild(nav);

  viewer.appendChild(block);

  const spans = block.querySelectorAll(".span-highlight");
  spans.forEach((span, idx) => {
    span.addEventListener("click", () => {
      const attr = item.nonfactual_spans[idx].attributes;
      attrBox.innerHTML = `<strong>Attributes:</strong><br/>
        Evidence: ${attr.evidence}<br/>
        Likelihood: ${attr.likelihood}<br/>
        Consequence: ${attr.consequence}<br/>
        Common Knowledge: ${attr.common_knowledge}`;
    });
  });

  if (progress) {
    progress.innerHTML = `
      <div class="progress-wrapper">
        <div class="progress" style="width: ${(currentIndex + 1) / annotations.length * 100}%"></div>
      </div>
    `;
  }
}

function highlightSpans(text, spans) {
  let offset = 0;
  let result = "";
  spans.forEach((span, i) => {
    result += text.slice(offset, span.start);
    result += `<span class="span-highlight">${text.slice(span.start, span.end)}</span>`;
    offset = span.end;
  });
  result += text.slice(offset);
  return result;
}

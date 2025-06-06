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
  progress.innerHTML = "";

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

  const source = document.createElement("div");
  source.className = "source";
  source.innerHTML = `<strong>Source:</strong> ${item.source}`;
  block.appendChild(source);

  const summary = document.createElement("div");
  summary.className = "summary";
  summary.innerHTML = `<strong>Summary:</strong> ` + highlightSpans(item.summary, item.nonfactual_spans);
  block.appendChild(summary);

  const attrBox = document.createElement("div");
  attrBox.className = "attributes";
  attrBox.textContent = "Click on a highlighted span to view attributes.";
  block.appendChild(attrBox);

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

  // span interactivity
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

  // progress bar
  progress.innerHTML = `
    <div class="progress-wrapper">
      <div class="progress" style="width: ${(currentIndex + 1) / annotations.length * 100}%"></div>
    </div>
  `;
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

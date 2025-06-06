let annotations = [];
let currentIndex = 0;

fetch("data/annotations.json")
  .then(res => res.json())
  .then(data => {
    annotations = data;
    renderAnnotation();
  });

document.getElementById("backBtn").addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderAnnotation();
  }
});

document.getElementById("nextBtn").addEventListener("click", () => {
  if (currentIndex < annotations.length - 1) {
    currentIndex++;
    renderAnnotation();
  }
});

function renderAnnotation() {
  const item = annotations[currentIndex];
  const sourceBox = document.getElementById("source-content");
  const summaryBox = document.getElementById("summary-content");
  const attrBox = document.getElementById("attr-box");
  const counter = document.getElementById("counterDisplay");

  sourceBox.textContent = item.source;
  summaryBox.innerHTML = highlightSpans(item.summary, item.nonfactual_spans);
  attrBox.textContent = "Click on a highlighted span to view attributes.";
  counter.textContent = `Example ${currentIndex + 1} of ${annotations.length}`;

  const progress = document.getElementById("progress-bar");
  progress.innerHTML = `
    <div class="progress-wrapper">
      <div class="progress" style="width: ${(currentIndex + 1) / annotations.length * 100}%"></div>
    </div>
  `;

  const spans = summaryBox.querySelectorAll(".span-highlight");
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

  // disable/enable buttons
  document.getElementById("backBtn").disabled = currentIndex === 0;
  document.getElementById("nextBtn").disabled = currentIndex === annotations.length - 1;
}

function highlightSpans(text, spans) {
  let result = "";
  let offset = 0;
  spans.forEach((span, i) => {
    result += text.slice(offset, span.start);
    result += `<span class="span-highlight">${text.slice(span.start, span.end)}</span>`;
    offset = span.end;
  });
  result += text.slice(offset);
  return result;
}

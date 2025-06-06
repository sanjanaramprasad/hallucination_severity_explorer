fetch("data/annotations.json")
  .then((res) => res.json())
  .then((data) => {
    const viewer = document.getElementById("annotation-viewer");

    data.forEach((item) => {
      const block = document.createElement("div");
      block.className = "annotation-block";

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

      // Add interactivity to each span
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

      viewer.appendChild(block);
    });
  });

function highlightSpans(text, spans) {
  let offset = 0;
  let result = "";
  spans.forEach((span, i) => {
    result += text.slice(offset, span.start);
    result += `<span class="span-highlight" data-idx="${i}">${text.slice(span.start, span.end)}</span>`;
    offset = span.end;
  });
  result += text.slice(offset);
  return result;
}

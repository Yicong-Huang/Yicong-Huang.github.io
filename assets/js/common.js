$(document).ready(function() {
  // add toggle functionality to abstract and bibtex buttons
  $('a.abstract').click(function() {
    $(this).parent().parent().find(".abstract.hidden").toggleClass('open');
    $(this).parent().parent().find(".bibtex.hidden.open").toggleClass('open');
  });
  $('a.bibtex').click(function() {
    $(this).parent().parent().find(".bibtex.hidden").toggleClass('open');
    $(this).parent().parent().find(".abstract.hidden.open").toggleClass('open');
  });
  $('a').removeClass('waves-effect waves-light');

  // bootstrap-toc
  if($('#toc-sidebar').length){
    var navSelector = "#toc-sidebar";
    var $myNav = $(navSelector);
    Toc.init($myNav);
    $("body").scrollspy({
      target: navSelector,
    });
  }

  // add css to jupyter notebooks
  const cssLink = document.createElement("link");
  cssLink.href  = "../css/jupyter.css";
  cssLink.rel   = "stylesheet";
  cssLink.type  = "text/css";

  let theme = localStorage.getItem("theme");
  if (theme == null || theme == "null") {
    const userPref = window.matchMedia;
    if (userPref && userPref("(prefers-color-scheme: dark)").matches) {
      theme = "dark";
    }
  }

  $('.jupyter-notebook-iframe-container iframe').each(function() {
    $(this).contents().find("head").append(cssLink);

    if (theme == "dark") {
      $(this).bind("load",function(){
        $(this).contents().find("body").attr({
          "data-jp-theme-light": "false",
          "data-jp-theme-name": "JupyterLab Dark"});
      });
    }
  });

  initializeScholarCitations();
});

function initializeScholarCitations() {
  const cards = document.querySelectorAll("[data-scholar-card]");
  if (!cards.length) {
    return;
  }

  cards.forEach((card) => {
    const source = card.getAttribute("data-scholar-source");
    if (!source) {
      return;
    }

    fetch(source, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`scholar fetch failed: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        renderScholarCard(card, data);
      })
      .catch((error) => {
        console.warn("Failed to refresh scholar citations from GitHub.", error);
      });
  });
}

function renderScholarCard(card, data) {
  if (!data || !data.totals || !Array.isArray(data.yearly)) {
    return;
  }

  updateScholarMetric(card, "all.citations", data.totals.all && data.totals.all.citations);
  updateScholarMetric(card, "since_2021.citations", data.totals.since_2021 && data.totals.since_2021.citations);
  updateScholarMetric(card, "all.h_index", data.totals.all && data.totals.all.h_index);
  updateScholarMetric(card, "since_2021.h_index", data.totals.since_2021 && data.totals.since_2021.h_index);
  updateScholarMetric(card, "all.i10_index", data.totals.all && data.totals.all.i10_index);
  updateScholarMetric(card, "since_2021.i10_index", data.totals.since_2021 && data.totals.since_2021.i10_index);

  renderScholarBars(card, data.yearly);
}

function updateScholarMetric(card, key, value) {
  if (value === undefined || value === null) {
    return;
  }
  const node = card.querySelector(`[data-scholar-metric="${key}"]`);
  if (node) {
    node.textContent = value;
  }
}

function renderScholarBars(card, yearly) {
  const barsNode = card.querySelector("[data-scholar-bars]");
  const yAxisNode = card.querySelector("[data-scholar-yaxis]");
  if (!barsNode || !yAxisNode || !yearly.length) {
    return;
  }

  const counts = yearly
    .map((item) => Number(item.count) || 0)
    .filter((count) => count >= 0);
  const maxCount = Math.max(...counts, 1);
  const yMax = Math.ceil(maxCount / 10) * 10;
  const y75 = Math.round((yMax * 3) / 4);
  const y50 = Math.round(yMax / 2);
  const y25 = Math.round(yMax / 4);

  const spacerHtml = `
    <div class="scholar-bar-col scholar-bar-col--spacer" aria-hidden="true">
      <div class="scholar-bar-wrap"></div>
      <div class="scholar-bar-year"></div>
    </div>
  `;

  const barsHtml = yearly
    .map((item) => {
      const year = Number(item.year) || "";
      const count = Number(item.count) || 0;
      const height = maxCount === 0 ? 0 : (count * 100) / maxCount;
      return `
        <div class="scholar-bar-col">
          <div class="scholar-bar-wrap">
            <div class="scholar-bar" style="height: ${height}%;" title="${year}: ${count}">
              <span class="scholar-bar-value">${count}</span>
            </div>
          </div>
          <div class="scholar-bar-year">${year}</div>
        </div>
      `;
    })
    .join("");

  barsNode.innerHTML = spacerHtml + barsHtml;
  yAxisNode.innerHTML = `
    <span>${yMax}</span>
    <span>${y75}</span>
    <span>${y50}</span>
    <span>${y25}</span>
    <span>0</span>
  `;
}

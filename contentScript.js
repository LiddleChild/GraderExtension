const panel = document.getElementsByClassName("col-md-7")[0];
const bottomPanel = panel.getElementsByClassName(
  "table table-striped table-condensed"
)[0];
const tasks = bottomPanel
  .getElementsByTagName("tbody")[0]
  .getElementsByTagName("tr");
const fileDownloadPanel = document.getElementsByClassName("list-group")[0];
const fileDownload = fileDownloadPanel
  .getElementsByTagName("li")[0]
  .getElementsByTagName("li");

let downloads = [];

// Remove grey background
bottomPanel.className = "table table-condensed";

// Load search bar
const loadHTML = async () => {
  return await fetch(chrome.runtime.getURL("container.html")).then((res) =>
    res.text()
  );
};

const attachSearchBar = async () => {
  let searchBarContainer = document.getElementsByClassName(
    "search-bar-container"
  )[0];

  if (!searchBarContainer) {
    searchBarContainer = document.createElement("div");
    searchBarContainer.className = "search-bar-container";

    let content = await loadHTML();
    if (!content) content = "Error loading extension!";
    searchBarContainer.innerHTML = content;
  }

  panel.insertBefore(searchBarContainer, bottomPanel);

  const searchBar = document.getElementById("search-bar");
  searchBar.addEventListener("input", (e) => {
    updateTasks(searchBar.value.trim().toLowerCase());
  });
};

const updateTasks = (filter) => {
  let [query, option] = filter.split(";");

  let undone = option !== undefined && option.includes("undone");

  for (let i of tasks) {
    let [name, fullName, subs, results, editBtn] = i.getElementsByTagName("td");
    let classes = "";

    let n = name.innerHTML.trim().toLowerCase();
    let fn = fullName.innerText.split("\n")[0].trim().toLowerCase();

    if (
      (!n.includes(query) && !fn.includes(query)) ||
      (undone && parseInt(results.innerText.split("score: ")[1]) == 100)
    )
      classes += "hide ";

    i.className = classes + "task ";
  }
};

const processTask = () => {
  let index = 1;
  for (let i of tasks) {
    let [name, fullName, subs, results, editBtn] = i.getElementsByTagName("td");
    let div = results.getElementsByTagName("tt")[0];

    if (!div) continue;

    let cases = div.innerText.trim().split("");
    let newText = "";

    for (let i = 0; i < cases.length; i++) {
      if (cases[i] === "]" || cases[i] === "[") {
        newText += cases[i];
      } else {
        newText += `<span class="${cases[i] === "P" ? "pass" : "wrong"}">${
          cases[i]
        }</span>`;
      }
    }

    div.innerHTML = newText;
  }
};

(() => {
  attachSearchBar();
  processTask();
})();

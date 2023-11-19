
async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [ tab ] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function onOpen() {
  let tab = await getCurrentTab();

  chrome.scripting
    .executeScript({
      target : { tabId : tab.id },
      files : [ './main/script.js' ],
    });
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("saveColor").addEventListener("click", function() {
        var input = document.getElementById("SimpleColor").value;
        document.getElementById("demo").innerHTML = "The color " + input + " has been saved.";
    });
})

onOpen();
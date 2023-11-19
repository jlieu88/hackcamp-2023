
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

/*function enable() {
  chrome.scripting
    .executeScript({
      target : { tabId : tab.id },
      files : [ './main/script.js' ],
    });
}

function disable() {
  chrome.scripting
    .executeScript({
      target : { tabId : tab.id },
      files : [ './main/disable.js' ],
    });
}*/

onOpen();
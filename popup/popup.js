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
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("saveColor").addEventListener("click", function() {
        var input = document.getElementById("SimpleColor").value;
        document.getElementById("demo5").innerHTML = "The color " + input + " has been saved.";
    });
})


document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("copyR").addEventListener("click", function() {

    var copyTextR = document.getElementById("R").value;
    var copyTextG = document.getElementById("G").value;
    var copyTextB = document.getElementById("B").value;


       // Copy the text inside the text field
      navigator.clipboard.writeText(copyTextR + "." + copyTextG + "." + copyTextB);

      // Alert the copied text

        document.getElementById("demo1").innerHTML = "Copied RGB: " + copyTextR +
         "," + copyTextG +
         "," + copyTextB ;
    });
})



/*
function myFunction1() {
  // Get the text field
  var copyText = document.getElementById("myInput");

  // Select the text field
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices

   // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.value);

  // Alert the copied text
  alert("Copied the text: " + copyText.value);
}

onOpen();
*/

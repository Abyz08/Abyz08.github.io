
function doit()
{
    window.location.href = "index.html";
}

function move(element, direction, distance=10, duration="0.1s") {
   var elId = element.id;
   if (!elId) { throw("Cannot move an element without an ID!"); }
   var elStyleSheet = document.getElementById(elId + "-movement");
   if (!elStyleSheet) {
      elStyleSheet = document.createElement("style");
      elStyleSheet.id = elId + "-movement";
      document.head.appendChild(elStyleSheet);
   }
   var topOrLeft = (direction=="left" || direction=="right") ? "left" : "top";
   if (direction=="up" || direction=="left") { distance *= -1; }
   
   var elStyle = window.getComputedStyle(element);
   var value = elStyle.getPropertyValue(topOrLeft).replace("px", "");
   var destination = (Number(value) + distance) + "px";
   var oldLoc = [elStyle.getPropertyValue("left"), elStyle.getPropertyValue("top")];
   var newLoc = (topOrLeft=="left") ? [destination, oldLoc[1]] : [oldLoc[0], destination];
   elStyleSheet.innerHTML = elStyleSheet.innerHTML.replace(/\s+\#(.|\n)*?\}\s+\n/, "");
   elStyleSheet.innerHTML += `
      #` + elId + `.moved
      {
         transition: all ` + duration + ` linear;
         -webkit-transition: all ` + duration + ` linear;
         -moz-transition: all ` + duration + ` linear;
         -o-transition: all ` + duration + ` linear;
         top: ` + newLoc[1] + `;
         left: ` + newLoc[0] + `;
      }
   `;
   element.classList.add("moved");
}

var littleBox = document.getElementById("little-box");
littleBox.onclick = function(){ move(this); };

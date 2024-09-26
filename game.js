let selectedTool = null;
let selectedItem = null;
const gameContainer = document.querySelector("#game-container");
const tiles = document.querySelectorAll(".fraction > *:not(.sky)");
const tools = document.querySelectorAll("#tools > *");
const items = document.querySelectorAll("#items > *");

function toolClick(tool) {
  console.log(tool.id);
  tools.forEach((tool) => {
    tool.classList.remove("active");
  });
  items.forEach((tool) => {
    tool.classList.remove("active");
  });

  tool.classList.add("active");

  if (tool.classList.contains("active")) {
    selectedItem = null;
    selectedTool = tool.id;
  } else {
    selectedTool = null;
  }
}

function addCount(tile, isStone = false) {
  if (!isStone) {
    const attValue = tile.attributes[1].value;
    const item = document.getElementById(attValue);
    item.setAttribute("count", parseInt(item.getAttribute("count")) + 1);
    return;
  }
  const item = document.getElementById("stone");
  item.setAttribute("count", parseInt(item.getAttribute("count")) + 1);
}

function tileClickEvent(tile) {
  if (selectedTool === "shovel" && tile.classList.contains("ground")) {
    addCount(tile);

    while (tile.attributes.length > 1) {
      tile.removeAttribute(tile.attributes[1].name);
    }

    tile.classList.remove("ground");
    tile.classList.add("sky");
  } else if (selectedTool === "axe" && tile.classList.contains("tree")) {
    addCount(tile);
    tile.classList.remove("tree");
    tile.classList.add("sky");
  } else if (selectedTool === "pickaxe" && tile.classList.contains("stone")) {
    addCount(tile, true);
    tile.classList.remove("stone");
    tile.classList.add("sky");
  }
}

function skyClickEvent(newTile) {
  if (selectedItem) {
    const item = document.getElementById(selectedItem);
    if (item.getAttribute("count") > 0) {
      item.setAttribute("count", parseInt(item.getAttribute("count")) - 1);
      newTile.classList.remove("sky");
      switch (selectedItem) {
        case "wood":
          newTile.classList.add("tree");
          newTile.setAttribute("tree-type", selectedItem);

          break;
        case "stone":
          newTile.classList.add("stone");

          break;
        case "leaves":
          newTile.classList.add("tree");
          newTile.setAttribute("tree-type", selectedItem);

          break;
      }

      if (item.getAttribute("type") === "grass") {
        newTile.classList.add("ground");
        newTile.setAttribute("grass-type", selectedItem);
      } else {
        newTile.classList.add("ground");
        newTile.setAttribute("soil-type", selectedItem);
      }
    }
  }
}

gameContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("sky")) {
    skyClickEvent(e.target);
  } else {
    tileClickEvent(e.target);
  }
});

// tiles.forEach((tile) => {
//   tile.addEventListener("click", () => {
//     tileClickEvent(tile);
//   });
// });

items.forEach((item) => {
  item.addEventListener("click", () => {
    if (item.getAttribute("count") > 0) {
      items.forEach((tool) => {
        tool.classList.remove("active");
      });
      tools.forEach((tool) => {
        tool.classList.remove("active");
      });
      item.classList.add("active");
      const type = item.id;
      selectedTool = null;
      selectedItem = type;
    }
  });
});

// function addClickEvent(sky) {
//   sky.forEach((tile) => {
//     const newTile = tile.cloneNode(true);
//     tile.parentNode.replaceChild(newTile, tile);

//     newTile.addEventListener("click", () => {
//       skyClickEvent(newTile);
//     });
//   });
// }

// function addClickEvent(sky) {
//   sky.forEach((tile) => {
//     // Define the event handler function
//     const eventHandler = () => {
//       skyClickEvent(tile);
//     };

//     const tileEvenhandler = () => {
//       tileClickEvent(tile);
//     };

//     tile.removeEventListener("click", eventHandler);
//     tile.removeEventListener("click", tileEvenhandler);
//     // Remove the existing event listener if it exists
//     tile.removeEventListener("click", eventHandler);

//     // Add the new event listener
//     tile.addEventListener("click", eventHandler);
//   });
// }

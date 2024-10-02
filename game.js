const mainContainer = document.querySelector("#main-container");
const gameContainer = document.querySelector("#game-container");
const tiles = document.querySelectorAll(".fraction > *:not(.sky)");
const tools = document.querySelectorAll("#tools > *");
const resetGameButton = document.querySelector("#reset-game");
const box = document.querySelector(".box");
const itemsContainer = document.querySelector("#items");
const emptyMessage = document.createElement("p");
emptyMessage.textContent = "Start playing to have items!";
emptyMessage.classList.add("highlightText");
let OriginalgameContainer;
let itemsCounter = {};
let selectedTool = undefined;
let itemData = {
  selectedItem: undefined,
  itemType: undefined,
};
let items = [...itemsContainer.children];

document.addEventListener("DOMContentLoaded", () => {
  OriginalgameContainer = gameContainer.innerHTML;

  itemsContainer.append(emptyMessage);
  itemsContainer.classList.add("empty");
});

box.addEventListener("click", () => {
  itemsContainer.classList.toggle("items-active");
  itemsContainer.classList.toggle("hide");
});

function resetGame() {
  items = [...itemsContainer.children];
  gameContainer.innerHTML = OriginalgameContainer;
  items.forEach((item) => {
    item.setAttribute("count", "0");
    itemsCounter[item.id] = 0;
    removeItemFromBox(item);
  });
}

resetGameButton.addEventListener("click", () => {
  resetGame();
});

function toolClick(tool) {
  tools.forEach((tool) => {
    tool.classList.remove("active");
  });
  items.forEach((tool) => {
    tool.classList.remove("active");
  });

  tool.classList.add("active");
  itemData.selectedItem = undefined;
  selectedTool = tool.id;
  document.body.style.cursor = `url(./assets/cursors/${tool.id}.cur), auto`;
}

function addCount(tile) {
  const attValue = tile.attributes[1].value;
  const item = document.getElementById(attValue);
  itemsCounter[item.id] += 1;
  item.setAttribute("count", itemsCounter[item.id]);
}

function addItemToBox(tile) {
  if (itemsContainer.contains(emptyMessage)) {
    itemsContainer.removeChild(emptyMessage);
    itemsContainer.classList.remove("empty");
    itemsContainer.classList.add("items-active");
  }

  const itemToCheck = items.find(
    (item) => item.id === tile.attributes[1].value
  );

  if (itemToCheck) {
    addCount(tile);
  } else {
    const item = document.createElement("div");
    item.classList.add("item");
    item.setAttribute("count", 0);
    item.setAttribute("type", tile.attributes[0].value);
    item.id = tile.attributes[1].value;
    itemsContainer.appendChild(item);
    if (!itemsCounter[item.id]) {
      itemsCounter[item.id] = 0;
    }
    addCount(tile);
    items.push(item);
  }

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
        const type = item.getAttribute("type");
        selectedTool = undefined;

        itemData.selectedItem = item.id;
        itemData.itemType = type;
      }
    });
  });
}

function removeItemFromBox(item) {
  itemsCounter[item.id] -= 1;

  if (itemsCounter[item.id] <= 0) {
    itemsCounter[item.id] = 0;
    itemsContainer.removeChild(item);
    items = items.filter((item) => item.id !== item.id);

    if (itemsContainer.children.length === 0) {
      itemsContainer.append(emptyMessage);
      itemsContainer.classList.add("empty");
    }
  } else {
    item.setAttribute("count", itemsCounter[item.id]);
  }
  console.log(itemsCounter);
}

function tileClickEvent(tile) {
  if (
    selectedTool === "shovel" &&
    (tile.classList.contains("grass") || tile.classList.contains("soil"))
  ) {
    addItemToBox(tile);

    while (tile.attributes.length > 1) {
      tile.removeAttribute(tile.attributes[1].name);
    }

    tile.classList.remove("grass");
    tile.classList.remove("soil");
    tile.classList.add("sky");
  } else if (
    selectedTool === "axe" &&
    (tile.classList.contains("wood") || tile.classList.contains("leaves"))
  ) {
    addItemToBox(tile);

    while (tile.attributes.length > 1) {
      tile.removeAttribute(tile.attributes[1].name);
    }
    tile.classList.remove("wood");
    tile.classList.remove("leaves");
    tile.classList.add("sky");
  } else if (selectedTool === "pickaxe" && tile.classList.contains("stone")) {
    addItemToBox(tile);

    tile.classList.remove("stone");
    tile.classList.add("sky");
  }
}

function skyClickEvent(newTile) {
  if (itemData.selectedItem) {
    const item = document.getElementById(itemData.selectedItem);
    if (item.getAttribute("count") > 0) {
      removeItemFromBox(item);

      newTile.classList.remove("sky");

      switch (itemData.itemType) {
        case "wood":
          newTile.classList.add("wood");
          while (newTile.attributes.length > 1) {
            newTile.removeAttribute(newTile.attributes[1].name);
          }
          newTile.setAttribute("wood-type", itemData.selectedItem);
          break;

        case "stone":
          newTile.classList.add("stone");
          newTile.setAttribute("stone-type", itemData.selectedItem);
          break;

        case "leaves":
          newTile.classList.add("leaves");
          while (newTile.attributes.length > 1) {
            newTile.removeAttribute(newTile.attributes[1].name);
          }
          newTile.setAttribute("leaves-type", itemData.selectedItem);
          break;

        case "grass":
          newTile.classList.add("grass");
          newTile.setAttribute("grass-type", itemData.selectedItem);
          break;

        case "soil":
          newTile.classList.add("soil");
          newTile.setAttribute("soil-type", itemData.selectedItem);
          break;
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

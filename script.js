const deck = document.getElementById("cardsContainer");
const debugText = document.getElementById("debugText");

// let cardData = []

// Template
const templateCard = document.getElementById("cardTemplate")

function showElement(e) {
    e.hidden = false;
}
function hideElement(e) {
    e.hidden = true;
}

// Edit Card
const overlay = document.getElementById("overlay")
const editCard = document.getElementById("editCard")
const fileUpload = document.getElementById("fileUpload")
const soldOutCheckbox = document.getElementById("soldOutCheckbox")

const addButton = document.getElementById("addButton")
const saveButton = document.getElementById("saveButton")
const loadButton = document.getElementById("loadButton")
const clearButton = document.getElementById("clearButton")

// const auroriteInput = document.getElementById("auroriteInput")
const triaInput = document.getElementById("triaInput")

function createCard() {
    const copy = templateCard.cloneNode(true)
    setupDraggable(copy)
    deck.appendChild(copy)
    copy.hidden = false
    return copy
}

function loadDetails(card) {
    editCard.querySelector("#thumbnailPreview").src = card.querySelector(".thumbnail").src;
    // auroriteInput.value = card.querySelector(".priceAurorite").textContent;
    triaInput.value = Number((card.querySelector(".priceTria").textContent).replace(/,/g, ""));
    soldOutCheckbox.checked = !card.querySelector(".soldOutOverlay").hidden;
    editCard.querySelector(".soldOutOverlay").hidden = card.querySelector(".soldOutOverlay").hidden;
}

function saveDetails(card) {
    card.querySelector(".thumbnail").src = editCard.querySelector("#thumbnailPreview").src;
    // card.querySelector(".priceAurorite").textContent = auroriteInput.value;
    const triaValue = Number(triaInput.value)
    if (triaValue > 9999) {
        card.querySelector(".priceTria").textContent = triaValue.toLocaleString('en-US');
    } else {
        card.querySelector(".priceTria").textContent = triaValue
    }
    card.querySelector(".soldOutOverlay").hidden = editCard.querySelector(".soldOutOverlay").hidden;
}

function openCard(card) {
    editing = true
    target = card;
    loadDetails(card);
    showElement(overlay)
    triaInput.focus()
    triaInput.select()
}

function closeCard() {
    editing = false
    saveDetails(target);
    target = null;
    hideElement(overlay)
}

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.hidden = true

let saving = false;
async function saveShop() {
    saving = true;
    debugText.textContent = "Saving..."
    let cardData = []
    for (const card of deck.querySelectorAll(".card")) {
        // Saving thumbnails
        const thumbnail = card.querySelector(".thumbnail")

        canvas.width = 300;
        canvas.height = 300 * (thumbnail.naturalHeight / thumbnail.naturalWidth);

        const ctx = canvas.getContext("2d");
        ctx.drawImage(thumbnail, 0, 0, canvas.width, canvas.height);
        console.log(canvas.toDataURL("image/png", 1).length * 0.75 / 1000)
        cardData.push([
            card.querySelector(".priceTria").textContent,
            card.querySelector(".soldOutOverlay").hidden,
            canvas.toDataURL("image/png", 1)
        ]);

    }
    localStorage.setItem("lastSave", JSON.stringify(cardData))
    saving = false;
    setTimeout(function () {
        debugText.textContent = "Saved"
    }, Math.random() * 500 + 500)
    setTimeout(function () {
        debugText.textContent = ""
    }, 3000)
}

function loadShop() {
    const lastSave = JSON.parse(localStorage.getItem("lastSave"))
    for (const savedCard of lastSave) {
        let card = createCard()
        // card.querySelector(".priceAurorite").textContent = 
        card.querySelector(".priceTria").textContent = savedCard[0];
        card.querySelector(".soldOutOverlay").hidden = savedCard[1];
        card.querySelector(".thumbnail").src = savedCard[2];
    }
}

// Buttons
addButton.addEventListener("click", function () {
    openCard(createCard());
});
saveButton.addEventListener("click", saveShop)
loadButton.addEventListener("click", loadShop)
clearButton.addEventListener("click", function () {
    for (const card of deck.querySelectorAll(".card")) {
        card.remove()
    }
})


var editing = false
var target = null;

const preview = document.getElementById("thumbnailPreview")
window.addEventListener('paste', (e) => {
    if (editing) {
        const editingField = document.activeElement &&
            (
                document.activeElement.matches("input, textarea, select") ||
                document.activeElement.isContentEditable
            );
        if (!editingField) {
            e.preventDefault();
            if (e.clipboardData.files) {
                fileUpload.files = e.clipboardData.files;
                preview.src = URL.createObjectURL(fileUpload.files[0]);
            }
        }
    }
});

window.addEventListener('click', (e) => {
    const cardTarget = e.target.closest(".card");
    if (e.target.closest("button")) {
        return;
    }
    if (!editing) {
        if (cardTarget) {
            openCard(cardTarget);
        }
    } else {
        if (!e.target.closest("#editCard")) {
            closeCard()
        }
    }
})

soldOutCheckbox.addEventListener("change", () => {
    editCard.querySelector(".soldOutOverlay").hidden = !soldOutCheckbox.checked;
})

fileUpload.addEventListener("change", (e) => {
    preview.src = URL.createObjectURL(fileUpload.files[0]);
})

window.addEventListener("keydown", (e) => {
    if (editing) {
        if (e.key === "Enter") {
            closeCard()
        }

        if ((e.key === "Backspace" || e.key === "Delete") && target) {
            const ignore = document.activeElement &&
                (
                    document.activeElement.matches("input, textarea, select") ||
                    document.activeElement.isContentEditable
                );
            if (!ignore) {
                target.remove();
                target = null;
                hideElement(overlay)
                editing = false
            }
        }
    }
})

// AI GENERATED CODE
function setupDraggable(card) {
    card.draggable = true;

    card.addEventListener("dragstart", (e) => {
        draggedCard = card;
        card.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", card.dataset.id || "");
    });

    card.addEventListener("dragend", () => {
        draggedCard.classList.remove("dragging");
        draggedCard = null;
    });

    card.addEventListener("dragover", (e) => {
        e.preventDefault();

        if (!draggedCard || draggedCard === card) return;

        const rect = card.getBoundingClientRect();
        const before = e.clientX < rect.left + rect.width / 2;
        const target = before ? card : card.nextSibling;

        if (target !== draggedCard && target !== draggedCard.nextSibling) {
            deck.insertBefore(draggedCard, target);
        }
    });

    card.addEventListener("drop", (e) => {
        e.preventDefault();
        // Not needed since dragover constantly updates the arrangement
    });
}
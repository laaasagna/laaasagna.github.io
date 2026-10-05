const cards = document.getElementById("cardsContainer");
const debugText = document.getElementById("debugText");

// Template
const templateCard = document.getElementById("cardTemplate")

function showElement(e) {
    e.hidden = false;
}
function hideElement(e) {
    e.hidden = true;
}

const auroriteInput = document.getElementById("auroriteInput")
const triaInput = document.getElementById("triaInput")

function loadDetails(card) {
    editCard.querySelector("#thumbnailPreview").src = card.querySelector(".thumbnail").src;
    auroriteInput.value = card.querySelector(".priceAurorite").textContent;
    triaInput.value = card.querySelector(".priceTria").textContent;
    // console.log(card.querySelector(".thumbnail").src);
    // console.log(card.querySelector(".priceTria").textContent);
    // console.log(card.querySelector(".priceAurorite").textContent);
}

function saveDetails(card) {
    card.querySelector(".thumbnail").src = editCard.querySelector("#thumbnailPreview").src;
    card.querySelector(".priceAurorite").textContent = auroriteInput.value;
    card.querySelector(".priceTria").textContent = triaInput.value;
}

// Edit Card
const overlay = document.getElementById("overlay")
const editCard = document.getElementById("editCard")
const fileUpload = document.getElementById("fileUpload")
const addButton = document.getElementById("addButton")

var editing = false
var target = null;
addButton.addEventListener("click", () => {
    const copy = templateCard.cloneNode(true)
    copy.id = ""
    setupDraggable(copy)
    cards.appendChild(copy)
    copy.hidden = false
});

const preview = document.getElementById("thumbnailPreview")
window.addEventListener('paste', (e) => {
    if (editing) {
        fileUpload.files = e.clipboardData.files;
        preview.src = URL.createObjectURL(fileUpload.files[0]);
    }
});

window.addEventListener('click', (e) => {
    const cardTarget = e.target.closest(".card");
    if (!editing) {
        if (cardTarget) {
            editing = true
            target = cardTarget;
            loadDetails(target);
            showElement(overlay)
            showElement(editCard)
        }
    } else {
        if (!e.target.closest("#editCard")) {
            editing = false
            saveDetails(target);
            target = null;
            hideElement(overlay)
            hideElement(editCard)
        }
    }
})

fileUpload.addEventListener("change", (e) => {
    preview.src = URL.createObjectURL(fileUpload.files[0]);
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

        const container = cards;
        const target = before ? card : card.nextSibling;

        if (target !== draggedCard && target !== draggedCard.nextSibling) {
            container.insertBefore(draggedCard, target);
        }
    });

    card.addEventListener("drop", (e) => {
        e.preventDefault();

        if (!draggedCard || draggedCard === card) return;

        const parent = cards;
        const isAfter = card.compareDocumentPosition(draggedCard) & Node.DOCUMENT_POSITION_FOLLOWING;

        if (getDropPosition(card, e) === "after") {
            parent.insertBefore(draggedCard, card.nextSibling);
        } else {
            parent.insertBefore(draggedCard, card);
        }
    });
}

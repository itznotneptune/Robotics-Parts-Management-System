`Parts table`

var partsImages = {};

fetch("../backend/partsImages.csv")
    .then(function(response) {
        return response.text();
    })
    .then(function(text) {
        var lines = text.split("\n");

        for (var i = 1; i < lines.length; i++) {
            var comma = lines[i].indexOf(",");
            var keyword = lines[i].substring(0, comma);
            var imageURL = lines[i].substring(comma + 1);
            partsImages[keyword] = imageURL;
        }

        tableRenderer();
    })

function getImage(partName) {
    var lowerCase = partName.toLowerCase();
    var keywords = Object.keys(partsImages);

    for (var i = 0; i < keywords.length; i++) {
        if (lowerCase.includes(keywords[i])) {
            return "<img src='" + partsImages[keywords[i]] + "' width='40'> ";
        }
    }

    return "";
}

function saveParts() {
    localStorage.setItem("parts", JSON.stringify(parts));
}

function loadParts() {
    var savedParts = localStorage.getItem("parts");
    if (savedParts != null) {
        parts = JSON.parse(savedParts);
    }
}

var parts = [{name: "V5 Smart Motor", category: "Electronics", quantity: 10, condition: "Good", threshold: 5},
                {name: "1x2x1x35 C-Channel (6 Pack)", category: "Structure", quantity: 10, condition: "Good", threshold: 5}
];
loadParts();

function searchPart() {
    var searching = document.getElementById("searchBar").value.toLowerCase();
    var filtered = parts.filter(function(part) {
        return part.name.toLowerCase().includes(searching) || part.category.toLowerCase().includes(searching);
    });
    var tbody = document.getElementById("partsTable");
    tbody.innerHTML = "";

    for (var i = 0; i < filtered.length; i++) {
        var part = filtered[i];
        tbody.innerHTML += "<tr><td>" + getImage(part.name) + part.name + "</td><td>" + part.category + "</td><td>" + part.quantity + "</td><td>" + part.condition + "</td><td><button type='button' onclick='deletePart(\"" + part.name + "\")'>Delete</button></td></tr>";
    }
}

function deletePart(partName) {
    parts = parts.filter(function(part) {
        return part.name !== partName;
    });
    saveParts();
    tableRenderer();
}

function addPart() {
    var name = document.getElementById("partName").value;
    var category = document.getElementById("partCategory").value;
    var qty = document.getElementById("partQty").value;
    var condition = document.getElementById("partCondition").value;
    var threshold = document.getElementById("partThreshold").value;

    parts.push({name: name, category: category, quantity: qty, condition: condition, threshold: threshold});
    tableRenderer();

    document.getElementById("addDialog").close();
    saveParts();
}

function clearTable() {
    parts = [];
    tableRenderer();
    saveParts();
}

`BoM table stuff`

function getCategoryFromUrl(url) {
    var cutout = url.split("/").pop();
    cutout = cutout.replace("v5-", "").replace(".html", "");
    return cutout.charAt(0).toUpperCase() + cutout.slice(1);
}

function getInventoryQty(partName) {
    for (var i = 0; i < parts.length; i++) {
        if (parts[i].name === partName) {
            return parts[i].quantity;
        }
    }
    return 0;
}

function getStatus(inventoryQty, needed) {
    if(inventoryQty >= needed) return {text: "Complete", color: "background-color: Lightgreen"};
    if (inventoryQty > 0) return {text: "Incomplete", color: "background-color: Yellow"};
    return {text: "Missing", color: "background-color: Red"};
}

function importBom(bom) {
    var file = bom.target.files[0];
    var reader = new FileReader();

    reader.onload = function(file) {
        var lines = file.target.result.split("\n");
        var tbody = document.getElementById("bomTable");
        tbody.innerHTML = "";

        for (var i = 1; i < lines.length; i++) {
            if (lines[i].trim() === "") continue;

            var cols = lines[i].split(",");
            var qty = cols[1] ? cols[1].trim() : "0";
            var partNumber = cols[2] ? cols[2].trim() : "";
            var description = cols[3] ? cols[3].trim() : "";
            var name = cols[4] ? cols[4].trim() : "";

            var category = description.includes("vexrobotics.com") ? getCategoryFromUrl(description) : "N/A";
            var inventoryQty = getInventoryQty(name);
            var status = getStatus(inventoryQty, parseInt(qty));

            tbody.innerHTML += "<tr style='" + status.color + "'><td>" + name + "</td><td>" + category + "</td><td>" + inventoryQty + "/" + qty + "</td><td>" + status.text + "</td><td>" + partNumber + "</td></tr>";
        }
    };

    reader.readAsText(file);
}

`Table renderer`

function tableRenderer() {
    var tbody = document.getElementById("partsTable");
    tbody.innerHTML = "";

    for (var i = 0; i < parts.length; i++) {
        var part = parts[i];
        var color = parseInt(part.quantity) < parseInt(part.threshold) ? "background-color: yellow;" : "";
            tbody.innerHTML += "<tr style ='" + color + "'><td>" + getImage(part.name) + part.name + "</td><td>" + part.category + "</td><td>" + part.quantity + "</td><td>" + part.condition + "</td><td>" + part.threshold + "</td><td><button type='button' onclick='deletePart(\"" + part.name + "\")'>Delete</button></td></tr>";
    }
}

tableRenderer();
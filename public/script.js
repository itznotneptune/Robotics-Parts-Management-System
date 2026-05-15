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

var parts = [{name: "V5 Smart Motor", category: "Electronics", quantity: 10, condition: "Good", threshold: 5},
                {name: "1x2x1x35 C-Channel (6 Pack)", category: "Structure", quantity: 10, condition: "Good", threshold: 5}
];

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
    tableRenderer();
}

function tableRenderer() {
    var tbody = document.getElementById("partsTable");
    tbody.innerHTML = "";

    for (var i = 0; i < parts.length; i++) {
        var part = parts[i];
        var color = part.quantity <= part.threshold ? "background-color: yellow;" : "";
            tbody.innerHTML += "<tr style ='" + color + "'><td>" + getImage(part.name) + part.name + "</td><td>" + part.category + "</td><td>" + part.quantity + "</td><td>" + part.condition + "</td><td>" + part.threshold + "</td><td><button type='button' onclick='deletePart(\"" + part.name + "\")'>Delete</button></td></tr>";
    }
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
}

tableRenderer();
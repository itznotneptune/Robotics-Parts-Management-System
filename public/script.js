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

var parts = [{name: "V5 Smart Motor", category: "Electronics", quantity: 10, condition: "Good"},
                {name: "1x2x1x35 C-Channel (6 Pack)", category: "Structure", quantity: 5, condition: "Good"}
];

function tableRenderer() {
    var tbody = document.getElementById("partsTable");
    tbody.innerHTML = "";
    parts.forEach(
        function(part) {
            tbody.innerHTML += "<tr><td>" + getImage(part.name) + part.name + "</td><td>" + part.category + "</td><td>" + part.quantity + "</td><td>" + part.condition + "</td></tr>";
        });
}

function addPart() {
    var name = document.getElementById("partName").value;
    var category = document.getElementById("partCategory").value;
    var qty = document.getElementById("partQty").value;
    var condition = document.getElementById("partCondition").value;

    parts.push({name: name, category: category, quantity: qty, condition: condition});
    tableRenderer();

    document.getElementById("addDialog").close();
}

tableRenderer();
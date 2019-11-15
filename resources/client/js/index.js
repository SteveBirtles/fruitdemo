function pageLoad() {

    fetch('/fruit/list', {method: 'get'}
    ).then(response => response.json()
    ).then(fruits => {

        let fruitsHTML = `<table style='width: 100%;'>` +
            '<tr>' +
            '<th>Id</th>' +
            '<th>Name</th>' +
            '<th>Image</th>' +
            '<th>Colour</th>' +
            '<th>Size</th>' +
            '<th>Options</th>' +
            '</tr>';

        for (let fruit of fruits) {

            fruitsHTML += `<tr>` +
                `<td>${fruit.id}</td>` +
                `<td>${fruit.name}</td>` +
                `<td><img src='/client/img/${fruit.image}' alt='Picture of ${fruit.name}' height='100px'></td>` +
                `<td>${fruit.colour}</td>` +
                `<td>${fruit.size}</td>` +
                `<td>` +
                `<button class='editButton' data-id='${fruit.id}'>Edit</button>` +
                `<button class='deleteButton' data-id='${fruit.id}' style='margin-left: 10px;'>Delete</button>` +
                `</td>` +
                `</tr>`;

        }

        fruitsHTML += '</table>';

        document.getElementById("listDiv").innerHTML = fruitsHTML;

        let editButtons = document.getElementsByClassName("editButton");
        for (let button of editButtons) {
            button.addEventListener("click", editFruit);
        }

        let deleteButtons = document.getElementsByClassName("deleteButton");
        for (let button of deleteButtons) {
            button.addEventListener("click", deleteFruit);
        }

    });

    document.getElementById("saveButton").addEventListener("click", saveEdit);
    document.getElementById("cancelButton").addEventListener("click", cancelEdit);

}

function editFruit(event) {

    document.getElementById("listDiv").style.display = 'none';
    document.getElementById("editDiv").style.display = 'block';

    let id = event.target.getAttribute("data-id");

    fetch('/fruit/get/' + id, {method: 'get'}
    ).then(response => response.json()
    ).then(fruit => {

        if (fruit.hasOwnProperty('error')) {
            alert(fruit.error);
        } else {
            document.getElementById("fruitId").value = id;
            document.getElementById("fruitName").value = fruit.name;
            document.getElementById("fruitImage").value = fruit.image;
            document.getElementById("fruitColour").value = fruit.colour;
            document.getElementById("fruitSize").value = fruit.size;
        }

    });

}

function saveEdit(event) {

    event.preventDefault();

}

function cancelEdit(event) {

    event.preventDefault();

    document.getElementById("listDiv").style.display = 'block';
    document.getElementById("editDiv").style.display = 'none';

}


function deleteFruit(event) {

    let ok = confirm("Are you sure?");

    if (ok === true) {

        let id = event.target.getAttribute("data-id");
        let formData = new FormData();
        formData.append("id", id);

        fetch('/fruit/delete', {method: 'post', body: formData}
        ).then(response => response.json()
        ).then(data => {

                if (data.hasOwnProperty('error')) {
                    alert(data.error);
                } else {
                    pageLoad();
                }
            }
        );
    }

}
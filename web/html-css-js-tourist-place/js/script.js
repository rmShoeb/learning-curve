const places = new Array();
sessionStorage.clear();


// context switching
// the function
function SwitchContext() {
    let addNew = document.getElementById('add-new-place');
    let places = document.getElementById('places-list')

    addNew.hidden = !addNew.hidden;
    places.hidden = !places.hidden;
}
// event listener
{
    let backToTouristId = document.getElementById('back-to-tourist');
    let backToAddNewPlace = document.getElementById('create-new-place');
    backToTouristId.addEventListener('click', SwitchContext);
    backToAddNewPlace.addEventListener('click', SwitchContext);
}

/**
 * Create Operation
*/
document.getElementById('btn-submit-new-place').addEventListener('click', function (event) {
    event.preventDefault();
    const form = document.forms['add-new-place'];
    const validatedData = ValidateAddNewForm(form);
    if (validatedData['validationSuccess']) {
        places.push(validatedData['place']);
        SwitchContext();
        ShowPlaces(places);
    } else {
        alert(validatedData['validationMessage']);
    }
});
function isNumeric(str) {
    return !isNaN(str) && !isNaN(parseFloat(str));
}
function ValidateAddNewForm(formData) {
    const name = formData['name'].value.trim();
    const address = formData['address'].value.trim();
    const rating = formData['rating'].value.trim();
    const picture = formData['picture'].files[0];

    const validatedData = {
        validationSuccess: true,
        validationMessage: '',
        place: {},
    };

    if (name.length == 0 || isNumeric(name)) {
        validatedData['validationSuccess'] = false;
        validatedData['validationMessage'] += 'Place Name is invalid\n';
    }
    else if (isNumeric(address) || address.length == 0) {
        validatedData['validationSuccess'] = false;
        validatedData['validationMessage'] += 'Address is invalid\n';
    }
    else if (!isNumeric(rating) || rating < 1 || rating > 5) {
        validatedData['validationSuccess'] = false;
        validatedData['validationMessage'] += 'Rating is invalid\n';
    }
    else if (picture === undefined || !picture.type.includes('image/')) {
        validatedData['validationSuccess'] = false;
        validatedData['validationMessage'] += 'Upload an Image\n';
    }
    else {
        validatedData['place']['id'] = Math.random().toString(36).substring(2, 12);
        validatedData['place']['name'] = name;
        validatedData['place']['address'] = address;
        validatedData['place']['rating'] = Number(rating);
        validatedData['place']['imgURL'] = URL.createObjectURL(picture);
        formData.reset();
    }
    return validatedData;
}

/**
 * this function does the read operation
 * @param {*} places
 */
function ShowPlaces(places) {
    let row = ``;
    places.forEach(function (place, i) {
        row += `
        <div>${place['name']}</div>
		<div>${place['address']}</div>
		<div>${place['rating']}</div>
		<div class="image-container">
			<img src="${place['imgURL']}" alt="${place['name']}">
		</div>
		<div class="text-right">
			<button class="delete" onclick="DeletePlace(${i})">Delete</button>
			<button class="submit" onclick="UpdatePlace(${i})">Update</button>
		</div>`;
    });
    document.getElementById('container-for-places-list').innerHTML = row;
}

/**
 * Update
 * @param {*} index 
 */
function UpdatePlace(index) {
    event.preventDefault();
    SwitchContext();

    document.querySelector('#add-new-place h3').innerText = 'Update Tourist Place';
    document.getElementById('name').value = places[index]['name'];
    document.getElementById('address').value = places[index]['address'];
    document.getElementById('rating').value = places[index]['rating'];
    document.querySelector('#update-img-preview img').setAttribute('src', places[index]['imgURL']);
    document.getElementById('update-img-preview').hidden = false;
    document.getElementById('place-index').value = index;
    document.getElementById('btn-submit-new-place').hidden = true;
    document.getElementById('btn-update-place').hidden = false;
}
document.getElementById('btn-update-place').addEventListener('click', function (event) {
    event.preventDefault();
    const form = document.forms['add-new-place'];
    const validatedData = ValidateAddNewForm(form);

    if (validatedData['validationSuccess']) {
        places.splice(form['index'].value, 1, validatedData['place']);
        document.querySelector('#add-new-place h3').innerText = 'Add a new tourist place';
        document.getElementById('btn-submit-new-place').hidden = false;
        document.getElementById('btn-update-place').hidden = true;
        document.getElementById('update-img-preview').hidden = true;
        SwitchContext();
        ShowPlaces(places);
    }
    else {
        alert(validatedData['validationMessage']);
    }
});
document.getElementById('reset-place-form').addEventListener('click', function (event) {
    document.forms['add-new-place'].reset();
    document.querySelector('#add-new-place h3').innerText = 'Add a new tourist place';
    document.getElementById('btn-submit-new-place').hidden = false;
    document.getElementById('btn-update-place').hidden = true;
    document.getElementById('update-img-preview').hidden = true;
});

/**
 * Delete
 * @param {*} index 
 */
function DeletePlace(index) {
    event.preventDefault();
    document.forms['add-new-place'].reset(); // in case there was any data for edit
    sessionStorage.removeItem(places[index]['id']);
    places.splice(index, 1);
    ShowPlaces(places);
}


/**
 * Sorting
 */
document.getElementById('header-name').addEventListener('click', function (event) {
    event.preventDefault();

    switch (document.forms['sorted-data']['name'].value) {
        case "": // this means the array was not sorted before, sort the array into ascending order
        case "2": // sorted in descending order, sort into ascending order
            document.forms['sorted-data']['name'].value = 1;
            sorted = places.sort(function (p1, p2) {
                if (p1['name'] > p2['name']) return 1;
                if (p1['name'] < p2['name']) return -1;
                return 0;
            });
            break;
        default: // sorted in ascending order, sort into descending order
            document.forms['sorted-data']['name'].value = 2;
            sorted = places.sort(function (p1, p2) {
                if (p1['name'] > p2['name']) return -1;
                if (p1['name'] < p2['name']) return 1;
                return 0;
            });
    }
    ShowPlaces(sorted);
});
document.getElementById('header-address').addEventListener('click', function (event) {
    event.preventDefault();

    switch (document.forms['sorted-data']['address'].value) {
        case "": // this means the array was not sorted before, sort the array into ascending order
        case "2": // sorted in descending order, sort into ascending order
            document.forms['sorted-data']['address'].value = 1;
            sorted = places.sort(function (p1, p2) {
                if (p1['address'] > p2['address']) return 1;
                if (p1['address'] < p2['address']) return -1;
                return 0;
            });
            break;
        default: // sorted in ascending order, sort into descending order
            document.forms['sorted-data']['address'].value = 2;
            sorted = places.sort(function (p1, p2) {
                if (p1['address'] > p2['address']) return -1;
                if (p1['address'] < p2['address']) return 1;
                return 0;
            });
    }
    ShowPlaces(sorted);
});
document.getElementById('header-rating').addEventListener('click', function (event) {
    event.preventDefault();

    switch (document.forms['sorted-data']['rating'].value) {
        case "": // this means the array was not sorted before, sort the array into ascending order
        case "2": // sorted in descending order, sort into ascending order
            document.forms['sorted-data']['rating'].value = 1;
            sorted = places.sort(function (p1, p2) {
                if (p1['rating'] > p2['rating']) return 1;
                if (p1['rating'] < p2['rating']) return -1;
                return 0;
            });
            break;
        default: // sorted in ascending order, sort into descending order
            document.forms['sorted-data']['rating'].value = 2;
            sorted = places.sort(function (p1, p2) {
                if (p1['rating'] > p2['rating']) return -1;
                if (p1['rating'] < p2['rating']) return 1;
                return 0;
            });
    }
    ShowPlaces(sorted);
});


/**
 * search as you type
 */
document.getElementById('search-box').addEventListener('keyup', function () {
    const searchString = this.value;
    ShowPlaces(places.filter(function (place) {
        return place['name'].toLowerCase().includes(searchString.toLowerCase());
    }));
});

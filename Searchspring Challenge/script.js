const searchSpringAPI = "https://scmq7n.a.searchspring.io/api/search/search.json"
let pageNumber;

$("#searchButton").click(function() {
    const userSearch = $("#search").val();

    userRequest(userSearch, 1); //passing in user search + page number (don't want to use current here)

})

//Previous functionality
$("#previous").click(function() {

    const userSearch = $("#search").val();

    userRequest(userSearch, pageNumber.prev); //.prev grabs the previous page of data dynamically
})

//Next functionality
$("#next").click(function() {

    const userSearch = $("#search").val();

    userRequest(userSearch, pageNumber.next); //.next grabs the next page of data dynamically
})


//Gives pagination data
function paginateData(searchData) {
    const pageData = {
        prev: searchData.pagination.previousPage,
        curr: searchData.pagination.currentPage,
        next: searchData.pagination.nextPage
    }

    return pageData;
}

//Determines display of prev and next buttons
function displayButtons(pageNumber) {

    //Checks only prev validation
    if(pageNumber.prev === 0) {
        $("#previous").hide(); //No more pages left
    } else if(pageNumber.prev !== 0) {
        $("#previous").show(); //Still pages left
    } else {
        console.log(pageNumber) //error catcher
    }

    //Checks only next validation
    if (pageNumber.next === 0) {
        $("#next").hide();
    } else if(pageNumber.next !== 0) {
        $("#next").show();
    } else {
        console.log(pageNumber)
    }

    //Note for me: tried doing this where both if statements were merged into one big if statement.
    // It didn't work. Once one is triggered the rest don't fire. Keep seperated.

}

function userRequest(q, pageNum) {

    const searchParameters = new URLSearchParams({
        resultsFormat: "native",
        siteId: "scmq7n",
        q: q,
        page: pageNum,
        resultsPerPage: 20
    });

    const editedURL = searchSpringAPI + "?" + searchParameters;

    fetch(editedURL) //Getting URL

    .then(response => response.json())
        .then(data => {
            console.log(data.results) //Turns it into manipulable data
            pageNumber = paginateData(data); //Assigns number to pageNumber by finding page data
            renderProducts(data.results);
            displayButtons(pageNumber);
            console.log(data);

        })
        .catch(error =>
            console.log(error)) //Catches errors if they arise
}



function renderProducts(products) {

    let html = ""; //Clears html out every time function is called

    products.forEach(result => {

        let hasSale = result.hasOwnProperty("msrp");

        let originalPrice = parseFloat(result.price).toFixed(2)
        let salePrice = parseFloat(result.msrp).toFixed(2)

        html += "<img src=\"" + result.thumbnailImageUrl + "\">" +
        "<h1>" + result.name + "</h1>"

        if (!hasSale || originalPrice >= salePrice) {
            html += "<p>$" + originalPrice + "</p>"
        } else {
            html += "<p><strike>$" + salePrice + "</strike></p>" + " " +
                "<p>$" + originalPrice + "</p>"
        }
    })

    document.getElementById("results").innerHTML = html

}

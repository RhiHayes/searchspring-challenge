const searchSpringAPI = "https://scmq7n.a.searchspring.io/api/search/search.json"
let pageNumber;

$("#searchButton").click(function() {
    const userSearch = $("#search").val();

    userRequest(userSearch, 1); //passing in user search + page number (don't want to use current here)

})

//Previous functionality
$("#prev").click(function() {

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
        curr: searchData.pagination.currentPage,
        next: searchData.pagination.nextPage,
        prev: searchData.pagination.previousPage
    }

    return pageData;
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

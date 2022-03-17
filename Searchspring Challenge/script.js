const searchSpringAPI = "https://scmq7n.a.searchspring.io/api/search/search.json"


$("#searchButton").click(function() {
    const userSearch = $("#search").val();
    console.log(userSearch);

    userRequest(userSearch); //passing in user search
})


function userRequest(q) {

    const searchParameters = new URLSearchParams({
        resultsFormat: "native",
        siteId: "scmq7n",
        q: q,
        resultsPerPage: 21
    });

    const editedURL = searchSpringAPI + "?" + searchParameters;

    fetch(editedURL) //Getting URL

    .then(response => response.json())
        .then(data => {
            console.log(data.results) //Turns it into manipulable data
            renderProducts(data.results);

        })
        .catch(error =>
            console.log(error)) //Catches errors if they arise
}



function renderProducts(products) {

    let html = ""; //Clears html out everytime function is called

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

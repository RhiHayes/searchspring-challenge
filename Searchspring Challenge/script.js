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
        q: q
    });

    const editedURL = searchSpringAPI + "?" + searchParameters;

    console.log(editedURL);

}

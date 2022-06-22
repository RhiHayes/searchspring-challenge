const searchSpringAPI = "https://scmq7n.a.searchspring.io/api/search/search.json"
let pageNumber;
let colorArray = [];
let clothingArray = [];

$("#previous").hide()
$("#next").hide()
$(".search-results").hide()

$("#searchButton").click(function() {
    const userSearch = $("#search").val();

    $(".color-box").data('clicked', false);
    $(".dropdown-item").data('clicked', false);

    $("#previous").show()
    $("#next").show()
    $(".search-results").show()

    $("#results").empty();
    userRequest(userSearch, 1); //passing in user search + page number (don't want to use current here)

})

//Checking for when a user hits enter
$(document).on('keypress', function(e) {
    if(e.which == 13) {
        const userSearch = $("#search").val();

        $(".color-box").data('clicked', false);
        $(".dropdown-item").data('clicked', false);

        $("#previous").show()
        $("#next").show()
        $(".search-results").show()

        $("#results").empty();
        userRequest(userSearch, 1); //passing in user search + page number (don't want to use current here)
    }
});

//Previous functionality
$("#previous").click(function() {

    let userSearch;

    //Check to see if color picker was used
    if($('.color-box').data('clicked')) {

        let myColor = colorArray.slice(-1).pop()
        console.log(myColor);

        userSearch = myColor;

        //Check to see if dropdown was clicked
    } else if ($('.dropdown-item').data('clicked')) {
        let myClothes = clothingArray.slice(-1).pop()
        console.log(myClothes);

        userSearch = myClothes;
    }

    //If none, use search results
    else {
        userSearch = $("#search").val();
    }

    $("#results").empty();
    userRequest(userSearch, pageNumber.prev); //.prev grabs the previous page of data dynamically
})

//Next functionality
$("#next").click(function() {

    let userSearch;

    //Check to see if color picker was used
    if($('.color-box').data('clicked')) {

        let myColor = colorArray.slice(-1).pop()
        console.log(myColor);

        userSearch = myColor;

        //Check to see if dropdown was clicked
    } else if ($('.dropdown-item').data('clicked')) {
        let myClothes = clothingArray.slice(-1).pop()
        console.log(myClothes);

        userSearch = myClothes;
    }

    //If none, use search results
    else {
        userSearch = $("#search").val();
    }

    $("#results").empty();
    userRequest(userSearch, pageNumber.next); //.next grabs the next page of data dynamically
})


//Registers color picker and pushes clicked color to an array (colorArray)
$(".color-box").on('click', function() {

    let myColor = this.className.split(' ')[1];

    let userSearch = myColor;

    $(".color-box").data('clicked', true);
    $(".dropdown-item").data('clicked', false);

    colorArray.push(myColor);

    $("#previous").show()
    $("#next").show()
    $(".search-results").show()

    $("#results").empty();
    userRequest(userSearch, 1); //.next grabs the next page of data dynamically
})


//Registers dropdown click and pushes clicked item to an array (clothesArray)
$(".dropdown-item").on('click', function() {

    let myClothes = $(this).text();

    let userSearch = myClothes;

    $(".color-box").data('clicked', false);
    $(".dropdown-item").data('clicked', true);

    clothingArray.push(myClothes);

    $("#previous").show()
    $("#next").show()
    $(".search-results").show()

    $("#results").empty();
    userRequest(userSearch, 1); //takes whatever dropdown item is clicked and searches for it
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

            let newQ = q.replace(/-/g, " "); //Replace dash with spaces

            //Capitalize first letter of every string
            function toTitleCase(str) {
                return str.replace(/\w\S*/g, function(txt){
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });
            }

            let finalQ = toTitleCase(newQ) //Pass new q into function

            $(".search").text(finalQ); //display final q

            renderProducts(data.results);
            displayButtons(pageNumber);
            console.log(data);

            let cart = $(".cart").text();
            let cartNum = parseInt(cart);

            //Need to put functionality here or else this code doesn't work.
            $(".add-to-cart-btn").on('click', function() {
                cartNum++;
                $(".cart").text(cartNum);
            })


        })
        .catch(error =>
            console.log(error)) //Catches errors if they arise
}



function renderProducts(products) {

    let html = ""; //Clears html out every time function is called
    let anchor = document.querySelector(".results-section");

    if (products.length === 0) {
       $("#results").append(`<h3 class="fail-message">Uh oh! We couldn't find any matches.</h3>`)
    } else {

    products.forEach(result => {

        let hasSale = result.hasOwnProperty("msrp");

        let originalPrice = parseFloat(result.price).toFixed(2)
        let salePrice = parseFloat(result.msrp).toFixed(2)

        $("#results").append(
            `<div class="card col-sm-6 col-md-4 col-lg-3" col-centered>  
                <div class="card-body">
                <img class= "card-img-top" src="${result.thumbnailImageUrl}">
                <h4 class= "card-title">${result.name}</h4>

                ${!hasSale || originalPrice >= salePrice ? `<p class="normal-price">$${originalPrice}</p>` : `<p class="strike-price"><strike>$${salePrice}</strike></p><p class="new-price">$${originalPrice}</p>`}

                <br>

                <button type="button" class="btn gradient-btn text-center add-to-cart-btn">Add To Cart</button>
    
            </div>
            </div>

            ` 
        )
    })
    }

    anchor.scrollIntoView({behavior: "smooth"});

}


jQuery(document).ready(function($) {
    var alterClass = function() {
        var ww = document.body.clientWidth;
        if (ww < 990) {
            $('.search-col').addClass('mx-auto text-center');
            $('.color-col').addClass('mx-auto text-center');
        } else if (ww >= 991) {
            $('.search-col').removeClass('mx-auto text-center');
            $('.color-col').removeClass('mx-auto text-center');
        };
    };
    $(window).resize(function(){
        alterClass();
    });
    //Fire it when the page first loads:
    alterClass();
});

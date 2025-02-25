function khoachuyen(obj) {
    var id = obj.id;
    var x = document.getElementById('Accordions' + id);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";

    } else {
        x.className = x.className.replace(" w3-show", "");

    }
}
function khoachuyen2(obj) {
    var id = obj.id;
    var xxx = "" + "#" + "Accordions" + obj.id + "";
    var x = document.getElementById('Accordions' + id);
    if (x.className.indexOf("w3-hide") == -1) {
        $(xxx).removeClass("w3-show")
        x.className += " w3-hide";


    } else {
        x.className = x.className.replace(" w3-hide", "");

    }
}

function chuyenkhoa(obj) {
    
    var id = obj.id;
    var x = document.getElementById('Accordions' + id);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";

    } else {
        x.className = x.className.replace(" w3-show", "");

    }
}

function w3_open() {
    document.getElementById("mySidebardp").style.display = "block";
    document.getElementById("myOverlaydp").style.display = "block";
}
 
function w3_close() {
    document.getElementById("mySidebardp").style.display = "none";
    document.getElementById("myOverlaydp").style.display = "none";
}

var slideIndex = 1;


function plusDivs(n) {
    showDivs(slideIndex += n);
}

function showDivs(n) {
    var i;
    var x = document.getElementsByClassName("mySlides");
    if (n > x.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = x.length }
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    x[slideIndex - 1].style.display = "block";
}
var myIndex = 0;


function carousel() {
    var i;
    var x = document.getElementsByClassName("mySlides");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    myIndex++;
    if (myIndex > x.length) { myIndex = 1 }
    x[myIndex - 1].style.display = "block";
    setTimeout(carousel, 10000); 
}
function openCity(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}
$(window).scroll(function () {
    var height = $(window).scrollTop();
    if (height > 100) {
        $('#back2Top').fadeIn();
    } else {
        $('#back2Top').fadeOut();
    }
});
$(document).ready(function () {
    $("#back2Top").click(function (event) {
        event.preventDefault();
        $("html, body").animate({ scrollTop: 0 }, "slow");
        return false;
    });

});
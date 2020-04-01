function toggleForm(event) {
    var inputItems = document.querySelectorAll(".input-field");
    for (var i = 0; i < inputItems.length; i++) {
        inputItems[i].value = "";
    }
    var formSlider = document.getElementById('form-slider');
    if (event.target.id == "signup-pointer") {
        formSlider.style.left = "-400px";
    } else {
        formSlider.style.left = "0px";
    }
}
function toggleCourseTab() {
    //alert("h");
    /*var courseTab = document.getElementById('course-tab');
    if (courseTab.style.display == "none") {
        courseTab.style.display = "block";
    } else {
        courseTab.style.display = "none";
    }*/
}
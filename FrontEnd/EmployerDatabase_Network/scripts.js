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
function addCourse(coursecode,coursename,coursetags) {
    var courseTab = document.createElement('div');
    var courseCode = document.getElementById('course-code-box');
    var courseName = document.getElementById('course-name-box');
    courseTab.className = "course-tab";
    courseTab.innerHTML = "(" + coursecode + ")" + " " + coursename+"\n ["+ coursetags +"]";
    var gridItem2 = document.getElementById('grid-item-2');
    gridItem2.appendChild(courseTab);
}

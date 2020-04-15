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
function addCourse() {
    var courseTab = document.createElement('div');
    var courseCode = document.getElementById('course-options').value;
    //Check for amount of courses
    const MAX_COURSES = 5;
    var totalCourses = document.querySelectorAll('.course-tab').length;
    if (totalCourses >= MAX_COURSES) {
        return;
    }

    courseTab.className = "course-tab";
    //courseTab.innerHTML = "(" + courseCode.value + ")" + " " + courseName.value;
    courseTab.innerHTML = courseCode;
    var courseContainer = document.getElementById('course-container');
    courseContainer.appendChild(courseTab);
}

function clearFields() {
    var inputItems = document.querySelectorAll(".input-field");
    for (var i = 0; i < inputItems.length; i++) {
        inputItems[i].value = "";
    }
}
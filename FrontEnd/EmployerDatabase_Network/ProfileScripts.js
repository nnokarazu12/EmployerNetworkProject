function UpdateCourseDisplayList() {
    //pull from local storage
    let LoggedInUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    //Display All Currently enrolled Courses
    if(!LoggedInUser.ProfileData.education){
        AddNewCoursetolist({ "CourseName": "Please Add Classes to Display",
            "CourseCode": "",
            "CourseID": "",
            "CourseTags": [
                ""
            ],
            "CoursePFP":"https://lh4.googleusercontent.com/-OL58GeS_l4k/AAAAAAAAAAI/AAAAAAAAAAA/I7L0deGEHMQ/s48-p-k-no-ns-nd/photo.jpg"
        });
        return;
    }
    if(!LoggedInUser.ProfileData.education.courses){
        //TODO Show No Courses
        return;
    }
    //Remove all old Courses
    let Card = document.getElementById("CourseSelectionbox");
    while(Card.children > 1){
        Card.removeChild(Card.children[Card.children.length-1]);
    }
    //User has a Course to display
    for(let i =0;i<LoggedInUser.ProfileData.education.courses.length;i++){
        AddNewCoursetolist(LoggedInUser.ProfileData.education.courses[i]);
    }
    document.getElementById("CourseSelectionbox").removeChild(document.getElementById("CourseSelectionbox").children[1]);
}

  function UpdateJobsDiaplayList(jobsFound) {
      let Card = document.getElementById("Job_Clone");
      while(Card.children > 1){
          Card.removeChild(Card.children[Card.children.length-1]);
      }


     if (jobsFound) {
         //Got the jobs to update Loop Thorough them
         console.log("Adding Job");
         for (let i = 0; i < jobsFound.length; i++) {
             AddnewJobToList(jobsFound[i]);
         }
     } else {
         AddnewJobToList({
             "Job_Udid": "0iV2lmkpKA+W8FjPXv7UBA==",
             "Job_Title": "No Jobs Could be Found",
             "Job_Description": "Add more courses or wait for a job listing",
             "Job_Location": "",
             "job_Skills": [],
             "job_pay": "",
             "Job_Availability": "",
             "Job_Duration": "",
             "Job_PFP": "https://cdn.clipart.email/7d12a404aed45989729816377fe9bcfd_no-camera-allowed-clip-art-at-clkercom-vector-clip-art-online-_600-600.png"
         });
     }
      document.getElementById("Job_Clone").removeChild(document.getElementById("Job_Clone").children[1]);
 }

function AddNewCoursetolist(Course) {
    let NewName = Course.CourseName;
    let NewCode = Course.CourseCode;
    let NewID = Course.CourseID;
    let photoUrl = Course.CoursePFP;
    //First Pull all child elements to clone
    var Course_Name = document.getElementById("Course_Name");
    var Course_NameClone = Course_Name.cloneNode(true);
    Course_NameClone.children[0].textContent = NewName;

    var Course_Code = document.getElementById("Course_Code");
    var Course_CodeClone = Course_Code.cloneNode(true);
    Course_CodeClone.children[0].textContent = NewCode;

    var Uni_Name = document.getElementById("Uni_Name");
    var Uni_NameClone = Uni_Name.cloneNode(true);
    Uni_NameClone.children[0].textContent = NewID;

    var UniPFP_Group = document.getElementById("UniPFP_Group");
    var UniPFP_GroupClone = UniPFP_Group.cloneNode(true);
    if (photoUrl) {
    UniPFP_GroupClone.children[1].src = photoUrl;
    }else {
        UniPFP_GroupClone.children[1].src = "https://cdn.clipart.email/7d12a404aed45989729816377fe9bcfd_no-camera-allowed-clip-art-at-clkercom-vector-clip-art-online-_600-600.png";
    }
    UniPFP_GroupClone.children[1].srcset = "";

    var Course_SelectionBox = document.getElementById("Course_SelectionBox");
    var Course_SelectionBoxClone = Course_SelectionBox.cloneNode(true);

    var finalclone = document.createElement('div');
    finalclone.className = "Course_Box";
    finalclone.id = "Course_Box";
    finalclone.appendChild(Course_SelectionBoxClone);
    finalclone.appendChild(Course_NameClone);
    finalclone.appendChild(Course_CodeClone);
    finalclone.appendChild(Uni_NameClone);
    finalclone.appendChild(UniPFP_GroupClone);
    document.getElementById("CourseSelectionbox").appendChild(finalclone);
}
function AddnewJobToList(JobListing) {
    let Job_Udid = JobListing.Job_Udid;
    let Job_Title = JobListing.Job_Title;
    let Job_Description = JobListing.Job_Description;
    let Job_Location = JobListing.Job_Location;
    let job_pay = JobListing.job_pay;
    let Job_Availability = JobListing.Job_Availability;
    let Job_Duration = JobListing.Job_Duration;
    let Job_PFP = JobListing.Job_PFP;
    //First Pull all child elements to clone
    var JobTitle = document.getElementById("Job_Title");
    var Job_TitleClone = JobTitle.cloneNode(true);
    Job_TitleClone.children[0].textContent = Job_Title;

    var JobDescription = document.getElementById("Job_Description");
    var Job_DescriptionClone = JobDescription.cloneNode(true);
    Job_DescriptionClone.children[0].textContent = Job_Description;

    var JobLocation = document.getElementById("Uni_Name");
    var JobLocationClone = JobLocation.cloneNode(true);
    JobLocationClone.children[0].textContent = Job_Location;

    var UniPFP_Group_cc = document.getElementById("UniPFP_Group_cc");
    var UniPFP_Group_ccClone = UniPFP_Group_cc.cloneNode(true);
    if (Job_PFP) {
        UniPFP_Group_ccClone.children[1].src = Job_PFP;
    }else {
        UniPFP_Group_ccClone.children[1].src = "https://cdn.clipart.email/7d12a404aed45989729816377fe9bcfd_no-camera-allowed-clip-art-at-clkercom-vector-clip-art-online-_600-600.png";
    }
    UniPFP_Group_ccClone.children[1].srcset = "";

    var Course_SelectionBox_b = document.getElementById("Course_SelectionBox_b");
    var Course_SelectionBox_bClone = Course_SelectionBox_b.cloneNode(true);

    var finalJob = document.createElement('div');
    finalJob.className = "Job_Box1";
    finalJob.id = "Job_Box1";
    finalJob.appendChild(Course_SelectionBox_bClone);
    finalJob.appendChild(Job_TitleClone);
    finalJob.appendChild(Job_DescriptionClone);
    finalJob.appendChild(JobLocationClone);
    finalJob.appendChild(UniPFP_Group_ccClone);
    document.getElementById("Job_Clone").appendChild(finalJob);
}

function FillDropdownitem(Course) {
    console.log("Callback reveived on ReceiveCourses");
    var Courseoption = document.getElementById("OptionCourse");
    var CourseoptionClone = Courseoption.cloneNode(true);
    CourseoptionClone.textContent = Course.CourseName;
    CourseoptionClone.value = Course.CourseCode;
    document.getElementById("course-options2").appendChild(CourseoptionClone);
}
function GetAllCoursesUpdate(courses) {
    if(courses){
        for(let i =0;i<courses.length;i++){
            FillDropdownitem(courses[i]);
        }
    }else{
        FillDropdownitem({
            "CourseName": "Unable To Download Courses",
            "CourseCode": "404",
            "CourseID": "",
            "CourseTags": []
        });
    }
}

const resumeLists = document.querySelectorAll('.resume-list');
const resumeBoxs = document.querySelectorAll('.resume-box');

//navbar actions and all section actions along with cube rotation when navbar is clicked



//resume section when clicking tab-list
resumeLists.forEach((list, idx) => {
    list.addEventListener('click', () => {
        document.querySelector('.resume-list.active').classList.remove('active');
        list.classList.add('active');

        document.querySelector('.resume-box.active').classList.remove('active');
        resumeBoxs[idx].classList.add('active');
    });
});


//portfolio section when clicking tab-list

//visibility for contact section when reloading (cube reloading animation)
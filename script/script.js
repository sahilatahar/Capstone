const trendingSection = document.getElementById('trending__cards');
const allCoursesSection = document.getElementById('all__courses__cards');
const toggleNavbarBtn = document.getElementById('toggle__navbar__btn');
const toggleThemeBtn = document.getElementById('theme__toggle__btn');

// Variables 
let data;
let userData = JSON.parse(localStorage.getItem('userData'));
let isDarkTheme = false;

// Changing theme
let theme = localStorage.getItem('theme');
if (theme === 'dark') {
    isDarkTheme = true;
    document.body.classList.add('dark-theme');
    toggleThemeBtn.innerHTML = '<i class="fa-regular fa-sun"></i>';
} else {
    toggleThemeBtn.innerHTML = '<i class="fa-regular fa-moon"></i>';
    localStorage.setItem('theme', 'light');
}

// Reading JSON File
const readJSONFile = async () => {
    let data;
    try {
        data = await fetch('./data/data.json').then((respond) => respond.json());
    } catch {
        console.log("JSON file reading error")
    }
    return data;
}

data = await readJSONFile();


// Toggle Navbar 
toggleNavbarBtn.addEventListener('click', () => {
    document.querySelector('.nav__list').classList.toggle('show');
})


// Adding trending corses
data.slice(1, 3).forEach((course) => {
    trendingSection.innerHTML += `<div class="card ${course.title}__Card">
                <div class="complete__mark">${userData != null && userData?.completedCourses?.includes(course.title) ? "Completed" : ""}</div>
                <img src="./images/${course.poster}" alt="${course.title} image" class="card__image">
                <p class="card__title">${course.title}</p>
            </div>`;
});

// Adding All corses

data.forEach((course) => {
    allCoursesSection.innerHTML += `<div class="card ${course.title}__Card">
                <div class="complete__mark">${userData != null && userData?.completedCourses?.includes(course.title) ? "Completed" : ""}</div>
                <img src="./images/${course.poster}" alt="${course.title} image" class="card__image">
                <p class="card__title">${course.title}</p>
            </div>`;
});

data.forEach((course) => {
    let cards = document.querySelectorAll(`.${course.title}__Card`);
    cards.forEach((card) => {
        card.addEventListener('click', () => {
            localStorage.setItem('currentCourseId', course.courseId);
            if (userData != null) {
                window.location.href = '/learningpage.html';
            } else {
                window.location.href = './form.html';
            }
        });
    });
});


const swiper = new Swiper('.swiper', {
    // Optional parameters
    loop: true,

    pagination: {
        el: '.swiper-pagination',
    },
    // Autoplay
    autoplay: {
        delay: 5000,
    },

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

});


// Toggle Theme
toggleThemeBtn.addEventListener("click", (e) => {
    if (isDarkTheme) {
        toggleThemeBtn.innerHTML = '<i class="fa-regular fa-moon"></i>';
    } else {
        toggleThemeBtn.innerHTML = '<i class="fa-regular fa-sun"></i>';
    }
    isDarkTheme = !isDarkTheme;
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    document.body.classList.toggle('dark-theme');
});
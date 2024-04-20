// Variables
const toggleNavbarBtn = document.querySelector("#toggle__navbar__btn")
const sidebar = document.querySelector(".sidebar")
const sidebarList = document.querySelector(".topic__list")
const progressValue = document.querySelector(".progress__value")
const progressText = document.querySelector(".progress__text")
const homeOption = document.querySelector(".back__option")
const body = document.querySelector(".body")
const navTitle = document.querySelector(".navbar__title")
const iframe = document.querySelector("#iframe")
const videoTitle = document.querySelector(".video__title")
const videoDesc = document.querySelector(".video__description")
const nextBtn = document.getElementById("next__btn")
const prevBtn = document.getElementById("prev__btn")

const searchParams = new URLSearchParams(window.location.search)
// Changing theme
let theme = localStorage.getItem("theme")
if (theme === "dark") {
	document.body.classList.add("dark-theme")
}

// Function to read JSON file asynchronously
const readJSONFile = async () => {
	let data
	try {
		let urlArray = window.location.href.split("/")
		urlArray.pop()
		urlArray.push("data", "data.json")
		let jsonUrl = urlArray.join("/")
		data = await fetch(jsonUrl).then((respond) => respond.json())
	} catch {
		console.log("JSON file reading error")
	}
	return data
}

// Retrieve the current course ID from local storage
const currentCourseId = searchParams.get("id")

let data = await readJSONFile()
let cCourse = data.filter((course) => course.courseId == currentCourseId)[0]

// Initialize variables for course management
let index = 0
let cVideoData = cCourse.videos[index]
let progress = 0

// Function to change the video based on the given index
const changeVideo = (index) => {
	cVideoData = cCourse.videos[index]

	// Update the video player and related information
	iframe.src = cVideoData.embed_url
	videoTitle.textContent = cVideoData.title
	videoDesc.textContent = cVideoData.description

	// Update the text of the next button based on the index
	if (index == cCourse.videos.length - 1) {
		nextBtn.textContent = "Finish"
	} else {
		nextBtn.textContent = "Next"
	}
}

// Putting Course nav title
navTitle.textContent = cCourse.title

// Putting first video url
changeVideo(index)

// Adjusting main body content height
if (window.innerWidth > 768) {
	body.classList.add("flex-0-75")
}

// Toggle Navbar when toggleNavbarBtn is clicked
toggleNavbarBtn.addEventListener("click", () => {
	const isMobile = window.innerWidth < 768
	sidebar.classList.toggle("show")
	if (!isMobile) {
		body.classList.toggle("flex-0-75")
	}
})

// Redirect to the home page when homeOption is clicked
homeOption.addEventListener("click", () => {
	let urlArray = window.location.href.split("/")
	urlArray.pop()
	urlArray.push("index.html")
	let newUrl = urlArray.join("/")
	window.location.href = newUrl
})

// Adding Sidebar topics
sidebarList.innerHTML = ""
cCourse.videos.forEach((video, index) => {
	sidebarList.innerHTML += `<li class="list__item" id="list__item${index}">
                <h4 class="title">${video.title}</h4>
                <p class="language">Language : ${video.language}</p>
            </li>`
})

// Handling click on sidebar topics
document.querySelectorAll(`.list__item`).forEach((item, itemIndex) =>
	item.addEventListener("click", (e) => {
		index = itemIndex
		changeVideo(index)
	})
)

function btnClick(e) {
	// Check if the button clicked has an id of 'next__btn'
	if (e.target.id === "next__btn") {
		// Increment progress if the current index is within the video length
		if (index < cCourse.videos.length - 1) {
			progress++
			let percent
			if (progress > cCourse.videos.length) {
				percent = 100
			} else {
				percent = (progress / cCourse.videos.length) * 100
			}
			progressValue.style.width = `${percent}%`
			progressText.textContent = `${Math.floor(percent)}% Completed`
		}

		// Check if there are more videos to navigate to
		if (index < cCourse.videos.length - 1) {
			index++
		} else {
			// Check if the progress is 50% or more
			if ((progress / cCourse.videos.length) * 100 >= 50) {
				let userData = JSON.parse(localStorage.getItem("userData")) || {
					completedCourses: [],
				}
				userData.completedCourses.push(cCourse.title)
				localStorage.setItem("userData", JSON.stringify(userData))

				// Display a dialog indicating completion and redirect to home
				window.dialog.show({
					content: `You have completed the ${cCourse.title} Course`,
					okText: "Go to Home",
					onOk: () => {
						let urlArray = window.location.href.split("/")
						urlArray.pop()
						urlArray.push("index.html")
						let newUrl = urlArray.join("/")
						window.location.href = newUrl
					},
				})
			} else {
				// Display an error message if progress is less than 50%
				document.querySelector(".error__text").textContent =
					"You should complete at least 50% of the Course"
				return
			}
		}
	} else {
		// Check if there are previous videos to navigate to
		if (index > 0) {
			index--
		} else {
			return
		}
	}

	// Update the video based on the current index
	changeVideo(index)
}

// setting next btn click
nextBtn.addEventListener("click", (e) => btnClick(e))
prevBtn.addEventListener("click", (e) => btnClick(e))

// Handling resizing
window.addEventListener("resize", () => {
	const isMobile = window.innerWidth < 768
	if (isMobile) {
		sidebar.classList.remove("show")
		body.classList.remove("flex-0-75")
	} else {
		sidebar.classList.add("show")
		body.classList.add("flex-0-75")
	}
})

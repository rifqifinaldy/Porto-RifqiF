// navigtaion menu
(() =>{

	const my_btn = document.querySelector(".my_btn"),
	navMenu = document.querySelector(".nav_menu"),
	closeNavBtn = navMenu.querySelector(".close_nav_menu");

	my_btn.addEventListener("click", showNavMenu);
	closeNavBtn.addEventListener("click", hideNavMenu);

	function showNavMenu(){
		navMenu.classList.add("open");
		bodyScrollingToggle();
	}

	function hideNavMenu(){
		navMenu.classList.remove("open");
		fadeOutEffect();
		bodyScrollingToggle();
	}

	function fadeOutEffect(){
		document.querySelector(".fade_out_effect").classList.add("active");
		setTimeout(() =>{
			document.querySelector(".fade_out_effect").classList.remove("active");
		},300)
	}

	// attach an event handler to document
	document.addEventListener("click", (event) => {
		if(event.target.classList.contains('link-item')){
			// make sure event.target.hash has a value before overriding default
			// behavior
			if(event.target.hash !==""){
				// prevent default anchor click behavior
				event.preventDefault();
				const hash = event.target.hash;
				// deactivate existing active section
				document.querySelector(".section.active").classList.add("hide");
				document.querySelector(".section.active").classList.remove("active");
				// activate new 'section'
				document.querySelector(hash).classList.add("active");
				document.querySelector(hash).classList.remove("hide");
				// deactivate existing active navigation menu 'link-item'
				navMenu.querySelector(".active").classList.add("outer-shadow","hover-in-shadow");
				navMenu.querySelector(".active").classList.remove("active","inner-shadow");
				//  if clicked 'link item is contained within the navigation'
				if(navMenu.classList.contains("open")){
					// activate new navigation menu 'link-item'
					event.target.classList.add("active","inner-shadow");
					event.target.classList.remove("outer-shadow","hover-in-shadow");
					// hide navigtaion menu
					hideNavMenu();
				}
				else {
					let navItems = navMenu.querySelectorAll(".link-item");
					navItems.forEach((item) => {
						if (hash === item.hash){
							// activate new navigation menu 'link-item'
							item.classList.add("active","inner-shadow");
							item.classList.remove("outer-shadow","hover-in-shadow");
						}
					})
					fadeOutEffect();
				}
				// add hash(# to url)
				window.location.hash = hash;
			}
		}
	})

})();


function bodyScrollingToggle(){
	document.body.classList.toggle("hidden-scrolling")
}

// portfolio filter and pop up

(() => {

	const filterContainer = document.querySelector(".portfolio_filter"),
	portfolioItemsContainer = document.querySelector(".portfolio_items"),
	portfolioItems = document.querySelectorAll(".portfolio_item"),
	popup = document.querySelector(".portfolio_popup"), 
	prevBtn = popup.querySelector(".pp_prev"),
	nextBtn = popup.querySelector(".pp_next"),
	closeBtn = popup.querySelector(".pp_close"),
	projectDetailsContainer = popup.querySelector(".pp_details"),
	projectDetailsBtn = popup.querySelector(".pp-project-details-btn");
	let itemIndex, slideIndex, screenshots;

	// Filter portfolio items

	filterContainer.addEventListener('click', (event)=>{
		if(event.target.classList.contains("filter_item") &&
			!event.target.classList.contains("active")){
			 // deactivate existing active 'filter_item'
			filterContainer.querySelector(".active").classList.remove("outer-shadow",
				"active");
			// activate new "new filter"
			event.target.classList.add("active","outer-shadow");
			const target = event.target.getAttribute("data-target");
			portfolioItems.forEach((item) =>{
				if (target === item.getAttribute("data-category") || target === 'all'){
					item.classList.remove("hide");
					item.classList.add("show");
				}
				else {
					item.classList.remove("show");
					item.classList.add("hide");
				}
			}) 
		}
	})

	portfolioItemsContainer.addEventListener("click", (event) =>{
		if(event.target.closest(".portfolio_item_inner")){
			const portfolioItem = event.target.closest(".portfolio_item_inner").
				parentElement;
			// get the index item
			itemIndex = Array.from(portfolioItem.parentElement.children).indexOf(
				portfolioItem);
			screenshots = portfolioItems[itemIndex].querySelector(".portfolio_item_img img").getAttribute("data-screenshots");
			
			screenshots = screenshots.split(",");
			if(screenshots.length === 1){
				prevBtn.style.display="none";
				nextBtn.style.display="none";
			}
			else{
				prevBtn.style.display="block";
				nextBtn.style.display="block";
			}
			slideIndex = 0;
			popupToggle();
			popupSlideshow();
			popupDetails();
		}
	})

	closeBtn.addEventListener("click", () => {
		popupToggle();
		if(projectDetailsContainer.classList.contains("active")){
			popupDetailsToggle();
		}
	})

	function popupToggle() {
		popup.classList.toggle("open");
		bodyScrollingToggle();
	}

	function popupSlideshow(){
		const imgSrc = screenshots[slideIndex];
		const popupImg = popup.querySelector(".pp_img");
		// activate loader untill the popupImg loaded
		popup.querySelector(".pp_loader").classList.add("active");
		popupImg.src=imgSrc;
		popupImg.onload = () =>{
			// deactivate loader after the popupImg
			popup.querySelector(".pp_loader").classList.remove("active");
		}
		popup.querySelector(".pp_counter").innerHTML = (slideIndex+1) + " of " + screenshots.length;
	}

	// next slide
	nextBtn.addEventListener("click", () =>{
		if(slideIndex === screenshots.length-1){
			slideIndex = 0;
		}
		else {
			slideIndex++;
		}
		popupSlideshow();
	})

	function popupDetails(){
		// if no details
		if(!portfolioItems[itemIndex].querySelector(".portfolio-item-details")){
			projectDetailsBtn.style.display="none";
			return; 
			// end no detail
		}

		projectDetailsBtn.style.display="block";
		// get the details title category
		const details = portfolioItems[itemIndex].querySelector(".portfolio-item-details").innerHTML;
		popup.querySelector(".pp_project_details").innerHTML = details;
		const title = portfolioItems[itemIndex].querySelector(".portfolio_item_title").innerHTML;
		popup.querySelector(".pp-title h2").innerHTML = title;
		const category = portfolioItems[itemIndex].getAttribute("data-category");
		popup.querySelector(".pp_project_category").innerHTML = category.split("-").join(" ");
	}

	// prev slide
	prevBtn.addEventListener("click", () =>{
		if(slideIndex === 0){
			slideIndex = screenshots.length-1
		}
		else{
			slideIndex--;
		}
		popupSlideshow();
	})

	projectDetailsBtn.addEventListener("click", () => {
		popupDetailsToggle();
	})

	function popupDetailsToggle(){
		if(projectDetailsContainer.classList.contains("active")){
			projectDetailsBtn.querySelector("i").classList.remove("fa-minus");
			projectDetailsBtn.querySelector("i").classList.add("fa-plus");
			projectDetailsContainer.classList.remove("active");
			projectDetailsContainer.style.maxHeight = 0 + "px";
		}
		else{
			projectDetailsBtn.querySelector("i").classList.remove("fa-plus");
			projectDetailsBtn.querySelector("i").classList.add("fa-minus");
			projectDetailsContainer.classList.add("active");
			projectDetailsContainer.style.maxHeight = projectDetailsContainer.
				scrollHeight + "px";
			popup.scrollTo(0,projectDetailsContainer.offsetTop);
		}
	}


})();

// Hide all section except active

(() =>{

	const sections = document.querySelectorAll(".section");
	console.log(sections);
	sections.forEach((section) =>{
		if(!section.classList.contains("active")){
			section.classList.add("hide");
		}
	})

})();
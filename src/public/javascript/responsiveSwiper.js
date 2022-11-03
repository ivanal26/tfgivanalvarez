var swiper = new Swiper('.swiper-container', {
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev'
	},
	slidesPerView: 1,
	spaceBetween: 10,
	// init: false,

	//Aqui se indica como se va a mostrar el subcarousel con swiper en los diferentes dispositivos
	breakpoints: {
		300: { //Del 300px al 500px muestra 2 items y con un espaciado de 20
			slidesPerView: 2,
			spaceBetween: 20,
		},
		500: {
			slidesPerView: 2,
			spaceBetween: 30,
		},
		550: {
			slidesPerView: 3,
			spaceBetween: 30,
		},
		802: {
			slidesPerView: 4,
			spaceBetween: 30,
		},
		920: {
			slidesPerView: 5,
			spaceBetween: 30,
		},
		1240: {
			slidesPerView: 6,
			spaceBetween: 30,
		},
	}
});

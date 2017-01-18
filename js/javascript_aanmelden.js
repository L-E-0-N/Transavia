var form = document.querySelector('form:first-of-type').addEventListener('submit', submit);
var form2 = document.querySelector('form:last-of-type').addEventListener('submit', submit);
var mobileMenuButton = document.querySelector('.navhome > div:first-of-type > div:nth-of-type(1)').addEventListener("click", mobileMenu);

function mobileMenu() {


	document.querySelector('.navhome > div:first-of-type > div:nth-of-type(1)').classList.toggle('mobileClose');
	document.querySelector('.navmobielhome').classList.toggle('navUitklappenMobiel');
}

function submit(e) {
	e.preventDefault(); // Zorgt ervoor dat de pagina niet wordt herladen na het submitten
    window.location.href = 'ingelogd.html';
}
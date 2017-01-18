var mobileMenuButton = document.querySelector('.navhome > div:first-of-type > div:nth-of-type(1)').addEventListener("click", mobileMenu);

function mobileMenu() {


	document.querySelector('.navhome > div:first-of-type > div:nth-of-type(1)').classList.toggle('mobileClose');
	document.querySelector('.navmobielhome').classList.toggle('navUitklappenMobiel');
}
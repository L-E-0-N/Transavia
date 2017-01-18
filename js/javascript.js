var searchQuery,
	duplicateTag,
	spanAll;
var form = document.querySelector('form').addEventListener('submit', submit);
var searchInput = document.querySelector('#searchInput');
var searchBar = document.querySelector('#searchBar').addEventListener("click", focusSearchInput);
var searchQueryContainer = document.querySelector('#searchQueryContainer');
var searchSubmit = document.querySelector('#searchSubmit');
var filterCheckboxen = document.querySelectorAll('.suggestiebalk input[type=checkbox]');
var filterSlider = document.querySelector('.suggestiebalk input[type=range]');
var suggestiebalk = document.querySelector('.suggestiebalk');
var uitgebreidZoeken = document.querySelector('.headerhome p');
uitgebreidZoeken.addEventListener("click", suggestiebalkInklappen);
var suggestiebalkBottom = document.querySelector('main > div:first-child');
suggestiebalkBottom.addEventListener("click", suggestiebalkInklappen);
var mobileSearchButton = document.querySelector('.navhome > div:first-of-type > div:nth-of-type(2)').addEventListener("click", mobileSearch);
var mobileMenuButton = document.querySelector('.navhome > div:first-of-type > div:nth-of-type(1)').addEventListener("click", mobileMenu);
var verhaalOpslaanButtons = document.querySelectorAll('.mainhome > article > div:first-child > div');
var verhaalLikeButttons = document.querySelectorAll('.hartjeingelogd');
var likesCheck = 0; // Check of de waarde van de likes omhoog of omlaag moet
var spanPosition = 0;
var checkDuplicateTag = 0; // Check of er al een tag met dezelfde waarde bestaat, 0 = Nee / 1 = Ja

function addTag() {
	
	if (searchInput.value.indexOf(",") != -1 || searchInput.value.indexOf(" ") != -1) {
		
		determineSearchQuery();
		searchQuery = searchQuery.slice(0, -1); // Laatste karakter van de term verwijderen, spatie of komma ,
		addTagNoCheck();
		
  	}
}

function spanCreate() {
	
	if (searchInput.value.length > 1) { // span aanmaken met de zoekterm als het meer dan 2 letters bevat

		var span = document.createElement("span");
		var searchQueryNode = document.createTextNode(searchQuery);
		span.appendChild(searchQueryNode);
		searchQueryContainer.appendChild(span);

		// De zoekterm checked tegenover alle checkboxes zodat die eventueel checked moeten worden
		checkboxTagCheck();

		// de zoekbalk weer achteraan plaatsen
		searchQueryContainer.insertBefore(span, searchQueryContainer.childNodes[spanPosition]);
		spanPosition++;
		searchInput.value = "";

		// Scrollen van de zoektermcontainer zodat de laatste tag altijd te zien is tijdens scrollen
		searchQueryContainer.scrollLeft = searchQueryContainer.scrollWidth;

		// Code die een event aan de span koppelt zodat hij zichzelf kan verwijderen als je erop klikt
		spanAll = document.querySelectorAll("#searchQueryContainer span");
		spanAll[spanPosition-1].addEventListener("click", function(spanindex){
			//alert(this.innerText);
			this.remove(spanindex);
			spanPosition--;

			// Zorgen dat de desbetrefende checkbox unchecked wordt
			for (var i = 0; i < filterCheckboxen.length; i++) {
				if (this.innerText === filterCheckboxen[i].parentNode.innerText.toLowerCase()) {
					filterCheckboxen[i].checked = false;
				}
			}
		});
	}

	else { // Bevat het minder dan 2 letters, maak het inputveld dan leeg
		searchInput.value = "";
	}

}

function tagQuickDelete() { // Hiermee worden de tags verwijderd als je backspace ingedrukt houdt
	if (event.keyCode == 8) { // Tag verwijderen met backspace
		if (searchInput.value.length == 0) { // Verwijder alleen als het inputveld leeg is
			var spanAll = document.querySelectorAll("#searchQueryContainer span");

			// Checken of de waarde van de verwijderde span gekoppeld aan de checkboxes kan worden
			for (var i = 0; i < filterCheckboxen.length; i++) {
				if (spanAll[spanPosition-1].innerText == filterCheckboxen[i].parentNode.innerText.toLowerCase()) {
					filterCheckboxen[i].checked = false;
				}
			}

			// Checken of de waarde van de verwijderde span gekoppeld aan de slider kan worden
			if (spanAll[spanPosition-1].innerText == "< 5min" || spanAll[spanPosition-1].innerText == "< 10min" || spanAll[spanPosition-1].innerText == "< 15min") {
				filterSlider.value = 3;
			}

			searchQueryContainer.removeChild(spanAll[spanPosition-1]);
			spanPosition--;
		}
	}
}

function focusSearchInput() { // Focus inputveld met klikken van zoekbalk + zoektermcontainer
    searchInput.focus();
}

function focusSearchInputStyle() {
	document.querySelector('#searchBar').classList.add("searchBarFocus");
}

function focusOutSearchInputStyle() {
	document.querySelector('#searchBar').classList.remove("searchBarFocus");
}

function suggestiebalkInklappen() {
	suggestiebalk.classList.toggle("suggestiebalkIngeklapt");
	uitgebreidZoeken.classList.toggle("uitgebreidzoeken");
	suggestiebalkBottom.classList.toggle("pijldraaien");
}

function highlightDuplicateTag() {
	
	var knipperenTag;
	var duplicateTag2 = duplicateTag; // Overnemen van de waarde van duplicateTag aangezien de setTimeout functie anders alleen undefined ziet, geen idee waarom. 
	
	
	spanAll[duplicateTag2].classList.add('tagCopy');
		setTimeout(function(){
			spanAll[duplicateTag2].classList.remove('tagCopy');
		},500);
	
	knipperenTag = setInterval(function(){
		spanAll[duplicateTag2].classList.add('tagCopy');
		setTimeout(function(){
			spanAll[duplicateTag2].classList.remove('tagCopy');
		},500);
	},1000);
	
	
	setTimeout(function(){
		clearInterval(knipperenTag);
	},2000);

}

function submit(e) {
	
	e.preventDefault(); // Zorgt ervoor dat de pagina niet wordt herladen na het submitten
	
	if (searchInput.value.length > 0) {
		determineSearchQuery();
		addTagNoCheck();
		setTimeout(function(){
			resultaten();
		},300);
		console.log("hoi");
		searchSubmit.classList.add('searchSubmitSuccess');
		setTimeout(function(){
			searchSubmit.classList.remove('searchSubmitSuccess');
			//searchSubmit.innerText = "Zoeken";
		},2000);
	}
	
	else {
		
		spanAll = document.querySelectorAll("#searchQueryContainer span");
		
		if (spanAll.length === 0) {
			searchSubmit.classList.add('searchSubmitError');

			$("#searchSubmit").effect( "shake", {times:4,distance:10}, 500 );
			setTimeout(function(){
				searchSubmit.classList.remove('searchSubmitError');
				//searchSubmit.innerText = "Zoeken";
			},2000);
		}

		else  {
			setTimeout(function(){
				resultaten();
			},300);
			searchSubmit.classList.add('searchSubmitSuccess');
			setTimeout(function(){
				searchSubmit.classList.remove('searchSubmitSuccess');
				//searchSubmit.innerText = "Zoeken";
			},2000);

			// setTimeout(function() { 
			//     window.location.href = 'resultaten.html';
			// }, 500);
		}
		
	}
	
}

function resultaten() {

	document.querySelector('.mainhome > article:first-of-type').classList.add('hide');
	document.querySelector('.mainhome > h3:first-of-type').classList.add('hide');
	document.querySelector('.mainhome > h3:nth-of-type(2)').innerHTML = '6 Resultaten';
	suggestiebalk.classList.remove('suggestiebalkUitklappenMobiel');
	document.querySelector('#searchBar').classList.remove('searchBarUitklappenMobiel');
	searchSubmit.classList.remove('searchSubmitUitklappenMobiel');
	document.querySelector('.navhome > div:first-of-type > div:nth-of-type(2)').classList.remove('mobileClose');
}

function determineSearchQuery() {
	searchQuery = searchInput.value; // Zoekterm bepalen
}

function addTagNoCheck() {
	
	searchQuery = searchQuery.toLowerCase();
	spanAll = document.querySelectorAll("#searchQueryContainer span");

	if (spanAll.length === 0) { // Als er nog geen span bestaat ga direct naar het aanmaken van de span
		spanCreate();
	}

	else { // Als er al wel een span bestaat, check de nieuwe span met de oude of er geen dubbele zijn

		for (duplicateTag = 0; duplicateTag < spanAll.length; duplicateTag++) {

			if (searchQuery === spanAll[duplicateTag].innerText) {
				highlightDuplicateTag();
				checkDuplicateTag = 1;
			}

		}

		if (checkDuplicateTag == 1) { // Is er een dubbele, highlight deze.
			searchInput.value = "";
			checkDuplicateTag = 0;
		}

		else { // Geen dubbele span? Maak dan een nieuwe span van de zoekterm.
			spanCreate();
		}

	}
}

for (var i = 0; i < filterCheckboxen.length; i++) {
	filterCheckboxen[i].addEventListener("click", checkboxTag);
}

function checkboxTagCheck() { // Laat de zoekterm langs alle checkboxes lopen zodat als de zoekterm hetzeflde is als een checkbox, deze op checked gaat.
	
	for (var i = 0; i < filterCheckboxen.length; i++) {
		if (searchQuery == filterCheckboxen[i].parentNode.innerText.toLowerCase()) {
			filterCheckboxen[i].checked = true;
		}
	}
}

function checkboxTag() {
	var checkboxCheck = this.checked;

	if (checkboxCheck === true) {
		var span = document.createElement("span");
		var checkboxValue = document.createTextNode(this.parentNode.innerText);
		span.appendChild(checkboxValue);
		searchQueryContainer.appendChild(span);

		// de zoekbalk weer achteraan plaatsen
		searchQueryContainer.insertBefore(span, searchQueryContainer.childNodes[spanPosition]);
		spanPosition++;

		// Scrollen van de zoektermcontainer zodat de laatste tag altijd te zien is tijdens scrollen
		searchQueryContainer.scrollLeft = searchQueryContainer.scrollWidth;

		// Code die een event aan de span koppelt zodat hij zichzelf kan verwijderen als je erop klikt
		spanAll = document.querySelectorAll("#searchQueryContainer span");
		spanAll[spanPosition-1].addEventListener("click", function(spanindex){

			this.remove(spanindex);
			spanPosition--;

			// Zorgen dat de desbetrefende checkbox unchecked wordt
			for (var i = 0; i < filterCheckboxen.length; i++) {
				if (this.innerText === filterCheckboxen[i].parentNode.innerText) {
					filterCheckboxen[i].checked = false;
				}
			}

		});
	}

	else {
		var checkboxText = this.parentNode.innerText.toLowerCase();
		for (var i = 0; i < spanAll.length; i++) {
			if (spanAll[i].innerText === checkboxText) {
				spanAll[i].remove();
				spanPosition--;
			}
		}
	}
}

function sliderTag() {

	spanAll = document.querySelectorAll("#searchQueryContainer span");

	if (filterSlider.value == 0) {

		//Verwijderen van de andere spans van de slider 
		for (var i = 0; i < spanAll.length; i++) {
			if (spanAll[i].innerText === "< 10min" || spanAll[i].innerText === "< 15min") {
				spanAll[i].remove();
				spanPosition--;
			}
		}

		// Span aanmaken met de huidige slider waarde
		var span = document.createElement("span");
		var slider5min = document.createTextNode("< 5min");
		span.appendChild(slider5min);
		searchQueryContainer.appendChild(span);

		// de zoekbalk weer achteraan plaatsen
		searchQueryContainer.insertBefore(span, searchQueryContainer.childNodes[spanPosition]);
		spanPosition++;

		// Scrollen van de zoektermcontainer zodat de laatste tag altijd te zien is tijdens scrollen
		searchQueryContainer.scrollLeft = searchQueryContainer.scrollWidth;

		// Code die een event aan de span koppelt zodat hij zichzelf kan verwijderen als je erop klikt
		spanAll = document.querySelectorAll("#searchQueryContainer span");
		spanAll[spanPosition-1].addEventListener("click", function(spanindex){

			this.remove(spanindex);
			spanPosition--;
			filterSlider.value =3;

		});

	}

	if (filterSlider.value == 1) {

		//Verwijderen van de andere spans van de slider 
		for (var i = 0; i < spanAll.length; i++) {
			if (spanAll[i].innerText === "< 5min" || spanAll[i].innerText === "< 15min") {
				spanAll[i].remove();
				spanPosition--;
			}
		}

		// Span aanmaken met de huidige slider waarde
		var span = document.createElement("span");
		var slider10min = document.createTextNode("< 10min");
		span.appendChild(slider10min);
		searchQueryContainer.appendChild(span);

		// de zoekbalk weer achteraan plaatsen
		searchQueryContainer.insertBefore(span, searchQueryContainer.childNodes[spanPosition]);
		spanPosition++;

		// Scrollen van de zoektermcontainer zodat de laatste tag altijd te zien is tijdens scrollen
		searchQueryContainer.scrollLeft = searchQueryContainer.scrollWidth;

		// Code die een event aan de span koppelt zodat hij zichzelf kan verwijderen als je erop klikt
		spanAll = document.querySelectorAll("#searchQueryContainer span");
		spanAll[spanPosition-1].addEventListener("click", function(spanindex){

			this.remove(spanindex);
			spanPosition--;
			filterSlider.value =3;

		});

	}

	if (filterSlider.value == 2) {

		//Verwijderen van de andere spans van de slider 
		for (var i = 0; i < spanAll.length; i++) {
			if (spanAll[i].innerText === "< 5min" || spanAll[i].innerText === "< 10min") {
				spanAll[i].remove();
				spanPosition--;
			}
		}

		// Span aanmaken met de huidige slider waarde
		var span = document.createElement("span");
		var slider15min = document.createTextNode("< 15min");
		span.appendChild(slider15min);
		searchQueryContainer.appendChild(span);

		// de zoekbalk weer achteraan plaatsen
		searchQueryContainer.insertBefore(span, searchQueryContainer.childNodes[spanPosition]);
		spanPosition++;

		// Scrollen van de zoektermcontainer zodat de laatste tag altijd te zien is tijdens scrollen
		searchQueryContainer.scrollLeft = searchQueryContainer.scrollWidth;

		// Code die een event aan de span koppelt zodat hij zichzelf kan verwijderen als je erop klikt
		spanAll = document.querySelectorAll("#searchQueryContainer span");
		spanAll[spanPosition-1].addEventListener("click", function(spanindex){

			this.remove(spanindex);
			spanPosition--;
			filterSlider.value =3;

		});

	}

	if (filterSlider.value == 3) {

		//Verwijderen van de andere spans van de slider 
		for (var i = 0; i < spanAll.length; i++) {
			if (spanAll[i].innerText === "< 5min" || spanAll[i].innerText === "< 10min" || spanAll[i].innerText === "< 15min") {
				spanAll[i].remove();
				spanPosition--;
			}
		}

	}
}

function mobileMenu() {
	suggestiebalk.classList.remove('suggestiebalkUitklappenMobiel');
	document.querySelector('#searchBar').classList.remove('searchBarUitklappenMobiel');
	searchSubmit.classList.remove('searchSubmitUitklappenMobiel');
	document.querySelector('.navhome > div:first-of-type > div:nth-of-type(2)').classList.remove('mobileClose');


	document.querySelector('.navhome > div:first-of-type > div:nth-of-type(1)').classList.toggle('mobileClose');
	document.querySelector('.navmobielhome').classList.toggle('navUitklappenMobiel');
}

function mobileSearch() {
	document.querySelector('.navhome > div:first-of-type > div:nth-of-type(1)').classList.remove('mobileClose');
	document.querySelector('.navmobielhome').classList.remove('navUitklappenMobiel');


	suggestiebalk.classList.toggle('suggestiebalkUitklappenMobiel');
	document.querySelector('#searchBar').classList.toggle('searchBarUitklappenMobiel');
	searchSubmit.classList.toggle('searchSubmitUitklappenMobiel');
	document.querySelector('.navhome > div:first-of-type > div:nth-of-type(2)').classList.toggle('mobileClose');
}

for (var i = 0; i < verhaalOpslaanButtons.length; i++) {
	verhaalOpslaanButtons[i].addEventListener("click", verhaalOpslaan);
}

function verhaalOpslaan() {
	this.classList.toggle('verhaalopgeslagen');

	if (this.classList.contains('verhaalopgeslagen')) {
	    document.querySelector('.opslaanBevestiging').classList.add('opslaanBevestigingUitklappen');
		setTimeout(function(){
			document.querySelector('.opslaanBevestiging').classList.remove('opslaanBevestigingUitklappen');
		},2000);
	}
}

for (var i = 0; i < verhaalLikeButttons.length; i++) {
	verhaalLikeButttons[i].addEventListener("click", verhaalLiken);
}

function verhaalLiken() {
	this.classList.toggle('hartjeGevuld');

	if (likesCheck === 0) {
		var likes = this.innerText;
		likes++;
		this.innerHTML = likes;
		likesCheck = 1;
	}

	else {
		var likes = this.innerText;
		likes--;
		this.innerHTML = likes;
		likesCheck = 0;
	}
}

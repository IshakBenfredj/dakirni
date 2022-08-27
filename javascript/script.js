
// Show Nav Menu 
let open = document.querySelector(".bars");
let navbar = document.querySelector(".nav");
open.onclick = function(){
	this.classList.toggle("active");
	navbar.classList.toggle("active");
}
// Change Background Color Of Header
let header = document.querySelector(".header");
window.onscroll = function() {
	open.classList.remove("active");
	navbar.classList.remove("active");
	window.scrollY >= 100 ? header.classList.add("scroll") : header.classList.remove("scroll");
};
// Change Background Of Landing Every 3s
let landing = document.querySelector(".landing");

// let imgArray = ["landing2.jpg","landing3.jpg","landing4.jpg","landing5.jpg","landing6.jpg","landing1.jpg"];

// ======= Methode 1 =======
// let i = 0;
// setInterval(()=> {
// 	landing.style.backgroundImage = 'url("images/'+imgArray[i]+'")';
// 	i < 5 ? i++ : i=0;
// },3000);

// ======= Methode 2 =======
// setInterval(()=> {
//     let randomNumber = Math.floor(Math.random()*imgArray.length);
//     landing.style.backgroundImage = 'url("images/'+imgArray[randomNumber]+'")';
// },3000);

// ======= Methode 3 =======
let i = 1;
	setInterval(()=>{
		i < 6 ? i++ : i=1;
		landing.style.backgroundImage =`url("images/landing${i}.jpg")`;
	},3000);

// Show PrayTimes
let countries = document.querySelector(".praytime .container .country select");
let wilayas = document.querySelector(".praytime .container .wilaya select");
let btnTimePray = document.querySelector(".praytime .container .btn-time");
let country = document.querySelector(".praytime .container .show-info .info-place .country-select");
let wilaya = document.querySelector(".praytime .container .show-info .info-place .wilaya-select");
let dateMiladi = document.querySelector(".praytime .container .show-info .info-date .date-miladi");
let dateHijri = document.querySelector(".praytime .container .show-info .info-date .date-hijri");
let spacesOfTimes = document.querySelectorAll(".praytime .container .times .time p");
let countryLocal = localStorage.getItem("country");
let wilayaLocal = localStorage.getItem("wilaya");
if ( countryLocal && wilayaLocal) {
	countries.value = countryLocal;
	wilayas.value = wilayaLocal;
	selectCountryAndWilaya(countryLocal,wilayaLocal);
}

fetch('https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries%2Bstates.json')
.then(response => response.json())
.then( data => {
	countries.onclick = function(){
		wilayas.innerHTML = "";
	}
	data.forEach((ele)=>{
		
		if(ele.name !== 'Israel')countries.innerHTML += `<option>${ele.name}</option>`
	});
	countries.onblur=function(){
		data.forEach((ele)=>{
			if (ele.name === countries.value) {
				// wilayas.innerHTML = "";
				let states = ele.states;
				states.forEach((state)=>{
		
					wilayas.innerHTML += `
						<option>${state.name}</option>
					`;
				})
			}
		});
	};
	btnTimePray.onclick = function(){
		selectCountryAndWilaya(countries.value,wilayas.value);
		localStorage.setItem("country", countries.value);
		localStorage.setItem("wilaya", wilayas.value);
	}
});
function selectCountryAndWilaya(countryValue,wilayaValue){
	country.innerHTML = countryValue;
	wilaya.innerHTML = wilayaValue;
	selectTimesPray(countryValue,wilayaValue);
}
async function selectTimesPray(countryValue,wilayaValue){
	fetch(`https://api.aladhan.com/v1/timingsByCity?city=${wilayaValue}&country=${countryValue}%20Arab%20Emirates&method=8`)
	.then(response => response.json())
	.then( data => {
		let allDates = data.data.date;
		dateMiladi.innerHTML = allDates.gregorian.date;
		dateHijri.innerHTML = `${allDates.hijri.weekday.ar} ${allDates.hijri.day} ${allDates.hijri.month.ar} ${allDates.hijri.year}`;
		let allTimes = data.data.timings;
		spacesOfTimes[0].innerHTML = allTimes.Fajr;
		spacesOfTimes[1].innerHTML = allTimes.Sunrise;
		spacesOfTimes[2].innerHTML = allTimes.Dhuhr;
		spacesOfTimes[3].innerHTML = allTimes.Asr;
		spacesOfTimes[4].innerHTML = allTimes.Maghrib;
		spacesOfTimes[5].innerHTML = allTimes.Isha;
		spacesOfTimes[6].innerHTML = allTimes.Imsak;
	});
};

// Show Surat 
let quranSection = document.querySelector(".quran");
let quranContainer = document.querySelector(".quran .container");
let btn = document.querySelector(".seemore");
btn.innerHTML = "المزيد من السور";
showSurat();
async function showSurat(){
	const response = await fetch('https://api.alquran.cloud/v1/meta');
	const data = await response.json();
	// console.log(data);
	printData(data);
}
function printData(data){
	let surat = data.data.surahs.references;
	surat.forEach((ele)=>{
		quranContainer.innerHTML += `
			<div class="surah">
				<div class="name">
					<h3>${ele.name}</h3>
					<h3>${ele.englishName}</h3>
				</div>
				<div class="info">
					<h5>${ele.revelationType === "Meccan" ? ele.revelationType = "مكية" : ele.revelationType = "مدنية" } </h5>
					<h5>آياتها <span class="bum-ayat">${ele.numberOfAyahs}</span></h5>
				</div>
			</div>
		`;
	});
	let allSurat = quranContainer.querySelectorAll(".surah");
	let popupQuran = document.querySelector(".popup-quran");
	let surahTitle = document.querySelector(".popup-quran .main-title h1");
	let xQuran = document.querySelector(".popup-quran .x");
	let ayatContainer = document.querySelector(".popup-quran .container");
	allSurat.forEach((title,index)=>{
		if (index >= 55){
			title.classList.toggle("d-none");
		};
		title.addEventListener('click',()=>{
				showAyat();
				async function showAyat(){
					popupQuran.classList.add("active");
					// arrbic version
					const responseArr = await fetch(`https://api.alquran.cloud/v1/surah/${index +1}`);
					const dataArr = await responseArr.json();
					//english version 
					const responseEng = await fetch(`https://api.alquran.cloud/v1/surah/${index +1}/en.asad`);
					const dataEng = await responseEng.json();
				
					const ayatArr = dataArr.data.ayahs;
					const ayatEng = dataEng.data.ayahs;
					const titleOfSurahArr = dataArr.data.name;
					const titleOfSurahArrEng = dataEng.data.englishName;
					ayatArr.forEach((ele,i)=>{
						surahTitle.innerHTML = `${titleOfSurahArr} - ${titleOfSurahArrEng}`;
						ayatContainer.innerHTML += `
						<p ><span class="numaya" >${ele.numberInSurah}</span>${ele.text}</p>

						<p class="english-verse"> 
						
						<span class="numaya numayaToleft" >${ayatEng[i].numberInSurah}</span>
						${ayatEng[i].text}
						
						</p>
						
						`;
					})
				}
			});
		});
		// See More Surat Or Less
		btn.addEventListener("click",()=>{
			allSurat.forEach((title,index)=>{
				if (index >= 55){
					title.classList.toggle("d-none");
					quranSection.scrollIntoView({
						behavior : "smooth"
					});
					if(title.classList.contains("d-none")){
						btn.innerHTML = "المزيد من السور";
					} else {
						btn.innerHTML = "تصفح أقل";
					}
				};
			});
		});
		xQuran.onclick = function(){
			popupQuran.classList.remove("active");
			ayatContainer.innerHTML = "";
			surahTitle.innerHTML = "";
		}
}


// Show Categories Of Adkar
let adkarContainer = document.querySelector(".adkar .container");
fetch('json/adkartypes.json').then( response => response.json()).then((data) => {
	for(let i=0 ; i < data.length ; i++){
		adkarContainer.innerHTML += `
			<div class="dikr-type">
				<h3>${data[i].category}</h3>
			</div>
		`;





	}
	adkarContainer.innerHTML += `
			<div class="dikr-type diff-adkar">
				<h3>أدعية و أذكار أخرى ومتنوعة</h3>
			</div>
		`;
	// Show Diff Adkars
	let popupDiffAdkar = document.querySelector(".popup-diffadkar");
	let popupDiffAdkarCon = document.querySelector(".popup-diffadkar .container");
	let diffAdkars = document.querySelector(".diff-adkar");
	let xDiffAdkar = document.querySelector(".x-diffadkar");
	diffAdkars.addEventListener("click",()=>{
		popupDiffAdkar.classList.add("active");
		popupDiffAdkarCon.innerHTML = "";
		showDiffAdkar();
	})
	async function showDiffAdkar(){
		const response = await fetch('json/diffadkar&doaa.json');
		const data = await response.json();
		data.forEach((ele)=>{
			popupDiffAdkarCon.innerHTML += `
				<div class="diffdikr">
					<h3>${ele.category}</h3>
					<p>${ele.zekr}</p>
				</div>
			`;
		})
	};
	xDiffAdkar.addEventListener("click",()=>{
		popupDiffAdkar.classList.remove("active");
	});
	// Show Adkars
	let dikrType = document.querySelectorAll(".container .dikr-type");
	let popupAdkar = document.querySelector(".popup-adkar");
	let popupTitle = popupAdkar.querySelector(".main-title h1");
	let popupAdkarContainer = document.querySelector(".popup-adkar .container");
	let xAdkar = document.querySelector(".x-adkar");

	dikrType.forEach((title,index)=>{
		if (index !== dikrType.length -1){
			title.addEventListener('click',()=>{
				fetch("json/adkartypes.json").then(response => response.json())
				.then( data =>{
					popupAdkarContainer.innerHTML = "";
					let adkars = data[index].adkar;
					adkars.forEach(ele=>{
						popupAdkar.classList.add("active");
						popupTitle.innerHTML = data[index].category;
						popupAdkarContainer.innerHTML += `
							<div class="dikr">
								<div class="dikr-text">
									<p class="text">${ele.zekr}</p>
									<div class="description">
										<p><span>الفضل : </span> ${ele.description} </p>
									</div>
								</div>
								<div class="repeat">
									<span>التكرار</span> <br>
									<span>${ele.count}</span>
									<span>مرات</span> 
								</div>
								<div class="reference">
									<h3>${ele.reference}</h3>
								</div>
							</div>
						`;
					})
				});
			});
		}
		xAdkar.addEventListener("click",function(){
			popupAdkar.classList.remove("active");
		})
	});
});
const random=(min,max)=>Math.random()*(max-min+1)+min
// Show Ahadiths
let transfer = document.querySelector(".hadith .container .transfere p");
let indexOfTransfer = document.querySelector(".hadith .container .transfere input");
let lengthOfAhadiths = document.querySelector(".hadith-text .number .length");
let hadith = document.querySelector(".hadith-text p");
let numOfHadith = document.querySelector(".hadith-text .number .numofhadith");
let prevHadith = document.querySelector(".hadith-text .prev");
let nextHadith = document.querySelector(".hadith-text .next");
let hadithIndex = 0;
if (localStorage.getItem("indexHadith")){
	hadithIndex = parseInt(localStorage.getItem("indexHadith"));
}
fetch("https://ahadith-api.herokuapp.com/api/search/ahadith/%D8%A7%D9%84%D9%84%D9%87/ar-notashkeel")
.then(response => response.json())
.then( data => {
	const hadiths = data.Chapter;
	lengthOfAhadiths.innerHTML = data.Chapter.length;
	const randomHadith=hadiths[Math.floor(random(1,hadiths.length))].Ar_Text_Without_Tashkeel;
	document.querySelector('.random-hadith').innerHTML+=randomHadith;
	transfer.onclick = function(){
		if (indexOfTransfer.value >= 1 && indexOfTransfer.value <= hadiths.length){
			hadithIndex = indexOfTransfer.value -1;
			changeHadith();
			indexOfTransfer.value  = '';
		}
	}
	prevHadith.onclick = function(){
		hadithIndex === 0 ? hadithIndex = hadiths.length -1 : hadithIndex--;
		changeHadith();
	}
	nextHadith.onclick = function(){
		hadithIndex ===  hadiths.length -1 ? hadithIndex = 0 : hadithIndex++;
		changeHadith();
	}
	changeHadith();
	function changeHadith(){
		numOfHadith.innerHTML = hadithIndex+1;
		hadith.innerHTML = hadiths[hadithIndex].Ar_Text_Without_Tashkeel;
		localStorage.setItem("indexHadith", hadithIndex);
	}
});

// Start Stories
let btnsOfTypesStories = document.querySelectorAll(".stories .types-stories p");
let typesStories = document.querySelectorAll(".stories .container .storie");
btnsOfTypesStories.forEach((btn)=>{
	btn.addEventListener('click',()=>{
		removeActiveFromBtns();
		btn.classList.add("active");
		let datatype = btn.dataset.type;
		removeActiveFromStories();
		document.querySelector(datatype).classList.add("active");
	});
})
function removeActiveFromBtns(){
	btnsOfTypesStories.forEach((btn)=>{
		btn.classList.remove("active");
	});
}
function removeActiveFromStories(){
	typesStories.forEach((type)=>{
		type.classList.remove("active");
	});
}
let titlesOfStories = document.querySelectorAll(".stories .container .storie h3");
let paragraphOfStories = document.querySelectorAll(".stories .container .storie .text-story");
titlesOfStories.forEach((title)=>{
	title.onclick = function(){
		document.querySelector(title.dataset.name).classList.toggle("active");
		title.querySelector("i").classList.toggle("rotate");
	}
})


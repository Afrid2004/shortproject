//nav bar
var navMenu = document.querySelector(".nav-list .toggle-list"),
  navItem = document.querySelectorAll(".nav-list a"),
  defaultNavItem = document.querySelectorAll(".nav-list .default-list a"),
  toggleBtn = document.querySelector(".toggle-icon"),
  toggleIcon = document.querySelector(".toggle-icon i"),
  navLine = document.querySelector(".nav-line"),
  navBar = document.querySelector(".navigation-bar");

toggleBtn.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  if (navMenu.classList.contains("active")) {
    toggleIcon.classList.add("fi", "fi-rr-cross");
    toggleIcon.classList.remove("fi", "fi-rr-menu-burger");
  } else {
    toggleIcon.classList.remove("fi", "fi-rr-cross");
    toggleIcon.classList.add("fi", "fi-rr-menu-burger");
  }
});

navItem.forEach((item) => {
  item.addEventListener("click", () => {
    if (navMenu.classList.contains("active")) {
      navMenu.classList.remove("active");
    }
    toggleIcon.classList.remove("fi", "fi-rr-cross");
    toggleIcon.classList.add("fi", "fi-rr-menu-burger");
  });
});
defaultNavItem.forEach((item) => {
  item.addEventListener("mouseover", function (e) {
    navLine.style.width = e.target.offsetWidth + "px";
    navLine.style.left = e.target.offsetLeft + "px";
  });
  item.addEventListener("click", function (e) {
    navBar.removeEventListener("mouseleave", resetTab);
    setTimeout(() => {
      navBar.addEventListener("mouseleave", resetTab);
    }, 1000);
    navLine.style.width = e.target.offsetWidth + "px !important";
    navLine.style.left = e.target.offsetLeft + "px !important";
  });
});
navBar.addEventListener("mouseleave", resetTab);
function resetTab() {
  navLine.style.width = "48px";
  navLine.style.left = "16px";
}
//parallax
document.querySelector(".parallax-div").addEventListener("mousemove", parallax);

function parallax(e) {
  document.querySelectorAll(".object").forEach((move) => {
    var movingValue = move.getAttribute("data-val");
    var x = (e.clientX * movingValue) / 250;
    var y = (e.clientY * movingValue) / 250;

    move.style.transform = "translateX(" + x + "px) translateY(" + y + "px)";
  });
}

//slider
var slides = document.querySelector('.slides'); //list
var slide = document.querySelectorAll('.slide'); //item
var dots = document.querySelectorAll('.slider .dots div');
var prev = document.getElementById('prev');
var next = document.getElementById('next');

var active = 0;
var slideLength = slide.length - 1;     //length items

next.addEventListener('click',  function(){

    if(active + 1 > slideLength){
        active = 0;
    }
    else{
        active = active+1;
    }
    reloadSlider();

});

prev.addEventListener('click', function(){
    if(active -1 <0){
        active = slideLength;
    }
    else{
        active = active -1 ;
    }
    reloadSlider();
})

var refreshSlider = setInterval(() => {    
    next.click();
}, 5000);

function reloadSlider(){
    var checkLeft = slide[active].offsetLeft;
    slides.style.left = -checkLeft + "px";
    var lastActiveDot = document.querySelector('.slider .dots div.active');
    lastActiveDot.classList.remove('active');
    dots[active].classList.add('active');
    clearInterval(refreshSlider);
    refreshSlider = setInterval(() => {
        next.click();
    }, 5000);
}
dots.forEach((div,key)=>{
    div.addEventListener('click',function(){
        active = key;
        reloadSlider();
    })
})

//review
var reviewWrapper = document.querySelector('[data-review-wrapper]');
var carousel = document.querySelector('[data-review-carousel]');
var cardWidth = document.querySelector('[data-review-card]').offsetWidth;
var carouselChildren = [...carousel.children];
var isDragging = false, startX, startScrollLeft, isAutoPlay = true , timeOut;

//getting number of cards can fit in carousel at once
var cardPreview = Math.round(carousel.offsetWidth / cardWidth);
//inserting copied few last cards to begining of carousel for infinite scroll
carouselChildren.slice(-cardPreview).reverse().forEach((card) =>{
    carousel.insertAdjacentHTML('afterbegin' , card.outerHTML);
})
//inserting copied few first cards to end of the carousel for infinite scroll
carouselChildren.slice(0, cardPreview).forEach((card) => {
    carousel.insertAdjacentHTML('beforeend' , card.outerHTML);
})

function dragStart(e){
  isDragging = true;
  carousel.classList.add("dragging");
  startX = e.pageX;
  startScrollLeft = carousel.scrollLeft;
}
function dragging(e){
  if(!isDragging){
    return;
  }
  carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}
function dragStop(){
  isDragging = false;
  carousel.classList.remove("dragging");
}
var infiniteScroll = ()=>{
  //if the carousel is at beging, scroll to end
  //else carousel at end, scroll to begining
  if(carousel.scrollLeft === 0){
      carousel.classList.add('no-transition');
      carousel.scrollLeft = carousel.scrollWidth - 2*carousel.offsetWidth;
      carousel.classList.remove('no-transition');
  }
  else if(Math.ceil(carousel.scrollLeft)===carousel.scrollWidth - carousel.offsetWidth){
      carousel.classList.add('no-transition');
      carousel.scrollLeft = carousel.offsetWidth;
      carousel.classList.remove('no-transition');
  }
  //clearing the timeout & starting the autoplay if the mouse is not hovering the carousel
  clearTimeout(timeOut);
  if(!reviewWrapper.matches(':hover')) autoPlay();
}
var autoPlay = () =>{
  if(!autoPlay) return;
  //autoplaying the carousel after every 2500ms
  timeOut = setTimeout(() => {
      carousel.scrollLeft += cardWidth;
  }, 5000);
}
autoPlay();
carousel.addEventListener('scroll', infiniteScroll);  
carousel.addEventListener("mousedown",dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup",dragStop);

reviewWrapper.addEventListener('mouseenter' , ()=> clearTimeout(timeOut));
reviewWrapper.addEventListener('mouseleave' , autoPlay);



//check network connection
var networkBox = document.querySelector(".network"),
  networkIcon = document.querySelector(".network-icon i"),
  networkTitle = document.querySelector(".network-title"),
  networkDesc = document.querySelector(".network-desc"),
  reconnectBtn = document.querySelector(".reconnect");
var isOnline = true,
  intervalId,
  timer = 10;
var checkConnention = async () => {
  try {
    /*try to fetch random data from API. If connection status code between 
        200 & 300 , the network connection is considerd online*/
    var response = await fetch("https://jsonplaceholder.typicode.com/posts");
    isOnline = response.status >= 200 && response.status < 300;
  } catch (error) {
    isOnline = false; //if there is an error then network connection is considerd offline
  }
  timer = 10;
  clearInterval(intervalId);
  handle(isOnline);
};

function handle(online) {
  if (online) {
    networkIcon.classList.remove("fi", "fi-rr-wifi-slash");
    networkIcon.classList.add("fi", "fi-rr-wifi");
    networkIcon.classList.add("active");
    networkBox.classList.add("active");
    networkTitle.innerHTML = "Restored Connection";
    networkDesc.innerHTML =
      "Your device is now successfully connected to the internet.";
    reconnectBtn.classList.add("active");
    setTimeout(() => {
      networkBox.classList.remove("show");
    }, 2000);
  } else {
    networkIcon.classList.add("fi", "fi-rr-wifi-slash");
    networkIcon.classList.remove("fi", "fi-rr-wifi");
    networkIcon.classList.remove("active");
    networkBox.classList.remove("active");
    networkTitle.innerHTML = "Lost Connection";
    networkDesc.innerHTML = `Your network is unavilable. We will attempt to reconnect you in
        <b>10</b> seconds.`;
    reconnectBtn.classList.remove("active");
    networkBox.classList.add("show");
  }
  intervalId = setInterval(() => {
    timer--;
    if (timer === 0) {
      checkConnention();
    }
    document.querySelector(".network-desc b").innerHTML = timer;
  }, 1000);
}

//check Internet connection after every 3s
setInterval(() => {
  isOnline && checkConnention();
}, 3000);

reconnectBtn.addEventListener("click", checkConnention);

//Random Password Generator
var generateInputField = document.querySelector(".generate-input-text");
var copyIcon = document.querySelector(".copy-icon");
var generateBtn = document.querySelector(".generate-btn");
var upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var lowerChars = upperChars.toLowerCase();
var numbers = "1234567890";
var symbols = "@#~$%^&*()+={}[]</>";
var mixChars = upperChars + lowerChars + numbers + symbols;
var passwordlength = 12;

generateBtn.addEventListener("click", generatePass);

function generatePass() {
  var password = "";

  password += upperChars[Math.floor(Math.random() * upperChars.length)];
  password += lowerChars[Math.floor(Math.random() * lowerChars.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  while (passwordlength > password.length) {
    password += mixChars[Math.floor(Math.random() * mixChars.length)];
  }
  console.log(password);
  generateInputField.value = password;
}

copyIcon.addEventListener("click", () => {
  copyIcon.classList.add("active");
  generateInputField.select();
  document.execCommand("copy");
});

copyIcon.addEventListener("mouseleave", () => {
  setTimeout(() => {
    copyIcon.classList.remove("active");
  }, 500);
});

//text to speech
var speech = new SpeechSynthesisUtterance();
var voices = [];
var voiceSelect = document.querySelector(".speech-row select");

window.speechSynthesis.onvoiceschanged = () => {
  voices = window.speechSynthesis.getVoices();
  speech.voice = voices[0];

  voices.forEach(
    (voice, i) => (voiceSelect.options[i] = new Option(voice.name, i))
  );
};

document.querySelector(".listen").addEventListener("click", () => {
  speech.text = document.querySelector(".speech-text").value;
  window.speechSynthesis.speak(speech);
});

voiceSelect.addEventListener("change", () => {
  speech.voice = voices[voiceSelect.value];
});

//quiz app
var questions = [
  {
    question: "পবিত্র কোরানের কোন সূরাটি কোরানের এক তৃতীয়াংশের সমান ?",
    answers: [
      { text: "সুরা কাহাফ", correct: false },
      { text: "সুরা ইখলাস", correct: true },
      { text: "সুরা কাফেরুন", correct: false },
      { text: "সুরা কাওসার", correct: false },
    ],
  },
  {
    question: "পবিত্র কোরান নাযিল হতে কত বছর সময় লেগেছিল ?",
    answers: [
      { text: "৪১ বছর", correct: false },
      { text: "৩৯ বছর", correct: false },
      { text: "২৩ বছর", correct: true },
      { text: "২৭ বছর", correct: false },
    ],
  },
  {
    question: "পবিত্র কুরআনুল কারীমে কতগুলো সূরা আছে ?",
    answers: [
      { text: "১০৫ টি", correct: false },
      { text: "১০৮ টি", correct: false },
      { text: "১১৪ টি", correct: true },
      { text: "১৪০ টি", correct: false },
    ],
  },
  {
    question: "কোন নবী নিজ দুশমনের বাড়িতে লালিত পালিত হন ?",
    answers: [
      { text: "ইব্রাহীম(আঃ)", correct: false },
      { text: "ইউসুফ(আঃ)", correct: false },
      { text: "সুলাইমান(আঃ)", correct: false },
      { text: "মুসা(আঃ)", correct: true },
    ],
  },
  {
    question: "কোন নবী পশু-পাখি,বাতাসের সাথে কথা বলতেন ?",
    answers: [
      { text: "যাকারিয়া(আঃ)", correct: false },
      { text: "সুলাইমান(আঃ)", correct: true },
      { text: "দাউদ(আঃ)", correct: false },
      { text: "ইউসুফ(আঃ)", correct: false },
    ],
  },
];

var quizQuestion = document.getElementById("question");
var ansBtnList = document.getElementById("answer-btns");
var nextQuesBtn = document.querySelector(".ans-submit");
var currentQuestionIndex = 0;
var quizScore = 0;

function startQuiz() {
  currentQuestionIndex = 0;
  quizScore = 0;
  nextQuesBtn.innerHTML = `পরবর্তী প্রশ্ন <i class="fi fi-rr-caret-right"></i>`;
  showQuestionAns();
}

function showQuestionAns() {
  resetQuestionAns();
  var currentQuestion = questions[currentQuestionIndex];
  var currentQuestionNumber = currentQuestionIndex + 1;
  var questionNoBangla;
  switch (currentQuestionNumber) {
    case 1:
      questionNoBangla = "১";
      break;
    case 2:
      questionNoBangla = "২";
      break;
    case 3:
      questionNoBangla = "৩";
      break;
    case 4:
      questionNoBangla = "৪";
      break;
    default:
      questionNoBangla = "৫";
  }

  quizQuestion.innerHTML = questionNoBangla + " . " + currentQuestion.question;

  currentQuestion.answers.forEach((answer) => {
    var createQuizLi = document.createElement("li");

    createQuizLi.innerHTML = answer.text;
    ansBtnList.appendChild(createQuizLi);
    if (answer.correct) {
      createQuizLi.dataset.correct = answer.correct;
    }
    createQuizLi.addEventListener("click", showCorrectAns);
  });
}

startQuiz();

function resetQuestionAns() {
  nextQuesBtn.style.display = "none";
  while (ansBtnList.firstChild) {
    ansBtnList.removeChild(ansBtnList.firstChild);
  }
}

function showCorrectAns(e) {
  var selectedBtn = e.target;
  var isCorrect = selectedBtn.dataset.correct === "true";
  if (isCorrect) {
    selectedBtn.classList.add("correct");
    var audio = new Audio("media/tikmark.mp3");
    quizScore++;
  } else {
    selectedBtn.classList.add("incorrect");
    audio = new Audio("media/crossmark.mp3");
  }
  audio.play();

  Array.from(ansBtnList.children).forEach((btn) => {
    if (btn.dataset.correct === "true") {
      btn.classList.add("correct");
    }
    btn.classList.add("pointer");
  });
  nextQuesBtn.style.display = "flex";
}

nextQuesBtn.addEventListener("click", () => {
  if (currentQuestionIndex < questions.length) {
    handleNextQues();
  } else {
    startQuiz();
  }
});

function handleNextQues() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestionAns();
  } else {
    showScore();
  }
}

function showScore() {
  resetQuestionAns();
  var questionNoBangla;
  switch (quizScore) {
    case 1:
      questionNoBangla = "১";
      break;
    case 2:
      questionNoBangla = "২";
      break;
    case 3:
      questionNoBangla = "৩";
      break;
    case 4:
      questionNoBangla = "৪";
      break;
    default:
      questionNoBangla = "৫";
  }

  switch (quizScore) {
    case 0:
      quizQuestion.innerHTML = `দুঃখিত! আপনি ৫ টি প্রশ্নের মধ্যে ১টি প্রশ্নেরও সঠিক উত্তর দিতে পারেন নি । ইসলামিক কুইজে অংশগ্রহণের জন্য ধন্যবাদ আপনাকে ।`;
      break;
    case 1:
    case 2:
    case 3:
      quizQuestion.innerHTML = `আরো ভালো প্রস্তুতি প্রয়োজন। আপনি ৫ টি প্রশ্নের মধ্যে ${questionNoBangla} টি প্রশ্নের সঠিক উত্তর দিয়েছেন । ইসলামিক কুইজে অংশগ্রহণের জন্য ধন্যবাদ আপনাকে ।`;
      break;
    case 4:
      quizQuestion.innerHTML = `দারুণ চেষ্টা! আপনি ৫ টি প্রশ্নের মধ্যে ${questionNoBangla} টি প্রশ্নের সঠিক উত্তর দিয়েছেন । ইসলামিক কুইজে অংশগ্রহণের জন্য ধন্যবাদ আপনাকে ।`;
      break;
    default:
      quizQuestion.innerHTML = `অভিনন্দন! আপনি ৫ টি প্রশ্নের মধ্যে ${questionNoBangla} টি প্রশ্নের সঠিক উত্তর দিয়েছেন । ইসলামিক কুইজে অংশগ্রহণের জন্য ধন্যবাদ আপনাকে ।`;
  }

  nextQuesBtn.innerHTML = `পুনরায় শুরু করুন &nbsp; <i class="fi fi-rr-refresh"></i>`;
  nextQuesBtn.style.display = "flex";
}

//image search engine
var imgSearchForm = document.getElementById("img-search-form"),
  imgSearchField = document.getElementById("img-search-field"),
  imgSearchBtn = document.getElementById("search-img"),
  imgSearchResult = document.getElementById("img-search-result"),
  imgSearchText = document.querySelector(".img-search-text"),
  imgSearchTextLink = document.querySelector(".img-search-text a"),
  loadMoreBtn = document.getElementById("load-more-img"),
  accessKey = "AZb1p8AFvtoHiOfpTXbm5TKC8wgdPz9sMlfiR4L9oDM";

//get unsplash api to show the images

var imgKeyword = "";
var imgPage = 1;
async function searchImg() {
  imgKeyword = imgSearchField.value; //get searchfield value
  var url = `https://api.unsplash.com/search/photos?page=${imgPage}&query=${imgKeyword}&client_id=${accessKey}&per_page=9`; //get unsplash api url
  var response = await fetch(url); //get response in browser from api url
  var data = await response.json(); //get response as object
  var results = data.results; //get results from object
  if (imgPage === 1) {
    imgSearchResult.innerHTML = "";
  }
  results.map((result) => {
    //pass 1 by 1 result from results array which is 10
    var createLink = document.createElement("a");
    createLink.href = result.links.html; //each results links
    createLink.target = "_blank";
    var createImg = document.createElement("img"); //each result image link
    createImg.src = result.urls.small;
    createLink.appendChild(createImg);
    imgSearchResult.appendChild(createLink);
  });

  var searchobject = [
    {
      searchTxt: imgSearchField.value,
    },
  ];
  searchobject.map((subdata) => {
    if (subdata.searchTxt == "") {
      imgSearchText.innerHTML = `No Results, Please enter a value.`;
      loadMoreBtn.style.display = "none";
    }
    if (data.results.length === 0) {
      imgSearchText.innerHTML = `No results found of `;
      imgSearchTextLink.innerHTML = `${subdata.searchTxt}`;
      imgSearchText.append(imgSearchTextLink);
      loadMoreBtn.style.display = "none";
    } else {
      imgSearchText.innerHTML = `Showing results of `;
      imgSearchTextLink.innerHTML = `${subdata.searchTxt}`;
      imgSearchText.append(imgSearchTextLink);
      loadMoreBtn.style.display = "flex";
    }
  });
}

imgSearchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  imgPage = 1;
  searchImg();
});

loadMoreBtn.addEventListener("click", () => {
  imgPage++;
  loadMoreBtn.querySelector("i").classList.add("rotate");
  setTimeout(() => {
    loadMoreBtn.querySelector("i").classList.remove("rotate");
  }, 1000);
  searchImg();
});

//to-do app
var todoInput = document.getElementById("todo-Input"),
  todoForm = document.querySelector(".todo-form"),
  todoContainer = document.querySelector(".todo-container");

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask();
});

function addTask() {
  if (todoInput.value === " ") {
    alert("Please enter any task.");
  } else {
    var createList = document.createElement("li");
    createList.innerHTML = todoInput.value;
    todoContainer.appendChild(createList);
    var createIcon = document.createElement("i");
    createIcon.classList.add("fi", "fi-rr-cross-small");
    createList.appendChild(createIcon);
  }
  todoInput.value = "";
  saveTask();
}

todoContainer.addEventListener(
  "click",
  (e) => {
    if (e.target.tagName === "LI") {
      e.target.classList.toggle("checked");
      saveTask();
    } else if (e.target.tagName === "I") {
      e.target.parentElement.remove();
      saveTask();
    }
  },
  false
);

function saveTask() {
  localStorage.setItem("data", todoContainer.innerHTML);
}
function showData() {
  todoContainer.innerHTML = localStorage.getItem("data");
}
showData();

//magnify img

var magnifyContainer = document.querySelector(".magnify-container");
function magnify(imgId, zoom) {
  var img, glass, imgWidth, imgHeight, bw;
  img = document.getElementById(imgId);
  glass = document.createElement("div");
  glass.classList.add("magnify-glass");
  img.parentElement.insertBefore(glass, img);
  glass.style.backgroundImage = "url('" + img.src + "')";
  glass.style.backgroundRepeat = "no-repeat";
  glass.style.backgroundSize = img.width * zoom + "px" + img.height * zoom + "px";
  bw = 3;
  imgWidth = glass.offsetWidth / 2;
  imgHeight = glass.offsetHeight / 2;

  glass.addEventListener("mousemove", moveMagnifier);
  img.addEventListener("mousemove", moveMagnifier);
  glass.addEventListener("touchmove", moveMagnifier);
  img.addEventListener("touchmove", moveMagnifier);

  function moveMagnifier(e) {
    e.preventDefault();
    var pos, x, y;
    pos = getCursorPos(e);
    x = pos.x;
    y = pos.y;

    if (x > img.width - imgWidth / zoom) {
      x = img.width - imgWidth / zoom;
    }
    if (x < imgWidth / zoom) {
      x = imgWidth / zoom;
    }
    if (y > img.height - imgHeight / zoom) {
      y = img.height - imgHeight / zoom;
    }
    if (y < imgHeight / zoom) {
      y = imgHeight / zoom;
    }
    glass.style.left = x - imgWidth + "px";
    glass.style.top = y - imgHeight + "px";
    glass.style.backgroundPosition =
      "-" +
      (x * zoom - imgWidth + bw) +
      "px -" +
      (y * zoom - imgHeight + bw) +
      "px";
  }

  function getCursorPos(e) {
    var a,
      x = 0,
      y = 0;
    e = e || window.event;
    a = img.getBoundingClientRect();
    x = e.pageX - a.left;
    y = e.pageY - a.top;
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;
    return { x: x, y: y };
  }
}

magnify("car-img", 3);

//image previewer
var defaultFileBtn = document.querySelector(".default-file-btn");
var customFileBtn = document.querySelector(".custom-file-btn");
var imgPreviewsec = document.querySelector(".img-preview");
var imgPreviewContainer = document.querySelector(".img-preview-container");
var imgPreviewWrapper = document.querySelector(".img-preview-wrapper");
var noFileChoseText = document.querySelector(".img-preview-content p");
var previewImg = document.querySelector(".img-preview img");
var imgName = document.querySelector(".img-name");
var regExp = /[0-9a-zA-Z\^\&\'\@\{\}\[\]\,\$\=\!\-\#\(\)\.\%\+\~\_ ]+$/;

customFileBtn.addEventListener("click", () => {
  defaultFileBtn.click();
});

defaultFileBtn.addEventListener("change", previewImgFunc);

function previewImgFunc() {
  var file = defaultFileBtn.files[0];
  if (file) {
    var reader = new FileReader();
    reader.addEventListener("load", function () {
      var result = reader.result;
      var xhr = new XMLHttpRequest();
      xhr.open("GET", result);
      xhr.responseType = "arraybuffer";
      xhr.onload = () => {
        var blob = new Blob([xhr.response]);
        var url = URL.createObjectURL(blob);
        previewImg.src = url;
      };
      xhr.send();
    });
    reader.readAsDataURL(file);
    imgPreviewContainer.classList.add("active");
  }
  if (this.value) {
    imgName.innerHTML = "Image name : " + this.value.match(regExp);
  }
}
imgPreviewWrapper.addEventListener("dragover", (e) => {
  e.preventDefault();
  imgPreviewWrapper.classList.add("active");
  imgPreviewContainer.classList.remove("active");
  noFileChoseText.textContent = "Yeah! drop here.";
});

imgPreviewWrapper.addEventListener("drop", (e) => {
  e.preventDefault();
  imgPreviewWrapper.classList.remove("active");
  defaultFileBtn.files = e.dataTransfer.files;
  previewImgFunc();
  if (defaultFileBtn.value) {
    imgName.innerHTML = "Image name: " + defaultFileBtn.value.match(regExp);
  }
});

//img resizer and compressor
var uploadBox = document.querySelector(".upload-box"),
  uploadFile = document.querySelector(".upload-box input"),
  uploadImg = document.querySelector(".upload-box img"),
  uploadWrapper = document.querySelector(".img-rsz-wrapper"),
  uploadImgWidth = document.querySelector(".img-width input"),
  uploadImgHeight = document.querySelector(".img-height input"),
  uploadImgRatio = document.querySelector(".img-ratio input"),
  uploadImgQuality = document.querySelector(".img-quality input"),
  uploadImgDownBtn = document.querySelector(".img-download-btn");

uploadBox.addEventListener("click", () => {
  uploadFile.click();
});
uploadFile.addEventListener("change", previewFile);
uploadImgDownBtn.addEventListener("click", resizeDownload);

var imgRatio;

function previewFile() {
  var file = uploadFile.files[0];
  if (!file) {
    return;
  }
  uploadImg.src = URL.createObjectURL(file);
  uploadImg.addEventListener("load", () => {
    uploadWrapper.classList.add("active");
    uploadImgWidth.value = uploadImg.naturalWidth;
    uploadImgHeight.value = uploadImg.naturalHeight;
    imgRatio = uploadImg.naturalWidth / uploadImg.naturalHeight;
  });
}

uploadImgWidth.addEventListener("keyup", () => {
  var height = uploadImgRatio.checked
    ? uploadImgWidth.value / imgRatio
    : uploadImgHeight.value;
  uploadImgHeight.value = Math.floor(height);
});
uploadImgHeight.addEventListener("keyup", () => {
  var width = uploadImgRatio.checked
    ? uploadImgHeight.value * imgRatio
    : uploadImgWidth.value;
  uploadImgWidth.value = Math.floor(width);
});

function resizeDownload() {
  var canvas = document.createElement("canvas");
  var a = document.createElement("a");
  var ctx = canvas.getContext("2d");

  var quality = uploadImgQuality.checked ? 0.7 : 1.0;

  canvas.width = uploadImgWidth.value;
  canvas.height = uploadImgHeight.value;
  ctx.drawImage(uploadImg, 0, 0, canvas.width, canvas.height);

  a.href = canvas.toDataURL("image/*", quality);
  a.download = new Date().getTime();
  a.click();
}

//file downloader
var urlFileInput = document.querySelector(".file-input-form input"),
  urlDownBtn = document.querySelector(".file-input-form button");

urlDownBtn.addEventListener("click", (e) => {
  e.preventDefault();
  urlDownBtn.textContent = "Downloading...";
  fetchFile(urlFileInput.value);
});

function fetchFile(url) {
  fetch(url)
    .then((res) => res.blob())
    .then((file) => {
      var fileUrl = URL.createObjectURL(file);
      var a = document.createElement("a");
      a.href = fileUrl;
      a.download = url.replace(/^_.*[\\\/]/, "");
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(fileUrl);
      urlDownBtn.textContent = "Download File";
    })
    .catch(() => {
      alert("fail to Download file");
      urlDownBtn.textContent = "Download File";
    });
}

//save text as file
var textInputArea = document.querySelector(".save-text-container textarea"),
  textFileName = document.querySelector(".file-name input"),
  textFileOptions = document.querySelector(".file-options select"),
  textFileDownBtn = document.querySelector(".save-text-container button");

textFileOptions.addEventListener("change", () => {
  var selectedOptions =
    textFileOptions.options[textFileOptions.selectedIndex].text;
  textFileDownBtn.innerHTML = `Save As ${selectedOptions.split(" ")[0]} File`;
});

textFileDownBtn.addEventListener("click", (e) => {
  e.preventDefault();
  var blob = new Blob([textInputArea.value], { type: textFileOptions.value });
  var fileLink = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = fileLink;
  a.download = textFileName.value;
  a.click();
});

//custom select menu
var selectMenuContainer = document.querySelector(".select-menu-container"),
  selectBtn = document.querySelector(".select-menu-container .select-btn"),
  searchMenu = document.querySelector(".serach-menu input"),
  selectMenuOptions = document.querySelector(".menu-options"),
  allSelectMenuOptions = document.querySelectorAll(".menu-options .option");

selectBtn.addEventListener("click", () => {
  selectMenuContainer.classList.toggle("active");
});

var countries = [
  "Algeria",
  "Australia",
  "Bangladesh",
  "Belgium",
  "Canada",
  "China",
  "Denmark",
  "Ethiopia",
  "England",
  "Finland",
  "France",
  "Germany",
  "Hungary",
  "Iceland",
  "India",
  "Indonasia",
  "Iran",
  "Italy",
  "Japan",
  "Malaysia",
  "Nepal",
  "Natherlands",
  "pakistan",
  "Qatar",
  "Russia",
  "Romania",
  "Saudi Arabia",
  "South Africa",
  "Turkey",
  "Thailand",
  "Ukrain",
  "United States",
  "Vietnam",
];

function allCountries(selectedCountry) {
  selectMenuOptions.innerHTML = "";
  countries.forEach((country) => {
    var isSelected = country == selectedCountry ? "selected" : "";
    var li = `<li onclick="updateName(this)" class=${isSelected}>${country}</li>`;
    selectMenuOptions.insertAdjacentHTML("beforeend", li);
  });
}
allCountries();

function updateName(selectedLi) {
  searchMenu.value = "";
  allCountries(selectedLi.innerHTML);
  selectBtn.firstElementChild.innerHTML = selectedLi.innerHTML;
  selectMenuContainer.classList.remove("active");
}

searchMenu.addEventListener("keyup", () => {
  var array = [];
  var insertValue = searchMenu.value.toLowerCase();
  array = countries
    .filter((data) => {
      return data.toLowerCase().startsWith(insertValue);
    })
    .map((data) => `<li onclick="updateName(this)">${data}</li>`)
    .join("");
  selectMenuOptions.innerHTML = array
    ? array
    : `<p>Sorry! Country not found.</p>`;
});

//autocomplete searchbar
var autoSearchField = document.querySelector(".auto-search-box input"),
  autoResultBox = document.querySelector(".result-box");

var keywords = [
  "HTML",
  "CSS",
  "Javascript",
  "How to design a website",
  "Portfolio website",
  "How to learn javascript",
  "Front-end Developer Roadmap",
  "MERN Stack Developing",
  "Learn with Faisal",
  "Visual studio code extensions",
];

autoSearchField.addEventListener("keyup", () => {
  var resArray = [];
  var serFieldVal = autoSearchField.value.toLowerCase();
  if (serFieldVal.length) {
    resArray = keywords.filter((keyword) => {
      return keyword.toLowerCase().includes(serFieldVal);
    });
    autoResultBox.classList.add("active");
  } else {
    autoResultBox.classList.remove("active");
  }
  display(resArray);
  if (!resArray.length) {
    autoResultBox.innerHTML = `Sorry! no results found.`;
  }
  if (!serFieldVal.length) {
    autoResultBox.innerHTML = ``;
  }
});

function display(result) {
  var content = result.map((list) => {
    return `<li onclick="showVal(this)">${list}</li>`;
  });
  autoResultBox.innerHTML = content.join("");
}

function showVal(list) {
  autoSearchField.value = list.innerHTML;
  autoResultBox.innerHTML = ``;
  autoResultBox.classList.remove("active");
}

//load more content
var loadContentBtn = document.querySelector(".btn-loading .load-more");
var currentContent = 2;
loadContentBtn.addEventListener("click", (e) => {
  e.preventDefault();
  var allContents = [...document.querySelectorAll(".loading-content li")];
  e.target.classList.add("show-loader");
  for (let i = currentContent; i < currentContent + 2; i++) {
    setTimeout(() => {
      e.target.classList.remove("show-loader");
      if (allContents[i]) {
        allContents[i].style.display = "inherit";
      }
    }, 3000);
  }
  currentContent += 2;
  if (currentContent >= allContents.length) {
    setTimeout(() => {
      e.target.classList.add("loaded");
    }, 3000);
  }
});

// localStorage에 저장되어 있는 날씨 데이터를 받아옴
const savedWeatherData = JSON.parse(localStorage.getItem('saved-weather'));
// input 태그 선택
const todoInput = document.querySelector('#todo-input');
// to do list를 감싼 ul 태그
const todoList = document.querySelector('#todo-list');
// 로컬 스토리지에서 저장된 데이터 가져오기
const savedTodoList = JSON.parse(localStorage.getItem('saved-items'));

// list 만들기
const createTodo = function (storageData) {
  let todoContents = todoInput.value;
  // 만약 스토리지에 데이터가 있다면
  if(storageData) {
    // 값에 스토리지에 있던 contents 추가
    todoContents = storageData.contents;
  }
  const newLi = document.createElement('li'); // li 태그 생성
  const newSpan = document.createElement('span'); // span 태그 생성
  const newBtn = document.createElement('button'); // button 태그 생성

  // 버튼 클릭 이벤트
  newBtn.addEventListener('click', () => {
    // classList : li에 새로운 클래스 추가
    // toggle: 클릭시 추가, 다시 클릭하면 클래스 제거
    newLi.classList.toggle('complete');
    // 로컬 스토리지에 저장
    saveItemsFn();
  });

  // 더블클릭 이벤트
  newLi.addEventListener('dblclick', () => {
    newLi.remove();
    // 로컬 스토리지에 저장
    saveItemsFn();
  });

  // 스토리지 데이터가 존재하고(?.) complete 프로퍼티가 존재하고 그 값이 true 라면
  // ?. : 옵셔널 체이닝 (존재했을 경우만 뒤 코드 진행, undefined 이거나 Null인 경우는 뒷부분 무시)
  if(storageData?.complete === true) {
    newLi.classList.add('complete')
  }

  newSpan.textContent = todoContents; // span 안에 input 에 입력한 값(value) 넣기
  newLi.appendChild(newBtn); // li 내부에 완료 btn 넣기
  newLi.appendChild(newSpan); // li 내부에 span 넣기
  todoList.appendChild(newLi); // ul 내부에 리스트 넣기
  todoInput.value = ''; // input 에 입력된 값(value) 지우기
  // 로컬 스토리지에 저장
  saveItemsFn();
};

const keyCodeCheck = function () {
  // 엔터(keyCode: 13)를 눌렀을 때, 그리고 공백이 아닐 경우만 실행 
  if (window.event.keyCode === 13 && todoInput.value.trim() !== '') {
    createTodo();
  }
};

// list 전부 삭제
const deleteAll = function () {
  const liList = document.querySelectorAll('li');
  for (let i = 0; i < liList.length; i++) {
    liList[i].remove();
  }
  // 로컬 스토리지에 저장
  saveItemsFn();
};

// 로컬 스토리지에 저장
const saveItemsFn = function () {
  const saveItems = [];
  for (let i = 0; i < todoList.children.length; i++) {
    const todoObj = {
      contents: todoList.children[i].querySelector('span').textContent,
      complete: todoList.children[i].classList.contains('complete'),
    };
    saveItems.push(todoObj);
  }

  saveItems.length === 0 
  ? localStorage.removeItem('saved-items') 
  : localStorage.setItem('saved-items', JSON.stringify(saveItems));;
};

/**
 * savedTodoList 의 데이터 존재여부에 따른 if문
 */
if(savedTodoList) {
  for(let i=0; i<savedTodoList.length; i++) {
    createTodo(savedTodoList[i]);
  }
};

/**
 * 타이틀을 지역 이름으로, 배경을 날씨 이미지로 보이도록
 */
const weatherDataActive = function({ location, weather }) {
  const weatherMainList = [
    'Clear',
    'Clouds',
    'Drizzle',
    'Rain',
    'Snow',
    'Thunderstorm'
  ];
  // weather에 정해진 것 이외의 날씨가 들어온다면 Clouds가 보이도록
  weather = weatherMainList.includes(weather) ? weather : 'Clouds';
  const locationNameTag = document.querySelector('#location-name-tag');

  locationNameTag.textContent = location;
  document.body.style.backgroundImage = `url('./images/${weather}.jpg')`;

  // 지역이 같거나 날씨가 같은 경우 불필요하게 로컬스토리지에 접근하는 것 방지
  if(!savedWeatherData || 
    savedWeatherData.location !== location || 
    savedWeatherData.weather !== weather) {
    localStorage.setItem('saved-weather', JSON.stringify({ location, weather }));
  }
}

/**
 * openWeatherMap API 사용
 * https://openweathermap.org/api/
 */
const weatherSearch = function( { latitude, longitude } ) {
  // API 요청
  fetch( 
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=85f05cb8ddb38b221d82bd263842f0ac`
  )
    // 비동기로 동작하는 함수는 then 을 사용하여 기다림
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      const weatherData = {
        location: json.name,
        weather: json.weather[0].main,
      }
      weatherDataActive(weatherData);
    })
    // 에러 확인 (then과 세트라고 보면 됨)
    .catch((err) => {
      console.log(err);
    })
};

// Google API에서 위도/경도 받아와서 객체로 만들기
// {coords} : 구조분해할당 사용
const accessToGeo = function({coords}) {
  const { latitude, longitude } = coords;
  const positionObj = {
    // shorthand property (키,값이 동일할 경우 하나만 쓰면 됨)
    latitude, //위도
    longitude //경도
  };

  weatherSearch(positionObj);
};

/**
 * Google API 사용
 * https://developer.mozilla.org/ko/docs/Web/API/Geolocation_API/Using_the_Geolocation_API
 */
const askForLocation = function() {
  navigator.geolocation.getCurrentPosition(accessToGeo, (err) => {
    console.log(err);
  })
};

askForLocation();

/**
 * 
 */
if(savedWeatherData) {
  weatherDataActive(savedWeatherData);
}
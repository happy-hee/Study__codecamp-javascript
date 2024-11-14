const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const savedTodoList = JSON.parse(localStorage.getItem("saved-item")); // JSON.parse : String을 배열로 변환

const createTodo = function(storageData) {
  let todoContents = todoInput.value;
  if(storageData) {
    todoContents = storageData.contents;
  }
  const newLi = document.createElement("li");
  const newSpan = document.createElement("span");
  const newBtn = document.createElement("button");  // 완료버튼

  // 완료버튼 클릭시 실행
  newBtn.addEventListener("click", () => {
    newLi.classList.toggle("complete"); // 버튼 클릭시 클래스명이 추가 되었다가, 삭제 되었다가 함(toggle)
    saveItemsFn();  // contents의 complete 값이 바뀌었으므로 다시 저장함
  });

  newLi.addEventListener("dblclick", () => {
    newLi.remove(); // 클릭된 li를 삭제
    saveItemsFn();  // li가 하나 삭제 되었으므로 다시 저장함
  });

  // 아래에서 함수를 실행하며 storageData를 하나하나 가져올 건데,
  // 그 storageData 에서 complete가 true이면 complete 클래스명을 추가해 준다.
  if(storageData?.complete) { // 옵셔널체이닝을 통해 storageData가 있을 경우에만 실행
    newLi.classList.add("complete");
  }

  newSpan.textContent = todoContents;
  newLi.appendChild(newBtn); // 하위 속성으로 추가
  newLi.appendChild(newSpan);
  todoList.appendChild(newLi);
  todoInput.value = ""; // li 요소 추가 후 input 비우기

  saveItemsFn();
}

const keyCodeCheck = function(event) {  // 입력 이벤트를 받아옴
  // 'Enter' 키가 눌렸을 때, 입력폼이 비어있지 않을 때만 실행
  if (event.key === "Enter" && todoInput.value) { 
    createTodo();
  }
}

// todo 리스트 전체 삭제
const deleteAll = function() {
  const liList = document.querySelectorAll("li");
  for (let i = 0; i < liList.length; i++) {
    liList[i].remove();
  }
  saveItemsFn();  // contents의 갯수가 바뀌었으므로 다시 저장함
}

const saveItemsFn = function() {
  const saveItems = [];
  for (let i = 0; i < todoList.children.length; i++) {
    const todoObj = {
      contents: todoList.children[i].querySelector("span").textContent,
      complete: todoList.children[i].classList.contains("complete") // complete 라는 클래스를 가지고 있는지 확인(return: Boolean)
    }
    saveItems.push(todoObj);
  }

  // 로컬스토리지에 저장
  if(saveItems.length === 0) {
    localStorage.removeItem("saved-item");
  } else {
    localStorage.setItem("saved-item", JSON.stringify(saveItems));  // JSON.stringfy: 배열을 String으로 변환
  }
  // 삼항연산자로 표현: saveItems.length === 0 ? localStorage.removeItem("saved-item") : localStorage.setItem("saved-item", JSON.stringify(saveItems));
}

if(savedTodoList) { // savedTodoList가 있다면
  for (let i = 0; i < savedTodoList.length; i++) {  // savedTodoList의 길이(배열 안 갯수)만큼 반복 
    createTodo(savedTodoList[i]);
  }
}

const weatherSearch = function(position) {
  // 프로토콜://도메인/경로(Path)?파라미터(요청을 보낼 때 필요한 데이터)
  // * 비동기로 동작하는 함수는 then을 사용해서 응답을 받아올 때까지 기다려줘야 한다.
  const openWeatherRes = fetch( // fetch : API 요청
    `https://api.openweathermap.org/data/2.5/weather?lat=${position.latitude}&lon=${position.longitude}&exclude={part}&appid=85f05cb8ddb38b221d82bd263842f0ac`
  ).then((res) => { // 응답이 오길 기다렸다가 받아옴
    return res.json();  // 받아온 값을 json 으로 변환하여 return
  })
  .then((json) => {
    console.log(json.name, json.weather[0].description);
  })
  .catch((err) => { // 요청이 제대로 이루어지지 않았다면 (*then을 수행하는 중 에러가 발생하면 catch로 이동)
    console.error(err);
  });
}

const accessToGeo = function(position) {
  const positionObj = {
    latitude: position.coords.latitude, // 위도 // position 안의 coords 안의 latitude 을 불러옴
    longitude: position.coords.longitude, // 경도
  }

  weatherSearch(positionObj)  
}

const askForLocation = function() {
  navigator.geolocation.getCurrentPosition(accessToGeo, (error) => {    // (위치에 접근 가능시 동작, 위치에 접근 불가능시 동작 콜백함수)
    console.log(error);
  });
}

askForLocation();



// const promiseTest = function() {
//   return new Promise((resolver, reject) => {
//     setTimeout(() => {
//       resolver("success!!!");
//       // reject("error!!!");
//     }, 2000);
//   });
// }

// promiseTest().then((res) => {
//   console.log(res);
// });
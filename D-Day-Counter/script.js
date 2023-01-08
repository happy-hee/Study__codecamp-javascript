const messageContainer = document.querySelector("#d-day-message");
const container = document.querySelector("#d-day-container");
// 로컬스토리지에서 저장했던 데이터 가져오기
const savedDate = localStorage.getItem("saved-date");

const intervalIdArr = [];

container.style.display = "none";
messageContainer.innerHTML = "<h3>D-Day를 입력해 주세요.</h3>";

// 목표 날짜를 만드는 함수
const dateForMaker = function () {
  // input에 입력한 값을 가져옴
  const inputYear = document.querySelector("#target-year-input").value;
  const inputMonth = document.querySelector("#target-month-input").value;
  const inputDate = document.querySelector("#target-date-input").value;

  const dateFormat = `${inputYear}-${inputMonth}-${inputDate}`;
  return dateFormat;
};

// 카운터 만드는 함수
const counterMaker = function (data) {
  // 데이터와 로컬스토리지에 저장되어있는 데이터가 같지 않은 경우만 실행
  if (data !== savedDate) {
    // 로컬 스토리지에 저장
    // 개발자도구 -> 어플리케이션 -> 로컬 스토리지에서 확인 가능
    localStorage.setItem("saved-date", data);
  }
  // 현재 날짜/시간을 가져옴
  const nowDate = new Date();
  // 원하는 날짜 데이터를 가져옴 (시간은 오전 9시를 기준으로 함)
  // .setHours(0, 0, 0, 0) : 자정을 기준으로 하게 해줌
  const targetDate = new Date(data).setHours(0, 0, 0, 0);
  // 남은 시간 전체를 초로 변환하여 가져옴
  const remaining = (targetDate - nowDate) / 1000;

  // 만약, remaining(남은 시간)이 0이라면, 타이머가 종료되었습니다. 출력
  if (remaining <= 0) {
    container.style.display = "none";
    messageContainer.innerHTML = "<h3>타이머가 종료되었습니다.</h3>";
    messageContainer.style.display = "flex";
    setClearInterval();
    //함수를 종료시킴
    return;
  } else if (isNaN(remaining)) {
    container.style.display = "none";
    // 만약, 잘못된 날짜가 들어왔다면, 유효한 시간대가 아닙니다. 출력
    messageContainer.innerHTML = "<h3>유효한 시간대가 아닙니다.</h3>";
    messageContainer.style.display = "flex";
    //타이머 초기화
    setClearInterval();
    //함수를 종료시킴
    return;
  }

  // 남은 날짜
  const remainingObj = {
    remainingDate: Math.floor(remaining / 3600 / 24), // 남은 일을 가져옴 (Math.flooer = 소수점 내림)
    remainingHours: Math.floor(remaining / 3600) % 24, // 남은 시간을 가져옴
    remainingMin: Math.floor(remaining / 60) % 60, // 남은 분을 가져옴
    remainingSec: Math.floor(remaining) % 60, // 남은 초를 가져옴
  };

  const timeKeys = Object.keys(remainingObj); //['remainingDate', 'remainingHours' ...]

  // 남은 시간의 단위가 10 미만일 시 앞에 0 붙여주기
  const format = function (time) {
    if (time < 10) {
      return "0" + time;
    } else {
      return time;
    }
  };

  const documentArr = ["days", "hours", "min", "sec"];

  let i = 0;
  // html 태그에 일,월,분,초  표시
  for (let tag of documentArr) {
    const remainingTime = format(remainingObj[timeKeys[i]]);
    // html 에서 tag("days", "hours", "min", "sec")가 id인 곳에 남은 날짜 표시
    document.getElementById(tag).textContent = remainingTime;
    i++;
  }
};

// 카운트다운 시작
const starter = function (targetDateInput) {
  if (!targetDateInput) {
    // 목표 날짜를 가져옴
    targetDateInput = dateForMaker();
  }
  container.style.display = "flex";
  messageContainer.style.display = "none";
  // 타이머 초기화
  setClearInterval();

  // setInterval이 1초 뒤에 실행되기때문에 일단 한번 함수 실행
  counterMaker(targetDateInput);

  //1초씩 증감하는 setInterval (반환값: setInterval의 고유한 id값)
  const intervalId = setInterval(() => {
    // 카운트다운 시작 함수 실행
    counterMaker(targetDateInput);
  }, 1000);
  // intervalIdArr 에 intervalId push
  intervalIdArr.push(intervalId);
};

// setInterval 초기화
const setClearInterval = function () {
  //로컬 스토리지에 있던 데이터 삭제
  localStorage.removeItem("saved-date");

  for (let i = 0; i < intervalIdArr.length; i++) {
    // clearInterval(): 1초마다 증가하던 setInterval을 취소
    clearInterval(intervalIdArr[i]);
  }
};

// 타이머 초기화
const resetTimer = function () {
  container.style.display = "none";
  messageContainer.innerHTML = "<h3>D-Day를 입력해 주세요.</h3>";
  messageContainer.style.display = "flex";
  setClearInterval();
};

// saveDate 가 있는지 여부(truthy)
if (savedDate) {
  starter(savedDate);
} else {
  container.style.display = "none";
  messageContainer.innerHTML = "<h3>D-Day를 입력해 주세요.</h3>";
}

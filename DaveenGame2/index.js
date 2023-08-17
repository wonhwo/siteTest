// ============ 변수 모음zip ============ //
// 캔버스 위에 그래픽을 렌더링하기 위해서
// 캔버스 엘리먼트에 대한 참조를 [ canvas ] 변수에 저장함
// 그림을 그리는 실질적 도구인 2D rendering ctx를 [ ctx ]변수에 저장함
const canvas = document.getElementById('Canvas');
const ctx = canvas.getContext('2d');

// 공의 시작위치 지정 ( 화면 중앙 + 하단부터 30px 윗칸)
let x = canvas.width / 2;
let y = canvas.height - 60;

// 공의 반지름
const ballRadius = 10;

// 공의 좌표를 계속 변하게 하기 위해서 프레임마다 x와 y에 추가될 값
let movingX = 2;
let MovingY = -2;

// 라켓 높이, 길이, 시작위치
// let 사용이유 = 아이템 등 여러 요인으로 라켓의 넓이,높이가 변경될 수 있기 때문에
let racketHeight = 10;
let racketWidth = 75;
let racketX = (canvas.width - racketWidth) / 2; // canvas의 길이에서 라켓길이를 빼고 그것의 반절의 위치
let racketY = canvas.height - 40;

// 좌, 우 키보드 입력변수
let rightKey = false;
let leftKey = false;

// 벽돌의 행과 열
const blockRow = 7;
const blockColumn = 6;
// 벽돌의 넓이와 높이
const blockWidth = 75;
const blockHeight = 20;
// 벽돌 추워서 패딩입음
const blockPadding = 10;
const blockOffsetLeft = 30;
const blockOffsetTop = 30;

// 벽돌 배열을 초기화함 status: 1  <<== 1이면 그림, 0이면 안그림(삭제)
const blocks = [];
for (let i = 0; i < blockColumn; i++) {
  blocks[i] = [];
  for (let z = 0; z < blockRow; z++) {
    blocks[i][z] = { x: 0, y: 0, status: 1 };
  }
}

// 헤더의 스코어 <p>태그
const $score = document.getElementById('score');
$score.textContent = 0;

// ============ 주인"공"을 캔버스 위에 그리는 파트 ============ //
// 주인"공"을 그리는 함수
function drawBall() {
  ctx.beginPath(); // 그리기 시작
  ctx.arc(x, y, ballRadius, 0, 10); // x: 50, y: 50, 반지름: 10, 시작각도, 끝 각도
  ctx.fillStyle = 'yellow';
  ctx.fill();
  ctx.closePath(); // 그리기 끝

  
  // 이미지 로드
  const backgroundImage = new Image();
  backgroundImage.src = './image/발리볼.png'; // 이미지 파일 경로

  backgroundImage.onload = function () {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(backgroundImage, x - ballRadius, y - ballRadius, ballRadius * 2, ballRadius * 2);
    ctx.restore();
  };
} // drawBall() 함수 끝

// 라켓을 그리는 함수
function drawRacket() {
  ctx.beginPath();
  ctx.shadowBlur = 10; // 그림자의 흐림 정도
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // 그림자 색상
  ctx.shadowOffsetX = 5; // 그림자의 X축 오프셋
  ctx.shadowOffsetY = 5; // 그림자의 Y축 오프셋
  ctx.rect(racketX, racketY, racketWidth, racketHeight);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';
}

// for (let i = 0; i < blockColumn; i++) {
//   blocks[i] = [];

//   for (let z = 0; z < blockRow; z++) {
//       blocks[i][z] = { x: 0, y: 0 };
//   }
// }

// 파괴할 오브젝트(블록)을 그리는 함수
function makeBlock() {
  for (let i = 0; i < blockColumn; i++) {
    for (let z = 0; z < blockRow; z++) {
      if (blocks[i][z].status === 1) {
        let blockX = i * (blockWidth + blockPadding) + blockOffsetLeft;
        let blockY = z * (blockHeight + blockPadding) + blockOffsetTop;
        blocks[i][z].x = blockX;
        blocks[i][z].y = blockY;

        ctx.beginPath();
        ctx.rect(blockX, blockY, blockWidth, blockHeight);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function blockDelete() {
  for (let i = 0; i < blockColumn; i++) {
    for (let z = 0; z < blockRow; z++) {
      const target = blocks[i][z];
      if (target.status === 1) {
        if (
          x > target.x &&
          x < target.x + blockWidth &&
          y + ballRadius > target.y &&
          y < target.y + blockHeight
        ) {
          MovingY = -MovingY;
          target.status = 0;
          $score.textContent = +$score.textContent + 100;
        }
      }
    }
  }
}

// 게임을 리셋하는 함수
function resetGame() {
  x = canvas.width / 2;
  y = canvas.height - 60;
  movingX = 2;
  MovingY = -2;

  racketX = (canvas.width - racketWidth) / 2; // canvas의 길이에서 라켓길이를 빼고 그것의 반절의 위치
  racketY = canvas.height - 40;

  for (let i = 0; i < blockColumn; i++) {
    for (let z = 0; z < blockRow; z++) {
      blocks[i][z].status = 1;
    }
  }

  $score.textContent = 0;
}

// 그리기 함수 (10밀리초마다 호출됨 = 무한작동)
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 공을 그리기 전에 기존에 공을 지운다
  makeBlock(); // 블록 그리기 함수
  drawBall(); // 주인"공" 그리기 함수 호출
  drawRacket(); // 라켓 그리기 함수 호출
  blockDelete();

  // ============ 주인"공"을 벽에 튕기게 하는 파트 ============ //
  // 만약에 현재의 높이에서 + MovingY( -2 )를 했을때 0보다 작아지는경우(벽을넘어감)
  // plusY를 양수로 바꿔서 반대로 움직이게해서 벽에 튕기는것처럼 보이게 한다
  // (화면 위를 넘어갈때)
  if (y + MovingY < ballRadius) {
    MovingY = -MovingY;
  }
  // 공이 화면 아래로 향했을때의 코드
  else if (y + MovingY > racketY - ballRadius) {
    if (y + movingX > canvas.height - ballRadius) {
      alert(`Game Over... 스코어: ${$score.textContent}점`);
      // 시작지점으로 돌린다.
      resetGame();
    }
  }

  // (화면 왼쪽을 넘어가거나 화면 오른쪽으로 넘어가거나)
  if (x + movingX > canvas.width - ballRadius || x + movingX < ballRadius) {
    movingX = -movingX;
  }

  // 라켓에 주인"공"이 닿았을 때, 벽에 튀긴것처럼 튕기게 하기
  if (x > racketX && x < racketX + racketWidth && y + ballRadius > racketY) {
    MovingY = -MovingY;
  }

  // 좌우 각 방향키를 누르면 10의 속도(10px)로 움직인다. 라켓이 벽을 넘지않는 선에서
  if (rightKey && racketX < canvas.width - racketWidth) {
    racketX += 10;
  } else if (leftKey && racketX > 0) {
    racketX -= 10;
  }

  x += movingX; // x의 값 +2
  y += MovingY; // y의 값 -2

} // draw() 함수 끝

// 키보드 이벤트리스너
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightKey = true;
  } else if (e.keyCode == 37) {
    leftKey = true;
  }
}
function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightKey = false;
  } else if (e.keyCode == 37) {
    leftKey = false;
  }
}

// =========== 일시정지 버튼과 draw함수 반복호출문 ========== //
let stop = false;
let intervalId;
const $btn = document.querySelector('.header button');

$btn.addEventListener('click', pauseDrawing);

function startDrawing() {
  intervalId = setInterval(draw, 10); // 10밀리초마다 draw 함수 호출
}
function pauseDrawing() {
  if (stop === false) {
    stop = true;
    clearInterval(intervalId); // 타이머 일시정지
    console.log('멈춰!!');
  } else {
    stop = false;
    intervalId = setInterval(draw, 10); // 10밀리초마다 draw 함수 호출
    console.log('시간은 다시 흐른다.');
  }
}
startDrawing();

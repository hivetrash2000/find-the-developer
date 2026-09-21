const NPCS = [
  {
    id:"sujin", name:"수진", team:"기획팀", avatar:"👩🏻‍💼",
    hotspot:{left:"3%",top:"24%",width:"19%",height:"18%"},
    line:"어? 무슨 일이세요?",
    choices:[
      ["뭐 하고 계세요?", "다음 주 서비스 업데이트 기획서 만들고 있어요."],
      ["혹시 개발자세요?", "네?! 아니요! 전 기획자예요. 개발자라면 여기 앉아 있지도 않을걸요?"],
      ["관찰하기", "책상 위에 '개발팀 전달 완료'라고 적힌 기획서가 보입니다."]
    ]
  },
  {
    id:"minho", name:"민호", team:"디자인팀", avatar:"🧑🏻‍🎨",
    hotspot:{left:"27%",top:"31%",width:"20%",height:"18%"},
    line:"지금 시안 수정하고 있어요.",
    choices:[
      ["혹시 개발자세요?", "당연하죠. 저는 픽셀 하나에도 목숨 거는 디자이너입니다."],
      ["관찰하기", "디자인 툴과 태블릿이 보입니다. 색상값 메모도 잔뜩 있습니다."],
      ["색상값은 왜 적어놨어요?", "디자이너도 그 정도는 알아요!"]
    ]
  },
  {
    id:"jiyoung", name:"지영", team:"마케팅팀", avatar:"👩🏻‍💻",
    hotspot:{left:"46%",top:"45%",width:"22%",height:"18%"},
    line:"저 바빠요. 광고 성과 보고 있어요.",
    choices:[
      ["혹시 개발자세요?", "제가요? 전 오늘 광고비만 세 번 확인했는데요."],
      ["개발팀 사람 잘 알아요?", "네. 그런데 요즘 개발팀에 사람이 한 명 없는 것 같던데요."],
      ["누구 말하는 거예요?", "모르겠어요. 그런데 그 사람이 회의에는 계속 들어와요."]
    ]
  },
  {
    id:"taehyun", name:"태현", team:"인사팀", avatar:"🧑🏻‍💼",
    hotspot:{left:"77%",top:"22%",width:"19%",height:"19%"},
    line:"안녕하세요. 인사팀입니다.",
    choices:[
      ["개발팀에는 몇 명 있어요?", "현재 공식적으로는 4명이요."],
      ["지금은 3명밖에 안 보이는데요?", "아... 한 명은 다른 팀에 있을 겁니다."],
      ["관찰하기", "책상 위에 최신 조직도가 놓여 있습니다. 개발팀 옆에 작은 이동 표시가 있습니다."]
    ]
  },
  {
    id:"junseok", name:"준석", team:"영업팀", avatar:"🧑🏻‍💼",
    hotspot:{left:"35%",top:"65%",width:"21%",height:"17%"},
    line:"저 지금 고객 통화해야 해서요.",
    choices:[
      ["혹시 개발자세요?", "아니요. 저는 고객이랑 싸우는 사람입니다."],
      ["개발팀 사람 잘 알아요?", "아, 그 이상한 사람? 제가 오류 하나 물어봤더니 3초 만에 고쳐주던데요."],
      ["누구였어요?", "도윤 씨였던 것 같은데... 개발자인지는 모르겠네요."]
    ]
  },
  {
    id:"yujin", name:"유진", team:"운영팀", avatar:"🧑🏻‍💻",
    hotspot:{left:"6%",top:"57%",width:"23%",height:"17%"},
    line:"저는 운영이에요. 화면이 복잡해 보이죠?",
    choices:[
      ["개발자죠?", "아니요. 운영하면서 보는 화면이에요."],
      ["코딩도 해요?", "가끔요. 운영하려면 어느 정도는 알아야 하니까요."],
      ["개발자는 누구예요?", "저보다 훨씬 조용한 사람. ...도윤 씨요."]
    ]
  },
  {
    id:"doyoon", name:"도윤", team:"기획팀", avatar:"🧑🏻‍💻",
    hotspot:{left:"70%",top:"71%",width:"23%",height:"18%"},
    line:"안녕하세요. 기획팀입니다.",
    choices:[
      ["무슨 기획을 해요?", "서비스 관련된 거요. 이것저것 합니다."],
      ["최근 개발된 기능이 뭐예요?", "로그인 개선이요."],
      ["관찰하기", "기획서 아래에 'FIX LOGIN ERROR'라는 메모가 있습니다."],
      ["그 메모는 뭐예요?", "아... 기획팀에서도 그런 거 가끔 확인해요."]
    ]
  }
];

const clues = new Set();
const suspects = new Set();
let timeLeft = 180;
let timerId = null;
let started = false;
let paused = false;

const $ = (id) => document.getElementById(id);
const npcDialog = $("npcDialog");
const resultDialog = $("resultDialog");

function formatTime(sec) {
  return `${String(Math.floor(sec/60)).padStart(2,"0")}:${String(sec%60).padStart(2,"0")}`;
}

function updateHUD() {
  $("clueCount").textContent = `${clues.size} / 5`;
  $("timer").textContent = formatTime(timeLeft);
}

function addClue(key, text) {
  if (!clues.has(key)) {
    clues.add(key);
    updateHUD();
    $("hintText").textContent = `📌 단서 발견: ${text}`;
    const card = document.querySelector(`[data-id="${key}"]`);
    if (card) card.classList.add("found");
  }
}

function markSuspect(id) {
  suspects.add(id);
  const card = document.querySelector(`[data-person="${id}"]`);
  if (card) card.classList.add("suspect");
}

function renderHotspots() {
  const wrap = $("hotspots");
  NPCS.forEach(npc => {
    const b = document.createElement("button");
    b.className = "hotspot";
    b.style.left = npc.hotspot.left;
    b.style.top = npc.hotspot.top;
    b.style.width = npc.hotspot.width;
    b.style.height = npc.hotspot.height;
    b.dataset.id = npc.id;
    b.innerHTML = `<span class="tag">${npc.name} · ${npc.team}</span>`;
    b.addEventListener("click", () => openNPC(npc));
    wrap.appendChild(b);
  });
}

function renderPeople() {
  const strip = $("peopleStrip");
  NPCS.forEach(npc => {
    const b = document.createElement("button");
    b.className = "person-card";
    b.dataset.person = npc.id;
    b.innerHTML = `<div class="avatar">${npc.avatar}</div><small>${npc.name}</small>`;
    b.addEventListener("click", () => openNPC(npc));
    strip.appendChild(b);
  });
}

function openNPC(npc) {
  if (!started || paused) return;
  $("npcTeam").textContent = npc.team;
  $("npcName").textContent = `${npc.name} · ${npc.team}`;
  $("npcLine").textContent = npc.line;
  const choices = $("dialogChoices");
  choices.innerHTML = "";

  npc.choices.forEach(([question, answer], index) => {
    const b = document.createElement("button");
    b.className = "choice";
    b.textContent = question;
    b.addEventListener("click", () => {
      $("npcLine").textContent = answer;

      // Story clues.
      if (npc.id === "jiyoung" && index === 1) {
        addClue("missing-dev", "개발팀에 한 명이 없는 것처럼 보인다.");
      }
      if (npc.id === "taehyun" && index === 1) {
        addClue("team-transfer", "개발자 한 명이 다른 팀으로 이동한 기록이 있다.");
      }
      if (npc.id === "junseok" && index === 1) {
        addClue("fast-fix", "도윤이 오류를 3초 만에 고쳤다는 증언.");
        markSuspect("doyoon");
      }
      if (npc.id === "yujin" && index === 2) {
        addClue("yujin-testimony", "유진이 도윤을 개발자로 지목했다.");
        markSuspect("doyoon");
      }
      if (npc.id === "doyoon" && index === 1) {
        addClue("private-info", "도윤이 아직 공개되지 않은 개발 정보를 알고 있다.");
        markSuspect("doyoon");
      }
      if (npc.id === "doyoon" && index === 2) {
        addClue("code-note", "도윤의 책상에 개발 관련 메모가 있다.");
        markSuspect("doyoon");
      }
    });
    choices.appendChild(b);
  });

  // Add final accusation button after enough investigation.
  if (clues.size >= 3) {
    const accuse = document.createElement("button");
    accuse.className = "choice";
    accuse.textContent = "🔍 개발자를 지목한다";
    accuse.addEventListener("click", openAccusation);
    choices.appendChild(accuse);
  }

  npcDialog.showModal();
}

function openAccusation() {
  npcDialog.close();
  $("resultContent").innerHTML = `
    <h2>🔍 누가 개발자인가?</h2>
    <p>의심되는 사람을 선택하세요.</p>
    <div class="choices" id="accuseChoices"></div>
  `;
  const box = $("accuseChoices");
  NPCS.forEach(npc => {
    const b = document.createElement("button");
    b.className = "choice";
    b.textContent = `${npc.avatar} ${npc.name} · ${npc.team}`;
    b.onclick = () => resolveAccusation(npc.id);
    box.appendChild(b);
  });
  resultDialog.showModal();
}

function resolveAccusation(id) {
  const correct = id === "doyoon";
  if (correct) {
    resultDialog.close();
    showWin();
  } else {
    $("resultContent").innerHTML = `
      <h2>❌ 아닙니다!</h2>
      <p>${NPCS.find(n => n.id === id).name}은(는) 진짜 ${NPCS.find(n => n.id === id).team}입니다.</p>
      <p>단서를 더 찾아보세요.</p>
      <button class="primary-btn" onclick="resultDialog.close()">계속 조사하기</button>
    `;
  }
}

function showWin() {
  clearInterval(timerId);
  const elapsed = 180 - timeLeft;
  const stars = clues.size >= 5 ? "★★★★★" : clues.size >= 4 ? "★★★★☆" : "★★★☆☆";
  $("resultContent").innerHTML = `
    <div class="intro-icon">🎉</div>
    <h2>개발자를 찾았습니다!</h2>
    <p>정답은 <strong>도윤 · 기획팀</strong>이었습니다.</p>
    <p>사실 그는 개발자였고, 기획팀으로 위장하고 있었습니다.</p>
    <div class="score">
      관찰력 ${stars}<br>
      발견 단서 ${clues.size}/5<br>
      소요 시간 ${formatTime(elapsed)}
    </div>
    <button class="primary-btn" onclick="location.reload()">다시 플레이</button>
  `;
  resultDialog.showModal();
}

function showGameOver() {
  clearInterval(timerId);
  $("resultContent").innerHTML = `
    <h2>⏰ 시간이 끝났습니다!</h2>
    <p>개발자는 아직 정체를 들키지 않았습니다.</p>
    <button class="primary-btn" onclick="location.reload()">다시 도전</button>
  `;
  resultDialog.showModal();
}

function startTimer() {
  clearInterval(timerId);
  timerId = setInterval(() => {
    if (!started || paused) return;
    timeLeft--;
    updateHUD();
    if (timeLeft <= 0) showGameOver();
  }, 1000);
}

$("startBtn").addEventListener("click", () => {
  $("introDialog").close();
  started = true;
  startTimer();
});

$("closeDialog").addEventListener("click", () => npcDialog.close());

$("hintBtn").addEventListener("click", () => {
  const hints = [
    "모든 사람이 말하는 직업과 실제 행동이 일치하는지 비교해보세요.",
    "개발자는 다른 팀 사람처럼 행동하고 있습니다.",
    "오류를 너무 자연스럽게 해결하는 사람이 있는지 살펴보세요.",
    "아직 공개되지 않은 개발 정보를 알고 있는 사람을 찾아보세요.",
    "조용한 사람일수록 주변 물건을 자세히 살펴보세요."
  ];
  $("hintText").textContent = `💡 ${hints[Math.min(clues.size, hints.length - 1)]}`;
});

$("pauseBtn").addEventListener("click", () => {
  paused = !paused;
  $("pauseBtn").textContent = paused ? "▶" : "Ⅱ";
  $("hintText").textContent = paused ? "⏸ 일시정지 중입니다." : "게임을 계속합니다.";
});

$("soundBtn").addEventListener("click", () => {
  $("soundBtn").textContent = $("soundBtn").textContent === "♪" ? "🔇" : "♪";
});

renderHotspots();
renderPeople();
updateHUD();
$("introDialog").showModal();

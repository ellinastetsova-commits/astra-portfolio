/* Petit à petit — общий скрипт: прогресс, тема, навигация.
   Прогресс хранится локально в браузере (localStorage). */
(function () {
  var KEY = "ppp_done_v1";

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch (e) { return {}; }
  }
  function save(obj) {
    try { localStorage.setItem(KEY, JSON.stringify(obj)); } catch (e) {}
  }

  // --- Полный список уроков курса (обновляется по мере добавления) ---
  var ALL_LESSONS = ["urok-01"];

  // === Страница урока: кнопка «пройдено» ===
  var btn = document.querySelector(".btn-done");
  if (btn) {
    var id = btn.getAttribute("data-lesson");
    var done = load();
    function render() {
      var is = !!done[id];
      btn.classList.toggle("is-done", is);
      btn.querySelector(".label").textContent = is ? "Урок пройден" : "Отметить пройденным";
      btn.querySelector(".mark").textContent = is ? "✓" : "○";
    }
    btn.addEventListener("click", function () {
      done = load();
      if (done[id]) { delete done[id]; } else { done[id] = true; }
      save(done);
      render();
    });
    render();
  }

  // === Главная: подсветка статусов и прогресс-бар ===
  var links = document.querySelectorAll(".lesson-link[data-lesson]");
  if (links.length) {
    var done2 = load();
    var doneCount = 0;
    links.forEach(function (a) {
      var lid = a.getAttribute("data-lesson");
      if (done2[lid]) { a.classList.add("done"); doneCount++; }
    });
    var totalReady = links.length; // сколько уроков уже открыто
    var totalPlanned = ALL_LESSONS.length;
    var bar = document.querySelector(".bar > i");
    var cnt = document.querySelector(".progress-top .cnt");
    if (bar) bar.style.width = (totalReady ? (doneCount / totalReady * 100) : 0) + "%";
    if (cnt) cnt.innerHTML = "Пройдено <b>" + doneCount + "</b> из " + totalReady + " уроков";
  }
})();

// ئەمە خشتەکەتە، لێرە ڤیدیۆکانت بگۆڕە (بەبێ دەستکاریکردنی بلۆگەر)
const kurdflixSchedule = [
  { time: "00:00", link: "https://example.com/movie1.mp4" },
  { time: "06:00", link: "https://example.com/movie2.mp4" },
  { time: "12:00", link: "https://example.com/movie3.mp4" },
  { time: "18:00", link: "https://example.com/movie4.mp4" }
];

const video = document.getElementById('kurdflixVideo');

function timeToSeconds(timeStr) {
  let parts = timeStr.split(':');
  return (+parts[0]) * 3600 + (+parts[1]) * 60;
}

function getCurrentProgram() {
  const now = new Date();
  const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  let activeIndex = 0;
  for (let i = 0; i < kurdflixSchedule.length; i++) {
    if (currentSeconds >= timeToSeconds(kurdflixSchedule[i].time)) { activeIndex = i; } else { break; }
  }
  return { prog: kurdflixSchedule[activeIndex], nowSec: currentSeconds };
}

function syncStream() {
  let info = getCurrentProgram();
  
  // ئەگەر ڤیدیۆکە گۆڕا بوو، لینکی نوێی پێدەدات
  if (video.getAttribute('src') !== info.prog.link) {
    video.src = info.prog.link;
    video.load();
  }

  let expectedTime = info.nowSec - timeToSeconds(info.prog.time);
  if (video.duration && expectedTime > video.duration) expectedTime = expectedTime % video.duration;
  
  if (video.duration && Math.abs(video.currentTime - expectedTime) > 5) {
    video.currentTime = expectedTime;
  }
  video.play().catch(()=>{});
}

// هەرکاتێک پەڕەکە کرایەوە ئەمە کاردەکات
video.addEventListener('loadedmetadata', syncStream);
video.addEventListener('ended', syncStream);
setInterval(syncStream, 10000); // هەر 10 چرکە جارێک چێک دەکات کە کاتی ڤیدیۆی نوێ هاتووە یان نا

// Parse chapter number from URL
const urlParams = new URLSearchParams(window.location.search);
const chapterNum = urlParams.get('ch');

// Display an error or fetch and display chapter verses
if (!chapterNum) {
  document.getElementById('chapter-title').textContent = "Chapter not found";
  document.getElementById('verse-list').innerHTML = '<p>Please select a chapter from <a href="/">index</a>.</p>';
} else {
  fetch(`/data/ch${chapterNum}.json`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Chapter not found");
      }
      return response.json();
    })
    .then(data => {
      document.getElementById('chapter-title').textContent = data.title;

      const verseList = document.getElementById('verse-list');
      data.verses.forEach((verse, index) => {
        const verseItem = document.createElement('div');
        verseItem.className = 'verse-item';
        verseItem.textContent = verse;
        verseItem.onclick = () => copyVerse(verse, chapterNum, index + 1);
        verseList.appendChild(verseItem);
      });
    })
    .catch(error => {
      document.getElementById('chapter-title').textContent = "Chapter not found";
      document.getElementById('verse-list').innerHTML = '<p>The requested chapter does not exist. Please select a chapter from <a href="/">index</a>.</p>';
    });
}

// Copy verse text with prefix and show custom toast
function copyVerse(verse, chapterNum, verseIndex) {
  const formattedVerse = `~ Chanakya Niti ${chapterNum}:${verseIndex}\n${verse}`;
  navigator.clipboard.writeText(formattedVerse).then(() => {
    showToast("Verse copied!");
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'show';
  setTimeout(() => {
    toast.className = toast.className.replace('show', '');
  }, 2000);
}
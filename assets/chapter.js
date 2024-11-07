// Parse chapter number from URL
const urlParams = new URLSearchParams(window.location.search);
const chapterNum = urlParams.get('ch') || '1';

// Fetch and display chapter verses
fetch(`/data/ch${chapterNum}.json`)
  .then(response => response.json())
  .then(data => {
    document.getElementById('chapter-title').textContent = data.title;

    const verseList = document.getElementById('verse-list');
    data.verses.forEach((verse, index) => {
      const verseItem = document.createElement('div');
      verseItem.className = 'verse-item';
      verseItem.textContent = verse;
      verseItem.onclick = () => copyVerse(verse);
      verseList.appendChild(verseItem);
    });
  });

// Copy verse text and show custom toast
function copyVerse(verse) {
  navigator.clipboard.writeText(verse).then(() => {
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
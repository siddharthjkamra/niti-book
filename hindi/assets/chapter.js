// Parse chapter number from URL
const urlParams = new URLSearchParams(window.location.search);
const chapterNum = urlParams.get('ch');

// If no chapter number is found, show "Chapter not found" immediately
if (!chapterNum) {
  document.title = "Chapter not found";
  document.getElementById('chapter-title').textContent = "Chapter not found";
  document.getElementById('verse-list').innerHTML = '<p>Please select a chapter from <a href="/">index</a>.</p>';
} else {
  // Show the loading indicator when fetching data
  document.getElementById('loading-indicator').classList.add('show');

  // Fetch chapter data
  fetch(`/hindi/data/ch${chapterNum}.json`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Chapter not found");
      }
      return response.json();
    })
    .then(data => {
      // Successfully fetched data, update title and content
      document.title = `Chapter ${chapterNum} - Chanakya Niti`; // Set the page title dynamically
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
      // If chapter is not found or there's an error fetching data
      document.title = "Chapter not found";
      document.getElementById('chapter-title').textContent = "Chapter not found";
      document.getElementById('verse-list').innerHTML = '<p>The requested chapter does not exist. Please select a chapter from <a href="/">index</a>.</p>';
    })
    .finally(() => {
      // Hide loading indicator once the data is processed (either successfully or with an error)
      document.getElementById('loading-indicator').classList.remove('show');
    });
}

// Copy verse text with prefix and show custom toast
function copyVerse(verse, chapterNum, verseIndex) {
  const formattedVerse = `~ चाणक्य नीति ${chapterNum}:${verseIndex}\n${verse}`;
  navigator.clipboard.writeText(formattedVerse).then(() => {
    showToast("श्लोक कॉपी किया गया!");
  });
}

// Show Toast message
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'show';
  setTimeout(() => {
    toast.className = toast.className.replace('show', '');
  }, 2000);
}
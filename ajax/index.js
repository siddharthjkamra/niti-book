// Elements
const chapterListSection = document.getElementById('chapter-list-section');
const chapterContentSection = document.getElementById('chapter-content-section');
const chapterList = document.getElementById('chapter-list');
const chapterTitle = document.getElementById('chapter-title');
const verseList = document.getElementById('verse-list');

// Load chapters and display in chapter list section
fetch('/data/list-chapters.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(chapter => {
      const chapterItem = document.createElement('div');
      chapterItem.className = 'chapter-item';
      chapterItem.textContent = chapter.title;
      chapterItem.onclick = () => loadChapter(chapter.chapter);
      chapterList.appendChild(chapterItem);
    });
  })
  .catch(error => console.error('Error loading chapters:', error));

// Load a chapter without page refresh
function loadChapter(chapterNum) {
  // Update URL and add to history
  history.pushState({ chapter: chapterNum }, '', `/ajax/?ch=${chapterNum}`);

  // Fetch and display chapter content
  fetch(`/data/ch${chapterNum}.json`)
    .then(response => response.json())
    .then(data => {
      chapterTitle.textContent = data.title;
      verseList.innerHTML = ''; // Clear previous verses

      data.verses.forEach((verse, index) => {
        const verseItem = document.createElement('div');
        verseItem.className = 'verse-item';
        verseItem.textContent = verse;
        verseItem.onclick = () => copyVerse(verse, chapterNum, index + 1);
        verseList.appendChild(verseItem);
      });

      // Show chapter content section and hide chapter list
      chapterContentSection.style.display = 'block';
      chapterListSection.style.display = 'none';

      // Reset scroll position to the top of the chapter content section
      chapterContentSection.scrollTop = 0;
    })
    .catch(error => console.error('Error loading chapter:', error));
}

// Copy verse to clipboard with fixed prefix and dynamic chapter/verse info
function copyVerse(verse, chapterNum, verseIndex) {
  const formattedText = `~ Chanakya Niti ${chapterNum}:${verseIndex}\n${verse}`;
  navigator.clipboard.writeText(formattedText).then(() => showToast("Verse copied!"));
}

// Show a custom toast message
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'show';
  setTimeout(() => toast.className = toast.className.replace('show', ''), 2000);
}

// Go back to chapter list without adding to history
function goBack() {
  // Replace the current history entry to show the chapter list view
  history.replaceState({}, '', '/ajax');  // This ensures the URL is "/ajax"
  showChapterList();
}

// Display the chapter list without affecting the scroll
function showChapterList() {
  chapterListSection.style.display = 'block';
  chapterContentSection.style.display = 'none';

  // Reset the scroll position to ensure chapter list is scrolled to the top when switching back
  window.scrollTo(0, 0);
}

// Handle browser back and forward navigation
window.onpopstate = (event) => {
  if (event.state && event.state.chapter) {
    // If a chapter is in the history state, load it
    loadChapter(event.state.chapter);
  } else {
    // Otherwise, go back to the chapter list
    showChapterList();
  }
};

// Initialize the page state when the page is loaded
window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const chapterNum = urlParams.get('ch');
  if (chapterNum) {
    loadChapter(chapterNum); // Load chapter based on URL parameter
  } else {
    showChapterList(); // Show chapter list if no chapter is in the URL
  }
};
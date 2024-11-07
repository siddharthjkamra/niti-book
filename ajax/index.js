// Elements
const chapterListSection = document.getElementById('chapter-list-section');
const chapterContentSection = document.getElementById('chapter-content-section');
const chapterList = document.getElementById('chapter-list');
const chapterTitle = document.getElementById('chapter-title');
const verseList = document.getElementById('verse-list');
const toast = document.getElementById('toast');

// Cache chapters to avoid repeated fetches
let cachedChapters = {};
let cachedVerses = {};

// Load chapters and display
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
  .catch(console.error);

// Load chapter content from cache or fetch if not available
function loadChapter(chapterNum) {
  // Update URL and add to history
  history.pushState({ chapter: chapterNum }, '', `/ajax/?ch=${chapterNum}`);

  // If chapter is cached, use it, otherwise fetch
  if (cachedVerses[chapterNum]) {
    displayChapter(cachedVerses[chapterNum]);
  } else {
    fetch(`/data/ch${chapterNum}.json`)
      .then(response => response.json())
      .then(({ title, verses }) => {
        cachedVerses[chapterNum] = { title, verses }; // Cache the chapter content
        displayChapter({ title, verses });
      })
      .catch(console.error);
  }
}

// Display the chapter content
function displayChapter({ title, verses }) {
  chapterTitle.textContent = title;
  verseList.innerHTML = ''; // Clear previous verses

  // Batch DOM update by creating all verse items first
  const fragment = document.createDocumentFragment();
  verses.forEach((verse, index) => {
    const verseItem = document.createElement('div');
    verseItem.className = 'verse-item';
    verseItem.textContent = verse;
    verseItem.onclick = () => copyVerse(verse, title, index + 1);
    fragment.appendChild(verseItem);
  });
  verseList.appendChild(fragment);

  // Show chapter content and hide chapter list
  chapterContentSection.style.display = 'block';
  chapterListSection.style.display = 'none';
  chapterContentSection.scrollTop = 0;
}

// Copy verse to clipboard with a fixed prefix and dynamic chapter/verse info
function copyVerse(verse, chapterTitle, verseIndex) {
  navigator.clipboard.writeText(`~ ${chapterTitle} ${verseIndex}\n${verse}`).then(() => showToast("Verse copied!"));
}

// Show custom toast message
function showToast(message) {
  toast.textContent = message;
  toast.className = 'show';
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// Go back to chapter list without adding to history
function goBack() {
  history.replaceState({}, '', '/ajax/');
  showChapterList();
}

// Display the chapter list
function showChapterList() {
  chapterListSection.style.display = 'block';
  chapterContentSection.style.display = 'none';
  window.scrollTo(0, 0);
}

// Handle browser back/forward navigation
window.onpopstate = event => event.state?.chapter ? loadChapter(event.state.chapter) : (history.replaceState({}, '', '/ajax/'), showChapterList());

// Check URL query string
window.onload = () => {
  const chapterNum = new URLSearchParams(window.location.search).get('ch');
  chapterNum ? loadChapter(chapterNum) : showChapterList();
};
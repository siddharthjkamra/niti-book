  fetch('/data/list-chapters.json')
    .then(response => response.json())
    .then(data => {
      const chapterList = document.getElementById('chapter-list');
      data.forEach(chapter => {
        const chapterItem = document.createElement('div');
        chapterItem.className = 'chapter-item';
        chapterItem.textContent = chapter.title;
        chapterItem.onclick = () => {
          // Navigate to chapter.html with the correct chapter number in the URL
          location.href = `chapter.html?ch=${chapter.chapter}`;
        };
        chapterList.appendChild(chapterItem);
      });
    })
    .catch(error => console.error('Error loading chapters:', error));
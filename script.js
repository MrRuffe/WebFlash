const newsContainer = document.querySelector('.news-scroll');

if (newsContainer) {
  newsContainer.addEventListener('click', (event) => {
    const card = event.target.closest('.card');
    if (!card) {
      return;
    }

    card.classList.add('is-read');
    newsContainer.appendChild(card);
    newsContainer.scrollTo({
      top: newsContainer.scrollTop,
      behavior: 'smooth',
    });
  });
}

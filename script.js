const newsContainer = document.querySelector('.news-scroll');
const feedTrack = document.querySelector('[data-feed-track]');

const feedSources = [
  {
    label: '@arstechnica',
    url: 'https://r.jina.ai/http://feeds.arstechnica.com/arstechnica/index/',
  },
  {
    label: '@techcrunch',
    url: 'https://r.jina.ai/http://techcrunch.com/feed/',
  },
  {
    label: '@linustech',
    url: 'https://r.jina.ai/http://www.youtube.com/feeds/videos.xml?channel_id=UCXuqSBlHAE6Xw-yeJA0Tunw',
  },
];

const buildMarqueeItem = ({ label, title, link }) => {
  const item = document.createElement('a');
  item.className = 'marquee-item';
  item.href = link;
  item.target = '_blank';
  item.rel = 'noreferrer';

  const source = document.createElement('span');
  source.className = 'source';
  source.textContent = label;

  const text = document.createElement('p');
  text.textContent = title;

  item.append(source, text);
  return item;
};

const parseFeed = (label, xmlText) => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, 'text/xml');
  const items = Array.from(xml.querySelectorAll('item, entry'));

  return items.slice(0, 6).map((item) => {
    const title = item.querySelector('title')?.textContent?.trim();
    const linkNode = item.querySelector('link');
    const link = linkNode?.getAttribute('href') || linkNode?.textContent || '#';
    return {
      label,
      title: title || 'Latest update',
      link,
    };
  });
};

const loadFeed = async () => {
  if (!feedTrack) {
    return;
  }

  try {
    const responses = await Promise.all(
      feedSources.map(async (source) => {
        const response = await fetch(source.url);
        const text = await response.text();
        return parseFeed(source.label, text);
      }),
    );

    const entries = responses.flat().filter((entry) => entry.link && entry.title);
    if (!entries.length) {
      return;
    }

    feedTrack.innerHTML = '';
    const items = entries.map(buildMarqueeItem);
    const doubled = [...items, ...items.map((item) => item.cloneNode(true))];
    doubled.forEach((item, index) => {
      if (index >= items.length) {
        item.setAttribute('aria-hidden', 'true');
      }
      feedTrack.appendChild(item);
    });
  } catch (error) {
    console.warn('Unable to load live feed', error);
  }
};

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

loadFeed();

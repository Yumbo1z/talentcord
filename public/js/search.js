// Enhanced User Search Functionality
let allUsers = [];
let allListingCards = [];

function initializeSearch() {
  const searchInput = document.querySelector('.navbar .search-bar input');
  if (!searchInput) return;

  searchInput.id = 'user-search-input';

  const searchBar = searchInput.parentElement;
  searchBar.style.position = 'relative';
  
  const clearBtn = document.createElement('button');
  clearBtn.innerHTML = '&times;';
  clearBtn.id = 'search-clear-btn';
  clearBtn.style.cssText = `
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #99aab5;
    font-size: 24px;
    cursor: pointer;
    display: none;
    padding: 0;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 3px;
    transition: all 0.2s;
  `;
  clearBtn.onmouseover = () => clearBtn.style.backgroundColor = '#40444b';
  clearBtn.onmouseout = () => clearBtn.style.backgroundColor = 'transparent';
  searchBar.appendChild(clearBtn);


  allListingCards = Array.from(document.querySelectorAll('.listing-card'));
  
  let debounceTimer;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    
    clearBtn.style.display = query ? 'block' : 'none';
    
h
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      performSearch(query);
    }, 300);
  });

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.style.display = 'none';
    performSearch('');
    searchInput.focus();
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      clearBtn.style.display = 'none';
      performSearch('');
    }
  });
}

function performSearch(query) {
  const listingsContainer = document.getElementById('listings');
  if (!listingsContainer) return;

  const allCards = Array.from(listingsContainer.querySelectorAll('.listing-card'));
  
  if (!query) {
    allCards.forEach(card => {
      card.style.display = '';
      removeHighlights(card);
    });
    removeNoResultsMessage();
    return;
  }

  const lowerQuery = query.toLowerCase();
  let visibleCount = 0;

  allCards.forEach(card => {
    const username = card.getAttribute('data-user')?.toLowerCase() || '';
    const bio = card.querySelector('.listing-info p')?.textContent.toLowerCase() || '';
    const tags = Array.from(card.querySelectorAll('.tag'))
      .map(tag => tag.textContent.toLowerCase())
      .join(' ');
    
    const matches = username.includes(lowerQuery) || 
                   bio.includes(lowerQuery) || 
                   tags.includes(lowerQuery);
    
    if (matches) {
      card.style.display = '';
      highlightMatches(card, query);
      visibleCount++;
    } else {
      card.style.display = 'none';
      removeHighlights(card);
    }
  });

  if (visibleCount === 0) {
    showNoResultsMessage(listingsContainer, query);
  } else {
    removeNoResultsMessage();
  }
}

function highlightMatches(card, query) {
  if (!query) return;
  
  const username = card.querySelector('.listing-info h3');
  const bio = card.querySelector('.listing-info p');
  
  if (username && !username.querySelector('a')) {
    const text = username.textContent;
    const highlighted = highlightText(text, query);
    if (highlighted !== text) {
      username.innerHTML = highlighted;
    }
  }
  
  if (bio && !bio.hasAttribute('data-original')) {
    const text = bio.textContent;
    bio.setAttribute('data-original', text);
    const highlighted = highlightText(text, query);
    if (highlighted !== text) {
      bio.innerHTML = highlighted;
    }
  }
}

function removeHighlights(card) {
  const bio = card.querySelector('.listing-info p');
  if (bio && bio.hasAttribute('data-original')) {
    bio.textContent = bio.getAttribute('data-original');
    bio.removeAttribute('data-original');
  }
  
  const username = card.querySelector('.listing-info h3');
  if (username && !username.querySelector('a')) {
    const text = username.textContent;
    if (text) {
      username.textContent = text.replace(/<mark>|<\/mark>/g, '');
    }
  }
}

function highlightText(text, query) {
  if (!query || !text) return text;
  
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return text.replace(regex, '<mark style="background-color: #ffc107; color: #000; padding: 2px 4px; border-radius: 2px;">$1</mark>');
}


function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function showNoResultsMessage(container, query) {
  removeNoResultsMessage();
  
  const message = document.createElement('div');
  message.id = 'no-results-message';
  message.style.cssText = `
    text-align: center;
    padding: 60px 20px;
    background-color: #36393f;
    border-radius: 8px;
    margin: 20px auto;
    max-width: 500px;
    grid-column: 1 / -1;
  `;
  message.innerHTML = `
    <i class="fas fa-search" style="font-size: 3rem; color: #99aab5; margin-bottom: 15px;"></i>
    <h3 style="color: #99aab5; margin-bottom: 10px; font-weight: 500;">No results found</h3>
    <p style="color: #72767d;">No users match "${escapeHtml(query)}"</p>
    <p style="color: #72767d; margin-top: 10px; font-size: 0.9rem;">Try searching by username, bio, or tags</p>
  `;
  
  container.appendChild(message);
}

function removeNoResultsMessage() {
  const existing = document.getElementById('no-results-message');
  if (existing) {
    existing.remove();
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSearch);
} else {
  initializeSearch();
}

window.addEventListener('load', () => {
  setTimeout(initializeSearch, 500);
});

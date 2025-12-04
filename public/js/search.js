
const TalentcordSearch = (function() {
  let isInitialized = false;
  let searchInput = null;
  let clearBtn = null;
  let debounceTimer = null;

  function initializeSearch() {
   
    if (isInitialized) {
      return;
    }

    searchInput = document.querySelector('.navbar .search-bar input');
    if (!searchInput) {
      console.warn('Search input not found');
      return;
    }

    const searchBar = searchInput.parentElement;
    if (!searchBar) {
      console.warn('Search bar container not found');
      return;
    }

   
    const existingClearBtn = document.getElementById('search-clear-btn');
    if (existingClearBtn) {
      existingClearBtn.remove();
    }

    
    searchInput.id = 'user-search-input';

    searchBar.style.position = 'relative';
    
    // Create clear button
    clearBtn = document.createElement('button');
    clearBtn.innerHTML = '&times;';
    clearBtn.id = 'search-clear-btn';
    clearBtn.setAttribute('aria-label', 'Clear search');
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
      z-index: 10;
    `;
    
    clearBtn.addEventListener('mouseover', function() {
      this.style.backgroundColor = '#40444b';
    });
    
    clearBtn.addEventListener('mouseout', function() {
      this.style.backgroundColor = 'transparent';
    });
    
    searchBar.appendChild(clearBtn);

    attachEventListeners();
    
    isInitialized = true;
    console.log('Search functionality initialized');
  }

  function attachEventListeners() {
    if (!searchInput || !clearBtn) return;

    searchInput.addEventListener('input', handleSearchInput);

    clearBtn.addEventListener('click', handleClearClick);

    searchInput.addEventListener('keydown', handleKeyDown);
  }

  function handleSearchInput(e) {
    const query = e.target.value.trim();
    
    if (clearBtn) {
      clearBtn.style.display = query ? 'block' : 'none';
    }
    
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      performSearch(query);
    }, 300);
  }

  function handleClearClick() {
    if (!searchInput) return;
    
    searchInput.value = '';
    if (clearBtn) {
      clearBtn.style.display = 'none';
    }
    performSearch('');
    searchInput.focus();
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      if (!searchInput) return;
      
      searchInput.value = '';
      if (clearBtn) {
        clearBtn.style.display = 'none';
      }
      performSearch('');
    }
  }

  function performSearch(query) {
    const listingsContainer = document.getElementById('listings');
    if (!listingsContainer) {
      console.warn('Listings container not found');
      return;
    }

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
      const bioElement = card.querySelector('.listing-info p');
      const bio = bioElement?.textContent.toLowerCase() || '';
      const tagElements = card.querySelectorAll('.tag');
      const tags = Array.from(tagElements)
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
    
    if (username) {
      const usernameLink = username.querySelector('a');
      
      if (usernameLink) {
        const text = usernameLink.textContent;
        if (!usernameLink.hasAttribute('data-original')) {
          usernameLink.setAttribute('data-original', text);
          const highlighted = highlightText(text, query);
          if (highlighted !== text) {
            usernameLink.innerHTML = highlighted;
          }
        }
      } else {
        const text = username.textContent;
        if (!username.hasAttribute('data-original')) {
          username.setAttribute('data-original', text);
          const highlighted = highlightText(text, query);
          if (highlighted !== text) {
            username.innerHTML = highlighted;
          }
        }
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
    if (username) {
      const usernameLink = username.querySelector('a');
      
      if (usernameLink && usernameLink.hasAttribute('data-original')) {
        usernameLink.textContent = usernameLink.getAttribute('data-original');
        usernameLink.removeAttribute('data-original');
      } else if (username.hasAttribute('data-original')) {
        username.textContent = username.getAttribute('data-original');
        username.removeAttribute('data-original');
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
      <i class="fas fa-search" style="font-size: 3rem; color: #99aab5; margin-bottom: 15px; display: block;"></i>
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

  return {
    init: initializeSearch,
    search: performSearch,
    clear: handleClearClick
  };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', TalentcordSearch.init);
} else {
  TalentcordSearch.init();
}

window.addEventListener('load', () => {
  setTimeout(() => {
    const searchInput = document.querySelector('.navbar .search-bar input');
    if (searchInput && !searchInput.id) {
      TalentcordSearch.init();
    }
  }, 500);
});

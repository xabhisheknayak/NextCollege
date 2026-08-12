/* ============================================================
   CAMPUS CONNECT — SOCIAL ENGINE  (js/social.js)
   Shared across Student / Professor / Admin dashboards
   ============================================================ */

/* ── Utilities ── */
function getSocialPosts() {
  const stored = localStorage.getItem('cc_socialPosts');
  if (stored) return JSON.parse(stored);
  // Seed demo data
  const demo = [
    {
      id: 'sp-001',
      authorId: 'prof-001',
      authorName: 'Dr. Sharma',
      authorRole: 'Faculty',
      authorAvatar: 'DS',
      mediaUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
      mediaType: 'image',
      caption: '🎓 Congratulations to all the students who presented their projects today! The level of innovation was truly inspiring. Keep it up!',
      upvotes: 42,
      downvotes: 2,
      userVote: null,
      comments: [
        { id: 'c1', authorId: 'stu-001', name: 'Sanjana Kumari', avatar: 'SK', text: 'Thank you professor! It was a great experience.', time: '2h ago' },
        { id: 'c2', authorId: 'stu-002', name: 'Lakshya Raj', avatar: 'LR', text: 'Loved the session! 🙌', time: '1h ago' }
      ],
      shares: 8,
      timestamp: '3h ago',
      timeMs: Date.now() - 3 * 3600000
    },
    {
      id: 'sp-002',
      authorId: 'stu-001',
      authorName: 'Sanjana Kumari',
      authorRole: 'Student',
      authorAvatar: 'SK',
      mediaUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=800&q=80',
      mediaType: 'image',
      caption: '📚 Pulling an all-nighter for the data structures exam tomorrow. Anyone else in the same boat? Drop a 🙋 if you are!',
      upvotes: 28,
      downvotes: 1,
      userVote: null,
      comments: [
        { id: 'c3', authorId: 'stu-003', name: 'Harsh Raj', avatar: 'HR', text: '🙋 Me! Let\'s go study group?', time: '30m ago' }
      ],
      shares: 3,
      timestamp: '5h ago',
      timeMs: Date.now() - 5 * 3600000
    },
    {
      id: 'sp-003',
      authorId: 'stu-002',
      authorName: 'Lakshya Raj',
      authorRole: 'Student',
      authorAvatar: 'LR',
      mediaUrl: null,
      mediaType: 'text',
      caption: '🌸 Beautiful campus morning vibes! The garden near Block C is absolutely gorgeous right now. Perfect spot to read before class.',
      upvotes: 55,
      downvotes: 0,
      userVote: null,
      comments: [],
      shares: 12,
      timestamp: '1d ago',
      timeMs: Date.now() - 24 * 3600000
    },
    {
      id: 'sp-004',
      authorId: 'stu-003',
      authorName: 'Harsh Raj',
      authorRole: 'Student',
      authorAvatar: 'HR',
      mediaUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      mediaType: 'image',
      caption: '💻 Just finished building my first full-stack web app! React + Node + MongoDB. Big thanks to everyone who helped debug at 2am 😄',
      upvotes: 93,
      downvotes: 3,
      userVote: null,
      comments: [
        { id: 'c4', authorId: 'prof-001', name: 'Dr. Sharma', avatar: 'DS', text: 'Impressive work! Would love to see a demo in class.', time: '4h ago' },
        { id: 'c5', authorId: 'stu-001', name: 'Sanjana Kumari', avatar: 'SK', text: 'Bro you are crazy talented!! 🔥', time: '3h ago' }
      ],
      shares: 21,
      timestamp: '2d ago',
      timeMs: Date.now() - 48 * 3600000
    },
    {
      id: 'sp-005',
      authorId: 'stu-10',
      authorName: 'Akanksha Roy',
      authorRole: 'Student',
      authorAvatar: 'AR',
      mediaUrl: null,
      mediaType: 'text',
      caption: 'Anyone want to group up for the new physics assignment? 📚',
      upvotes: 12,
      downvotes: 0,
      userVote: null,
      comments: [],
      shares: 1,
      timestamp: '1d ago',
      timeMs: Date.now() - 25 * 3600000
    },
    {
      id: 'sp-006',
      authorId: 'stu-04',
      authorName: 'Vivek Kumar',
      authorRole: 'Student',
      authorAvatar: 'VK',
      mediaUrl: null,
      mediaType: 'text',
      caption: 'Just won the local chess tournament! ♟️🏆',
      upvotes: 45,
      downvotes: 0,
      userVote: null,
      comments: [],
      shares: 5,
      timestamp: '3d ago',
      timeMs: Date.now() - 72 * 3600000
    }
  ];
  localStorage.setItem('cc_socialPosts', JSON.stringify(demo));
  return demo;
}

function saveSocialPosts(posts) {
  localStorage.setItem('cc_socialPosts', JSON.stringify(posts));
}

function getFollowing() {
  const stored = localStorage.getItem('cc_following');
  return stored ? JSON.parse(stored) : [];
}

function saveFollowing(arr) {
  localStorage.setItem('cc_following', JSON.stringify(arr));
}

function getDMs() {
  const stored = localStorage.getItem('cc_dms');
  return stored ? JSON.parse(stored) : {};
}

function saveDMs(dms) {
  localStorage.setItem('cc_dms', JSON.stringify(dms));
}

function getCurrentSocialRole() {
  const path = window.location.pathname;
  if (path.includes('admin')) return 'admin';
  if (path.includes('professor')) return 'professor';
  return 'student';
}

/* ── Media Upload Preview ── */
let _pendingMediaFiles = []; // Array of { dataUrl, type }

function initPostComposer(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const user = (typeof getSession === 'function') ? getSession('currentUser') : null;
  const initials = user ? getInitials(user.name) : '?';

  container.innerHTML = `
    <div class="post-composer">
      <div class="post-composer-top">
        <div class="avatar avatar-sm" style="background:var(--grad-primary);flex-shrink:0">${initials}</div>
        <textarea
          id="social-caption-input"
          class="post-composer-textarea"
          placeholder="Share something with the campus..."
          rows="3"
        ></textarea>
      </div>
      <div id="media-preview-strip" class="media-preview-strip"></div>
      <div class="post-composer-actions">
        <label class="media-btn" for="social-img-input" title="Upload Photo">
          📷 Photo
          <input type="file" id="social-img-input" accept="image/*" style="display:none" onchange="handleMediaUpload(event,'image')">
        </label>
        <label class="media-btn" for="social-vid-input" title="Upload Video">
          🎬 Video
          <input type="file" id="social-vid-input" accept="video/*" style="display:none" onchange="handleMediaUpload(event,'video')">
        </label>
        <button class="btn btn-primary post-btn" onclick="submitSocialPost()">Share Post</button>
      </div>
    </div>
  `;
}

function handleMediaUpload(event, type) {
  const file = event.target.files[0];
  if (!file) return;
  const maxMB = type === 'image' ? 10 : 50;
  if (file.size > maxMB * 1024 * 1024) {
    if (typeof showToast === 'function') showToast(`File too large. Max ${maxMB}MB allowed.`, 'error');
    return;
  }
  const reader = new FileReader();
  reader.onload = function (e) {
    _pendingMediaFiles.push({ dataUrl: e.target.result, type });
    renderMediaPreviews();
  };
  reader.readAsDataURL(file);
  event.target.value = '';
}

function renderMediaPreviews() {
  const strip = document.getElementById('media-preview-strip');
  if (!strip) return;
  strip.innerHTML = _pendingMediaFiles.map((m, i) => `
    <div class="media-preview-item">
      ${m.type === 'image'
      ? `<img src="${m.dataUrl}" alt="preview">`
      : `<video src="${m.dataUrl}" muted></video>`
    }
      <button class="media-preview-remove" onclick="removeMediaPreview(${i})">✕</button>
    </div>
  `).join('');
}

function removeMediaPreview(index) {
  _pendingMediaFiles.splice(index, 1);
  renderMediaPreviews();
}

function submitSocialPost() {
  const captionInput = document.getElementById('social-caption-input');
  const caption = captionInput ? captionInput.value.trim() : '';

  if (!caption && _pendingMediaFiles.length === 0) {
    if (typeof showToast === 'function') showToast('Write a caption or add a photo/video!', 'warning');
    return;
  }

  const user = (typeof getSession === 'function') ? getSession('currentUser') : null;
  const role = getCurrentSocialRole();
  const roleLabel = role === 'student' ? 'Student' : (role === 'professor' ? 'Faculty' : 'Admin');

  const firstMedia = _pendingMediaFiles.length > 0 ? _pendingMediaFiles[0] : null;

  const newPost = {
    id: 'sp-' + Date.now(),
    authorId: user ? (user.id || user.regNo || user.name) : 'anon',
    authorName: user ? user.name : 'Campus User',
    authorRole: roleLabel,
    authorAvatar: user ? getInitials(user.name) : '?',
    mediaUrl: firstMedia ? firstMedia.dataUrl : null,
    mediaType: firstMedia ? firstMedia.type : 'text',
    caption,
    upvotes: 0,
    downvotes: 0,
    userVote: null,
    comments: [],
    shares: 0,
    timestamp: 'Just now',
    timeMs: Date.now()
  };

  const posts = getSocialPosts();
  posts.unshift(newPost);
  saveSocialPosts(posts);

  // Reset
  if (captionInput) captionInput.value = '';
  _pendingMediaFiles = [];
  renderMediaPreviews();

  if (typeof showToast === 'function') showToast('Post shared! 🎉', 'success');
  renderSocialFeed('social-feed-container', role);
  renderHomeFeedPreview('home-feed-preview', role);
}

/* ── Full Social Feed ── */
function renderSocialFeed(containerId, role) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const posts = getSocialPosts();
  const following = getFollowing();

  if (posts.length === 0) {
    container.innerHTML = `
      <div class="social-empty">
        <div class="empty-icon">📸</div>
        <h4>No posts yet</h4>
        <p>Be the first to share something with the campus!</p>
      </div>`;
    return;
  }

  container.innerHTML = posts.map(post => buildPostCard(post, role, following)).join('');
}

function buildPostCard(post, role, following) {
  const isFollowing = following.includes(post.authorId);
  const isAdmin = role === 'admin';
  const isMine = (() => {
    const user = (typeof getSession === 'function') ? getSession('currentUser') : null;
    if (!user) return false;
    return post.authorId === (user.id || user.regNo || user.name);
  })();

  const roleClass = post.authorRole === 'Faculty' ? 'role-badge-faculty' : (post.authorRole === 'Admin' ? 'role-badge-admin' : 'role-badge-student');

  const mediaHtml = (() => {
    if (post.mediaUrl && post.mediaType === 'image') {
      return `<div class="post-media"><img src="${post.mediaUrl}" alt="post image" loading="lazy"></div>`;
    }
    if (post.mediaUrl && post.mediaType === 'video') {
      return `<div class="post-media"><video src="${post.mediaUrl}" controls preload="metadata"></video></div>`;
    }
    if (!post.mediaUrl) {
      // Text-only: colorful gradient background with caption preview
      return `<div class="post-media-placeholder">💬</div>`;
    }
    return '';
  })();

  const commentsHtml = post.comments.map(c => `
    <div class="comment-item">
      <div class="comment-avatar">${c.avatar || c.name[0]}</div>
      <div class="comment-bubble">
        <span class="comment-name">${escapeHtml(c.name)}</span>
        <span class="comment-text"> ${escapeHtml(c.text)}</span>
      </div>
    </div>
  `).join('');

  const netVotes = post.upvotes - post.downvotes;

  return `
    <div class="social-post-card" id="post-${post.id}">
      <div class="post-header">
        <div class="post-author">
          <div class="avatar avatar-sm" style="background:var(--grad-primary);flex-shrink:0">${escapeHtml(post.authorAvatar)}</div>
          <div class="post-author-info">
            <div class="post-author-name">${escapeHtml(post.authorName)}</div>
            <div class="post-author-meta">
              <span class="${roleClass}">${escapeHtml(post.authorRole)}</span>
              <span>·</span>
              <span>${post.timestamp}</span>
            </div>
          </div>
        </div>
        ${isAdmin
      ? `<button class="post-delete-btn" onclick="deleteSocialPost('${post.id}')">🗑️ Delete</button>`
      : (isMine ? `
          <div class="flex gap-2">
            <button class="btn btn-sm btn-secondary" onclick="editSocialPost('${post.id}')" style="padding:4px 10px;font-size:11px;">✏️ Edit</button>
            <button class="post-delete-btn" onclick="deleteSocialPost('${post.id}')">🗑️</button>
          </div>`
        : `<button class="follow-btn ${isFollowing ? 'following' : ''}" id="follow-btn-${post.id}" onclick="toggleFollow('${post.authorId}', '${post.id}')">
                ${isFollowing ? '✓ Following' : '+ Follow'}
               </button>`)
    }
      </div>

      ${mediaHtml}

      <div class="post-actions">
        <div class="vote-group">
          <button class="vote-btn ${post.userVote === 'up' ? 'upvoted' : ''}" onclick="votePost('${post.id}', 'up')" title="Upvote">
            <span class="vote-icon">▲</span> ${post.upvotes}
          </button>
          <div class="vote-divider"></div>
          <button class="vote-btn ${post.userVote === 'down' ? 'downvoted' : ''}" onclick="votePost('${post.id}', 'down')" title="Downvote">
            <span class="vote-icon">▼</span> ${post.downvotes}
          </button>
        </div>
        <button class="action-btn" onclick="toggleComments('${post.id}')" title="Comments">
          💬 ${post.comments.length}
        </button>
        <button class="action-btn" onclick="sharePost('${post.id}')" title="Share">
          🔗 ${post.shares}
        </button>
        ${!isMine && !isAdmin ? `
          <button class="action-btn action-btn-spacer" onclick="openDMFromPost('${post.authorId}', '${escapeHtml(post.authorName)}')" title="Message">
            ✉️
          </button>
        ` : '<span class="action-btn-spacer"></span>'}
      </div>

      <div class="post-body">
        <div class="post-caption"><strong>${escapeHtml(post.authorName)}</strong> ${escapeHtml(post.caption)}</div>

        ${post.comments.length > 0 ? `
          <div class="post-comments-toggle" onclick="toggleComments('${post.id}')">
            View all ${post.comments.length} comment${post.comments.length !== 1 ? 's' : ''}
          </div>
        ` : ''}
        <div class="post-comments-section" id="comments-${post.id}" style="display:none">
          ${commentsHtml}
        </div>
      </div>

      <div class="post-comment-input-row">
        <div class="avatar avatar-sm" style="background:var(--grad-primary);width:28px;height:28px;font-size:var(--fs-xs);flex-shrink:0">
          ${(typeof getSession === 'function' && getSession('currentUser')) ? getInitials(getSession('currentUser').name) : '?'}
        </div>
        <input type="text"
          id="comment-input-${post.id}"
          class="post-comment-input"
          placeholder="Add a comment..."
          onkeydown="if(event.key==='Enter') addComment('${post.id}')">
        <button class="post-comment-submit" onclick="addComment('${post.id}')">Post</button>
      </div>
    </div>
  `;
}

function toggleComments(postId) {
  const section = document.getElementById(`comments-${postId}`);
  if (!section) return;
  const isHidden = section.style.display === 'none';
  section.style.display = isHidden ? 'block' : 'none';
}

/* ── Vote ── */
function votePost(postId, direction) {
  const posts = getSocialPosts();
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  if (post.userVote === direction) {
    // Remove vote
    if (direction === 'up') post.upvotes = Math.max(0, post.upvotes - 1);
    else post.downvotes = Math.max(0, post.downvotes - 1);
    post.userVote = null;
  } else {
    // Undo previous vote
    if (post.userVote === 'up') post.upvotes = Math.max(0, post.upvotes - 1);
    if (post.userVote === 'down') post.downvotes = Math.max(0, post.downvotes - 1);
    // Apply new vote
    if (direction === 'up') post.upvotes++;
    else post.downvotes++;
    post.userVote = direction;
  }

  saveSocialPosts(posts);
  const role = getCurrentSocialRole();
  renderSocialFeed('social-feed-container', role);
  renderHomeFeedPreview('home-feed-preview', role);
}

/* ── Comment ── */
function addComment(postId) {
  const input = document.getElementById(`comment-input-${postId}`);
  if (!input || !input.value.trim()) return;

  const user = (typeof getSession === 'function') ? getSession('currentUser') : null;
  const posts = getSocialPosts();
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  post.comments.push({
    id: 'c-' + Date.now(),
    authorId: user ? (user.id || user.regNo || user.name) : 'anon',
    name: user ? user.name : 'You',
    avatar: user ? getInitials(user.name) : '?',
    text: input.value.trim(),
    time: 'Just now'
  });

  saveSocialPosts(posts);
  const role = getCurrentSocialRole();
  renderSocialFeed('social-feed-container', role);
  renderHomeFeedPreview('home-feed-preview', role);

  // Re-open comments after re-render
  setTimeout(() => {
    const section = document.getElementById(`comments-${postId}`);
    if (section) section.style.display = 'block';
    const newInput = document.getElementById(`comment-input-${postId}`);
    if (newInput) newInput.focus();
  }, 50);
}

/* ── Share ── */
function sharePost(postId) {
  const posts = getSocialPosts();
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  post.shares = (post.shares || 0) + 1;
  saveSocialPosts(posts);

  // Copy to clipboard
  const shareText = `Campus Connect Post by ${post.authorName}: "${post.caption.slice(0, 100)}..."`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(shareText).catch(() => { });
  }
  if (typeof showToast === 'function') showToast('Post link copied to clipboard! 🔗', 'success');

  const role = getCurrentSocialRole();
  renderSocialFeed('social-feed-container', role);
  renderHomeFeedPreview('home-feed-preview', role);
}

/* ── Follow ── */
function toggleFollow(userId, postId) {
  const following = getFollowing();
  const idx = following.indexOf(userId);
  let nowFollowing;
  if (idx > -1) {
    following.splice(idx, 1);
    nowFollowing = false;
  } else {
    following.push(userId);
    nowFollowing = true;
  }
  saveFollowing(following);

  const btn = document.getElementById(`follow-btn-${postId}`);
  if (btn) {
    btn.textContent = nowFollowing ? '✓ Following' : '+ Follow';
    btn.classList.toggle('following', nowFollowing);
  }

  if (typeof showToast === 'function') {
    const posts = getSocialPosts();
    const post = posts.find(p => p.id === postId);
    const name = post ? post.authorName : 'user';
    showToast(nowFollowing ? `Now following ${name}! 👋` : `Unfollowed ${name}`, nowFollowing ? 'success' : 'info');
  }
}

/* ── Delete ── */
function deleteSocialPost(postId) {
  if (!confirm('Delete this post permanently?')) return;
  const posts = getSocialPosts().filter(p => p.id !== postId);
  saveSocialPosts(posts);
  if (typeof showToast === 'function') showToast('Post deleted.', 'warning');
  const role = getCurrentSocialRole();
  renderSocialFeed('social-feed-container', role);
  renderHomeFeedPreview('home-feed-preview', role);
}

/* ── Edit ── */
function editSocialPost(postId) {
  const posts = getSocialPosts();
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  const newCaption = prompt('Edit your post:', post.caption);
  if (newCaption === null) return; // cancelled
  if (!newCaption.trim()) {
    if (typeof showToast === 'function') showToast('Caption cannot be empty.', 'warning');
    return;
  }
  post.caption = newCaption.trim();
  post.timestamp = 'Edited · Just now';
  saveSocialPosts(posts);
  if (typeof showToast === 'function') showToast('Post updated! ✏️', 'success');
  const role = getCurrentSocialRole();
  renderSocialFeed('social-feed-container', role);
  renderHomeFeedPreview('home-feed-preview', role);
}

/* ── Home Feed Preview ── */
function renderHomeFeedPreview(containerId, role) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const posts = getSocialPosts();

  if (posts.length === 0) {
    container.innerHTML = `
      <div class="home-feed-empty">
        <div class="emoji">📱</div>
        <p>No campus posts yet. Be the first!</p>
      </div>`;
    return;
  }

  const latest = posts.slice(0, 6);

  const thumbsHtml = latest.map(p => {
    let mediaHtml;
    if (p.mediaUrl && p.mediaType === 'image') {
      mediaHtml = `<img class="feed-thumb-media" src="${p.mediaUrl}" alt="post" loading="lazy">`;
    } else if (p.mediaUrl && p.mediaType === 'video') {
      mediaHtml = `<div class="feed-thumb-video-wrap">🎬</div>`;
    } else {
      const snippet = p.caption.length > 50 ? p.caption.slice(0, 50) + '…' : p.caption;
      mediaHtml = `<div class="feed-thumb-text-wrap">"${escapeHtml(snippet)}"</div>`;
    }

    return `
      <div class="feed-thumb-item" onclick="goToSocial()" title="${escapeHtml(p.authorName)}">
        ${mediaHtml}
        <div class="feed-thumb-info">
          <div class="feed-thumb-author">${escapeHtml(p.authorName)}</div>
          <div class="feed-thumb-votes">
            <span>▲ ${p.upvotes}</span>
            <span>💬 ${p.comments.length}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `<div class="home-feed-scroll">${thumbsHtml}</div>`;
}

function goToSocial() {
  if (typeof switchSection === 'function') {
    switchSection('social');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const socialNav = document.querySelector('.nav-item[data-section="social"]');
    if (socialNav) socialNav.classList.add('active');
  }
}

/* ── Private DMs ── */
let _dmOpen = false;
let _activeDMUserId = null;
let _activeDMUserName = '';

function initDMSystem() {
  // Create DM panel if not exists
  if (!document.getElementById('dm-panel')) {
    const panel = document.createElement('div');
    panel.id = 'dm-panel';
    panel.className = 'dm-panel hidden';
    document.body.appendChild(panel);
  }

  // Create FAB if not exists
  if (!document.getElementById('dm-fab')) {
    const fab = document.createElement('button');
    fab.id = 'dm-fab';
    fab.className = 'dm-fab';
    fab.title = 'Messages';
    fab.setAttribute('aria-label', 'Open Messages');
    fab.innerHTML = '✉️';
    fab.onclick = toggleDMPanel;
    document.body.appendChild(fab);
  }

  renderDMPanel();
}

function toggleDMPanel() {
  _dmOpen = !_dmOpen;
  _activeDMUserId = null;
  _activeDMUserName = '';
  const panel = document.getElementById('dm-panel');
  if (panel) panel.classList.toggle('hidden', !_dmOpen);
  if (_dmOpen) renderDMPanel();
}

function renderDMPanel() {
  const panel = document.getElementById('dm-panel');
  if (!panel) return;

  if (_activeDMUserId) {
    renderDMThread(panel);
    return;
  }

  const dms = getDMs();
  const convos = Object.entries(dms);

  panel.innerHTML = `
    <div class="dm-panel-header">
      <h5>💌 Messages</h5>
      <button class="dm-panel-close" onclick="toggleDMPanel()">✕</button>
    </div>
    <div class="dm-convo-list">
      ${convos.length === 0
      ? `<div class="dm-empty-state">No messages yet.<br>Follow someone and tap ✉️ to start!</div>`
      : convos.map(([userId, thread]) => {
        const last = thread.messages[thread.messages.length - 1];
        const unread = thread.unread || 0;
        return `
              <div class="dm-convo-item" onclick="openDM('${userId}', '${escapeHtml(thread.name)}')">
                <div class="avatar avatar-sm" style="background:var(--grad-primary);font-size:var(--fs-xs)">${getInitials(thread.name)}</div>
                <div class="dm-convo-info">
                  <div class="dm-convo-name">${escapeHtml(thread.name)}</div>
                  <div class="dm-convo-preview">${last ? escapeHtml(last.text) : 'No messages yet'}</div>
                </div>
                ${unread > 0 ? `<div class="dm-convo-unread">${unread}</div>` : ''}
              </div>
            `;
      }).join('')
    }
    </div>
  `;
}

function renderDMThread(panel) {
  const dms = getDMs();
  const thread = dms[_activeDMUserId] || { name: _activeDMUserName, messages: [], unread: 0 };
  const user = (typeof getSession === 'function') ? getSession('currentUser') : null;
  const myId = user ? (user.id || user.regNo || user.name) : 'me';

  const messagesHtml = thread.messages.map(msg => {
    const isMine = msg.senderId === myId;
    return `
      <div class="dm-msg ${isMine ? 'mine' : 'theirs'}">
        <div class="dm-bubble">${escapeHtml(msg.text)}</div>
        <div class="dm-msg-time">${msg.time}</div>
      </div>
    `;
  }).join('');

  panel.innerHTML = `
    <div class="dm-panel-header">
      <button class="dm-panel-back" onclick="backToDMList()" title="Back">◀</button>
      <div class="flex items-center gap-2" style="flex:1">
        <div class="avatar avatar-sm" style="background:var(--grad-primary);font-size:var(--fs-xs);width:28px;height:28px">${getInitials(thread.name)}</div>
        <h5 style="margin:0;font-size:var(--fs-sm)">${escapeHtml(thread.name)}</h5>
      </div>
      <button class="dm-panel-close" onclick="toggleDMPanel()">✕</button>
    </div>
    <div class="dm-thread">
      <div class="dm-messages" id="dm-messages-list">
        ${thread.messages.length === 0
      ? `<div class="dm-empty-state">Start the conversation! 👋</div>`
      : messagesHtml
    }
      </div>
      <div class="dm-input-bar">
        <input type="text" id="dm-input" class="dm-input" placeholder="Message ${escapeHtml(thread.name)}..."
          onkeydown="if(event.key==='Enter') sendDM()">
        <button class="dm-send-btn" onclick="sendDM()">➤</button>
      </div>
    </div>
  `;

  // Scroll to bottom
  setTimeout(() => {
    const msgList = document.getElementById('dm-messages-list');
    if (msgList) msgList.scrollTop = msgList.scrollHeight;
  }, 50);
}

function openDM(userId, userName) {
  _activeDMUserId = userId;
  _activeDMUserName = userName;
  _dmOpen = true;

  const panel = document.getElementById('dm-panel');
  if (!panel) return;
  panel.classList.remove('hidden');

  // Mark as read
  const dms = getDMs();
  if (dms[userId]) { dms[userId].unread = 0; saveDMs(dms); }

  renderDMThread(panel);
}

function openDMFromPost(userId, userName) {
  // Ensure DM panel exists
  if (!document.getElementById('dm-panel')) initDMSystem();
  const dms = getDMs();
  if (!dms[userId]) {
    dms[userId] = { name: userName, messages: [], unread: 0 };
    saveDMs(dms);
  }
  openDM(userId, userName);
}

function backToDMList() {
  _activeDMUserId = null;
  _activeDMUserName = '';
  renderDMPanel();
}

function sendDM() {
  const input = document.getElementById('dm-input');
  if (!input || !input.value.trim()) return;

  const user = (typeof getSession === 'function') ? getSession('currentUser') : null;
  const myId = user ? (user.id || user.regNo || user.name) : 'me';
  const now = new Date();
  const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

  const dms = getDMs();
  if (!dms[_activeDMUserId]) {
    dms[_activeDMUserId] = { name: _activeDMUserName, messages: [], unread: 0 };
  }

  dms[_activeDMUserId].messages.push({
    id: 'msg-' + Date.now(),
    senderId: myId,
    text: input.value.trim(),
    time: timeStr
  });
  saveDMs(dms);
  input.value = '';

  const panel = document.getElementById('dm-panel');
  if (panel) renderDMThread(panel);

  // Simulate reply after 1–3 seconds for demo feel
  if (Math.random() > 0.4) {
    const replies = [
      'Got it! 👍',
      'Thanks for reaching out!',
      'Sure, let\'s connect!',
      'I\'ll get back to you soon.',
      'Sounds good! 😊',
      'Okay! 👌',
      'Great! Let\'s talk.',
      'Will check and reply!'
    ];
    setTimeout(() => {
      const dms2 = getDMs();
      if (!dms2[_activeDMUserId]) return;
      dms2[_activeDMUserId].messages.push({
        id: 'msg-r-' + Date.now(),
        senderId: _activeDMUserId,
        text: replies[Math.floor(Math.random() * replies.length)],
        time: timeStr
      });
      saveDMs(dms2);
      if (_activeDMUserId) {
        const panel2 = document.getElementById('dm-panel');
        if (panel2 && !panel2.classList.contains('hidden')) renderDMThread(panel2);
      }
    }, 1000 + Math.random() * 2000);
  }
}

/* ── Init Social Page ── */
function initSocialPage() {
  const role = getCurrentSocialRole();

  // Init composer
  initPostComposer('social-composer');

  // Render feed
  renderSocialFeed('social-feed-container', role);

  // Render home feed preview
  renderHomeFeedPreview('home-feed-preview', role);

  // Init DM system
  initDMSystem();
}

/* ── Init note ──
   initSocialPage() is called by each dashboard JS (student.js / professor.js / admin.js)
   after the user is authenticated.  Do NOT auto-init here.
*/

/* ── Directory Profile View ── */
function openDirectoryProfile(name, role, regNoOrTitle, emailOrDept) {
  const avatar = document.getElementById('dir-profile-avatar');
  const nameEl = document.getElementById('dir-profile-name');
  const subtitleEl = document.getElementById('dir-profile-subtitle');
  const postsContainer = document.getElementById('dir-profile-posts');

  if (!avatar || !nameEl || !subtitleEl || !postsContainer) return;

  avatar.innerHTML = getInitials(name);
  if (role === 'faculty') {
    avatar.style.background = 'var(--grad-accent)';
  } else {
    avatar.style.background = 'var(--bg-surface-alt)';
  }

  nameEl.textContent = name;
  subtitleEl.textContent = `${regNoOrTitle} • ${emailOrDept}`;

  // Find posts uploaded by this user (approximate by name for demo purposes)
  const allPosts = getSocialPosts();
  const userPosts = allPosts.filter(p => p.authorName === name);

  if (userPosts.length === 0) {
    postsContainer.innerHTML = '<p class="text-tertiary" style="font-size:var(--fs-sm)">No recent posts.</p>';
  } else {
    postsContainer.innerHTML = userPosts.map(post => {
      return `
        <div class="card card-flat" style="padding:var(--sp-3)">
          <p style="margin:0; font-size:var(--fs-sm);">${escapeHtml(post.caption)}</p>
          <div class="flex gap-2" style="margin-top:var(--sp-2); font-size:10px; color:var(--text-tertiary)">
            <span>👍 ${post.upvotes}</span>
            <span>💬 ${post.comments.length}</span>
            <span>${escapeHtml(post.timestamp)}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  openModal('modal-directory-profile');
}

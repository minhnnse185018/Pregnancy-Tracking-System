import React, { useState } from 'react';
import './BlogPage.css';

function CommunityPosts() {
  const [sortBy, setSortBy] = useState('recent');

  const posts = [
    {
      id: 1,
      title: 'Visitors Post Birth',
      author: 'AelinG',
      group: 'October 2024 Birth Club',
      content: 'Hello everyone!! What is everyone doing regarding post birth visitors who want to meet the baby. I am having a bit of anxiety regarding this as with my first baby I had my whole in law family...',
      timeAgo: '2 hours ago',
      comments: 23,
      likes: 0,
      avatar: '/images/avatar1.jpg'
    },
    {
      id: 2,
      title: 'Baby food',
      author: 'Hanngahhh',
      group: 'October 2024 Birth Club',
      content: 'When has your baby started baby food? Or planning on it. Baby\'s doctor said 4-6 months and he said he was fine starting at 4',
      timeAgo: '4 hours ago',
      comments: 15,
      likes: 2,
      avatar: '/images/avatar2.jpg'
    }
  ];

  return (
    <div className="community-container">
      {/* Navigation */}
      <nav className="community-nav">
        <button className="nav-item active">Home</button>
        <button className="nav-item">Bookmarks</button>
        <button className="nav-item">Trending</button>
        <button className="nav-item">My Groups</button>
        <button className="nav-item">Activity</button>
        <button className="nav-item">Discover</button>
      </nav>

      <div className="posts-header">
        <h1 className="posts-title">Posts in my groups</h1>
        <button className="sort-button">
          <i className="sort-icon"></i>
          Sort by
        </button>
      </div>

      {/* Posts */}
      <div className="posts-container">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <div className="post-content">
              <div className="post-user">
                <img src={post.avatar} alt={post.author} className="user-avatar" />
                <div className="post-info">
                  <p className="post-metadata">
                    By <span className="author-name">{post.author}</span> in{' '}
                    <span className="group-name">{post.group}</span>
                  </p>
                  <h2 className="post-title">{post.title}</h2>
                </div>
                <button className="more-options">
                  <i className="more-icon"></i>
                </button>
              </div>
              
              <p className="post-text">{post.content}</p>
              
              <div className="post-stats">
                <span className="post-time">{post.timeAgo}</span>
                <div className="interaction-stats">
                  <div className="stat-item">
                    <i className="comment-icon"></i>
                    <span>{post.comments}</span>
                  </div>
                  <div className="stat-item">
                    <i className="heart-icon"></i>
                    <span>{post.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommunityPosts;
// utils/helpers.js

/**
 * Formats a date string into a relative time phrase in French.
 * e.g., "il y a 2 heures", "il y a 5 min", "il y a 3 jours"
 */
export function formatRelativeTime(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) {
    return "À l'instant";
  } else if (diffMin < 60) {
    return `Il y a ${diffMin} min`;
  } else if (diffHour < 24) {
    return `Il y a ${diffHour} h`;
  } else if (diffDay === 1) {
    return "Hier";
  } else if (diffDay < 7) {
    return `Il y a ${diffDay} jours`;
  } else {
    return past.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: past.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
}

/**
 * Simulates intelligent image compression.
 * Returns metadata showing size reduction, optimizing mobile performance.
 */
export async function simulateImageCompression(imageUri) {
  // Simulate network/CPU latency
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const originalSizeKb = Math.floor(Math.random() * 3000) + 1500; // 1.5MB to 4.5MB
  const compressionRatio = 0.15 + (Math.random() * 0.1); // ~15-25% of original size
  const compressedSizeKb = Math.round(originalSizeKb * compressionRatio);
  
  return {
    success: true,
    uri: imageUri,
    originalSize: `${(originalSizeKb / 1024).toFixed(2)} Mo`,
    compressedSize: `${(compressedSizeKb / 1024).toFixed(2)} Mo`,
    ratio: `${Math.round((1 - compressionRatio) * 100)}% de réduction`,
    savedKb: originalSizeKb - compressedSizeKb
  };
}

/**
 * Intelligent recommendation system based on user interactions and preferences.
 * Recommends posts based on:
 * 1. User's favorite categories derived from their liked posts
 * 2. High engagement posts (likes/views)
 * 3. Freshness (latest first)
 */
export function getRecommendedPosts(posts, likedPostIds = [], currentUserId = null) {
  if (!posts || posts.length === 0) return [];
  
  // 1. Determine favorite categories of the user
  const likedPosts = posts.filter(post => likedPostIds.includes(post.id));
  const categoryScores = {};
  
  likedPosts.forEach(post => {
    categoryScores[post.category] = (categoryScores[post.category] || 0) + 3; // +3 points for likes
  });

  // 2. Score and sort all posts
  const scoredPosts = posts.map(post => {
    let score = 0;
    
    // Boost posts from liked categories
    if (categoryScores[post.category]) {
      score += categoryScores[post.category];
    }
    
    // Engagement boost (likes and views)
    score += (post.likes_count || 0) * 0.5;
    score += (post.views_count || 0) * 0.05;
    
    // Recency boost (newer posts score higher)
    const postAgeDays = (new Date() - new Date(post.created_at)) / (1000 * 60 * 60 * 24);
    if (postAgeDays < 1) score += 5;      // In the last 24h
    else if (postAgeDays < 3) score += 2; // In the last 3 days
    
    // Exclude own posts from recommendations but keep in normal feed
    if (currentUserId && post.user_id === currentUserId) {
      score -= 10;
    }
    
    return { post, score };
  });
  
  // Sort posts by descending score
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .map(item => item.post);
}

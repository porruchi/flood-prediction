// components/shareUtil.js
export const shareContent = async ({ title, text, url }) => {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      console.log('Content shared successfully!');
    } catch (error) {
      console.error('Error sharing content:', error);
    }
  } else {
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  }
};

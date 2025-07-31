export async function postNote({ content }: { content: string }) {
  try {
    const token = localStorage.getItem('jwt_token');

    if (!token) {
      console.error("No JWT token found for post creation.");
      throw new Error("You must be logged in to post.");
    }

    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create post');
    }

    const newPost = await response.json();
    return newPost;
  } catch (error) {
    console.error('Error in postNote:', error);
    throw error;
  }
}
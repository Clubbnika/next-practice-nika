export async function postNote(data: { author: string; content: string }) {
  try {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Failed to create post: ${errorDetails}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error posting note:', error);
    throw error;
  }
}

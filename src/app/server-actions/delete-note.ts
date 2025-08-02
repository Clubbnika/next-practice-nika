type DeleteSuccess = { success: true };
type DeleteError = { error: string };
type DeleteResult = DeleteSuccess | DeleteError;

export async function deleteNote(id: string): Promise<DeleteResult> {
  const token = localStorage.getItem('jwt_token');

  if (!token) {
    console.error("No JWT token found for post deletion.");
    return { error: "You must be logged in to delete a post." };
  }

  const postIdNumber = Number(id);

  if (isNaN(postIdNumber)) {
    console.error("Invalid post ID:", id);
    return { error: "Invalid post ID." };
  }

  try {
    const response = await fetch(`/api/posts/${postIdNumber}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      console.log(`Post with ID ${postIdNumber} successfully deleted.`);
      return { success: true };
    } else {
      let errorMessage = 'Failed to delete post.';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        console.error("Error parsing server error response:", e);
      }

      console.error(`Server error during post deletion: ${errorMessage} (Status: ${response.status})`);
      return { error: errorMessage };
    }

  } catch (error: unknown) {
    console.error('Network or unknown error in deleteNote:', error);
    const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred.';
    return { error: errorMessage };
  }
}

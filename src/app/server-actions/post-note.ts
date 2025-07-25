'use server'

export async function postNote(formData: FormData) {
  const content = formData.get('content')
}
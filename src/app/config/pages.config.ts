export const PAGES = {
  HOME: '/',
  POSTS: '/explore',
  PROFILE_FAKE: '/profile-fake',
  PROFILE: (username: string) => `/user/${username}`,
};

export const PAGES = {
  HOME: '/',
  POSTS: '/explore',
  ACCOUNT: '/account',
  PROFILE: (username: string) => `/user/${username}`,
};

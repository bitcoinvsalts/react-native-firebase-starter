export const SIGNEDIN = 'SIGNEDIN'
export const SIGNEDOUT = 'SIGNEDOUT'
export const SAVEPOSTS = 'SAVEPOSTS'

export function signedIn(name, email, uid) {
  return {
    type: SIGNEDIN,
    payload: {
      name: name,
      email: email,
      uid: uid
    }
  }
}

export function signedOut() {
  return {
    type: SIGNEDOUT,
    payload: {}
  }
}

export function savePosts(posts) {
  return {
    type: SAVEPOSTS,
    payload: posts
  }
}

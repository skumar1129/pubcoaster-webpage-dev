export default async function({ store, redirect }) {
  if (!store.getters.user) {
    redirect('/signin');
  }
  else if (!store.getters.isEmailVerified) {
    redirect('/verifyemail');
  }
  else if (!store.getters.hasDisplayName) {
    redirect('/adduserinfo');
  }
}

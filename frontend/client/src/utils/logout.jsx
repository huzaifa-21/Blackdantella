export default () => {
  localStorage.removeItem("accessToken")
  location.assign("/account/login")
}
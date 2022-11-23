export default function checkSession() {
  let token = sessionStorage.getItem("token");
  if (token) {
    return true;
  } else {
    return false;
  }
}

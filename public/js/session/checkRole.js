export default function checkAdmin() {
  let role = sessionStorage.getItem("role");
  if (role == 1) {
    return true;
  } else {
    return false;
  }
}

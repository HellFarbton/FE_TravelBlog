import { authentication } from "../credentials.js";

$(document).on("click", "#btnSignIn", async function () {
  await authentication();
  window.location.href = "../../page/admin/index.html";
});
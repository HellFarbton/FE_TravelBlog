import { authentication } from "../credentials.js";

$(document).on("click", "#btnSignIn", function () {
  authentication();
});
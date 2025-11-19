import { callApi } from "./apiHelper.js";

var faqApi = "api/v1/faqs"
var jq = jQuery.noConflict();

jq(document).ready(async function() {
    await loadFaqs();
    initFaqAccordion();
});

async function loadFaqs() {
    const response = await callApi({
        url: faqApi,
        method: "GET",
    });
    const result = response.result;
    let content = '';
    
    result.forEach((item, idx) => {
       content += `
            <article class="faq-accordion__item ${idx == 0 ? "faq-accordion__item--active" : ""}">
                <div class="faq-accordion__question">
                  <h2 class="faq-accordion__title">
                    ${item.question}
                  </h2>
                  <span class="faq-accordion__icon"></span>
                </div>
                <div class="faq-accordion__answer">
                  ${item.answer}
                </div>
            </article>
       `
    });

    jq('#faq-accordion').html(content);
}

/**
 * Khởi tạo logic cho accordion trên trang FAQ
 */
function initFaqAccordion() {
  const faqAccordion = document.querySelector("#faq-accordion");
  if (!faqAccordion) return;  // Chỉ chạy nếu đang ở trang FAQ
  const items = faqAccordion.querySelectorAll(".faq-accordion__item");
  items.forEach(item => {
    const question = item.querySelector(".faq-accordion__question");
    question.addEventListener("click", () => {
      const isActive = item.classList.contains("faq-accordion__item--active");
      items.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove("faq-accordion__item--active");
        }
      });
      if (!isActive) {
        item.classList.add("faq-accordion__item--active");
      }
    });
  });
}
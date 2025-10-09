function load(selector, path) {
  const cached = localStorage.getItem(path);
  if (cached) {
    document.querySelector(selector).innerHTML = cached;
  }

  fetch(path)
    .then((res) => res.text())
    .then((html) => {
      if (html !== cached) {
        document.querySelector(selector).innerHTML = html;
        localStorage.setItem(path, html);
      }
    });
}
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

/**
 * Hàm tải template
 *
 * Cách dùng:
 * <div id="parent"></div>
 * <script>
 *  load("#parent", "./path-to-template.html");
 * </script>
 */
function load(selector, path) {
  const cached = localStorage.getItem(path);
  if (cached) {
    $(selector).innerHTML = cached;
  }

  fetch(path)
    .then((res) => res.text())
    .then((html) => {
      if (html !== cached) {
        $(selector).innerHTML = html;
        localStorage.setItem(path, html);
      }
    })
    .finally(() => {
      window.dispatchEvent(new Event("template-loaded"));
    });
}
/**
 * Khởi tạo logic cho accordion trên trang FAQ
 */
function initFaqAccordion() {
  const faqAccordion = document.querySelector("#faq-accordion");
  if (!faqAccordion) return; // Chỉ chạy nếu đang ở trang FAQ

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
// Lắng nghe sự kiện trang được tải để chạy logic accordion
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFaqAccordion);
} else {
  initFaqAccordion();
}
// Resposive Header
/**
 * JS toggle
 *
 * Cách dùng:
 * <button class="js-toggle" toggle-target="#box">Click</button>
 * <div id="box">Content show/hide</div>
 */
window.addEventListener("template-loaded", initJsToggle);

function initJsToggle() {
    $$(".js-toggle").forEach((button) => {
        const target = button.getAttribute("toggle-target");
        if (!target) {
            document.body.innerText = `Cần thêm toggle-target cho: ${button.outerHTML}`;
        }
        button.onclick = () => {
            if (!$(target)) {
                return (document.body.innerText = `Không tìm thấy phần tử "${target}"`);
            }
            const isHidden = $(target).classList.contains("hide");

            requestAnimationFrame(() => {
                $(target).classList.toggle("hide", !isHidden);
                $(target).classList.toggle("show", isHidden);
            });
        };
    });
}






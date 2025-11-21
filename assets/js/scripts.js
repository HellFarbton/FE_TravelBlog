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

  items.forEach((item) => {
    const question = item.querySelector(".faq-accordion__question");
    const icon = item.querySelector(".faq-accordion__icon");

    // Click vào câu hỏi hoặc icon đều được
    [question, icon].forEach((element) => {
      if (!element) return;
      element.addEventListener("click", (e) => {
        e.stopPropagation();

        // Toggle class mở/đóng riêng cho từng item
        item.classList.toggle("faq-accordion__item--active");
      });
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

function initFileDrop() {
  const dropArea = document.getElementById("file-drop-area");
  const fileInput = document.getElementById("file-upload");
  const filePreview = document.getElementById("file-preview");

  if (!dropArea || !fileInput) return;

  // Khi click vào khu vực => mở chọn file
  dropArea.addEventListener("click", () => fileInput.click());

  // Khi chọn file bằng cửa sổ dialog
  fileInput.addEventListener("change", (e) => {
    const files = e.target.files;
    if (files.length > 0) handleFiles(files);
  });

  // Ngăn hành vi mặc định khi kéo/thả
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  });
  // Khi thả file vào
  dropArea.addEventListener("drop", (e) => {
    const files = e.dataTransfer.files;
    handleFiles(files);
  });

  // Hàm xử lý file
  function handleFiles(files) {
    if (files.length === 0) return;
    if (files.length === 1) {
      const file = files[0];
      const fileName = file.name;
      const fileSize = (file.size / 1024).toFixed(2) + " KB";
      dropArea.innerHTML = `
        <span class="suggestion-form__file-name">${fileName} (${fileSize})</span>
      `;
    } else {
      dropArea.innerHTML = `
        <span class="suggestion-form__file-name">${files.length} files selected</span>
      `;
    }
  }

  // (Tùy chọn) Gửi file lên server
  function uploadFilesToServer(files) {
    const formData = new FormData();
    [...files].forEach((file) => formData.append("uploaded_files[]", file));

    fetch("/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Upload thành công:", data);
        alert("Tải file lên thành công!");
      })
      .catch((err) => {
        console.error("Lỗi khi upload:", err);
        alert("Có lỗi khi tải file.");
      });
  }
}
// Gọi hàm khi DOM load
document.addEventListener("DOMContentLoaded", initFileDrop);

// Testimonial xử lý slider
document.addEventListener("DOMContentLoaded", function () {
  const slider = document.getElementById("testimonial-slider");
  if (slider) {
    // Chỉ chạy nếu tìm thấy slider
    const track = slider.querySelector(".testimonials__track");
    const slides = Array.from(track.children);
    const dotsContainer = document.getElementById("testimonial-dots");
    // 1. Tạo các dấu chấm
    slides.forEach((slide, index) => {
      const dot = document.createElement("button");
      dot.classList.add("testimonials__dot");
      if (index === 0) {
        dot.classList.add("testimonials__dot--active");
      }

      dot.addEventListener("click", () => {
        goToSlide(index);
      });
      dotsContainer.appendChild(dot);
    });
    const dots = Array.from(dotsContainer.children);
    // 2. Hàm di chuyển slide
    function goToSlide(index) {
      // Di chuyển track
      track.style.transform = "translateX(-" + index * 100 + "%)";

      // Cập nhật active dot
      dots.forEach((dot) => dot.classList.remove("testimonials__dot--active"));
      dots[index].classList.add("testimonials__dot--active");
    }
  }
});

function parseJwt(token) {
  if (!token) return null;
  return JSON.parse(atob(token.split(".")[1]));
}

document.addEventListener("DOMContentLoaded", function () {
  const auth = document.querySelector(".auth");
  const userBox = document.querySelector(".auth__user");
  const avatar = document.querySelector(".auth__avatar");
  const logoutBtn = document.querySelector(".auth__logout");

  const token = localStorage.getItem("token");

  if (token) {
    auth.classList.add("auth--logged-in");
  }

  const payload = parseJwt(localStorage.getItem("token"));

  if (payload) {
    document.querySelector(".auth__name").innerText = payload.fullName;
  }

  if (avatar) {
    avatar.addEventListener("click", () => {
      userBox.classList.toggle("auth__user--show-menu");
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");

      window.location.reload();
    });
  }
});

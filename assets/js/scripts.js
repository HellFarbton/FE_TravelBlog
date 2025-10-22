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


// --- Xử lý Drag & Drop và Upload file ---
document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.getElementById('file-drop-area');
    const fileInput = document.getElementById('file-upload');
    const filePreview = document.getElementById('file-preview');

    // --- Xử lý khi click vào drop area ---
    dropArea.addEventListener('click', () => {
        fileInput.click(); // Giả lập hành vi click vào input file
    });

    // --- Xử lý khi file được chọn qua cửa sổ dialog ---
    fileInput.addEventListener('change', (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            handleFiles(files);
        }
    });
    // --- Xử lý sự kiện Drag & Drop ---
    // Ngăn chặn hành vi mặc định của trình duyệt
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    // Xử lý khi thả file
    dropArea.addEventListener('drop', (event) => {
        const dt = event.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }, false);
    //  // --- Hàm xử lý chung cho các file đã chọn/thả ---
    function handleFiles(files) {
        const dropArea = document.getElementById('file-drop-area'); // Lấy chính button drop area

        if (!dropArea) {
            console.error('Không tìm thấy phần tử .file-drop-area');
            return;
        }
        // Nếu không có file nào thì không làm gì
        if (files.length === 0) {
            return;
        }
        // Nếu có 1 file, hiển thị tên và kích thước
        if (files.length === 1) {
            const file = files[0];
            const fileName = file.name;
            const fileSize = (file.size / 1024).toFixed(2) + ' KB';
            
            // Cập nhật nội dung HTML bên trong button
            dropArea.innerHTML = `
                <span class="file-name-display">
                    ${fileName} (${fileSize})
                </span>
            `;
        } 
        // Nếu có nhiều file, hiển thị số lượng
        else {
            dropArea.innerHTML = `
                <span class="file-name-display">
                    ${files.length} files selected
                </span>
            `;
        }
    // --- Hàm gửi file lên server ---
    function uploadFilesToServer(files) {
        const formData = new FormData();
        // Bạn có thể đính kèm nhiều file
        [...files].forEach(file => {
            formData.append('uploaded_files[]', file); // 'uploaded_files[]' là tên mà backend sẽ nhận
        });

        // Sử dụng fetch API để gửi dữ liệu
        fetch('/api/upload', { // Đây là URL của API trên server của bạn
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log('Upload thành công:', data);
            alert('Tải file lên thành công!');
        })
        .catch(error => {
            console.error('Lỗi khi upload:', error);
            alert('Có lỗi xảy ra khi tải file.');
        });
    }
  }
});



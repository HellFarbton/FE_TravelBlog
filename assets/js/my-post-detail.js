import { callApi } from "./apiHelper.js";

let jq = jQuery.noConflict();

const token = localStorage.getItem("token");

jq(document).ready(() => {
  if (!token) {
    window.location.href = "sign-in.html";
    return;
  }
});

const postStatus = {
  0: "All",
  1: "In Review",
  2: "Approved",
  3: "Cancelled/Rejected",
};

const statusClassMap = {
  2: "post-detail__status post-detail__status--publish",
  1: "post-detail__status post-detail__status--in-review",
  3: "post-detail__status post-detail__status--cancelled",
};

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

if (!postId) {
  alert("Post ID is missing in URL!");
}

// Load Data
async function loadPostDetail() {
  try {
    const response = await callApi({
      url: "api/v1/blog-request/my/" + postId,
      method: "GET",
      token: token,
    });

    const data = await response.result;
    renderPostDetail(data);
  } catch (error) {
    console.error(error);
    alert("Error loading post detail");
  }
}

// Render UI
function renderPostDetail(post) {
  jq("#post-title").text(post.title);
  jq("#post-thumbnail").attr("src", post.thumbnail.fullPathUrl).show();
  jq("#post-destination").text(post.destination.name);
  jq("#post-category").text(post.category.name);

  // Status
  const statusEl = jq("#post-status");
  statusEl.text(postStatus[post.status]);
  statusEl.attr("class", statusClassMap[post.status]);
  if (post.status == 1) {
    jq("#btn-cancel").show();
  }

  // Render Editor.js content (if JSON)
  try {
    if (post.content) {
      renderEditorContent(JSON.parse(post.content));
    }
  } catch {
    // fallback nếu không phải editor.js -> render HTML thuần
    jq("#post-content").html(post.content);
  }
}

// Convert Editor.js JSON → HTML
function renderEditorContent(blocks) {
  let html = "";
  blocks.blocks.forEach((b) => {
    switch (b.type) {
      case "header":
        html += `<h${b.data.level}>${b.data.text}</h${b.data.level}>`;
        break;
      case "paragraph":
        html += `<p>${b.data.text}</p>`;
        break;
      case "image":
        html += `<img src="${b.data.file.url}" alt="" style="max-width:100%;border-radius:12px;margin:12px 0;">`;
        break;
      case "list":
        const tag = b.data.style === "ordered" ? "ol" : "ul";
        html += `<${tag}>${b.data.items
          .map((i) => `<li>${i}</li>`)
          .join("")}</${tag}>`;
        break;
    }
  });

  jq("#post-content").html(html);
}

// Handle Cancel Post
jq("#btn-cancel").on("click", async () => {
  if (!confirm("Do you want to cancel this post request?")) return;

  try {
    const res = await callApi({
        url: "api/v1/blog-request/cancel/" + postId,
        method: "POST",
        token: token,
    })

    alert("Post has been cancelled.");
    loadPostDetail(); // refresh UI
  } catch (err) {
    console.error(err);
    alert("Error cancelling request");
  }
});

// Run
loadPostDetail();

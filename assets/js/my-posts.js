import { getCurrentUserId } from "./common.js";
import { callApi } from "./apiHelper.js";
import { uploadFileApi } from "./apiHelper.js";

let jq = jQuery.noConflict();
let posts = [];

jq(document).ready(async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "sign-in.html";
    return;
  }
  posts = await loadPosts();
  renderPosts();
  loadCountries();
  loadCategories();
});

const postStatus = {
  0: "All",
  1: "In Review",
  2: "Approved",
  3: "Cancelled/Rejected",
};

const statusColors = {
  2: "#27ae60",
  1: "#f39c12",
  3: "#c0392b",
  0: "#7f8c8d",
};

const POSTS_PER_PAGE = 8;
let currentStatus = 0;
let currentPage = 1;

function renderPosts() {
  const filtered =
    currentStatus === 0
      ? posts
      : posts.filter((p) => p.status === currentStatus);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  if (currentPage > totalPages) currentPage = totalPages || 1;

  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filtered.slice(start, start + POSTS_PER_PAGE);

  const container = jq("#posts-list");
  container.empty();

  if (paginatedPosts.length === 0) {
    container.append('<p class="my-posts__no-posts">No posts found.</p>');
    jq("#pagination").empty();
    return;
  }

  paginatedPosts.forEach((post) => {
    const statusColor = statusColors[post.status] || "#7f8c8d";
    const card = jq(`
    <article class="post-card" data-id="${post.id}">
      <div class="post-card__status" style="background-color: ${statusColor}">
        ${postStatus[post.status]}
      </div>
      <img src="${post.thumbnail.fullPathUrl}" alt="${
      post.title
    }" class="post-card__thumbnail" />
      <div class="post-card__content">
        <h3 class="post-card__title">${post.title}</h3>
        <p class="post-card__description">${post.description}</p>
        <p class="post-card__destination"><i class="fas fa-map-marker-alt"></i> ${
          post.destination.name
        }</p>
      </div>
    </article>
  `);
    container.append(card);
  });

  renderPagination(totalPages);
}

jq("#posts-list").on("click", ".post-card", function () {
  const id = jq(this).data("id");
  if (!id) return;
  window.location.href = `my-post-detail.html?id=${id}`;
});

function renderPagination(totalPages) {
  const pagination = jq("#pagination");
  pagination.empty();
  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    const pageItem = jq(`<button class="pagination__btn">${i}</button>`);
    if (i === currentPage) pageItem.addClass("pagination__btn--active");
    pageItem.on("click", () => {
      currentPage = i;
      renderPosts();
    });
    pagination.append(pageItem);
  }
}

jq(".my-posts__tabs").on("click", ".my-posts__tab", function () {
  jq(".my-posts__tab").removeClass("my-posts__tab--active");
  jq(this).addClass("my-posts__tab--active");
  currentStatus = jq(this).data("status");
  currentPage = 1;
  renderPosts();
});

const modal = jq("#create-post-modal");
const openBtn = jq("#btn-create-post");
const closeBtn = jq("#close-modal");
const countrySelect = jq("#post-country");
const destinationSelect = jq("#post-destination");
const categorySelect = jq("#post-category");
const thumbnailInput = jq("#post-thumbnail");
const thumbnailPreview = jq("#thumbnail-preview");
let countries = [];
let categories = [];
let destinations = [];

let editor;
function initEditor() {
  editor = new EditorJS({
    holder: "editorjs",
    placeholder: "Type something...",
    tools: {
      image: {
        class: ImageTool,
        config: {
          uploader: {
            async uploadByFile(file) {
              const token = localStorage.getItem("token");
              const response = await uploadFileApi(file, token);
              return {
                success: 1,
                file: {
                  url: response.result.fullPathUrl,
                },
              };
            },
          },
        },
      },
      header: {
        class: Header,
        inlineToolbar: true,
      },
      List: {
        class: EditorjsList,
        inlineToolbar: true,
        config: {
          defaultStyle: "unordered",
        },
      },
    },
  });
}

async function loadPosts() {
  const response = await callApi({
    url: "api/v1/blog-request/my/search",
    method: "POST",
    data: JSON.stringify({ ignorePagination: true }),
    token: localStorage.getItem("token"),
  });

  return response.result.data;
}

async function loadCountries() {
  const res = await callApi({
    url: "api/v1/country/search",
    method: "POST",
    data: JSON.stringify({ ignorePagination: true }),
  });

  countries = res.result.data;
}

async function loadDestinationsByCountry(id) {
  const res = await callApi({
    url: "api/v1/country/" + id + "/destinations",
    method: "GET",
  });
  destinations = res;
}

async function loadCategories() {
  const res = await callApi({
    url: "api/v1/categories",
    method: "GET",
  });

  categories = res.result;
}

async function uploadFile(file) {
  const token = localStorage.getItem("token");
  try {
    const response = await uploadFileApi(file, token);
    const result = response.result;
    return result.id;
  } catch (err) {
    console.error("Upload failed:", err);
  }
}

openBtn.on("click", () => {
  modal.addClass("active").attr("aria-hidden", "false");
  if (editor == null || editor == undefined) {
    initEditor();
  }

  countrySelect
    .empty()
    .append('<option value="">-- Select Country --</option>');
  countries.forEach((country) => {
    countrySelect.append(
      `<option value="${country.id}">${country.name}</option>`
    );
  });

  categorySelect
    .empty()
    .append('<option value="">-- Select Category --</option>');
  categories.forEach((cat) => {
    categorySelect.append(`<option value="${cat.id}">${cat.name}</option>`);
  });
});

closeBtn.on("click", () => {
  modal.removeClass("active").attr("aria-hidden", "true");
  destinationSelect
    .empty()
    .append('<option value="" disabled selected>Select destination</option>');
});

modal.on("click", (e) => {
  if (e.target === modal[0] || e.target === modal.find(".modal__overlay")[0]) {
    modal.removeClass("active").attr("aria-hidden", "true");
  }
});

countrySelect.on("change", async () => {
  const countryId = countrySelect.val();
  await loadDestinationsByCountry(countryId);

  destinationSelect.prop("disabled", destinations.length === 0);
  destinationSelect
    .empty()
    .append('<option value="">-- Select Destination --</option>');
  destinations.forEach((destination) => {
    destinationSelect.append(
      `<option value="${destination.id}">${destination.name}</option>`
    );
  });
});

thumbnailInput.on("change", (e) => {
  const file = e.target.files[0];
  if (!file) {
    thumbnailPreview.hide().attr("src", "");
    return;
  }
  const reader = new FileReader();
  reader.onload = (event) => {
    thumbnailPreview.attr("src", event.target.result).show();
  };
  reader.readAsDataURL(file);
});

jq("#create-post-form").on("submit", async (e) => {
  e.preventDefault();

  const title = jq("#post-title").val();
  const country = jq("#post-country").val();
  const destination = jq("#post-destination").val();
  const category = jq("#post-category").val();
  const thumbnailFile = thumbnailInput[0].files[0];
  const thumbnailId = await uploadFile(thumbnailFile);

  if (!title || !country || !destination || !category || !thumbnailFile) {
    alert("Please fill all required fields.");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const content = await editor.save();

    const res = await callApi({
      url: "api/v1/blog-request",
      method: "POST",
      data: JSON.stringify({
        title: title,
        content: JSON.stringify(content),
        thumbnailId: thumbnailId,
        authorId: getCurrentUserId(),
        categoryId: category,
        destinationId: destination,
      }),
      token: token,
    });

    alert("Post created successfully!");

    modal.removeClass("active").attr("aria-hidden", "true");
    jq("#create-post-form")[0].reset();
    thumbnailPreview.hide().attr("src", "");
    editor.clear();
    destinationSelect
      .prop("disabled", true)
      .empty()
      .append('<option value="" disabled selected>Select destination</option>');
  } catch (error) {
    console.error("Failed to save content:", error);
    alert("Failed to save post content. Please try again.");
  }
});

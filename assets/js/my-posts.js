let jq = jQuery.noConflict();

const posts = [
  {
    id: 1,
    thumbnail: "https://picsum.photos/id/1011/300/180",
    title: "Exploring the Alps",
    description: "A wonderful journey through the mountains.",
    destination: "Switzerland",
    status: "publish",
  },
  {
    id: 2,
    thumbnail: "https://picsum.photos/id/1012/300/180",
    title: "Beaches of Thailand",
    description: "Sunny days and turquoise water.",
    destination: "Thailand",
    status: "in-review",
  },
  {
    id: 3,
    thumbnail: "https://picsum.photos/id/1013/300/180",
    title: "Tokyo City Lights",
    description: "Experience the vibrant city life.",
    destination: "Japan",
    status: "cancelled",
  },
  // ...thêm data nếu muốn
];

const POSTS_PER_PAGE = 4;
let currentStatus = "all";
let currentPage = 1;

function renderPosts() {
  const filtered =
    currentStatus === "all"
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
    const card = jq(`
            <article class="post-card">
              <img src="${post.thumbnail}" alt="${post.title}" class="post-card__thumbnail" />
              <div class="post-card__content">
                <h3 class="post-card__title">${post.title}</h3>
                <p class="post-card__description">${post.description}</p>
                <p class="post-card__destination"><i class="fas fa-map-marker-alt"></i> ${post.destination}</p>
              </div>
            </article>
          `);
    container.append(card);
  });

  renderPagination(totalPages);
}

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

jq(document).ready(() => {
  renderPosts();
});

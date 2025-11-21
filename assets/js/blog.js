import { callApi } from "./apiHelper.js";

var blogApi = "api/v1/blogs"
var jq = jQuery.noConflict();

jq(document).ready(async function() {
    await loadLastestBlogs();
    await loadHostestBlogs();
});

async function loadLastestBlogs() {
    const response = await callApi({
        url: blogApi + "/search",
        method: "POST",
        data: JSON.stringify({
            pageSize: 5,
            pageNumber: 1
        })
    });

    const blog = response.result;
    let content = `
        <h2 class="blog__heading--small">Lastest</h2>
        <div class="row">
          <div class="col-7">
            <div class="blog-card">
              <a href="#!" class="blog-card__img-wrap">
                <img
                  src="${blog[0].thumbnail}"
                  alt=""
                  class="blog-card__img"
                />
              </a>
              <a href="#!" class="blog-card__heading">
                ${blog[0].title}
              </a>
              <a href="#!" class="blog-card__more">By ${blog[0].author}</a>
            </div>
          </div>
          <div class="col-5">
            <div class="blog-card">
              <a href="#!" class="blog-card__img-wrap">
                <img
                  src="${blog[1].thumbnail}"
                  alt=""
                  class="blog-card__img"
                />
              </a>
              <a href="#!" class="blog-card__heading">
                ${blog[1].title}
              </a>
              <a href="#!" class="blog-card__more">By ${blog[1].title}</a>
            </div>
          </div>
        </div>
        <div class="seperator"></div>
        <div class="row row-cols-lg-3">
          ${renderNextBlogs(blog)}
        </div>
    `;

    jq('#lastestBlogs').html(content)
}

async function loadHostestBlogs() {
    const response = await callApi({
        url: blogApi + "/search",
        method: "POST",
        data: JSON.stringify({
            pageSize: 6,
            pageNumber: 1
        })
    });

    const blogs = response.result; 
    let content = '';

    blogs.forEach(item => {
        content += `
            <div class="col">
            <div class="blog-card">
              <a href="#!" class="blog-card__img-wrap">
                <img
                  src="${item.thumbnail}"
                  alt=""
                  class="blog-card__img"
                />
              </a>
              <a href="#!" class="blog-card__heading">
                ${item.title}
              </a>
              <a href="#!" class="blog-card__more">By ${item.author}</a>
            </div>
          </div>
        `
    });

    jq('#hostestBlogs row row-cols-lg-3 gy-4 gx-4').html(content);
}

function renderNextBlogs(blog) {
    let result = '';

    blog.forEach(item => {
        result += `
            <div class="col">
            <div class="blog-card">
              <a href="#!" class="blog-card__img-wrap">
                <img
                  src="${item.thumbnail}"
                  alt=""
                  class="blog-card__img"
                />
              </a>
              <a href="#!" class="blog-card__heading">
                ${item.title}
              </a>
              <a href="#!" class="blog-card__more">By ${item.author}</a>
            </div>
          </div>
        `
    });

    return result;
}
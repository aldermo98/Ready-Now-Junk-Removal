// Minimal static blog generator
// Run: npm i && npm run build

const fs = require("fs");
const path = require("path");
const { marked } = require("marked");

const BASE_URL = process.env.NODE_ENV === 'development'
  ? "http://localhost:5501"
  : "https://readynowjunkremoval.com";
const SRC_DIR = path.join(__dirname, "content", "posts");
const TPL_DIR = path.join(__dirname, "templates");
const OUT_DIR = path.join(__dirname, "blog");

// utils
const ensure = (p) => fs.mkdirSync(p, { recursive: true });
const slugify = (s) =>
  s.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const readTemplate = (name) =>
  fs.readFileSync(path.join(TPL_DIR, name), "utf8");

const parseFrontMatter = (raw) => {
  // Normalize BOM + Windows CRLF to LF so the regex works everywhere
  const src = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");

  const m = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return [{}, src];

  const fm = {};
  m[1].split("\n").forEach((line) => {
    const idx = line.indexOf(":");
    if (idx > -1) {
      const key = line.slice(0, idx).trim();
      let val = line.slice(idx + 1).trim();

      // Arrays like [a, b, c]
      if (/^\[.*\]$/.test(val)) {
        val = val
          .replace(/^\[/, "")
          .replace(/\]$/, "")
          .split(",")
          .map((v) => v.trim().replace(/^"|"$/g, ""));
      } else {
        // Strip optional surrounding quotes
        val = val.replace(/^"|"$/g, "");
      }
      fm[key] = val;
    }
  });

  return [fm, m[2]];
};


const formatDateHuman = (iso) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const makeTagLinks = (tags = []) =>
  (Array.isArray(tags) ? tags : [tags])
    .filter(Boolean)
    .map((t) => `<a href="/blog/tags/${slugify(t)}/">${escapeHtml(t)}</a>`)
    .join(", ");

const renderPost = (tpl, post) =>
  tpl
    .replaceAll("{{TITLE}}", escapeHtml(post.title))
    .replaceAll("{{DESCRIPTION}}", escapeHtml(post.description || ""))
    .replaceAll("{{DATE}}", post.date)
    .replaceAll("{{HUMAN_DATE}}", formatDateHuman(post.date))
    .replaceAll("{{AUTHOR}}", escapeHtml(post.author || ""))
    .replaceAll("{{COVER}}", post.cover || `${BASE_URL}/images/og-default.jpg`)
    .replaceAll("{{TAG_LINKS}}", makeTagLinks(post.tags))
    .replaceAll("{{CANONICAL}}", `${BASE_URL}/blog/${post.slug}/`)
    .replace("{{CONTENT}}", post.html);

const card = (p) => `
<div class="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".7s">
    <div class="news-box-item mt-0">
        <div class="news-image">
            ${p.cover ? `<img src="${p.cover}" alt="${escapeHtml(p.title)}" />` : ""}
            <div class="post-date">
                <i class="fa-light fa-calendar-days"></i> ${formatDateHuman(p.date)}
            </div>
        </div>
        <div class="news-content">
            <ul class="news-list">
                <li><i class="fa-solid fa-tags"></i>${(p.tags || []).join(", ")}</li>
            </ul>
            <h3><a href="/blog/${p.slug}/">${escapeHtml(p.title)}</a></h3>
            <p>${escapeHtml(p.description || "")}</p>
        </div>
    </div>
</div>
<article class="card">`;

const renderIndex = (tpl, posts) =>
  tpl
    .replace("{{BASE_URL}}", BASE_URL)
    .replace("{{POST_LIST}}", posts.map(card).join("\n"));

const writeFile = (relPath, content) => {
  const full = path.join(OUT_DIR, relPath);
  ensure(path.dirname(full));
  fs.writeFileSync(full, content, "utf8");
};

const build = () => {
  // clean dist
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  ensure(OUT_DIR);

  // copy public
  const copyRecursive = (src, dest) => {
    ensure(dest);
    for (const item of fs.readdirSync(src, { withFileTypes: true })) {
      const s = path.join(src, item.name);
      const d = path.join(dest, item.name);
      if (item.isDirectory()) copyRecursive(s, d);
      else fs.copyFileSync(s, d);
    }
  };
  if (fs.existsSync(path.join(__dirname, "src"))) {
    copyRecursive(path.join(__dirname, "src"), OUT_DIR);
  }

  const postTpl = readTemplate("post.html");
  const indexTpl = readTemplate("index.html");

  // read posts
  const files = fs
    .readdirSync(SRC_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.join(SRC_DIR, f));

  const posts = files.map((file) => {
    const raw = fs.readFileSync(file, "utf8");
    const [fm, body] = parseFrontMatter(raw);
    if (!fm.title) throw new Error(`Missing title in ${file}`);
    if (!fm.date) throw new Error(`Missing date in ${file}`);

    const slug = fm.slug ? slugify(fm.slug) : slugify(fm.title);
    const html = marked.parse(body);

    return {
      ...fm,
      slug,
      html,
      date: new Date(fm.date).toISOString().slice(0, 10),
      tags: Array.isArray(fm.tags) ? fm.tags : (fm.tags ? [fm.tags] : []),
    };
  });

  // sort newest first
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));

  // render posts
  for (const p of posts) {
    const out = renderPost(postTpl, p);
    writeFile(path.join(p.slug, "index.html"), out);
  }

  // render index
  const indexHtml = renderIndex(indexTpl, posts);
  writeFile(path.join("index.html"), indexHtml);

  // tag pages
  const tagMap = {};
  posts.forEach((p) =>
    p.tags.forEach((t) => {
      const k = slugify(t);
      tagMap[k] = tagMap[k] || { name: t, posts: [] };
      tagMap[k].posts.push(p);
    })
  );
  for (const [slug, tag] of Object.entries(tagMap)) {
    const html = renderIndex(
      indexTpl.replace("<h1>Blog</h1>", `<h1>Tag: ${escapeHtml(tag.name)}</h1>`),
      tag.posts
    );
    writeFile(path.join("tags", slug, "index.html"), html);
  }
};

build();

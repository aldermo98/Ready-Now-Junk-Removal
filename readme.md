# Ready Now Junk Removal - Blog System

## Creating webp images
To create webp images for your blog posts, you can use the following command:
```bash
  cwebp -q 80 input.jpg -o output.webp
```

## Creating New Blog Posts

### Overview
This project uses a static blog generator. Blog posts are written as Markdown files in the `/content/posts` directory and must be built to generate HTML files in the `/blog` directory.

### Step-by-Step Guide

#### 1. Create a New Post File
- Navigate to the `/content/posts` directory
- Create a new `.md` (Markdown) file with a descriptive name
- Example: `my-new-blog-post.md`

#### 2. Add Front Matter
At the top of your Markdown file, add front matter (metadata) in YAML format:

```yaml
---
title: "Your Blog Post Title"
description: "A brief description of your post (appears in listings)"
date: "2026-01-14"
author: "Author Name"
tags:
  - tag1
  - tag2
  - tag3
slug: "custom-url-slug" (optional - uses title if not provided)
cover: "/assets/img/your-image.jpg" (optional - post cover image)
---
```

#### 3. Write Your Content
Below the front matter, write your blog post in Markdown format:

```markdown
# Heading 1
## Heading 2

This is a paragraph with **bold** and *italic* text.

- Bullet point
- Another bullet

[Link text](https://example.com)
```

#### 4. Build the Blog
Run the build command to generate HTML files:

```bash
npm run build
```

This command will:
- Read all `.md` files from `/content/posts`
- Parse the front matter and Markdown content
- Generate individual post pages in `/blog/[post-slug]/index.html`
- Create tag pages in `/blog/tags/[tag-slug]/index.html`
- Update the main blog index at `/blog/index.html`

#### 5. View Your Post
Your post will be available at: `https://readynowjunkremoval.com/blog/your-post-slug/`

### Front Matter Reference

| Field | Required | Description |
|-------|----------|-------------|
| `title` | ✓ | Post title (used for slug if not provided) |
| `description` | ✗ | Short description for blog listings |
| `date` | ✓ | Publication date (YYYY-MM-DD format) |
| `author` | ✗ | Author name |
| `tags` | ✗ | Array of tags for categorization |
| `slug` | ✗ | Custom URL slug (auto-generated from title if omitted) |
| `cover` | ✗ | Cover image path |

### Important Notes

- **Always run `npm run build`** after creating or modifying posts for changes to appear on the site
- Posts are sorted by date (newest first)
- Tags are automatically converted to tag pages at `/blog/tags/[tag-slug]/`
- HTML special characters are automatically escaped in titles and descriptions
- The canonical URL is automatically generated based on the post slug
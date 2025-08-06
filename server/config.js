module.exports = {
  "63": {
    // Amazon config
    filters: [
      {
        id: "div.a-section.a-spacing-none[aria-labelledby]",
        multiContainerPrefix: true,
        titleSelector: "span.a-size-base",
        itemSelector: ".a-list-item .a-link-normal span.a-size-base.a-color-base",
        attribute: "innerText"
      },
      {
        id: "[aria-labelledby='p_n_size_two_browse-vebin-title']",
        titleSelector: "span.a-size-base.a-color-base.puis-bold-weight-text",
        itemSelector: "a.a-link-normal.s-navigation-item",
        attribute: "innerText",
        itemAttribute: "title"
      },
      {
        id: "#departments",
        titleSelector: "span.a-size-base.a-color-base.puis-bold-weight-text",
        itemSelector: "a.a-link-normal.s-navigation-item span.a-size-base.a-color-base",
        attribute: "innerText",
        itemAttribute: "innerText",
        join: "~",
        renameTo: "Breadcrumbs"
      }
    ]
  },
  "2": {
    // Flipkart config
    filters: [
      {
        id: "[class~='-5qqlC'][class~='_2OLUF3']",
        titleSelector: ".fxf7w6.rgHxCQ",
        itemSelector: ".QCKZip.hpLdC3",
        attribute: "textContent",
        itemAttribute: "title",
        itemAttributeFallback: "textContent"
      },
      {
        id: ".GSeM5C",
        isTitleless: true,
        itemSelector: ".esFpML",
        itemAttribute: "innerText",
        join: "~",
        renameTo: "Breadcrumbs"
      }
    ]
  }
};
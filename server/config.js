module.exports = {
  "63": {
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
        join: "~"
      }
    ]
  },
  "2":{
    filters: [
      {
        // This is the selector for each filter section container
        id: "[class~='-5qqlC'][class~='_2OLUF3']",
        // This is the selector for the title WITHIN the container
        titleSelector: ".fxf7w6.rgHxCQ",
        // This is the selector for each option item WITHIN the container
        itemSelector: ".QCKZip.hpLdC3",
        // This is the property to get the text from the title element
        attribute: "textContent",
        // For items, we first try the 'title' attribute...
        itemAttribute: "title",
        // ...if 'title' is missing, we fall back to the visible text.
        itemAttributeFallback: "textContent"
      }
    ]
  },

};

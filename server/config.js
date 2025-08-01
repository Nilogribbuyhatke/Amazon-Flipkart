// This should be inside your main configs file/object
module.exports = 
{
  111: {
    "brandSelector": [
      {
        "selector": "ul.brand-list li input[type='checkbox']",
        "attribute": "value",
        "global": true
      }
    ],
    "minPriceSelector": [
      {
        "selector": ".slider-dotContainer",
        "attribute": "innerText",
        "regex": "₹([\\d,]+)"
      }
    ],
    "maxPriceSelector": [
      {
        "selector": ".slider-dotContainer",
        "attribute": "innerText",
        "regex": "-\\s*₹([\\d,]+)"
      }
    ],
    "colorSelector": [
      {
        "comment": "Selects all color list items and cleans the text.",
        "selector": ".colour-listItem",
        "attribute": "innerText",
        "regex": "^(.*?)\\s*\\(",
        "global": true
      }
    ],
     "discountSelector": [
      {
        "comment": "Selects all discount range labels.",
        "selector": ".discount-list li label",
        "attribute": "innerText",
        "global": true
      }
    ],
     "breadcrumbSelector": [
      {
        "comment": "Selects all breadcrumb items.",
        "selector": ".breadcrumbs-item",
        "attribute": "innerText",
        "global": true,
        "join": " ~ " 
      }
    ]
  },
  63:{
    "brandSelector": [
      {
        "selector": "#brandsRefinements .a-list-item .a-link-normal span.a-size-base.a-color-base",
        "attribute": "innerText",
        "global": true
      }
    ],
    "priceBandSelector": [
      {
        "selector": "#priceRefinements .a-list-item .a-link-normal span",
        "attribute": "innerText",
        "global": true
      }
    ],
    "materialSelector": [
      {
        "selector": "#p_n_material_browse\\/1974774031 .a-list-item span.a-size-base.a-color-base",
        "attribute": "innerText",
        "global": true
      }
    ],
    "typeOfFitSelector": [
      {
        "selector": "#p_n_size_five_browse-vebin\\/1975309031 .a-list-item span.a-size-base.a-color-base",
        "attribute": "innerText",
        "global": true
      }
    ],
    "discountSelector": [
      {
        "selector": "#p_n_pct-off-with-tax\\/2665398031 .a-list-item span.a-size-base.a-color-base",
        "attribute": "innerText",
        "global": true
      }
    ]
}
  // ... other site configs
};
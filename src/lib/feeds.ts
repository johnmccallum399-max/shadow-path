// The 6 default RSS feeds from the Shadow Path manual
export const DEFAULT_FEEDS = [
  {
    label: 'Minneapolis GREEN ($0-650)',
    feed_url: 'https://minneapolis.craigslist.org/search/cta?format=rss&max_price=650&auto_title_status=1&query=clean+title+runs',
    market: 'minneapolis',
    tier: 'green',
  },
  {
    label: 'Minneapolis BLUE ($700-1700)',
    feed_url: 'https://minneapolis.craigslist.org/search/cta?format=rss&min_price=700&max_price=1700&auto_title_status=1&query=clean+title+runs',
    market: 'minneapolis',
    tier: 'blue',
  },
  {
    label: 'Duluth ALL TIERS',
    feed_url: 'https://duluth.craigslist.org/search/cta?format=rss&max_price=1700&auto_title_status=1&query=clean+title+runs',
    market: 'duluth',
    tier: 'all',
  },
  {
    label: 'Fargo ALL TIERS',
    feed_url: 'https://fargo.craigslist.org/search/cta?format=rss&max_price=1700&auto_title_status=1&query=clean+title+runs',
    market: 'fargo',
    tier: 'all',
  },
  {
    label: 'Eau Claire ALL TIERS',
    feed_url: 'https://eauclaire.craigslist.org/search/cta?format=rss&max_price=1700&auto_title_status=1&query=clean+title+runs',
    market: 'eauclaire',
    tier: 'all',
  },
  {
    label: 'La Crosse ALL TIERS',
    feed_url: 'https://lacrosse.craigslist.org/search/cta?format=rss&max_price=1700&auto_title_status=1&query=clean+title+runs',
    market: 'lacrosse',
    tier: 'all',
  },
];

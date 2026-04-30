// Mock data simulating WordPress REST API / WPGraphQL responses
// Replace with real API calls when connecting to WordPress

export const siteConfig = {
  name: "The Editorial Traveler",
  tagline: "Curating the world's most silent moments.",
  description:
    "A digital journal celebrating the art of slow travel and high-end editorial photography.",
  author: {
    name: "Julian",
    bio: "An editorial photographer and slow traveler dedicated to uncovering the authentic soul of every landscape I encounter.",
    stats: { countries: "42+", exhibitions: 12, yearsExperience: "8y" },
    portrait:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDxF8Mrkdfo4cg09JrTErtqRjUXNP97IrSSp_FVggnLyhsoOruYsStxqs5mmYHK3SU_gSdbAly5lDVu36bavntxzG6Zp4YzU6_X-Bf8WOMvI43ckmBKoxwSyPCeTb8vCNGnBd2fO4JXsccEiKMvWWBaRGSQxxilBeUVhriY12F53Qa00PySHGPrcE--1vER_ETBIjZI2FfvpjsGXuFN853v1SzxMySNU8g1POIVOXzlknEQbBAB6ef-V3-QaidU6R7feGaAEQLuYw",
  },
};

export const heroData = {
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCEg55QxjKAJAwzrfJ9_eLzB7NUsrjNFh7L-O4GkVutulA4b5ovGU5W8n3Hs_QPn1l2zzUdssZ9lnfucnHYT897KoiGX3-ujFRfrBobEeuTey49CriH_T6Kf_WJ0leIOA9KQ7Wlvx1kqXwQ2xrQOSOKOf0-PiEWjmeQtq5cAqd6c8JDmEMtv1xWJwl-aIFaE1z5mRs82tLb3vXG2GLL6ImfCFr4s23vaaT6owMQVLs8nin7z7Bwbq7E-Pk2d0n_xzEC4NFC-QuIcw",
  imageAlt: "Expansive panoramic view of misty mountain range at sunrise",
};

export const featuredDestinations = [
  {
    slug: "amalfi-coast",
    title: "The Amalfi Coast",
    region: "EUROPE",
    date: "Sept 2023",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBd2ZoCSxngnL2Hm6bP_zrQi2NeCXgt0HgME7ZG9hDSS_n8Ne46uhAKXpqCKRL9K-3ofZ1vYJWZ7B3ZL7JBGc-SRuqFjzNEEH9pD_KUSJiOtUPU6xr1EmohmNbQMwcvZeWdj8kxUm_0YtV_cGzElFdacs0ywdTvx_h-de7WMKLVbgdxONZ02m8WqUuTMPYsro2zPN3JXSZjIdbEVGqAWh_aSfzhzsLw5-4IQedCqLsgBmtwdTPXovCG6tFJMvn6TKVaMjhtzo5Lxw",
    imageAlt: "Narrow cobblestone street in a historic European village",
  },
  {
    slug: "sacred-spaces",
    title: "Sacred Spaces",
    region: "ASIA",
    date: "Jan 2024",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCrBQbnwaflZlIa5mx0JiVKOgXyrHSmzxljZOswGILGr_xnrLqVIY1ZXqfsiLUAqq-sOK0v2YCVzc-YKPSzlq4GZ0MaMQJhuCZVEfFWyGqyTk85QdpU5OTu7cikGzjDEMx6j8udu58fixyBgPDNOtEmqbyXLSzoN5rJHh8SbMYSGONG1tweq7iwwENvLUkGvTX3R35ZFIEOeG_sP5ae-kg7k_dx5zEZwczhZKJR-G_pbzXMC0eFv1dCRxQ-CNp3NCMDXhHtiz_pHA",
    imageAlt: "The Taj Mahal reflecting in its central pool at dawn",
  },
  {
    slug: "parisian-mornings",
    title: "Parisian Mornings",
    region: "FRANCE",
    date: "Nov 2023",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDypouT4Hc4gk4_5SfLm0AdYyG_MqF1dXsHAJmpcZLTrICn-0mHYu5oKFnFA59sF6Y_EJ_fylFsUj_3778Lb1zbpnnOrOVkuy1ByXwRHe1MsR5dnESZnMMf_n7JOBBmBoBWzMomkhbM5Ezn1a-wxGAOVzL42_XS1ek-0e1fx7SLMDMo8X0ZHN2m9ZFWjQ5UsrWj_MmWn12r-EpWJIFGwlTypG9lbrkO-LMoJowSxOamfGP_IARj1ZeyYxEF4VxkO-A-2tw52fXew",
    imageAlt: "Distant view of the Eiffel Tower from a Parisian balcony",
  },
];

export const blogPosts = [
  {
    slug: "faroe-islands",
    title: "Finding the Edge: A Week in the Faroe Islands",
    excerpt:
      "How stepping out of your comfort zone—and into the relentless wind of the North Atlantic—can sharpen your creative lens.",
    category: "Photography",
    readTime: "12 MIN READ",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDnaMyxxbuLbK89j5Bbvhr2syIE3fKoG8hWalewWy06T_lC3y6C92URu0rf4dxBSjk2cdhv5Ws7CNDwJsNy4LZBAsODHVq0cituVnnLSyh8w8oJchENZX1pB5SqZX0txrrPx_fiL7wTfhfDKMCMo31BJnazP5b1lgPniKpB3L3UFdmq55n8kcjrZkxsLF0Bq-r_5aATH6ujtTnQEqsjUZHZKD9iuhWj-fYJ_jlneZzG8thuDIVT5HP3kcpnw4Id32COzrBLLGJWZA",
    imageAlt: "Rugged coastline with dark jagged rocks and crashing turquoise waves",
    featured: true,
  },
  {
    slug: "camera-kit-2024",
    title: "My 2024 Ultralight Camera Kit",
    excerpt:
      "Everything I carry when the trail gets steep and the weight matters most.",
    category: "Equipment",
    date: "MAY 14, 2024",
    featured: false,
  },
  {
    slug: "art-of-slowing-down",
    title: "The Art of Slowing Down",
    excerpt:
      "Why I stopped counting countries and started counting connections.",
    category: "Reflection",
    date: "APR 29, 2024",
    featured: false,
  },
  {
    slug: "hoi-an",
    title: "The Colors of Hoi An: A Three-Day Sensory Map",
    excerpt:
      "From the steam of the morning markets to the paper lanterns of the Thu Bon River, discovering the ancient town's hidden rhythm.",
    category: "Itineraries",
    date: "March 12, 2024",
    readTime: "6 min read",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCcjXlILSdcxtkbce3vCs8bRS1w5E3K9hUeSn7JqteeS2cv7-e7OYwgc3e9IZJM77YTG-VzbagIahKtvfxQd8Bk8OhZlji-42ZikxQfLycL4L0rdUjluQSXcIxYF-5F302BSTkwffjAdtC8GhCd6u6UWfhuqPHjQ_treJWM7yaghT2bRhnAsdr-a1DJYXWGBHIfrTqUtB0Z68HMaVzksWB5RS6P5pud4K4nRdTjDmCuq4GrkrOGfP2LYQyePVDeAm3eHoxXP1B_wQ",
    imageAlt: "Aerial view of colorful Vietnamese fishing boats in a turquoise harbor",
  },
  {
    slug: "alpine-ethics",
    title: "High Altitude Ethics: Responsible Alpinism in 2024",
    excerpt:
      "As mountain tourism peaks, we speak to local guides about the changing landscape of high-altitude conservation and cultural respect.",
    category: "Guides",
    date: "March 08, 2024",
    readTime: "12 min read",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCPr8KatYxaCIE2MssUq3nx1f0dbJ0zdOb9arYBmkjLN4dMT5_-tSb0agWujHJYvgX4JrQ1kwGdP8jLDjEg9zAZmUkXsOoXmqyqC62WI98f7HB3lTIWkCmbUgi4Y_kL9w5zBE8xQnvYEWaqI_4VAUs3x9BWZnSkUve7QNZ7cVfUPU5dp3w_5tnl7wGka1aLjrLCJ5SECz7A32HdMhIeBF2JaD1XWsfgCvrJCaDnbouOl0DtODeYqzIfl1BfpefmEpiSpJGiSl7LZQ",
    imageAlt: "Jagged snowy mountain peaks against a deep blue sky",
  },
  {
    slug: "travel-photography",
    title: "The Art of Travel Photography: Beyond the Postcard",
    excerpt:
      "Moving past cliches to capture the true soul of a destination. A guide to lighting, composition, and human connection.",
    category: "Tips",
    date: "February 28, 2024",
    readTime: "15 min read",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCfbzob1anqiMC3zBcnDkv91i0bDmMp6s5-y0WupBWg_axqzlZpupEI3sxc1B9AstD9ix2OMcdERoVoYEVBxN1Dqt83P35LDfVY2lEOnj367MoJl3eUL6XzGoJmg7vvCyQIyVuhjdYHRotvEkVELG5JFkjFkTjBgktbOSWmmRZ-AKJ4z-csXfD5F3FGaZDU7sl81nsRl9auOOsHNNRwbjsq4RbnSzx5dKGBpE6V3tCzpUSPtlAKj852DeSYLLwyXPXOAik1q06Yag",
    imageAlt: "Minimalist view of white Santorini architecture against a bright blue sea",
  },
  {
    slug: "kyoto-arashiyama",
    title: "Midnight in Kyoto: A Solo Journey Through Arashiyama",
    excerpt:
      "Finding peace in the bamboo groves long after the crowds have departed. A personal essay on solitude and urban wilderness.",
    category: "Stories",
    date: "February 22, 2024",
    readTime: "9 min read",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAbtjUZlVDuHdoFRAmd8Qlayd_jVFZcELuvlj8dRgHnWkTZLyp2hnh48MhiNgvWPwdBmfJkpYY_tk2LQZgH7HwA-DNobU-5yfrnnZPSn-n8LQjqAhlwuK3JWmLdljAjXe8-3XiM8C4W7tpMjKqhVm9MNSqaaIdaUhJFx1qcwuiGwrXMWiJLi4V7urgl0yerxvhCfKQ9IoVN7Qq-WCzjcuK8ygd5-_NtPHCB-F6zLYUfaYoWlhTaIQ4yJDefRm9nEo5431UQBjrk_w",
    imageAlt: "Sunlight filtering through bamboo stalks in a Japanese garden",
  },
];

export const europeDestinations = [
  {
    slug: "italy",
    title: "Italy",
    label: "Editor's Choice",
    description:
      "Experience the art of living with iconic architecture, world-class cuisine, and the enchanting rolling hills of Tuscany.",
    size: "large",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBhbxFH5M2NclS215nghwMZzU4YGG80B_5_qRr3abhzpRIXuZb11slZRG0MTX2w4V-sAFttogREaK_W_ynlBSM-a89kGW-6TPVqIN3-d17_OK9Xce02BDnEAmFO56QIovgl4yrjwHCn_I3eVqsJGcIjn8MDcB-gASAEVB-QN-zEbeESzzQ8h9kA4jxpVIBJ-PgK7quoKfr1zgXyIzHraEzDz892ian-_qabLxKH3qId9YMSvCkJLK2USErwgipX4fvtREZ7jbI9Vw",
    imageAlt: "Venice Grand Canal with historic Venetian architecture at blue twilight",
  },
  {
    slug: "france",
    title: "France",
    size: "small",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCvkZsypFn-i-ifZjQrRXcan2w_GeyM_OpFs95grLsCC0sbZunIpEk5ETjj4dGKThaRl0iAzpgL5hK4qK6fPQcC_dqO0wpkXLW-gOQz3u39rIVe9aWpUl8HWp00UTjUZXFdIjYX2MHs3dO87uGOW9DVGpWdnZmJj4Qs4UeAU35lJ9T39o7-6gR2bRBvQ38MwE0BFa7jzWjEg5rxqcm13GAJEgd6eLhjRGF5he9OXsUFz80lyHpygipRueigWH6zAbzY82ON07QhaA",
    imageAlt: "Minimalist Eiffel Tower framed by spring cherry blossoms",
  },
  {
    slug: "greece",
    title: "Greece",
    size: "small",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCWuhETP7fAfRxH-IRK1y3_CqUYsgMYw6kKUhemE5LWbPQ1bsDgUYzlxkUetEtgRIBtQ1yUZy9953P_uHJJhU1O221A2ct_WN38pKY-oxl2VqsuZDl1zlpYW7rMet4dvPzlXOnOpli8pL9QCkVtjajyJC5FdoDSa5rCLoMrKXK5P57-x6D4zqoEC6GrKMjGRfBLeHon29_Ai0-KVZeFin9xKRjuc-tdx_fwsIpJIZEoi_J6y7QjuhYcME2lhmTtHD4PGYubWJDcjw",
    imageAlt: "Iconic white-washed Santorini buildings with blue domes at sunset",
  },
];

export const romeAttractions = [
  {
    name: "The Colosseum",
    description: "The enduring symbol of imperial power.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCVH6WSnsa3YJX5Cj0aQULx_ZtypE-EdlS_U30rQJMm-7Q42H4n4fRE7PFBREg8xdRHwxmtBHCczVhYla5RJ3TTlH6_lObbQMHsxgUdgZsKwEFXnykBypqDU5AyvH1uLviuSEW7o632G22kL-2QPdHnkcSNsIXDOQiPUD4CEd-nCjGqDp9M5if4TUWHogpxL4Ik9QjcuJdz7cX0LX37bKGuC4meey-TmHleg1tsBvFfjfkkt65wOZs2C0Wi4EkFy2c-E5a7sqOcbA",
    size: "medium",
  },
  {
    name: "Vatican Museums",
    description: "Artistic treasures of a millennium.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAykgu0lHIN4wnXRpbYhjK6ZQyUtJRPMRGtJH9VTLurZQh23LfuHDDfyf8i6SN3XiAnJviDUVJ_EbQgwfBukS1ocMGyJII6hQXztpUfTs59sGaeDiXsCyTdy7fZYlPd7V-XFiQYzddU-D55DW3-nwpUqeYRRdrSpUK-qxqr4qUza6rOVGa9fLkEahg_qOXYYEfBoGhDT9L0n6k2WQyQiFTTw5vkwRY1C0_LSiiZ6qtImD_eEWKDXuQYUtdjaGAFq9GDb4h4ch36Bw",
    size: "medium",
  },
  {
    name: "Fontana di Trevi",
    description:
      "Legend says a coin tossed here ensures your return to the Eternal City.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAoqmsBQcWkVw9TBy9aDEkNQPDZ0GhO7ejVgKlV51K0DBNvIyPvoZCmJb3UtMVx4WR-9yR3B6YvHoisfzanqRhpOIjMaEyquUmGycIvqGI5O60eSc4Zni4WRV9qBEAxExyK_vUvipxNA9mPVFi62oy1Jfu4FUylNqGJ4KchlbDSZX1LPU9r0esIVnY1z-ZRJC20dzPD-MtY0StKwX32hzQppKm5DLM23ItFdphKBtxdoixZhcW6jmr06-92YOk2XsAa8Je8yV_7ew",
    size: "wide",
  },
];

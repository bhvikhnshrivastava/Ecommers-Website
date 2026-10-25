export const LEGAL_DOCUMENTS = {
  privacy: {
    id: 'privacy',
    title: 'Privacy Policy',
    updated: 'October 2026',
    intro:
      'Ecaspian respects the quiet confidence of a private life. This policy explains what this demo storefront stores on your device and how it is used.',
    sections: [
      {
        heading: 'What we collect',
        body: [
          'This demonstration application does not have a server or a database. The details you enter — such as your name, email, delivery address, wishlist, bag, reviews and simulated orders — are stored only in your browser’s local storage.',
          'Product, category and rating data are fetched from the public Fake Store API. No personal information is sent to that service.',
        ],
      },
      {
        heading: 'How we use it',
        body: [
          'Your saved details are used to make the shopping experience work: restoring your bag, showing your wishlist and filling in the checkout form. Nothing is sold, shared or used for advertising.',
          'Clearing your browser data will permanently remove everything you have saved in this demo.',
        ],
      },
      {
        heading: 'Cookies and analytics',
        body: [
          'Ecaspian does not set advertising cookies and does not include third-party analytics. Local storage is used solely for the core shopping features described above.',
        ],
      },
      {
        heading: 'Your choices',
        body: [
          'You can remove saved information at any time by clearing the site data in your browser settings. For questions about this policy, write to hello@ecaspian.com.',
        ],
      },
    ],
  },
  terms: {
    id: 'terms',
    title: 'Terms & Conditions',
    updated: 'October 2026',
    intro:
      'These terms describe the demonstration experience offered by Ecaspian. By browsing or placing a demo order, you agree to them.',
    sections: [
      {
        heading: 'A demonstration store',
        body: [
          'Ecaspian is a capstone project built for learning. Products, prices, reviews and availability are illustrative. No real payment is taken and no physical order is dispatched.',
          'Authentication and checkout are simulated in the browser. Please do not enter real card details or sensitive personal information.',
        ],
      },
      {
        heading: 'Products and pricing',
        body: [
          'Product information and imagery come from the public Fake Store API. Discounts, stock levels and some review content are generated for demonstration purposes. Prices are displayed in Indian rupees using a fixed conversion rate.',
          'We make every effort to present details accurately, but the catalogue should not be relied on for real purchasing decisions.',
        ],
      },
      {
        heading: 'Orders and delivery',
        body: [
          'A demo order creates a local record in your browser and an order confirmation screen. Delivery estimates are illustrative and are not a promise of delivery.',
          'You can clear all locally stored orders by clearing the site data in your browser settings.',
        ],
      },
      {
        heading: 'Acceptable use',
        body: [
          'Please use the site respectfully. Do not attempt to disrupt the application or submit unlawful, harmful or misleading content through the review or newsletter forms.',
        ],
      },
      {
        heading: 'Contact',
        body: [
          'Questions about these terms can be sent to hello@ecaspian.com. These terms may be updated as the project evolves.',
        ],
      },
    ],
  },
};

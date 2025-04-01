export const faqStep1Options = [
    { id: "delivery", text: "Delivery time" },
    { id: "tracking", text: "Package Tracking" },
    { id: "shipping", text: "Shipping cost" },
    { id: "other", text: "Other inquiries" },
  ];
  
  export const faqFollowUp = {
    delivery: {
      message: "For Delivery time, please select an option:",
      options: [
        { id: "when", text: "When will it arrive?" },
        { id: "delay", text: "Why is it delayed?" },
        { id: "done", text: "Done" },
        { id: "contact", text: "Contact admin" },
      ],
    },
    tracking: {
      message: "For Package Tracking, please select an option:",
      options: [
        { id: "how", text: "How to track my package?" },
        { id: "update", text: "Why no update?" },
        { id: "done", text: "Done" },
        { id: "contact", text: "Contact admin" },
      ],
    },
    shipping: {
      message: "For Shipping cost, please select an option:",
      options: [
        { id: "cost", text: "What is the shipping cost?" },
        { id: "free", text: "How to get free shipping?" },
        { id: "done", text: "Done" },
        { id: "contact", text: "Contact admin" },
      ],
    },
    other: {
      message: "For Other inquiries, please select an option:",
      options: [
        { id: "general", text: "General inquiry" },
        { id: "done", text: "Done" },
        { id: "contact", text: "Contact admin" },
      ],
    },
  };
  

import image1 from "./image1.jpg";
import image2 from "./image2.jpg";
import image3 from "./image3.jpg";
import image4 from "./image4.jpg";
import image5 from "./image5.jpg";
import image6 from "./image6.jpg";
import pfp from "./pfp.png"
import logo from "./logo.webp"
import darkLogo from "./darkLogo.webp"

export const assets = {
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  pfp,
  logo,
  darkLogo
}

export const dummyImages = [
  {
    "_id": "234f",
    "imageUrl": image1,
    "userName": "We Go Pass"
  },
  {
    "_id": "234fd",
    "imageUrl": image3,
    "userName": "We Go Pass"
  },


  {
    "_id": "2h67g",
    "imageUrl": image4,
    "userName": "We Go Pass"
  },
  {
    "_id": "134fd",
    "imageUrl": image5,
    "userName": "We Go Pass"
  },
  {
    "_id": "35kld",
    "imageUrl": image6,
    "userName": "We Go Pass"
  }
]

export const dummyPlans = [
  {
    id: "Free",
    name: "Free",
    price: 10,
    credits: 100,
    popular: false,
    features: [
      "✔️ 100 text generations",
      "✔️ 50 image generations",
      "✔️ Standard support",
      "✔️ Access to basic models",
    ],
    description: "Perfect for individuals just getting started.",
  },
  {
    id: "pro",
    name: "Pro",
    price: 20,
    credits: 500,
    popular: true,
    features: [
      "✔️ 500 text generations",
      "✔️ 200 image generations",
      "✔️ Priority support",
      "✔️ Access to pro models",
      "⚡ Faster response time",
    ],
    description: "Best for professionals who need more power and speed.",
  },
  {
    id: "premium",
    name: "Premium",
    price: 30,
    credits: 1000,
    popular: false,
    features: [
      "✔️ 1000 text generations",
      "✔️ 500 image generations",
      "✔️ 24/7 VIP support",
      "✔️ Access to premium models",
      "👤 Dedicated account manager",
    ],
    description: "For teams and enterprises that need the best service.",
  },
];


export const dummyUserData = {
  name: "We Go Pass",
  email: "wegopass@admin.com",
  password: "$2b$12$f1SpQo.RTgLipjtsD.oeA.EEh1FrK6YH7YlU/gaa9F19WOtOvkf32",
  credits: 500,
};



export const dummyChats = [
  {
    "_id": "790de4bbaa932dc3a8ef6aaa",
    "userId": "1234567890abcdef12345678",
    "userName": "We Go Pass",
    "name": "Cyberpunk & Art Prompts",
    "messages": [
      {
        "isImage": false,
        "isPublished": false,
        "role": "user",
        "content": "Imagine a neon fox perched on a futuristic rock bridge above a glowing river under a full moon — cyberpunk cityscape in the background",
        "timestamp": 1756178179612,
      },
      {
        "isImage": true,
        "isPublished": true,
        "role": "assistant",
        "content": image3,
        "timestamp": 1756178194747,
      }
    ],
    "createdAt": "2025-09-01T10:29:31.398Z",
    "updatedAt": "2025-09-01T10:29:54.753Z",
  },
  {
    "_id": "790ccb9016a922dd57a23bbb",
    "userId": "1234567890abcdef12345678",
    "name": "Learning & Tech",
    "messages": [
      {
        "isImage": false,
        "isPublished": false,
        "role": "user",
        "content": "Show the latest AI breakthroughs in a futuristic lab filled with holographic screens and floating data panels",
        "timestamp": 1756106415912,
      },

      {
        "isImage": false,
        "isPublished": false,
        "role": "assistant",
        "content": "The lab is vibrant, filled with AI-driven robots, holographic charts, and glowing interfaces showcasing multimodal AI experiments.",
        "timestamp": 1756106420723,
      },
      {
        "isImage": false,
        "isPublished": false,
        "role": "user",
        "content": "Create an illustration of students using AR glasses and collaborating on futuristic digital tablets in a neon-lit library",
        "timestamp": 1756107475040,
      },
      {
        "isImage": true,
        "isPublished": true,
        "role": "assistant",
        "content": image1,
        "timestamp": 1756107486680,
      },
      {
        "isImage": false,
        "isPublished": false,
        "role": "user",
        "content": "Design a floating rainforest city at twilight with glowing bioluminescent plants, suspended bridges, and neon drones patrolling",
        "timestamp": 1756158982894,
      },
      {
        "isImage": false,
        "isPublished": false,
        "role": "assistant",
        "content": "Focus on ultra-realistic details: misty canopy, glowing flora, reflective waterways, and futuristic architecture blending with nature.",
        "timestamp": 1756158995829,
      },
      {
        "isImage": false,
        "isPublished": false,
        "role": "user",
        "content": "Generate an image of a neon-lit rainforest city floating above the clouds with flying vehicles and luminescent vegetation",
        "timestamp": 1756159013677,
      },
      {
        "isImage": true,
        "isPublished": true,
        "role": "assistant",
        "content": image2,
        "timestamp": 1756159034238,
      },
      {
        "isImage": false,
        "isPublished": false,
        "role": "user",
        "content": "Create a stylish futuristic coding room with holographic monitors and glowing RGB keyboards",
        "timestamp": 1756159074583,
      },
      {
        "isImage": false,
        "isPublished": false,
        "role": "assistant",
        "content": "The room should look ultra-modern: sleek desk, transparent screens, floating code snippets, and neon ambient lighting.",
        "timestamp": 1756159100513,
      },
      {
        "isImage": false,
        "isPublished": false,
        "role": "user",
        "content": "Write a Node.js API server that generates random futuristic gadget names",
        "timestamp": 1756159129597,
      },
      {
        "isImage": false,
        "isPublished": false,
        "role": "assistant",
        "content": "// Express.js server code returning random futuristic gadget names",
        "timestamp": 1756159145294,
      },
      {
        "isImage": false,
        "isPublished": false,
        "role": "user",
        "content": "Visualize a hyper-realistic RGB gaming desk with holographic peripherals and dynamic neon lights",
        "timestamp": 1756159264109,
      },
      {
        "isImage": true,
        "isPublished": true,
        "role": "assistant",
        "content": image6,
        "timestamp": 1756159273878,
      },
      {
        "isImage": false,
        "isPublished": false,
        "role": "user",
        "content": "Explain blockchain using a futuristic city metaphor with neon ledgers and flying transaction drones",
        "timestamp": 1756159666525,
      },
      {
        "isImage": false,
        "isPublished": false,
        "role": "assistant",
        "content": "Blockchain is like a city where every transaction is recorded on glowing towers, visible to all citizens, impossible to erase or tamper with.",
        "timestamp": 1756159683847,
      },
      {
        "isImage": false,
        "isPublished": false,
        "role": "user",
        "content": "Generate a cozy campfire scene in a dense cyber-forest with glowing mushrooms and neon wildlife",
        "timestamp": 1756160243315,
      },
      {
        "isImage": true,
        "isPublished": true,
        "role": "assistant",
        "content": image5,
        "timestamp": 1756160254161,
      },
      {
        "isImage": false,
        "isPublished": false,
        "role": "user",
        "content": "Create a minimalist streaming setup in a futuristic neon-lit room with holographic microphone and keyboard",
        "timestamp": 1756163990514,
      },
      {
        "isImage": true,
        "isPublished": true,
        "role": "assistant",
        "content": image4,
        "timestamp": 1756164001928,
      }
    ],
    "createdAt": "2025-09-01T09:29:52.421Z",
    "updatedAt": "2025-09-01T09:39:19.046Z",
    "userName": "We Go Pass"
  }
];

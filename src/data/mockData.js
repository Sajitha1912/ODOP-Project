export const products = [
    {
        id: 1,
        name: "Royal Blue Silk Saree",
        district: "Kanchipuram",
        state: "Tamil Nadu",
        price: 12999,
        image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=1974",
        category: "Textiles",
        rating: 4.8,
        artisan: "Lakshmi Weavers",
        description: "Handwoven silk saree with pure zari border, crafted by master weavers."
    },
    {
        id: 2,
        name: "Blue Pottery Vase",
        district: "Jaipur",
        state: "Rajasthan",
        price: 2499,
        image: "https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?q=80&w=2080",
        category: "Handicrafts",
        rating: 4.5,
        artisan: "Rajput Ceramics",
        description: "Traditional blue pottery vase with intricate floral patterns."
    },
    {
        id: 3,
        name: "Gold Leaf Krishna Painting",
        district: "Thanjavur",
        state: "Tamil Nadu",
        price: 25000,
        image: "https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?q=80&w=1965",
        category: "Paintings",
        rating: 5.0,
        artisan: "Thanjavur Arts",
        description: "22-carat gold leaf painting of Lord Krishna, framed in teak wood."
    },
    {
        id: 4,
        name: "Pashmina Shawl",
        district: "Srinagar",
        state: "Jammu & Kashmir",
        price: 15000,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935",
        category: "Textiles",
        rating: 4.9,
        artisan: "Valley Weaves",
        description: "Authentic hand-spun Pashmina shawl, soft and warm."
    },
    {
        id: 5,
        name: "Terracotta Horse",
        district: "Bankura",
        state: "West Bengal",
        price: 3500,
        image: "https://images.unsplash.com/photo-1590845947698-8924d7409b56?q=80&w=1974", // Placeholder similar to terracotta
        category: "Handicrafts",
        rating: 4.7,
        artisan: "Bengal Crafts",
        description: "Famous Bankura terracotta horse for home decor."
    },
    {
        id: 6,
        name: "Channapatna Toys",
        district: "Ramanagara",
        state: "Karnataka",
        price: 1200,
        image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=2070",
        category: "Toys",
        rating: 4.6,
        artisan: "Wooden Wonders",
        description: "Eco-friendly wooden toys colored with vegetable dyes."
    }
];

export const districts = [
    {
        id: 1,
        name: "Kanchipuram",
        state: "Tamil Nadu",
        product: "Silk Sarees",
        image: "https://images.unsplash.com/photo-1627914443907-74403d7c072c?q=80&w=1974", // Temple image
        description: "City of Thousand Temples and Silk."
    },
    {
        id: 2,
        name: "Jaipur",
        state: "Rajasthan",
        product: "Blue Pottery & Jewelry",
        image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=2070", // Hawa Mahal
        description: "The Pink City known for royal heritage."
    },
    {
        id: 3,
        name: "Varanasi",
        state: "Uttar Pradesh",
        product: "Banarasi Silk",
        image: "https://images.unsplash.com/photo-1561361513-35bd4e7d0752?q=80&w=2070", // Ghats
        description: "Spiritual capital of India, famous for fine silk."
    },
    {
        id: 4,
        name: "Srinagar",
        state: "Jammu & Kashmir",
        product: "Pashmina & Carpets",
        image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?q=80&w=2070", // Dal Lake
        description: "Paradise on Earth, home to exquisite craftsmanship."
    }
];

export const skillsData = {
    mySkills: [
        { id: 1, name: "Pottery", level: "Expert", endorsed: 12 },
        { id: 2, name: "Clay Modeling", level: "Intermediate", endorsed: 5 },
        { id: 3, name: "Glazing", level: "Beginner", endorsed: 2 }
    ],
    marketDemand: [
        { name: "Blue Pottery", demand: 95, growth: 12 },
        { name: "Terracotta", demand: 85, growth: 8 },
        { name: "Ceramics", demand: 70, growth: 5 },
        { name: "Stone Carving", demand: 60, growth: -2 },
        { name: "Woodwork", demand: 55, growth: 3 },
    ],
    demandTrends: [
        { month: 'Jan', demand: 4000 },
        { month: 'Feb', demand: 3000 },
        { month: 'Mar', demand: 2000 },
        { month: 'Apr', demand: 2780 },
        { month: 'May', demand: 1890 },
        { month: 'Jun', demand: 2390 },
        { month: 'Jul', demand: 3490 },
    ],
    gapAnalysis: [
        { subject: 'Pottery', A: 120, B: 110, fullMark: 150 },
        { subject: 'Design', A: 98, B: 130, fullMark: 150 },
        { subject: 'Marketing', A: 86, B: 130, fullMark: 150 },
        { subject: 'Packaging', A: 99, B: 100, fullMark: 150 },
        { subject: 'Glazing', A: 85, B: 90, fullMark: 150 },
        { subject: 'Kiln Mgmt', A: 65, B: 85, fullMark: 150 },
    ],
    recommendations: [
        {
            id: 1,
            title: "Advanced Glazing Techniques",
            provider: "National Institute of Design",
            duration: "4 Weeks",
            type: "Online",
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1565193566173-7a64d2784869?q=80&w=2070",
            reason: "High market demand for glazed pottery."
        },
        {
            id: 2,
            title: "Digital Marketing for Artisans",
            provider: "Skill India",
            duration: "2 Weeks",
            type: "Workshop",
            rating: 4.5,
            image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=2074",
            reason: "Bridge your gap in marketing skills."
        },
        {
            id: 3,
            title: "Sustainable Packaging",
            provider: "EcoCraft",
            duration: "1 Week",
            type: "Webinar",
            rating: 4.7,
            image: "https://images.unsplash.com/photo-1605631097436-0834d9520e58?q=80&w=1974",
            reason: "Trending skill in eco-conscious markets."
        }
    ]
};

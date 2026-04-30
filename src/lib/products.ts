export type Product = {
  id: number
  name: string
  price: number
  category: "tops" | "outerwear" | "accessories" | "footwear"
  img: string
  description: string
  sizes: string[]
  colors: string[]
}

const apparelSizes = ["XS", "S", "M", "L", "XL"]
const outerwearSizes = ["S", "M", "L", "XL"]
const footwearSizes = ["40", "41", "42", "43", "44", "45"]
const oneSize = ["One Size"]

const monoColors = ["Black", "Charcoal", "Bone"]
const denimColors = ["Indigo", "Raw Black"]
const leatherColors = ["Black", "Oxblood"]
const metalColors = ["Silver"]

export const products: Product[] = [
  {
    id: 1,
    name: "Heavy Knit Sweater",
    price: 240,
    category: "tops",
    img: "/product-knit-1.png",
    description:
      "A meticulously crafted heavy-weight knit sweater, featuring a structural silhouette and reinforced ribbing. Engineered for thermal regulation and architectural form.",
    sizes: apparelSizes,
    colors: monoColors,
  },
  {
    id: 2,
    name: "Industrial Denim",
    price: 180,
    category: "outerwear",
    img: "/product-denim-1.png",
    description:
      "14oz Japanese selvedge denim, treated with a unique industrial wash. Featuring reinforced articulation points and heavy-duty hardware.",
    sizes: outerwearSizes,
    colors: denimColors,
  },
  {
    id: 3,
    name: "Structured Belt",
    price: 95,
    category: "accessories",
    img: "/product-acc-1.png",
    description:
      "Multi-layered leather belt with a custom-cast brutalist buckle. Designed for lifetime durability and architectural integration.",
    sizes: ["S/M", "L/XL"],
    colors: leatherColors,
  },
  {
    id: 4,
    name: "Brutalist Boot",
    price: 320,
    category: "footwear",
    img: "/product-shoe-1.png",
    description:
      "Full-grain leather boot with a sculptural Vibram sole. Merging traditional craftsmanship with avant-garde aesthetic principles.",
    sizes: footwearSizes,
    colors: leatherColors,
  },
  {
    id: 5,
    name: "Sculptural Knit",
    price: 210,
    category: "tops",
    img: "/product-knit-2.png",
    description:
      "Asymmetrical knit piece with varying tension zones. Creates a dynamic silhouette through tension and gravity.",
    sizes: apparelSizes,
    colors: monoColors,
  },
  {
    id: 6,
    name: "Oversized Shell",
    price: 450,
    category: "outerwear",
    img: "/product-coat-1.png",
    description:
      "Waterproof technical shell with modular attachment points. A protective layer for the urban landscape.",
    sizes: outerwearSizes,
    colors: ["Black", "Slate"],
  },
  {
    id: 7,
    name: "Cast Silver Ring",
    price: 120,
    category: "accessories",
    img: "/product-acc-2.png",
    description:
      ".925 sterling silver ring, hand-cast in a rough-hewn brutalist form. Each piece carries unique casting artifacts.",
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: metalColors,
  },
  {
    id: 8,
    name: "Modular Shoe",
    price: 280,
    category: "footwear",
    img: "/product-shoe-2.png",
    description:
      "Deconstructed footwear featuring interchangeable components. A testament to modular design and functional versatility.",
    sizes: footwearSizes,
    colors: ["Black", "Bone"],
  },
  {
    id: 9,
    name: "Raw Denim",
    price: 195,
    category: "outerwear",
    img: "/product-denim-2.png",
    description:
      "Unwashed raw denim in a classic straight cut. Will develop unique patina based on the wearer's movement and environment.",
    sizes: outerwearSizes,
    colors: denimColors,
  },
  {
    id: 10,
    name: "Utility Jacket",
    price: 380,
    category: "outerwear",
    img: "/product-jacket-1.png",
    description:
      "Multi-pocket technical jacket inspired by archival workwear. Features hidden zip compartments and reinforced elbows.",
    sizes: outerwearSizes,
    colors: ["Black", "Olive"],
  },
  {
    id: 11,
    name: "Mono Tee",
    price: 85,
    category: "tops",
    img: "/0c2393bf.jpg",
    description:
      "Heavyweight cotton tee with a boxy fit and seamless construction. A fundamental building block for the modern wardrobe.",
    sizes: apparelSizes,
    colors: ["Black", "Bone", "Ash"],
  },
  {
    id: 12,
    name: "Technical Parka",
    price: 520,
    category: "outerwear",
    img: "/0f632715.jpg",
    description:
      "High-performance parka designed for extreme urban conditions. Insulated with sustainable down-alternative.",
    sizes: outerwearSizes,
    colors: ["Black", "Graphite"],
  },
  {
    id: 13,
    name: "Leather Pouch",
    price: 145,
    category: "accessories",
    img: "/46aba1cd.jpg",
    description: "Minimalist leather pouch with magnetic closure. Perfectly sized for daily essentials.",
    sizes: oneSize,
    colors: leatherColors,
  },
  {
    id: 14,
    name: "Desert Runner",
    price: 310,
    category: "footwear",
    img: "/7e0262a3.jpg",
    description:
      "Lightweight, breathable runner with a high-traction outsole. Designed for transitions between terrains.",
    sizes: footwearSizes,
    colors: ["Sand", "Black"],
  },
  {
    id: 15,
    name: "Ribbed Tank",
    price: 65,
    category: "tops",
    img: "/da594d43.jpg",
    description:
      "Tight-knit ribbed tank in an elongated silhouette. Features reinforced seams and a soft hand-feel.",
    sizes: apparelSizes,
    colors: ["Black", "Bone"],
  },
]

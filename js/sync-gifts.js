import { supabase } from "./supabase.js";

for (const gift of gifts) {
  const { error } = await supabase
    .from("gifts")
    .upsert({
      id: gift.id,
      name: gift.name,
      category: gift.category,
      price: gift.price,
      link: gift.link
    });

  if (error) {
    console.error(error);
  } else {
    console.log("Enviado:", gift.name);
  }
}
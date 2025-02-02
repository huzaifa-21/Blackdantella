import { toast } from "react-toastify";

function handleShare(product) {
  if (navigator.share) {
    navigator
      .share({
        title: product.name,
        text: "Check out this product",
        url: `https://www.blackdantella.com/product/${product._id}`,
      })
      .then(() => console.log("successfully shared the product"))
      .catch((error)=>error);
  } else {
    toast.error("Sharing is not available in this browser");
  }
}

function handleCopyToClipBoard(product) {
  navigator.clipboard
    .writeText(`https://www.blackdantella.com/product/${product._id}`)
    .then(() => "Link Copied")
    .catch((error) => console.log("error", error));
}

function handleShareOnWhatsApp(product) {
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `Check out this product: ${product.name} 
https://www.blackdantella.com/product/${product._id}`
  )}`;
  window.open(whatsappUrl, "_blank");
}

export { handleCopyToClipBoard, handleShare, handleShareOnWhatsApp };

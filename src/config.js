export const BASE_URL = "https://specs-backend.onrender.com";
export const getImageUrl = (image) => {
    if (!image) {
        return "https://via.placeholder.com/300";
    }

    // Cloudinary image
    if (image.startsWith("http")) {
        return image;
    }

    // Old local uploads image
    return `${BASE_URL}${image}`;
};
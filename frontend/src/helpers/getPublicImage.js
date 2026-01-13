const getPublicImage = (path) => {
  if (!path) return "/assest/no-image.png";

  // already correct
  if (path.startsWith("/assest")) return path;

  // src/assets → /assest
  return path.replace(/^src\/assets/, "/assest");
};

export default getPublicImage;

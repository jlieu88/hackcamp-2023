
function main() {
  let images = document.body.getElementsByTagName("img");
  for (let image of images) {
    image.addEventListener(
      "click",
      (event) => {
        console.log('clicked over image!');
      });
  }
}

main();
export default function generateNewElement(data: string) {
  const element = document.createElement('div');
  element.innerHTML = data;
  return element;
}

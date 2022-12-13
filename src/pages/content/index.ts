import axios from 'axios';

const currentURL = window.location.href;
const courseLinkList = document.getElementsByClassName('course_link');
let courseDocument: string[] = [];

const getElement = (data: string) => {
  const element = document.createElement('div');
  element.innerHTML = data;
  return element;
};

const getCourse = async (courseLink: string) => {
  const data = await axios.get(courseLink).then(res => res.data);
  courseDocument.push(data);
  console.log(getElement(data).querySelector('div.coursename > h1 > a')?.innerHTML.split('[')[0]);
};

for (let i = 0; i < courseLinkList.length; i++) {
  const courseLink = courseLinkList[i] as HTMLAnchorElement;
  getCourse(courseLink.href);
}

export {};

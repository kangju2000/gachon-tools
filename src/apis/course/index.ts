import axios from 'axios';

const courseApi = {
  getCourseById: (id: string) => {
    return axios.get(`https://cyber.gachon.ac.kr/mod/assign/index.php?id=${id}`);
  },
};

export default courseApi;

const baseUrl = 'http://localhost:5000';

export const addPost = async (item) =>  {
  reqBody = {

  };
  const data = await this.$axios.$post(`${baseUrl}/post`, {
    reqBody
  });
};

export const deletePost = async (uuid) => {
  const data = await this.$axios.$delete(`${baseUrl}/post/${uuid}`);
};

export const updatePost = async (uuid) => {
  const data = await this.$axios.$patch(`${baseUrl}/post/${uuid}`);
};

export const getPost = async (uuid) => {
  const data = await this.$axios.$get(`${baseUrl}/post/${uuid}`);
};

export const getUserPosts = async (user, offset=null) => {
  let data;
  if (offset) {
    data = await this.$axios.$get(`${baseUrl}/post/user/${user}?offset=${offset}`);
  }
  else {
    data = await this.$axios.$get(`${baseUrl}/post/user/${user}`);
  }
};

export const getLocUserPosts = async (location, user, offset=null) => {
  let data;
  if (offset) {
    data = await this.$axios.$get(`${baseUrl}/post/locuser/${location}/${user}?offset=${offset}`);
  }
  else {
    data = await this.$axios.$get(`${baseUrl}/post/locuser/${location}/${user}`);
  }
};

export const getLocationPosts = async (location, offset=null) => {
  let data;
  if (offset) {
    data = await this.$axios.$get(`${baseUrl}/post/location/${location}?offset=${offset}`);
  }
  else {
    data = await this.$axios.$get(`${baseUrl}/post/location/${location}`);
  }
};

export const getLocBarPosts = async (location, bar, offset=null) => {
  let data;
  if (offset) {
    data = await this.$axios.$get(`${baseUrl}/post/locbar/${location}/${bar}?offset=${offset}`);
  }
  else {
    data = await this.$axios.$get(`${baseUrl}/post/locbar/${location}/${bar}`);
  }
};

export const getLocNbhoodPosts = async (location, nbhood, offset=null) => {
  let data;
  if (offset) {
    data = await this.$axios.$get(`${baseUrl}/post/locnbhood/${location}/${nbhood}?offset=${offset}`);
  }
  else {
    data = await this.$axios.$get(`${baseUrl}/post/locnbhood/${location}/${nbhood}`);
  }


};



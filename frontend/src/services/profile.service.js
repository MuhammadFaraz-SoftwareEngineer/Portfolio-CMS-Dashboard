import api from "./api";

const getProfile = async () => {
  const { data } = await api.get("/users/profile");
  return data.user;
};

const updateProfile = async (payload) => {
  const { data } = await api.put("/users/profile", payload);
  return data.user;
};

const updateProfileImage = async (profileImage) => {
  const { data } = await api.put("/users/profile/image", { profileImage });
  return data.user;
};

const removeProfileImage = async () => {
  const { data } = await api.delete("/users/profile/image");
  return data.user;
};

export default {
  getProfile,
  updateProfile,
  updateProfileImage,
  removeProfileImage,
};
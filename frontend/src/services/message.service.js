import api from "./api";

const getMessages = async () => {
  const { data } = await api.get("/contact");
  return data.contacts;
};

export default { getMessages };

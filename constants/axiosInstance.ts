import axios from "axios";

export default axios.create({
  baseURL: __DEV__
    ? "https://api.refonte-koumi.com/api-koumi"
    : "https://api.refonte-koumi.com/api-koumi",
});

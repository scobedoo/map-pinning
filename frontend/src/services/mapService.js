import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8800/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Access-Control-Allow-Origin": "*",
  },
});

export default {
  getPins() {
    return instance.get("/pins");
  },
  addPin(pins) {
    return instance.post("/pins", pins);
  },
};

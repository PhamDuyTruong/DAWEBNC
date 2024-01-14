import axiosClient from "./axiosClient";

const notificationApi = {
    getNotifications: (id) => {
        return axiosClient.get(`/api/notification/${id}`);
    },
    createNotification: (data) => {
        return axiosClient.post('/api/notification', data);
    },
}

export default notificationApi;
import createApiClient from "./api.reader"

class ReaderService {
    constructor(baseUrl = "/api/reader") {
        this.apiClient = createApiClient(baseUrl)
    }

    // async get(id) {
    //     return (await this.apiClient.get(`/${id}`)).data;
    // }

    async create(userData) {
        try {
            const response = await this.apiClient.post('/register', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async updateBorrow(token, borrow) {
        try {
            const response = await this.apiClient.put(`/borrow`, {
                borrow,
                token
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getUserByToken(formData) {
        try {
            const {
                reader
            } = (await this.apiClient.get(`/user`, {
                headers: {
                    Authorization: `Bearer ${formData.get("tokenUser")}`
                }
            })).data;
            return reader;
        } catch (error) {
            throw error;
        }
    }

    async statusBookReturn(readerId, bookId, status) {
        try {
            const response = await this.apiClient.put(`/statusBookReturn/${readerId}/${bookId}`, {
                status
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async returnBookBorrow(userId) {
        try {
            const response = await this.apiClient.delete(`/return/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async getNumberBorrowed(id_book) {
        try {
            const response = await this.apiClient.get(`/numberbookborrowed/${id_book}`);
            console.log(response.data.borrowedBookQuantity)
            return response.data.borrowedBookQuantity;
        } catch (error) {
            throw error;
        }
    }
}


export default new ReaderService();
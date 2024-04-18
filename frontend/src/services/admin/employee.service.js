    import createApiAdmin from "./api.auth.service";

    class EmployeeService {
        constructor(baseUrl = "/api/admin/employee") {
            this.api = createApiAdmin(baseUrl);
        }
        
        async statusBook(readerId, bookId, status) {
            try {
                // Gọi đến ReaderService để thay đổi trạng thái của sách
                const response = await this.api.put(`/statusBook/${readerId}/${bookId}`, { status });
                return response.data;
            } catch (error) {
                throw error;
            }
        }

        async getReaders() {
            try {
                return (await this.api.get("/getReaders")).data;
            } catch (error) {
                throw error;
            }
        }
    }
    export default new EmployeeService();